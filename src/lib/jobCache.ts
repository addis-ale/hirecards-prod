/**
 * Job Caching Utilities
 * 
 * Handles caching of scraped job data and generated cards to avoid
 * re-scraping and re-generating for the same job URL.
 */

import crypto from "crypto";

// Cache validity periods (in milliseconds)
export const CACHE_VALIDITY = {
  scrapedData: 90 * 24 * 60 * 60 * 1000,      // 90 days
  aiExtracted: 90 * 24 * 60 * 60 * 1000,      // 90 days
  similarJobs: 14 * 24 * 60 * 60 * 1000,      // 14 days
  candidates: 14 * 24 * 60 * 60 * 1000,        // 14 days
  salaryData: 30 * 24 * 60 * 60 * 1000,       // 30 days
  generatedCards: 90 * 24 * 60 * 60 * 1000,   // 90 days
} as const;

export type CacheDataType = keyof typeof CACHE_VALIDITY;

/**
 * Hash a URL to create a consistent cache key
 */
export function hashURL(url: string): string {
  return crypto.createHash("sha256").update(url.trim().toLowerCase()).digest("hex");
}

/**
 * Normalize job title for matching
 */
export function normalizeTitle(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to one
    .trim();
}

/**
 * Normalize location for matching
 */
export function normalizeLocation(location: string): string {
  if (!location) return "no-location";
  return location
    .toLowerCase()
    .replace(/[^a-z0-9\s,]/g, "") // Remove special chars
    .replace(/\s*,\s*/g, "-") // Commas to hyphens
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to one
    .trim();
}

/**
 * Normalize company name for matching
 */
export function normalizeCompany(company: string): string {
  if (!company) return "unknown-company";
  return company
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to one
    .trim();
}

/**
 * Generate composite key for fallback matching
 */
export function generateCompositeKey(
  company: string,
  title: string,
  location?: string
): string {
  const normalizedCompany = normalizeCompany(company);
  const normalizedTitle = normalizeTitle(title);
  const normalizedLocation = location ? normalizeLocation(location) : "no-location";
  
  return `${normalizedCompany}_${normalizedTitle}_${normalizedLocation}`;
}

/**
 * Check if cached data is still valid
 */
export function isCacheValid(
  cachedData: Record<string, unknown> | null,
  dataType: CacheDataType
): boolean {
  if (!cachedData) return false;
  
  const validityPeriod = CACHE_VALIDITY[dataType];
  const timestampField = getTimestampField(dataType);
  const cacheTimestamp = cachedData[timestampField];
  
  if (!cacheTimestamp || typeof cacheTimestamp !== 'string' && typeof cacheTimestamp !== 'number' && !(cacheTimestamp instanceof Date)) return false;
  
  const cacheAge = Date.now() - new Date(cacheTimestamp as string | number | Date).getTime();
  return cacheAge < validityPeriod;
}

/**
 * Get the timestamp field name for a cache data type
 */
function getTimestampField(dataType: CacheDataType): string {
  const fieldMap: Record<CacheDataType, string> = {
    scrapedData: "scraped_at",
    aiExtracted: "ai_extracted_at",
    similarJobs: "external_data_fetched_at",
    candidates: "external_data_fetched_at",
    salaryData: "external_data_fetched_at",
    generatedCards: "cards_generated_at",
  };
  
  return fieldMap[dataType];
}

/**
 * Find cached job by URL
 */
export async function findCachedJob(jobURL: string): Promise<Record<string, unknown> | null> {
  try {
    // Check if Supabase client is available
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log("⚠️ Supabase not configured, skipping cache lookup");
      return null;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const urlHash = hashURL(jobURL);
    
    const { data, error } = await supabase
      .from("jobs_cache")
      .select("*")
      .eq("job_url_hash", urlHash)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned (not found)
        return null;
      }
      console.error("❌ Error finding cached job:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error in findCachedJob:", errorMessage);
    return null;
  }
}

/**
 * Validate that all cards are fully generated
 */
function validateCardsComplete(data: {
  jobAnalysisCards?: Record<string, unknown>;
  peopleAnalysisCards?: Record<string, unknown>;
  combinedAnalysisCards?: Record<string, unknown>;
  derivedStrategyCards?: Record<string, unknown>;
}): { isValid: boolean; missingCards: string[] } {
  const missingCards: string[] = [];
  
  // Check Job Analysis Cards (Group 1)
  if (!data.jobAnalysisCards) {
    missingCards.push("jobAnalysisCards");
  } else {
    const required = ["roleCard", "skillCard", "fitCard", "messageCard", "outreachCard"];
    const missing = required.filter(key => !data.jobAnalysisCards?.[key]);
    if (missing.length > 0) {
      missingCards.push(`jobAnalysisCards: ${missing.join(", ")}`);
    }
  }
  
  // Check People Analysis Cards (Group 2) - Optional if no candidates
  // We'll check this separately
  
  // Check Combined Analysis Cards (Group 3)
  if (!data.combinedAnalysisCards) {
    missingCards.push("combinedAnalysisCards");
  } else {
    const required = ["marketCard", "payCard", "funnelCard", "realityCard"];
    const missing = required.filter(key => !data.combinedAnalysisCards?.[key]);
    if (missing.length > 0) {
      missingCards.push(`combinedAnalysisCards: ${missing.join(", ")}`);
    }
  }
  
  // Check Derived Strategy Cards (Group 4)
  if (!data.derivedStrategyCards) {
    missingCards.push("derivedStrategyCards");
  } else {
    const required = ["interviewCard", "scorecardCard", "planCard"];
    const missing = required.filter(key => !data.derivedStrategyCards?.[key]);
    if (missing.length > 0) {
      missingCards.push(`derivedStrategyCards: ${missing.join(", ")}`);
    }
  }
  
  return {
    isValid: missingCards.length === 0,
    missingCards,
  };
}

/**
 * Save job data to cache
 * Only saves if all cards are fully generated
 */
export async function saveToCache(
  jobURL: string,
  data: {
    scrapedData?: Record<string, unknown>;
    aiExtractedData?: Record<string, unknown>;
    similarJobs?: Array<Record<string, unknown>>;
    candidates?: Array<Record<string, unknown>>;
    salaryData?: Record<string, unknown>;
    jobAnalysisCards?: Record<string, unknown>;
    peopleAnalysisCards?: Record<string, unknown>;
    combinedAnalysisCards?: Record<string, unknown>;
    derivedStrategyCards?: Record<string, unknown>;
    company?: string;
    title?: string;
    location?: string;
    platform?: string;
    forceSave?: boolean; // Allow saving even if cards incomplete (for debugging)
  }
): Promise<{ success: boolean; reason?: string }> {
  try {
    // Validate that all cards are complete before caching
    if (!data.forceSave) {
      const validation = validateCardsComplete({
        jobAnalysisCards: data.jobAnalysisCards,
        peopleAnalysisCards: data.peopleAnalysisCards,
        combinedAnalysisCards: data.combinedAnalysisCards,
        derivedStrategyCards: data.derivedStrategyCards,
      });
      
      if (!validation.isValid) {
        console.warn("⚠️ Cards incomplete, not caching:", validation.missingCards);
        return {
          success: false,
          reason: `Incomplete cards: ${validation.missingCards.join(", ")}`,
        };
      }
      
      console.log("✅ All cards validated as complete, proceeding with cache save");
    }
    
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log("⚠️ Supabase not configured, skipping cache save");
      return { success: false, reason: "Supabase not configured" };
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const urlHash = hashURL(jobURL);
    
    // Generate composite key for fallback matching
    const compositeKey = generateCompositeKey(
      data.company || "",
      data.title || "",
      data.location
    );
    
    // Check if entry already exists
    const existing = await findCachedJob(jobURL);
    
    const cacheData: Record<string, unknown> = {
      job_url: jobURL,
      job_url_hash: urlHash,
      composite_key: compositeKey,
      platform: data.platform || "unknown",
      company: data.company || "Unknown",
      job_title: data.title || "Unknown",
      location: data.location || null,
      normalized_title: normalizeTitle(data.title || ""),
      normalized_location: normalizeLocation(data.location || ""),
      updated_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
    };
    
    // Add scraped data if provided
    if (data.scrapedData) {
      cacheData.scraped_data = data.scrapedData;
      cacheData.scraped_at = new Date().toISOString();
    }
    
    // Add AI extracted data if provided
    if (data.aiExtractedData) {
      cacheData.ai_extracted_data = data.aiExtractedData;
      cacheData.ai_extracted_at = new Date().toISOString();
    }
    
    // Add external data if provided
    if (data.similarJobs || data.candidates || data.salaryData) {
      cacheData.similar_jobs = data.similarJobs || null;
      cacheData.similar_jobs_count = data.similarJobs?.length || 0;
      cacheData.candidates = data.candidates || null;
      cacheData.candidates_count = data.candidates?.length || 0;
      cacheData.salary_data = data.salaryData || null;
      cacheData.external_data_fetched_at = new Date().toISOString();
    }
    
    // Add generated cards if provided
    if (
      data.jobAnalysisCards ||
      data.peopleAnalysisCards ||
      data.combinedAnalysisCards ||
      data.derivedStrategyCards
    ) {
      cacheData.job_analysis_cards = data.jobAnalysisCards || null;
      cacheData.people_analysis_cards = data.peopleAnalysisCards || null;
      cacheData.combined_analysis_cards = data.combinedAnalysisCards || null;
      cacheData.derived_strategy_cards = data.derivedStrategyCards || null;
      cacheData.cards_generated_at = new Date().toISOString();
    }
    
    if (existing) {
      // Update existing entry
      const { error } = await supabase
        .from("jobs_cache")
        .update(cacheData)
        .eq("job_url_hash", urlHash);
      
      if (error) {
        console.error("❌ Error updating cache:", error);
        return { success: false, reason: error.message };
      }
      
      console.log("✅ Updated cached job data with complete cards");
      return { success: true };
    } else {
      // Insert new entry
      cacheData.created_at = new Date().toISOString();
      cacheData.access_count = 1;
      
      const { error } = await supabase
        .from("jobs_cache")
        .insert(cacheData);
      
      if (error) {
        console.error("❌ Error saving to cache:", error);
        return { success: false, reason: error.message };
      }
      
      console.log("✅ Saved complete job data and cards to cache");
      return { success: true };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error in saveToCache:", errorMessage);
    return { success: false, reason: errorMessage };
  }
}

/**
 * Update access metadata (track usage)
 */
export async function updateAccessMetadata(jobURL: string): Promise<void> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) return;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const urlHash = hashURL(jobURL);
    
    // Get current access count first, then increment
    const { data: current } = await supabase
      .from("jobs_cache")
      .select("access_count")
      .eq("job_url_hash", urlHash)
      .single();
    
    if (current) {
      await supabase
        .from("jobs_cache")
        .update({
          last_accessed_at: new Date().toISOString(),
          access_count: (current.access_count || 0) + 1,
        })
        .eq("job_url_hash", urlHash);
    }
  } catch (_error) {
    // Silently fail - not critical
  }
}

/**
 * Check what parts of cached data need refresh
 */
export function getCacheRefreshNeeds(cached: Record<string, unknown> | null): {
  needsScrapedRefresh: boolean;
  needsExternalRefresh: boolean;
  needsCardRefresh: boolean;
} {
  return {
    needsScrapedRefresh: !isCacheValid(cached, "scrapedData"),
    needsExternalRefresh:
      !isCacheValid(cached, "similarJobs") ||
      !isCacheValid(cached, "candidates") ||
      !isCacheValid(cached, "salaryData"),
    needsCardRefresh: !isCacheValid(cached, "generatedCards"),
  };
}

