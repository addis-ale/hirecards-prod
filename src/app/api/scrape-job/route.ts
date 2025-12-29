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
  linkedinUrl: string;
  company: {
    name: string;
    logo?: string;
    employeeCount?: number;
  };
  location: {
    linkedinText: string;
    parsed?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  salary?: {
    text: string;
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
  employmentType?: ("full-time" | "part-time" | "contract" | "internship" | "temporary")[];
  experienceLevel?: ("internship" | "entry" | "associate" | "mid-senior" | "director" | "executive")[];
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
 * Normalize job title for better LinkedIn search results
 * Removes company-specific details, team names, and simplifies the title
 */
function normalizeJobTitle(title: string): string {
  if (!title) return title;

  let normalized = title;

  // Remove content in parentheses (e.g., "(back-end)", "(Remote)", "(Contract)")
  normalized = normalized.replace(/\([^)]*\)/g, '');

  // Remove content after dashes that looks like team/department names
  // e.g., "Sr. Product Engineer - Trips Team" -> "Sr. Product Engineer"
  normalized = normalized.replace(/\s*-\s*[A-Z][a-zA-Z\s]*Team\s*$/i, '');
  normalized = normalized.replace(/\s*-\s*[A-Z][a-zA-Z\s]*Department\s*$/i, '');

  // Remove extra location/workplace info at the end
  normalized = normalized.replace(/\s*-\s*(Remote|Hybrid|On-site|Onsite)\s*$/i, '');

  // Normalize seniority abbreviations
  normalized = normalized.replace(/\bSr\.\s*/gi, 'Senior ');
  normalized = normalized.replace(/\bJr\.\s*/gi, 'Junior ');

  // Clean up extra whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  console.log(`Normalized job title: "${title}" -> "${normalized}"`);
  
  return normalized;
}

async function normalizeForApify(
  params: {
    jobTitle: string;
    location?: string;
    workplaceType?: string;
    employmentType?: string;
    experienceLevel?: string;
    salary?: string;
  }
): Promise<NormalizedApifyInput> {
  if (!openai) {
    // Fallback: naive mapping if OpenAI not available
    const naive: NormalizedApifyInput = { jobTitles: [params.jobTitle], maxItems: 50 };
    if (params.location) {
      const cleaned = params.location.replace(/\bnull\b,?\s*/gi, "").replace(/\s+,/g, ",").replace(/,{2,}/g, ",").replace(/\s{2,}/g, " ").trim();
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
      { role: "system", content: "Return only valid JSON. No prose. No markdown." },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    max_tokens: 400,
  });
  const json = resp.choices[0]?.message?.content?.trim() || "{}";
  try {
    const data = JSON.parse(json);
    // Always cap maxItems
    data.maxItems = 50;
    return data as NormalizedApifyInput;
  } catch (e) {
    console.error("Failed to parse OpenAI normalization response:", json);
    // Fallback minimal input
    const minimal: NormalizedApifyInput = { jobTitles: [params.jobTitle], maxItems: 50 };
    return minimal;
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
    console.log("Searching LinkedIn for similar jobs...", { jobTitle, location, filters });

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
      maxItems: normalized.maxItems ?? 50,
      // postedLimit removed - search all jobs regardless of posting date
    };
    if (normalized.locations && normalized.locations.length > 0) apifyInput.locations = normalized.locations;
    if (normalized.workplaceType && normalized.workplaceType.length > 0) apifyInput.workplaceType = normalized.workplaceType;
    if (normalized.employmentType && normalized.employmentType.length > 0) apifyInput.employmentType = normalized.employmentType;
    if (normalized.experienceLevel && normalized.experienceLevel.length > 0) apifyInput.experienceLevel = normalized.experienceLevel;
    
    // Note: Salary filtering is intentionally excluded to avoid over-filtering results

    console.log("Apify input:", JSON.stringify(apifyInput, null, 2));

    // Run the LinkedIn Jobs Scraper actor
    const run = await apifyClient
      .actor("zn01OAlzP853oqn4Z")
      .call(apifyInput, {
        timeout: 180, // 3 minutes timeout
      });

    console.log("✅ Apify run finished:", run.id);

    // Fetch results from dataset
    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

    console.log(`✅ Found ${items.length} similar jobs from LinkedIn`);

    // If no results found, try a broader search without filters
    if (items.length === 0) {
      console.log("⚠️ No jobs found with filters, trying broader search...");
      try {
        const normalizedTitle = normalizeJobTitle(jobTitle);
        const broadInput: any = { 
          jobTitles: [normalizedTitle], 
          maxItems: 50
          // No postedLimit - search all jobs
        };
        const cleanedLocation = location?.replace(/\bnull\b,?\s*/gi, "").replace(/\s+,/g, ",").replace(/,{2,}/g, ",").replace(/\s{2,}/g, " ").trim();
        if (cleanedLocation) broadInput.locations = [cleanedLocation];
        
        console.log("Retrying with broader search:", JSON.stringify(broadInput, null, 2));
        const broadRun = await apifyClient!.actor("zn01OAlzP853oqn4Z").call(broadInput, { timeout: 180 });
        const { items: broadItems } = await apifyClient!.dataset(broadRun.defaultDatasetId).listItems();
        console.log(`✅ Broader search found ${broadItems.length} similar jobs`);
        return broadItems as ApifyJobData[];
      } catch (e) {
        console.error("Broader search failed:", e);
      }
    }

    return items as ApifyJobData[];
  } catch (error: any) {
    console.error("❌ Error searching similar jobs with Apify:", error);

    if (error.type === "invalid-input") {
      console.error("Invalid Apify input. Please check the input format.");
      try {
        // Attempt to re-run without optional filters as a safe fallback
        const normalizedTitle = normalizeJobTitle(jobTitle);
        const safeInput: any = { jobTitles: [normalizedTitle], maxItems: 50 };
        const cleanedLocation = location?.replace(/\bnull\b,?\s*/gi, "").replace(/\s+,/g, ",").replace(/,{2,}/g, ",").replace(/\s{2,}/g, " ").trim();
        if (cleanedLocation) safeInput.locations = [cleanedLocation];
        console.log("Retrying Apify with safe input:", JSON.stringify(safeInput, null, 2));
        const run = await apifyClient!.actor("zn01OAlzP853oqn4Z").call(safeInput, { timeout: 180 });
        const { items } = await apifyClient!.dataset(run.defaultDatasetId).listItems();
        console.log(`✅ Fallback found ${items.length} similar jobs`);
        return items as ApifyJobData[];
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

    console.log("Apify People Search input:", JSON.stringify(peopleInput, null, 2));

    // Run the LinkedIn People Search actor
    const run = await apifyClient
      .actor("M2FMdjRVeF1HPGFcc") // LinkedIn Profile Search Mass Scraper
      .call(peopleInput, {
        timeout: 180, // 3 minutes timeout
      });

    console.log("✅ Apify People Search run finished:", run.id);

    // Fetch results from dataset
    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

    console.log(`✅ Found ${items.length} candidates from LinkedIn`);

    return items as ApifyPeopleData[];
  } catch (error: any) {
    console.error("❌ Error searching candidates with Apify:", error);

    if (error.type === "invalid-input") {
      console.error("Invalid Apify People Search input. Please check the input format.");
      try {
        // Attempt a minimal fallback search
        const safeInput: any = {
          profileScraperMode: "Short",
          currentJobTitles: [jobTitle],
          maxItems: 25,
          takePages: 1,
        };
        const cleanedLocation = location?.replace(/\bnull\b,?\s*/gi, "").replace(/\s+,/g, ",").replace(/,{2,}/g, ",").replace(/\s{2,}/g, " ").trim();
        if (cleanedLocation) safeInput.locations = [cleanedLocation];
        
        console.log("Retrying Apify People Search with safe input:", JSON.stringify(safeInput, null, 2));
        const run = await apifyClient!.actor("M2FMdjRVeF1HPGFcc").call(safeInput, { timeout: 180 });
        const { items } = await apifyClient!.dataset(run.defaultDatasetId).listItems();
        console.log(`✅ Fallback found ${items.length} candidates`);
        return items as ApifyPeopleData[];
      } catch (e) {
        console.error("Fallback candidate search failed:", e);
      }
    }

    return [];
  }
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
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    const isURL = urlPattern.test(input.trim());

    let scrapedData: any;
    let inputType: string;
    let scrapingError: string | null = null;

    if (isURL) {
      // If it's a URL, scrape it
      try {
        scrapedData = await scrapeJobURL(input.trim());
        inputType = "url";
      } catch (scrapeError: any) {
        console.error("Initial scraping failed, will try to continue:", scrapeError.message);
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
      scrapedData = {
        ...scrapedData,
        location: scrapedData.location || aiExtractedData.location,
        locationType: scrapedData.locationType || aiExtractedData.locationType,
        salary: scrapedData.salary || aiExtractedData.salary,
        experienceLevel: aiExtractedData.experienceLevel,
        employmentType:
          scrapedData.employmentType || aiExtractedData.employmentType,
        requirements:
          scrapedData.requirements ||
          aiExtractedData.requirements ||
          undefined,
        responsibilities:
          scrapedData.responsibilities ||
          aiExtractedData.responsibilities ||
          undefined,
        benefits:
          scrapedData.benefits || aiExtractedData.benefits || undefined,
        skills: aiExtractedData.skills || undefined,
        department: aiExtractedData.department,
        aiEnhanced: true, // Flag to indicate AI extraction was used
      };

      // Search for similar jobs on LinkedIn using Apify
      const jobTitle = scrapedData.title || aiExtractedData.department;
      const location = scrapedData.location || aiExtractedData.location;

      if (jobTitle && apifyClient) {
        console.log("Searching for similar jobs on LinkedIn...");
        similarJobs = await searchSimilarJobsWithApify(jobTitle, location, {
          workplaceType: scrapedData.locationType,
          employmentType: scrapedData.employmentType,
          experienceLevel: scrapedData.experienceLevel,
          salary: scrapedData.salary,
        });
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

    return NextResponse.json({
      success: true,
      data: scrapedData,
      similarJobs: similarJobs,
      similarJobsCount: similarJobs.length,
      candidates: candidates,
      candidatesCount: candidates.length,
      inputType,
      warnings: scrapingError ? [`Initial scraping failed: ${scrapingError}`] : undefined,
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
