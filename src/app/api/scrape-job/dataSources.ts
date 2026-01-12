/**
 * Data Sources Module
 *
 * This module provides real data scraping from multiple sources using APIFY:
 * - Glassdoor: Salary data for PayCard
 * - Industry benchmarks: Funnel conversion rates
 */

import { ApifyClient } from "apify-client";

// Initialize Apify client
const apifyClient = process.env.APIFY_API_KEY
  ? new ApifyClient({ token: process.env.APIFY_API_KEY })
  : null;

// Apify Actor IDs
const APIFY_ACTORS = {
  webScraper: "apify/web-scraper",
  glassdoorJobs: "bebity/glassdoor-jobs-scraper", // Glassdoor jobs with salary
};

// ============================================
// INTERFACES
// ============================================

export interface GlassdoorSalaryData {
  jobTitle: string;
  company?: string;
  location: string;
  baseSalary: {
    min: number;
    max: number;
    median: number;
    currency: string;
  };
  totalCompensation?: {
    min: number;
    max: number;
    median: number;
  };
  sampleSize: number;
  lastUpdated: string;
  source: string;
}



export interface IndustryBenchmarks {
  role: string;
  industry: string;
  funnelMetrics: {
    applicantsPerHire: number;
    phoneScreenPassRate: number;
    onsitePassRate: number;
    offerAcceptRate: number;
    averageTimeToHire: number;
  };
  qualityMetrics: {
    averageTenure: number;
    performanceRating: number;
    promotionRate: number;
  };
  source: string;
}

// ============================================
// GLASSDOOR SALARY SCRAPER (Using Apify)
// ============================================

/**
 * Scrape salary data from Glassdoor using Apify
 */
export async function scrapeGlassdoorSalaries(
  jobTitle: string,
  location: string,
  company?: string
): Promise<GlassdoorSalaryData[]> {
  if (!apifyClient) {
    console.warn(
      "⚠️ APIFY_API_KEY not configured, returning empty salary data"
    );
    return [];
  }

  try {
    console.log(
      "🔍 Scraping Glassdoor salaries via Apify for:",
      jobTitle,
      location
    );

    // Use Apify's Glassdoor Jobs Scraper
    const run = await apifyClient.actor(APIFY_ACTORS.glassdoorJobs).call(
      {
        keyword: jobTitle,
        location: location,
        maxItems: 10,
        includeCompanyDetails: true,
      },
      {
        timeout: 60, // 60 seconds timeout
      }
    );

    // Get results from the dataset
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    if (items && items.length > 0) {
      console.log(
        `✅ Found ${items.length} Glassdoor salary entries via Apify`
      );

      // Parse Glassdoor results
      const salaries: GlassdoorSalaryData[] = items
        .filter((item: Record<string, unknown>) => item.salary || item.salaryRange)
        .slice(0, 5)
        .map((item: Record<string, unknown>) => {
          const salaryText = (typeof item.salary === 'string' ? item.salary : '') || (typeof item.salaryRange === 'string' ? item.salaryRange : '') || "";
          const numbers = salaryText.match(/[\d,]+/g) || [];
          const min = numbers[0]
            ? parseInt(numbers[0].replace(/,/g, ""))
            : 80000;
          const max = numbers[1]
            ? parseInt(numbers[1].replace(/,/g, ""))
            : min * 1.3;

          return {
            jobTitle: (typeof item.jobTitle === 'string' ? item.jobTitle : jobTitle),
            company: (typeof item.companyName === 'string' ? item.companyName : company),
            location: (typeof item.location === 'string' ? item.location : location),
            baseSalary: {
              min: min > 1000 ? min : min * 1000, // Handle k notation
              max: max > 1000 ? max : max * 1000,
              median: Math.round(
                ((min > 1000 ? min : min * 1000) +
                  (max > 1000 ? max : max * 1000)) /
                  2
              ),
              currency: "USD",
            },
            sampleSize: (typeof item.reviewCount === 'number' ? item.reviewCount : 100),
            lastUpdated: new Date().toISOString(),
            source: "Glassdoor (via Apify)",
          };
        });

      if (salaries.length > 0) {
        return salaries;
      }
    }

    // No results found - return empty array
    console.log("⚠️ No Glassdoor data found, returning empty array");
    return [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Glassdoor Apify scraping error:", errorMessage);
    return [];
  }
}




// ============================================
// INDUSTRY BENCHMARKS
// ============================================

/**
 * Get industry benchmarks - returns null when no real data available
 * Real benchmarks should be scraped from external sources
 */
export async function scrapeIndustryBenchmarks(
  _role: string,
  _industry: string
): Promise<IndustryBenchmarks | null> {
  // No real data available - return null instead of estimates
  console.warn("⚠️ No real benchmark data available, returning null");
  return null;
}

// ============================================
// AGGREGATE ALL DATA SOURCES
// ============================================

export interface AggregatedDataSources {
  glassdoorSalaries: GlassdoorSalaryData[];
  benchmarks: IndustryBenchmarks | null;
  fetchedAt: string;
}

/**
 * Fetch all data sources for a job
 */
export async function fetchAllDataSources(
  jobTitle: string,
  company: string,
  location: string,
  skills: string[],
  industry: string = "technology"
): Promise<AggregatedDataSources> {
  console.log("📊 Fetching all data sources...");
  console.log("   Job:", jobTitle);
  console.log("   Company:", company);
  console.log("   Location:", location);
  console.log("   Skills:", skills.slice(0, 5).join(", "));

  // Fetch all sources in parallel
  const [glassdoorSalaries] =
    await Promise.all([
      scrapeGlassdoorSalaries(jobTitle, location, company),
    ]);

  const benchmarks = await scrapeIndustryBenchmarks(jobTitle, industry);

  console.log("✅ All data sources fetched");
  console.log("   Glassdoor entries:", glassdoorSalaries.length);

  return {
    glassdoorSalaries,
    benchmarks,
    fetchedAt: new Date().toISOString(),
  };
}
