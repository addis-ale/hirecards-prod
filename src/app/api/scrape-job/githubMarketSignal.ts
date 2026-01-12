/**
 * GitHub Market Signal
 * 
 * Estimates candidate availability using GitHub public profiles.
 * This is a market signal, not an exact candidate count.
 */

interface GitHubMarketSignal {
  source: "github";
  role: string;
  location: string;
  totalProfiles: number;
  confidence: "low" | "medium" | "high";
  keywordCounts?: Record<string, number>;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Array<Record<string, unknown>>;
}

// Simple in-memory cache
const cache = new Map<string, { data: GitHubMarketSignal; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Get role-related keywords for a given role
 * Returns an array of keywords to search in GitHub bios
 */
function getRoleKeywords(role: string): string[] {
  const normalizedRole = role.toLowerCase();
  
  // Role keyword mappings
  const keywordMap: Record<string, string[]> = {
    // Analytics/Data roles
    "analytics": ["analytics", "data analyst", "analytics engineer", "data analytics"],
    "data analyst": ["data analyst", "analytics", "business analyst", "data analysis"],
    "analytics engineer": ["analytics engineer", "data engineer", "analytics", "data pipeline"],
    "data engineer": ["data engineer", "etl", "data pipeline", "data infrastructure", "data engineering"],
    "data scientist": ["data scientist", "machine learning", "ml engineer", "data science"],
    
    // Backend roles
    "backend engineer": ["backend engineer", "backend developer", "server-side", "api developer"],
    "backend developer": ["backend developer", "backend engineer", "server-side", "api developer"],
    "senior backend engineer": ["senior backend engineer", "backend engineer", "backend developer", "server-side"],
    
    // Frontend roles
    "frontend engineer": ["frontend engineer", "frontend developer", "react developer", "ui developer"],
    "frontend developer": ["frontend developer", "frontend engineer", "react developer", "ui developer"],
    
    // Full-stack roles
    "full stack engineer": ["full stack engineer", "fullstack", "full-stack developer", "full stack developer"],
    "full stack developer": ["full stack developer", "fullstack", "full-stack engineer", "full stack engineer"],
    
    // DevOps roles
    "devops engineer": ["devops engineer", "devops", "sre", "site reliability engineer", "infrastructure engineer"],
    "sre": ["sre", "site reliability engineer", "devops", "reliability engineer"],
    
    // Product roles
    "product manager": ["product manager", "product management", "pm", "product owner"],
    "product designer": ["product designer", "ux designer", "ui designer", "product design"],
  };
  
  // Try exact match first
  if (keywordMap[normalizedRole]) {
    return keywordMap[normalizedRole];
  }
  
  // Try partial match
  for (const [key, keywords] of Object.entries(keywordMap)) {
    if (normalizedRole.includes(key) || key.includes(normalizedRole)) {
      return keywords;
    }
  }
  
  // Default: use role name and common variations
  const words = normalizedRole.split(/\s+/);
  const baseKeywords = [normalizedRole, ...words];
  
  // Add common variations
  if (words.includes("engineer")) {
    baseKeywords.push(words.join(" ").replace("engineer", "developer"));
  }
  if (words.includes("developer")) {
    baseKeywords.push(words.join(" ").replace("developer", "engineer"));
  }
  
  return baseKeywords;
}

/**
 * Search GitHub users by location and keyword in bio
 */
async function searchGitHubUsers(
  location: string,
  keyword: string,
  page: number = 1
): Promise<GitHubSearchResponse> {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.warn("⚠️ GITHUB_TOKEN not configured, skipping GitHub market signal");
    throw new Error("GITHUB_TOKEN not configured");
  }
  
  // Build search query: location in location field + keyword in bio
  const query = `location:"${location}" "${keyword}" in:bio type:user`;
  const url = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=100`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "HireCard-MarketSignal",
      },
    });
    
    // Handle rate limiting
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
      const rateLimitReset = response.headers.get("x-ratelimit-reset");
      
      if (rateLimitRemaining === "0") {
        console.warn(
          `⚠️ GitHub API rate limit exceeded. Resets at: ${new Date(Number(rateLimitReset) * 1000).toISOString()}`
        );
        throw new Error("GitHub API rate limit exceeded");
      }
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as GitHubSearchResponse;
    return data;
  } catch (error) {
    if (error.message.includes("rate limit")) {
      throw error;
    }
    console.error(`❌ Error searching GitHub for "${keyword}" in ${location}:`, error);
    throw error;
  }
}

/**
 * Get total count for a keyword, handling pagination if needed
 */
async function getKeywordCount(
  location: string,
  keyword: string
): Promise<number> {
  try {
    const firstPage = await searchGitHubUsers(location, keyword, 1);
    
    // GitHub API returns total_count, but if incomplete_results is true,
    // we might need to paginate. However, for market signals, we use total_count
    // which is GitHub's estimate of total matches
    return firstPage.total_count;
  } catch (error) {
    if (error.message.includes("rate limit")) {
      throw error;
    }
    // If search fails, return 0
    console.warn(`⚠️ Failed to get count for keyword "${keyword}":`, error.message);
    return 0;
  }
}

/**
 * Get GitHub market signal for a role and location
 * 
 * @param role - Job role/title (e.g., "Senior Backend Engineer")
 * @param location - Location (e.g., "Amsterdam", "San Francisco")
 * @returns Market signal with total profile count and confidence
 */
export async function getGithubMarketSignal(
  role: string,
  location: string
): Promise<GitHubMarketSignal | null> {
  // Check cache
  const cacheKey = `${role.toLowerCase()}:${location.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`📦 Using cached GitHub market signal for ${role} in ${location}`);
    return cached.data;
  }
  
  // Check if GitHub token is configured
  if (!process.env.GITHUB_TOKEN) {
    console.warn("⚠️ GITHUB_TOKEN not configured, skipping GitHub market signal");
    return null;
  }
  
  try {
    console.log(`🔍 Getting GitHub market signal for "${role}" in ${location}...`);
    
    // Get role keywords
    const keywords = getRoleKeywords(role);
    console.log(`   Keywords: ${keywords.join(", ")}`);
    
    // Search for each keyword
    const keywordCounts: Record<string, number> = {};
    let totalCount = 0;
    
    for (const keyword of keywords) {
      try {
        const count = await getKeywordCount(location, keyword);
        keywordCounts[keyword] = count;
        totalCount = Math.max(totalCount, count); // Use max count across keywords
        
        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        if (error.message.includes("rate limit")) {
          // If rate limited, return what we have so far
          console.warn("⚠️ GitHub rate limit hit, returning partial results");
          break;
        }
        // Continue with other keywords
        continue;
      }
    }
    
    // Determine confidence based on total count
    let confidence: "low" | "medium" | "high";
    if (totalCount > 800) {
      confidence = "high";
    } else if (totalCount >= 300) {
      confidence = "medium";
    } else {
      confidence = "low";
    }
    
    const result: GitHubMarketSignal = {
      source: "github",
      role,
      location,
      totalProfiles: totalCount,
      confidence,
      keywordCounts,
    };
    
    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    console.log(
      `✅ GitHub market signal: ${totalCount} profiles (confidence: ${confidence})`
    );
    
    return result;
  } catch (error) {
    console.error("❌ Error getting GitHub market signal:", error);
    
    // If rate limited, return null (don't cache errors)
    if (error.message.includes("rate limit")) {
      return null;
    }
    
    return null;
  }
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export function clearGithubMarketSignalCache(): void {
  cache.clear();
  console.log("🗑️ GitHub market signal cache cleared");
}

