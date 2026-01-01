import { NextRequest, NextResponse } from "next/server";
import { scrapeJobURL } from "@/lib/jobScraper";
import OpenAI from "openai";
import { ApifyClient } from "apify-client";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Initialize Apify client
const apifyClient = process.env.APIFY_API_KEY
  ? new ApifyClient({ token: process.env.APIFY_API_KEY })
  : null;

interface ExtractedJobData {
  location?: string;
  locationType?: string; // Remote, Hybrid, On-site
  salary?: string;
  experienceLevel?: string;
  employmentType?: string; // Full-time, Part-time, Contract
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  department?: string;
}

interface ApifyJobData {
  id: string;
  title: string;
  linkedinUrl?: string; // LinkedIn jobs
  url?: string; // Indeed jobs
  company: {
    name: string;
    logo?: string;
    employeeCount?: number;
  };
  location: {
    linkedinText?: string; // LinkedIn format
    city?: string; // Indeed format
    state?: string;
    country?: string;
    parsed?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  salary?: {
    text?: string;
    min?: number;
    max?: number;
    currency?: string;
  };
  employmentType?: string;
  workplaceType?: string;
  applicants?: number;
  views?: number;
  benefits?: string[];
  descriptionText?: string;
  description?: string; // Indeed uses this field
  platform?: "linkedin" | "indeed"; // Track which platform the job came from
}

interface ApifyPeopleData {
  id: string;
  publicIdentifier: string;
  linkedinUrl: string;
  firstName: string;
  lastName: string;
  headline: string;
  location: {
    linkedinText: string;
    countryCode?: string;
    parsed?: {
      text?: string;
      city?: string;
      state?: string;
      country?: string;
      countryCode?: string;
    };
  };
  avatar?: string;
  about?: string;
  topSkills?: string;
  connections?: number;
  followers?: number;
  premium?: boolean;
  openToWork?: boolean;
  currentCompany?: {
    name: string;
    company_id?: string;
    industry?: string;
    link?: string;
  };
  experience?: any[];
  education?: any[];
  certifications?: any[];
  projects?: any[];
}

interface NormalizedApifyInput {
  jobTitles: string[];
  locations?: string[];
  workplaceType?: ("remote" | "hybrid" | "office")[];
  employmentType?: (
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "temporary"
  )[];
  experienceLevel?: (
    | "internship"
    | "entry"
    | "associate"
    | "mid-senior"
    | "director"
    | "executive"
  )[];
  salary?: number[]; // [minSalary, maxSalary] - Apify expects an array
  postedLimit?: "1h" | "24h" | "week" | "month";
  maxItems?: number;
}

async function extractJobDetailsWithAI(
  description: string,
  existingData: any
): Promise<ExtractedJobData> {
  if (!openai) {
    console.warn("OpenAI API key not configured, skipping AI extraction");
    return {};
  }

  try {
    const prompt = `You are a job listing data extraction expert. Extract structured information from the following job description.

Job Description:
${description.substring(0, 8000)} // Limit to avoid token limits

Extract the following information if available:
1. Location (city, state, country)
2. Location Type (Remote, Hybrid, On-site, or combinations)
3. Salary/Compensation (range or specific amount with currency)
4. Experience Level (Entry level, Mid-Senior level, Associate, etc.)
5. Employment Type (Full-time, Part-time, Contract, Internship)
6. Key Requirements (list of qualifications/requirements)
7. Key Responsibilities (list of main duties)
8. Benefits (list of perks/benefits mentioned)
9. Required Skills (list of technical/soft skills)
10. Department/Team

Return ONLY a valid JSON object with these fields. If information is not found, omit the field or use null.
Format example:
{
  "location": "Amsterdam, Netherlands",
  "locationType": "Hybrid",
  "salary": "$120,000 - $150,000 per year",
  "experienceLevel": "Mid-Senior level",
  "employmentType": "Full-time",
  "requirements": ["5+ years experience", "Bachelor's degree"],
  "responsibilities": ["Lead design team", "Create wireframes"],
  "benefits": ["Health insurance", "Remote work"],
  "skills": ["Figma", "Design Systems", "Leadership"],
  "department": "Product Design"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a precise data extraction assistant. Return only valid JSON without markdown formatting or additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return {};
    }

    // Remove markdown code blocks if present
    const jsonContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const extractedData = JSON.parse(jsonContent);
    return extractedData;
  } catch (error) {
    console.error("Error extracting job details with AI:", error);
    return {};
  }
}

/**
 * Use OpenAI to extract the core job title without qualifiers
 * e.g., "Account Executive - French and English Bilingual" -> "Account Executive"
 */
async function normalizeJobTitleWithAI(title: string): Promise<string> {
  if (!openai) {
    console.warn("OpenAI not configured, using simple normalization");
    return normalizeJobTitle(title);
  }

  try {
    console.log(`🤖 Normalizing job title with AI: "${title}"`);
    
    const prompt = `Extract the core job title from the following job title. Remove language requirements, seniority levels, specializations, and other qualifiers. Return ONLY the core job title, nothing else.

Examples:
- "Account Executive - French and English Bilingual" -> "Account Executive"
- "Senior Software Engineer - Backend Python" -> "Software Engineer"
- "Sales Development Representative (SDR)" -> "Sales Development Representative"
- "Lead Product Manager - SaaS B2B" -> "Product Manager"

Job title to normalize:
"${title}"

Core job title:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a job title extraction expert. Extract only the core job title, removing all qualifiers, specializations, language requirements, and seniority levels. Return ONLY the core title, no explanation." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0,
      max_tokens: 50,
    });

    const normalized = response.choices[0]?.message?.content?.trim() || title;
    
    console.log(`✅ AI normalized: "${title}" -> "${normalized}"`);
    
    return normalized;
  } catch (error) {
    console.error("Error normalizing job title with AI:", error);
    return normalizeJobTitle(title);
  }
}

/**
 * Normalize job title for better LinkedIn search results (simple fallback)
 * Removes company-specific details, team names, and simplifies the title
 */
function normalizeJobTitle(title: string): string {
  if (!title) return title;

  let normalized = title;

  // Remove content in parentheses (e.g., "(back-end)", "(Remote)", "(Contract)")
  normalized = normalized.replace(/\([^)]*\)/g, "");

  // Remove content after dashes that looks like team/department names
  // e.g., "Sr. Product Engineer - Trips Team" -> "Sr. Product Engineer"
  normalized = normalized.replace(/\s*-\s*[A-Z][a-zA-Z\s]*Team\s*$/i, "");
  normalized = normalized.replace(/\s*-\s*[A-Z][a-zA-Z\s]*Department\s*$/i, "");

  // Remove extra location/workplace info at the end
  normalized = normalized.replace(
    /\s*-\s*(Remote|Hybrid|On-site|Onsite)\s*$/i,
    ""
  );

  // Normalize seniority abbreviations
  normalized = normalized.replace(/\bSr\.\s*/gi, "Senior ");
  normalized = normalized.replace(/\bJr\.\s*/gi, "Junior ");

  // Clean up extra whitespace
  normalized = normalized.replace(/\s+/g, " ").trim();

  console.log(`Normalized job title: "${title}" -> "${normalized}"`);

  return normalized;
}

async function normalizeForApify(params: {
  jobTitle: string;
  location?: string;
  workplaceType?: string;
  employmentType?: string;
  experienceLevel?: string;
  salary?: string;
}): Promise<NormalizedApifyInput> {
  if (!openai) {
    // Fallback: naive mapping if OpenAI not available
    const naive: NormalizedApifyInput = {
      jobTitles: [params.jobTitle],
      maxItems: 200,
    }; // Increased from 50 to 200
    if (params.location) {
      const cleaned = params.location
        .replace(/\bnull\b,?\s*/gi, "")
        .replace(/\s+,/g, ",")
        .replace(/,{2,}/g, ",")
        .replace(/\s{2,}/g, " ")
        .trim();
      if (cleaned) naive.locations = [cleaned];
    }
    return naive;
  }

  const prompt = `You are a strict normalizer for an API that searches LinkedIn jobs. Map the following fields to the exact enumerations and format below. If a field is missing or ambiguous, omit it.

Allowed values:
- workplaceType: ["remote", "hybrid", "office"]
- employmentType: ["full-time", "part-time", "contract", "internship", "temporary"]
- experienceLevel: ["internship", "entry", "associate", "mid-senior", "director", "executive"]
- salary: array of two numbers [minSalary, maxSalary] in integers, USD-equivalent if value uses K notation (e.g., "80K-200K" -> [80000, 200000]). If currency not USD, still output numeric array. If only one value is provided, duplicate it for both min and max.
- locations: array of human-readable locations; remove any literal "null" tokens (e.g., "Sydney, null, Australia" -> "Sydney, Australia").

Input:
${JSON.stringify(params, null, 2)}

Return ONLY valid JSON object matching this TypeScript type:
{
  "jobTitles": string[],
  "locations"?: string[],
  "workplaceType"?: ("remote"|"hybrid"|"office")[],
  "employmentType"?: ("full-time"|"part-time"|"contract"|"internship"|"temporary")[],
  "experienceLevel"?: ("internship"|"entry"|"associate"|"mid-senior"|"director"|"executive")[],
  "salary"?: number[]
}`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Return only valid JSON. No prose. No markdown.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    max_tokens: 400,
  });
  const json = resp.choices[0]?.message?.content?.trim() || "{}";
  try {
    const data = JSON.parse(json);
    // Always cap maxItems
    data.maxItems = 200; // Increased from 50 to 200
    return data as NormalizedApifyInput;
  } catch (e) {
    console.error("Failed to parse OpenAI normalization response:", json);
    // Fallback minimal input
    const minimal: NormalizedApifyInput = {
      jobTitles: [params.jobTitle],
      maxItems: 200,
    }; // Increased from 50 to 200
    return minimal;
  }
}

/**
 * Search for similar jobs on Indeed using Apify
 */
async function searchSimilarJobsOnIndeed(
  jobTitle: string,
  location: string,
  filters: {
    workplaceType?: string;
    employmentType?: string;
    experienceLevel?: string;
    salary?: string;
  }
): Promise<ApifyJobData[]> {
  if (!apifyClient) {
    console.warn("Apify API key not configured, skipping Indeed search");
    return [];
  }

  try {
    console.log("Searching Indeed for similar jobs...", {
      jobTitle,
      location,
      filters,
    });

    // Normalize job title for better search results
    const normalizedJobTitle = normalizeJobTitle(jobTitle);

    // Clean location to remove any "null" literals
    const cleanedLocation = location
      ?.replace(/\bnull\b,?\s*/gi, "")
      .replace(/\s+,/g, ",")
      .replace(/,{2,}/g, ",")
      .replace(/\s{2,}/g, " ")
      .trim();

    // Extract country from location for Indeed (required parameter)
    // Indeed API requires country code, but we'll use location for filtering
    const extractCountryFromLocation = (loc: string): string => {
      if (!loc) return "us"; // Default to US if no location
      
      const locationLower = loc.toLowerCase();
      
      // Simple country detection for Indeed's required country parameter
      if (locationLower.includes("sweden") || locationLower.includes("sverige")) return "se";
      if (locationLower.includes("united kingdom") || locationLower.includes("uk") || locationLower.includes("england") || locationLower.includes("scotland") || locationLower.includes("wales")) return "uk";
      if (locationLower.includes("canada")) return "ca";
      if (locationLower.includes("australia")) return "au";
      if (locationLower.includes("germany") || locationLower.includes("deutschland")) return "de";
      if (locationLower.includes("france")) return "fr";
      if (locationLower.includes("netherlands") || locationLower.includes("holland")) return "nl";
      if (locationLower.includes("spain") || locationLower.includes("espana")) return "es";
      if (locationLower.includes("italy") || locationLower.includes("italia")) return "it";
      if (locationLower.includes("india")) return "in";
      if (locationLower.includes("singapore")) return "sg";
      if (locationLower.includes("ireland")) return "ie";
      if (locationLower.includes("new zealand")) return "nz";
      if (locationLower.includes("brazil")) return "br";
      if (locationLower.includes("mexico")) return "mx";
      if (locationLower.includes("japan")) return "jp";
      if (locationLower.includes("china")) return "cn";
      
      // Default to US
      return "us";
    };

    const countryCode = extractCountryFromLocation(cleanedLocation || "");

    // Build Indeed search input - country is REQUIRED by Indeed API
    const indeedInput: any = {
      country: countryCode,
      query: normalizedJobTitle,
      maxRows: 200,
    };

    console.log(`Indeed search for: "${normalizedJobTitle}" in country: "${countryCode}", location: "${cleanedLocation}"`);

    // Always add location if available
    if (cleanedLocation) {
      indeedInput.location = cleanedLocation;
      console.log(`✅ Using location for Indeed search: "${cleanedLocation}"`);
    } else {
      console.warn(`⚠️ No location provided for Indeed search`);
    }

    // Map filters to Indeed format
    if (filters.employmentType) {
      const typeMap: any = {
        "Full-time": "fulltime",
        "Part-time": "parttime",
        Contract: "contract",
        Internship: "internship",
        Temporary: "temporary",
      };
      indeedInput.jobType =
        typeMap[filters.employmentType] || filters.employmentType.toLowerCase();
    }

    if (filters.workplaceType) {
      const remoteMap: any = {
        Remote: "remote",
        Hybrid: "hybrid",
      };
      if (remoteMap[filters.workplaceType]) {
        indeedInput.remote = remoteMap[filters.workplaceType];
      }
    }

    // Remove fromDays filter to get more results
    // indeedInput.fromDays = "7"; // Commented out to get all jobs, not just last 7 days
    indeedInput.sort = "relevance"; // Changed from "date" to "relevance" for better results

    console.log("Indeed Apify input:", JSON.stringify(indeedInput, null, 2));

    // Run the Indeed Jobs Scraper actor
    const run = await apifyClient
      .actor("MXLpngmVpE8WTESQr") // Indeed Job Scraper (PPR)
      .call(indeedInput, {
        timeout: 180, // 3 minutes timeout
      });

    console.log("✅ Indeed Apify run finished:", run.id);

    // Fetch results from dataset
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    console.log(`✅ Found ${items.length} similar jobs from Indeed`);

    // Normalize Indeed data to match our interface
    const normalizedJobs = items.map((job: any, idx: number) => ({
      id: job.id || job.jobKey || `indeed-${Date.now()}-${idx}`,
      title: job.title || job.jobTitle,
      url: job.url || job.link,
      company: {
        name: job.company?.name || job.companyName || "Unknown Company",
        logo: job.company?.logo || job.companyLogo,
        employeeCount: job.company?.employeeCount,
      },
      location: {
        city: job.location?.city || job.city,
        state: job.location?.state || job.state,
        country: job.location?.country || job.country,
        linkedinText: (() => {
          const text = job.location?.text || job.locationText;
          if (text) return text;

          // Build location string from available fields
          const parts = [
            job.location?.city || job.city,
            job.location?.state || job.state,
            job.location?.country || job.country,
          ].filter(Boolean); // Remove empty/null/undefined values

          return parts.length > 0 ? parts.join(", ") : "Location not specified";
        })(),
      },
      salary: job.salary
        ? {
            text:
              job.salary.salaryText ||
              job.salary.text ||
              (typeof job.salary === "string"
                ? job.salary
                : `${job.salary.salaryMin || ""} - ${
                    job.salary.salaryMax || ""
                  }`),
            min: job.salary.salaryMin || job.salary.min,
            max: job.salary.salaryMax || job.salary.max,
            currency: job.salary.salaryCurrency || job.salary.currency || "USD",
          }
        : undefined,
      employmentType: job.employmentType || job.jobType,
      workplaceType: job.workplaceType || job.remote,
      benefits: job.benefits || [],
      description: job.description || job.descriptionText,
      descriptionText: job.description || job.descriptionText,
      platform: "indeed" as const,
    }));

    return normalizedJobs;
  } catch (error: any) {
    console.error("❌ Error searching similar jobs on Indeed:", error);

    if (error.type === "invalid-input") {
      console.error(
        "Invalid Indeed Apify input. Trying with minimal parameters..."
      );
      try {
        const normalizedTitle = normalizeJobTitle(jobTitle);
        const locationForFallback = location?.replace(/\bnull\b,?\s*/gi, "").trim();
        const fallbackCountry = extractCountryFromLocation(locationForFallback || "");
        const safeInput: any = {
          country: fallbackCountry, // Required by Indeed
          query: normalizedTitle,
          maxRows: 200,
        };
        if (locationForFallback) {
          safeInput.location = locationForFallback;
          console.log(`📍 Fallback Indeed search with country: "${fallbackCountry}", location: "${locationForFallback}"`);
        } else {
          console.log(`📍 Fallback Indeed search with country: "${fallbackCountry}", no specific location`);
        }

        console.log(
          "Retrying Indeed with safe input:",
          JSON.stringify(safeInput, null, 2)
        );
        const run = await apifyClient!
          .actor("MXLpngmVpE8WTESQr")
          .call(safeInput, { timeout: 180 });
        const { items } = await apifyClient!
          .dataset(run.defaultDatasetId)
          .listItems();
        console.log(
          `✅ Fallback found ${items.length} similar jobs from Indeed`
        );

        // Normalize fallback results
        const normalizedJobs = items.map((job: any, idx: number) => ({
          id: job.id || job.jobKey || `indeed-fallback-${Date.now()}-${idx}`,
          title: job.title || job.jobTitle,
          url: job.url || job.link,
          company: {
            name: job.company?.name || job.companyName || "Unknown Company",
            logo: job.company?.logo || job.companyLogo,
          },
          location: {
            city: job.location?.city || job.city,
            state: job.location?.state || job.state,
            country: job.location?.country || job.country,
            linkedinText: (() => {
              const text = job.location?.text || job.locationText;
              if (text) return text;

              // Build location string from available fields
              const parts = [
                job.location?.city || job.city,
                job.location?.state || job.state,
                job.location?.country || job.country,
              ].filter(Boolean); // Remove empty/null/undefined values

              return parts.length > 0
                ? parts.join(", ")
                : "Location not specified";
            })(),
          },
          salary: job.salary
            ? {
                text:
                  job.salary.salaryText ||
                  job.salary.text ||
                  (typeof job.salary === "string"
                    ? job.salary
                    : `${job.salary.salaryMin || ""} - ${
                        job.salary.salaryMax || ""
                      }`),
                min: job.salary.salaryMin || job.salary.min,
                max: job.salary.salaryMax || job.salary.max,
                currency:
                  job.salary.salaryCurrency || job.salary.currency || "USD",
              }
            : undefined,
          employmentType: job.employmentType || job.jobType,
          workplaceType: job.workplaceType || job.remote,
          benefits: job.benefits || [],
          description: job.description || job.descriptionText,
          platform: "indeed" as const,
        }));

        return normalizedJobs;
      } catch (e) {
        console.error("Indeed fallback search failed:", e);
      }
    }

    return [];
  }
}

async function searchSimilarJobsWithApify(
  jobTitle: string,
  location: string,
  filters: {
    workplaceType?: string;
    employmentType?: string;
    experienceLevel?: string;
    salary?: string;
  }
): Promise<ApifyJobData[]> {
  if (!apifyClient) {
    console.warn("Apify API key not configured, skipping similar jobs search");
    return [];
  }

  try {
    console.log("Searching LinkedIn for similar jobs...", {
      jobTitle,
      location,
      filters,
    });

    // Normalize job title for better search results
    const normalizedJobTitle = normalizeJobTitle(jobTitle);

    // Use AI to normalize inputs to Apify enums
    const normalized = await normalizeForApify({
      jobTitle: normalizedJobTitle,
      location,
      workplaceType: filters.workplaceType,
      employmentType: filters.employmentType,
      experienceLevel: filters.experienceLevel,
      salary: filters.salary,
    });

    // Build Apify input from normalized values
    const apifyInput: any = {
      jobTitles: normalized.jobTitles,
      maxItems: normalized.maxItems ?? 200, // Increased from 50 to 200
      // postedLimit removed - search all jobs regardless of posting date
    };
    if (normalized.locations && normalized.locations.length > 0)
      apifyInput.locations = normalized.locations;
    if (normalized.workplaceType && normalized.workplaceType.length > 0)
      apifyInput.workplaceType = normalized.workplaceType;
    if (normalized.employmentType && normalized.employmentType.length > 0)
      apifyInput.employmentType = normalized.employmentType;
    if (normalized.experienceLevel && normalized.experienceLevel.length > 0)
      apifyInput.experienceLevel = normalized.experienceLevel;

    // Note: Salary filtering is intentionally excluded to avoid over-filtering results

    console.log("Apify input:", JSON.stringify(apifyInput, null, 2));

    // Run the LinkedIn Jobs Scraper actor
    const run = await apifyClient.actor("zn01OAlzP853oqn4Z").call(apifyInput, {
      timeout: 180, // 3 minutes timeout
    });

    console.log("✅ Apify run finished:", run.id);

    // Fetch results from dataset
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    console.log(`✅ Found ${items.length} similar jobs from LinkedIn`);

    // Mark all LinkedIn jobs with platform identifier
    const linkedInJobs = items.map((job: any) => ({
      ...job,
      platform: "linkedin" as const,
    }));

    // If no results found, try a broader search without filters
    if (linkedInJobs.length === 0) {
      console.log("⚠️ No jobs found with filters, trying broader search...");
      try {
        const normalizedTitle = normalizeJobTitle(jobTitle);
        const broadInput: any = {
          jobTitles: [normalizedTitle],
          maxItems: 200, // Increased from 50 to 200
          // No postedLimit - search all jobs
        };
        const cleanedLocation = location
          ?.replace(/\bnull\b,?\s*/gi, "")
          .replace(/\s+,/g, ",")
          .replace(/,{2,}/g, ",")
          .replace(/\s{2,}/g, " ")
          .trim();
        if (cleanedLocation) broadInput.locations = [cleanedLocation];

        console.log(
          "Retrying with broader search:",
          JSON.stringify(broadInput, null, 2)
        );
        const broadRun = await apifyClient!
          .actor("zn01OAlzP853oqn4Z")
          .call(broadInput, { timeout: 180 });
        const { items: broadItems } = await apifyClient!
          .dataset(broadRun.defaultDatasetId)
          .listItems();
        console.log(
          `✅ Broader search found ${broadItems.length} similar jobs`
        );
        // Mark all LinkedIn jobs with platform identifier
        const linkedInJobs = broadItems.map((job: any) => ({
          ...job,
          platform: "linkedin" as const,
        }));
        return linkedInJobs as ApifyJobData[];
      } catch (e) {
        console.error("Broader search failed:", e);
      }
    }

    return linkedInJobs as ApifyJobData[];
  } catch (error: any) {
    console.error("❌ Error searching similar jobs with Apify:", error);

    if (error.type === "invalid-input") {
      console.error("Invalid Apify input. Please check the input format.");
      try {
        // Attempt to re-run without optional filters as a safe fallback
        const normalizedTitle = normalizeJobTitle(jobTitle);
        const safeInput: any = { jobTitles: [normalizedTitle], maxItems: 200 }; // Increased from 50 to 200
        const cleanedLocation = location
          ?.replace(/\bnull\b,?\s*/gi, "")
          .replace(/\s+,/g, ",")
          .replace(/,{2,}/g, ",")
          .replace(/\s{2,}/g, " ")
          .trim();
        if (cleanedLocation) safeInput.locations = [cleanedLocation];
        console.log(
          "Retrying Apify with safe input:",
          JSON.stringify(safeInput, null, 2)
        );
        const run = await apifyClient!
          .actor("zn01OAlzP853oqn4Z")
          .call(safeInput, { timeout: 180 });
        const { items } = await apifyClient!
          .dataset(run.defaultDatasetId)
          .listItems();
        console.log(`✅ Fallback found ${items.length} similar jobs`);
        // Mark all LinkedIn jobs with platform identifier
        const linkedInJobs = items.map((job: any) => ({
          ...job,
          platform: "linkedin" as const,
        }));
        return linkedInJobs as ApifyJobData[];
      } catch (e) {
        console.error("Fallback search failed:", e);
      }
    }

    return [];
  }
}

async function searchCandidatesWithApify(
  jobTitle: string,
  location: string
): Promise<ApifyPeopleData[]> {
  if (!apifyClient) {
    console.warn("Apify API key not configured, skipping candidate search");
    return [];
  }

  try {
    console.log("Searching LinkedIn for candidates...", { jobTitle, location });

    // Normalize job title for better search results
    const normalizedJobTitle = normalizeJobTitle(jobTitle);

    // Clean location to remove any "null" literals
    const cleanedLocation = location
      ?.replace(/\bnull\b,?\s*/gi, "")
      .replace(/\s+,/g, ",")
      .replace(/,{2,}/g, ",")
      .replace(/\s{2,}/g, " ")
      .trim();

    // Build input for LinkedIn People Search actor
    const peopleInput: any = {
      profileScraperMode: "Short", // Use "Short" mode for cost efficiency
      currentJobTitles: [normalizedJobTitle],
      maxItems: 50, // Limit to 50 candidates
      takePages: 2, // 2 pages = up to 50 profiles (25 per page)
    };

    // Add location if available
    if (cleanedLocation) {
      peopleInput.locations = [cleanedLocation];
    }

    console.log(
      "Apify People Search input:",
      JSON.stringify(peopleInput, null, 2)
    );

    // Run the LinkedIn People Search actor
    const run = await apifyClient
      .actor("M2FMdjRVeF1HPGFcc") // LinkedIn Profile Search Mass Scraper
      .call(peopleInput, {
        timeout: 180, // 3 minutes timeout
      });

    console.log("✅ Apify People Search run finished:", run.id);

    // Fetch results from dataset
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    console.log(`✅ Found ${items.length} candidates from LinkedIn`);

    return items as ApifyPeopleData[];
  } catch (error: any) {
    console.error("❌ Error searching candidates with Apify:", error);

    if (error.type === "invalid-input") {
      console.error(
        "Invalid Apify People Search input. Please check the input format."
      );
      try {
        // Attempt a minimal fallback search
        const safeInput: any = {
          profileScraperMode: "Short",
          currentJobTitles: [jobTitle],
          maxItems: 25,
          takePages: 1,
        };
        const cleanedLocation = location
          ?.replace(/\bnull\b,?\s*/gi, "")
          .replace(/\s+,/g, ",")
          .replace(/,{2,}/g, ",")
          .replace(/\s{2,}/g, " ")
          .trim();
        if (cleanedLocation) safeInput.locations = [cleanedLocation];

        console.log(
          "Retrying Apify People Search with safe input:",
          JSON.stringify(safeInput, null, 2)
        );
        const run = await apifyClient!
          .actor("M2FMdjRVeF1HPGFcc")
          .call(safeInput, { timeout: 180 });
        const { items } = await apifyClient!
          .dataset(run.defaultDatasetId)
          .listItems();
        console.log(`✅ Fallback found ${items.length} candidates`);
        return items as ApifyPeopleData[];
      } catch (e) {
        console.error("Fallback candidate search failed:", e);
      }
    }

    return [];
  }
}

/**
 * Detect the platform (LinkedIn or Indeed) from a URL
 */
function detectPlatform(url: string): "linkedin" | "indeed" | "unknown" {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("linkedin.com")) return "linkedin";
  if (lowerUrl.includes("indeed.com")) return "indeed";
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Invalid input. Please provide a job URL or description." },
        { status: 400 }
      );
    }

    // Check if input is a URL
    const urlPattern =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    const isURL = urlPattern.test(input.trim());
    const platform = isURL ? detectPlatform(input.trim()) : "unknown";

    let scrapedData: any;
    let inputType: string;
    let scrapingError: string | null = null;

    if (isURL) {
      // If it's a URL, scrape it
      try {
        scrapedData = await scrapeJobURL(input.trim());
        inputType = "url";
      } catch (scrapeError: any) {
        console.error(
          "Initial scraping failed, will try to continue:",
          scrapeError.message
        );
        scrapingError = scrapeError.message;

        // Create minimal data object to try AI extraction with the URL
        scrapedData = {
          title: "Job Title (extraction failed)",
          description: "",
          rawText: "",
          source: "ScrapingBee (Failed)",
          url: input.trim(),
          scrapingError: scrapeError.message,
        };
        inputType = "url";
      }
    } else {
      // If it's a text description, return it as is
      scrapedData = {
        title: "Custom Job Description",
        description: input.trim(),
        rawText: input.trim(),
        source: "Manual Input",
      };
      inputType = "text";
    }

    // Use AI to extract additional details from the description
    const textToAnalyze =
      scrapedData.description ||
      scrapedData.descriptionPlainText ||
      scrapedData.rawText ||
      "";

    let aiExtractedData: ExtractedJobData = {};
    let similarJobs: ApifyJobData[] = [];

    if (textToAnalyze && textToAnalyze.length > 50) {
      aiExtractedData = await extractJobDetailsWithAI(
        textToAnalyze,
        scrapedData
      );

      // Merge AI-extracted data with scraped data
      // Only add AI data if the field doesn't already exist
      console.log(`📍 Location data - Scraped: "${scrapedData.location}", AI extracted: "${aiExtractedData.location}"`);
      
      scrapedData = {
        ...scrapedData,
        location: scrapedData.location || aiExtractedData.location,
        locationType: scrapedData.locationType || aiExtractedData.locationType,
        salary: scrapedData.salary || aiExtractedData.salary,
        experienceLevel: aiExtractedData.experienceLevel,
        employmentType:
          scrapedData.employmentType || aiExtractedData.employmentType,
        requirements:
          scrapedData.requirements || aiExtractedData.requirements || undefined,
        responsibilities:
          scrapedData.responsibilities ||
          aiExtractedData.responsibilities ||
          undefined,
        benefits: scrapedData.benefits || aiExtractedData.benefits || undefined,
        skills: aiExtractedData.skills || undefined,
        department: aiExtractedData.department,
        aiEnhanced: true, // Flag to indicate AI extraction was used
      };

      // Search for similar jobs on both LinkedIn and Indeed using Apify
      const jobTitle = scrapedData.title || aiExtractedData.department;
      const location = scrapedData.location || aiExtractedData.location;

      if (jobTitle && apifyClient) {
        console.log("Searching for similar jobs on LinkedIn and Indeed...");

        // Normalize job title with AI for better search results
        const normalizedJobTitle = await normalizeJobTitleWithAI(jobTitle);

        const filters = {
          workplaceType: scrapedData.locationType,
          employmentType: scrapedData.employmentType,
          experienceLevel: scrapedData.experienceLevel,
          salary: scrapedData.salary,
        };

        // Search both platforms in parallel with normalized title
        const [linkedInJobs, indeedJobs] = await Promise.all([
          searchSimilarJobsWithApify(normalizedJobTitle, location, filters),
          searchSimilarJobsOnIndeed(normalizedJobTitle, location, filters),
        ]);

        // Combine results from both platforms
        similarJobs = [...linkedInJobs, ...indeedJobs];
        console.log(
          `✅ Combined results: ${linkedInJobs.length} from LinkedIn + ${indeedJobs.length} from Indeed = ${similarJobs.length} total`
        );
      }
    }

    // Search for candidates with matching job title and location
    let candidates: ApifyPeopleData[] = [];
    const jobTitle = scrapedData.title || aiExtractedData.department;
    const location = scrapedData.location || aiExtractedData.location;

    if (jobTitle && apifyClient) {
      console.log("Searching for candidates on LinkedIn...");
      candidates = await searchCandidatesWithApify(jobTitle, location);
    }

    // Calculate platform breakdown for response
    const linkedInJobsCount = similarJobs.filter(
      (j) => j.platform === "linkedin"
    ).length;
    const indeedJobsCount = similarJobs.filter(
      (j) => j.platform === "indeed"
    ).length;

    // Extract salary range if available
    let minSalary: string | null = null;
    let maxSalary: string | null = null;
    if (scrapedData.salary || aiExtractedData.salary) {
      const salaryText = scrapedData.salary || aiExtractedData.salary || "";
      // Try to extract salary range (e.g., "$120,000 - $150,000" or "120K-150K")
      const rangeMatch = salaryText.match(/\$?(\d+(?:,\d{3})*(?:K|M)?)\s*[-–—]\s*\$?(\d+(?:,\d{3})*(?:K|M)?)/i);
      if (rangeMatch) {
        minSalary = rangeMatch[1].replace(/[Kk]/g, "000").replace(/[Mm]/g, "000000").replace(/,/g, "");
        maxSalary = rangeMatch[2].replace(/[Kk]/g, "000").replace(/[Mm]/g, "000000").replace(/,/g, "");
      } else {
        // Try single value
        const singleMatch = salaryText.match(/\$?(\d+(?:,\d{3})*(?:K|M)?)/i);
        if (singleMatch) {
          const value = singleMatch[1].replace(/[Kk]/g, "000").replace(/[Mm]/g, "000000").replace(/,/g, "");
          minSalary = value;
          maxSalary = value;
        }
      }
    }

    // Check for missing fields (the 10 fields from chatbot)
    const extractedFields = {
      roleTitle: scrapedData.title || null,
      department: scrapedData.department || aiExtractedData.department || null,
      experienceLevel: scrapedData.experienceLevel || aiExtractedData.experienceLevel || null,
      location: scrapedData.location || aiExtractedData.location || null,
      workModel: scrapedData.locationType || aiExtractedData.locationType || null,
      criticalSkills: scrapedData.skills || aiExtractedData.skills || null,
      minSalary: minSalary,
      maxSalary: maxSalary,
      nonNegotiables: scrapedData.requirements?.join(", ") || aiExtractedData.requirements?.join(", ") || null,
      flexible: scrapedData.benefits?.join(", ") || aiExtractedData.benefits?.join(", ") || null,
      timeline: null, // Timeline is rarely in job descriptions
    };

    // Count missing fields
    const missingFields = [];
    if (!extractedFields.roleTitle) missingFields.push("Role Title");
    if (!extractedFields.department) missingFields.push("Department");
    if (!extractedFields.experienceLevel) missingFields.push("Experience Level");
    if (!extractedFields.location) missingFields.push("Location");
    if (!extractedFields.workModel) missingFields.push("Work Model");
    if (!extractedFields.criticalSkills || (Array.isArray(extractedFields.criticalSkills) && extractedFields.criticalSkills.length === 0)) missingFields.push("Critical Skills");
    if (!extractedFields.minSalary || !extractedFields.maxSalary) missingFields.push("Salary Range");
    if (!extractedFields.nonNegotiables) missingFields.push("Non-Negotiables");
    if (!extractedFields.flexible) missingFields.push("Flexible Requirements");
    if (!extractedFields.timeline) missingFields.push("Timeline");

    return NextResponse.json({
      success: true,
      data: scrapedData,
      platform: platform, // Which platform was scraped (linkedin/indeed/unknown)
      similarJobs: similarJobs,
      similarJobsCount: similarJobs.length,
      linkedInJobsCount: linkedInJobsCount,
      indeedJobsCount: indeedJobsCount,
      candidates: candidates,
      candidatesCount: candidates.length,
      inputType,
      warnings: scrapingError
        ? [`Initial scraping failed: ${scrapingError}`]
        : undefined,
      extractedFields,
      missingFields,
      hasMissingFields: missingFields.length > 0,
    });
  } catch (error: any) {
    console.error("Error in scrape-job API:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to process job input",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
