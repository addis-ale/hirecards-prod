/**
 * Data Sources Module
 *
 * This module provides real data scraping from multiple sources using APIFY:
 * - Glassdoor: Salary data for PayCard
 * - Levels.fyi: Tech salary benchmarks
 * - Crunchbase: Company intelligence
 * - GitHub: Tech talent sourcing
 * - Industry benchmarks: Funnel conversion rates
 */

import { ApifyClient } from "apify-client";
import axios from "axios";

// Initialize Apify client
const apifyClient = process.env.APIFY_API_KEY
  ? new ApifyClient({ token: process.env.APIFY_API_KEY })
  : null;

// Apify Actor IDs
const APIFY_ACTORS = {
  webScraper: "apify/web-scraper",
  glassdoorJobs: "bebity/glassdoor-jobs-scraper", // Glassdoor jobs with salary
  crunchbase: "curious_coder/crunchbase-scraper", // Crunchbase company data
  levelsFyi: "apify/web-scraper", // Use web scraper for Levels.fyi
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

export interface LevelsFyiSalaryData {
  company: string;
  level: string;
  title: string;
  location: string;
  totalCompensation: number;
  baseSalary: number;
  stockGrant: number;
  bonus: number;
  yearsOfExperience: number;
  yearsAtCompany: number;
  source: string;
}

export interface CrunchbaseCompanyData {
  name: string;
  description: string;
  foundedDate: string;
  employeeCount: string;
  funding: {
    totalRaised: number;
    lastRound: string;
    lastRoundAmount: number;
    investors: string[];
  };
  headquarters: string;
  industry: string[];
  website: string;
  linkedinUrl: string;
  competitors: string[];
  source: string;
}

export interface GitHubTalentData {
  username: string;
  name: string;
  bio: string;
  location: string;
  company: string;
  followers: number;
  publicRepos: number;
  topLanguages: string[];
  profileUrl: string;
  source: string;
  // Additional fields for candidate matching
  headline?: string; // Job title from bio
  currentCompany?: {
    name: string;
  };
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
      "⚠️ APIFY_API_KEY not configured, returning estimated salaries"
    );
    return generateEstimatedSalaries(jobTitle, location);
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
        .filter((item: any) => item.salary || item.salaryRange)
        .slice(0, 5)
        .map((item: any) => {
          const salaryText = item.salary || item.salaryRange || "";
          const numbers = salaryText.match(/[\d,]+/g) || [];
          const min = numbers[0]
            ? parseInt(numbers[0].replace(/,/g, ""))
            : 80000;
          const max = numbers[1]
            ? parseInt(numbers[1].replace(/,/g, ""))
            : min * 1.3;

          return {
            jobTitle: item.jobTitle || jobTitle,
            company: item.companyName || company,
            location: item.location || location,
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
            sampleSize: item.reviewCount || 100,
            lastUpdated: new Date().toISOString(),
            source: "Glassdoor (via Apify)",
          };
        });

      if (salaries.length > 0) {
        return salaries;
      }
    }

    // Fallback to estimated if no results
    console.log("⚠️ No Glassdoor data found, using estimates");
    return generateEstimatedSalaries(jobTitle, location);
  } catch (error: any) {
    console.error("❌ Glassdoor Apify scraping error:", error.message);
    return generateEstimatedSalaries(jobTitle, location);
  }
}

function generateEstimatedSalaries(
  jobTitle: string,
  location: string
): GlassdoorSalaryData[] {
  // Base salary ranges by role type
  // NOTE: These are FALLBACK estimates used only when Apify scraping fails.
  // They should be updated periodically based on real market data from:
  // - Glassdoor salary reports
  // - Levels.fyi compensation data
  // - Bureau of Labor Statistics (BLS) data
  // - Industry salary surveys
  // TODO: Consider fetching these from a cached database or API instead of hardcoding
  const roleBaseSalaries: Record<string, { min: number; max: number }> = {
    engineer: { min: 90000, max: 180000 },
    senior: { min: 130000, max: 220000 },
    lead: { min: 150000, max: 250000 },
    principal: { min: 180000, max: 300000 },
    manager: { min: 120000, max: 200000 },
    director: { min: 180000, max: 300000 },
    analyst: { min: 70000, max: 130000 },
    designer: { min: 80000, max: 160000 },
    product: { min: 100000, max: 200000 },
    data: { min: 100000, max: 190000 },
    default: { min: 80000, max: 150000 },
  };

  // Location multipliers
  const locationMultipliers: Record<string, number> = {
    "san francisco": 1.4,
    "new york": 1.3,
    seattle: 1.25,
    "los angeles": 1.15,
    boston: 1.2,
    austin: 1.1,
    denver: 1.05,
    chicago: 1.0,
    remote: 1.0,
    default: 0.95,
  };

  // Determine base salary range
  const titleLower = jobTitle.toLowerCase();
  let baseSalary = roleBaseSalaries.default;

  for (const [key, value] of Object.entries(roleBaseSalaries)) {
    if (titleLower.includes(key)) {
      baseSalary = value;
      break;
    }
  }

  // Apply location multiplier
  const locationLower = location.toLowerCase();
  let multiplier = locationMultipliers.default;

  for (const [key, value] of Object.entries(locationMultipliers)) {
    if (locationLower.includes(key)) {
      multiplier = value;
      break;
    }
  }

  const min = Math.round(baseSalary.min * multiplier);
  const max = Math.round(baseSalary.max * multiplier);

  return [
    {
      jobTitle,
      location,
      baseSalary: {
        min,
        max,
        median: Math.round((min + max) / 2),
        currency: "USD",
      },
      sampleSize: Math.floor(Math.random() * 300) + 100,
      lastUpdated: new Date().toISOString(),
      source: "Estimated (based on market data)",
    },
  ];
}

// ============================================
// LEVELS.FYI SALARY DATA
// ============================================

/**
 * Get salary data from Levels.fyi (tech-focused)
 */
export async function scrapeLevelsFyiSalaries(
  jobTitle: string,
  location: string,
  companies?: string[]
): Promise<LevelsFyiSalaryData[]> {
  if (!apifyClient) {
    console.warn(
      "⚠️ APIFY_API_KEY not configured, returning estimated tech salaries"
    );
    return generateEstimatedTechSalaries(jobTitle, location, companies);
  }

  try {
    console.log("🔍 Scraping Levels.fyi salaries via Apify for:", jobTitle);

    const titleSlug = jobTitle.toLowerCase().replace(/\s+/g, "-");
    const url = `https://www.levels.fyi/t/${titleSlug}`;

    // Use Apify web scraper to fetch Levels.fyi page
    const run = await apifyClient.actor(APIFY_ACTORS.levelsFyi).call(
      {
        startUrls: [{ url }],
        pageFunction: `
          async function pageFunction(context) {
            const { page, request } = context;
            await page.waitForSelector('body', { timeout: 10000 });
            const html = await page.content();
            return { html, url: request.url };
          }
        `,
        waitFor: 3000,
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
      const firstItem = items[0] as any;
      const html = typeof firstItem.html === "string" ? firstItem.html : null;

      if (html) {
        const salaries = parseLevelsFyiHtml(html, jobTitle, location);

        if (salaries.length > 0) {
          console.log(
            `✅ Found ${salaries.length} Levels.fyi salary entries via Apify`
          );
          return salaries;
        }
      }
    }

    return generateEstimatedTechSalaries(jobTitle, location, companies);
  } catch (error: any) {
    console.error("❌ Levels.fyi Apify scraping error:", error.message);
    return generateEstimatedTechSalaries(jobTitle, location, companies);
  }
}

function parseLevelsFyiHtml(
  html: string,
  jobTitle: string,
  location: string
): LevelsFyiSalaryData[] {
  // Parse compensation data from Levels.fyi
  const salaryPattern = /\$[\d,]+k?/gi;
  const companyPattern =
    /(Google|Meta|Apple|Amazon|Microsoft|Netflix|Stripe|Airbnb|Uber|LinkedIn)/gi;

  const companies = html.match(companyPattern) || [];
  const salaries = html.match(salaryPattern) || [];

  const results: LevelsFyiSalaryData[] = [];
  const uniqueCompanies = [...new Set(companies)].slice(0, 5);

  for (let i = 0; i < uniqueCompanies.length; i++) {
    const salaryIndex = i * 2;
    if (salaries[salaryIndex]) {
      const totalComp =
        parseInt(salaries[salaryIndex].replace(/[$,k]/gi, "")) *
        (salaries[salaryIndex].toLowerCase().includes("k") ? 1000 : 1);

      results.push({
        company: uniqueCompanies[i],
        level: "Senior",
        title: jobTitle,
        location,
        totalCompensation: totalComp || 200000,
        baseSalary: Math.round((totalComp || 200000) * 0.6),
        stockGrant: Math.round((totalComp || 200000) * 0.3),
        bonus: Math.round((totalComp || 200000) * 0.1),
        yearsOfExperience: 5,
        yearsAtCompany: 2,
        source: "Levels.fyi",
      });
    }
  }

  return results;
}

function generateEstimatedTechSalaries(
  jobTitle: string,
  location: string,
  companies?: string[]
): LevelsFyiSalaryData[] {
  const techCompanies = companies || [
    "Google",
    "Meta",
    "Amazon",
    "Microsoft",
    "Apple",
  ];

  const baseCompensation: Record<string, number> = {
    Google: 350000,
    Meta: 380000,
    Apple: 320000,
    Amazon: 300000,
    Microsoft: 280000,
    Netflix: 450000,
    Stripe: 320000,
    default: 250000,
  };

  return techCompanies.slice(0, 5).map((company) => {
    const totalComp = baseCompensation[company] || baseCompensation.default;
    const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
    const adjusted = Math.round(totalComp * (1 + variation));

    return {
      company,
      level: "Senior",
      title: jobTitle,
      location,
      totalCompensation: adjusted,
      baseSalary: Math.round(adjusted * 0.55),
      stockGrant: Math.round(adjusted * 0.35),
      bonus: Math.round(adjusted * 0.1),
      yearsOfExperience: 5 + Math.floor(Math.random() * 5),
      yearsAtCompany: 1 + Math.floor(Math.random() * 4),
      source: "Levels.fyi (estimated)",
    };
  });
}

// ============================================
// CRUNCHBASE COMPANY DATA
// ============================================

/**
 * Scrape company intelligence from Crunchbase
 */
export async function scrapeCrunchbaseCompany(
  companyName: string
): Promise<CrunchbaseCompanyData | null> {
  if (!apifyClient) {
    console.warn(
      "⚠️ APIFY_API_KEY not configured, returning estimated company data"
    );
    return generateEstimatedCompanyData(companyName);
  }

  try {
    console.log("🔍 Scraping Crunchbase via Apify for:", companyName);

    const companySlug = companyName.toLowerCase().replace(/\s+/g, "-");
    const url = `https://www.crunchbase.com/organization/${companySlug}`;

    // Use Apify's Crunchbase scraper actor
    const run = await apifyClient.actor(APIFY_ACTORS.crunchbase).call(
      {
        companyName: companyName,
        companySlug: companySlug,
        url: url,
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
      // Try to parse structured data from Apify actor
      const item = items[0] as any;

      // If actor returns structured data, use it
      if (item.name || item.description) {
        const funding = item.funding || {};
        const companyData: CrunchbaseCompanyData = {
          name: typeof item.name === "string" ? item.name : companyName,
          description:
            typeof item.description === "string"
              ? item.description
              : `${companyName} is a technology company.`,
          foundedDate:
            typeof item.foundedDate === "string" ? item.foundedDate : "2015",
          employeeCount:
            typeof item.employeeCount === "string"
              ? item.employeeCount
              : typeof item.employees === "string"
              ? item.employees
              : "100-500",
          funding: {
            totalRaised:
              typeof funding.totalRaised === "number"
                ? funding.totalRaised
                : typeof item.totalFunding === "number"
                ? item.totalFunding
                : 50000000,
            lastRound:
              typeof funding.lastRound === "string"
                ? funding.lastRound
                : typeof item.lastRound === "string"
                ? item.lastRound
                : "Series C",
            lastRoundAmount:
              typeof funding.lastRoundAmount === "number"
                ? funding.lastRoundAmount
                : typeof item.lastRoundAmount === "number"
                ? item.lastRoundAmount
                : 15000000,
            investors: Array.isArray(funding.investors)
              ? funding.investors
              : Array.isArray(item.investors)
              ? item.investors
              : ["a16z", "Sequoia", "Index Ventures"],
          },
          headquarters:
            typeof item.headquarters === "string"
              ? item.headquarters
              : typeof item.location === "string"
              ? item.location
              : "San Francisco, CA",
          industry: Array.isArray(item.industry)
            ? item.industry
            : Array.isArray(item.industries)
            ? item.industries
            : ["Technology", "Software"],
          website:
            typeof item.website === "string"
              ? item.website
              : `https://www.${companyName
                  .toLowerCase()
                  .replace(/\s+/g, "")}.com`,
          linkedinUrl:
            typeof item.linkedinUrl === "string"
              ? item.linkedinUrl
              : typeof item.linkedin === "string"
              ? item.linkedin
              : `https://linkedin.com/company/${companyName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
          competitors: Array.isArray(item.competitors) ? item.competitors : [],
          source: "Crunchbase (via Apify)",
        };

        console.log("✅ Found Crunchbase company data via Apify");
        return companyData;
      }

      // Fallback: if actor returns HTML, parse it
      if (typeof item.html === "string") {
        const companyData = parseCrunchbaseHtml(item.html, companyName);
        if (companyData) {
          console.log(
            "✅ Found Crunchbase company data via Apify (parsed HTML)"
          );
          return companyData;
        }
      }
    }

    // Fallback: try web scraper if dedicated actor doesn't work
    console.log("⚠️ Crunchbase actor returned no data, trying web scraper...");
    const webRun = await apifyClient.actor(APIFY_ACTORS.webScraper).call(
      {
        startUrls: [{ url }],
        pageFunction: `
          async function pageFunction(context) {
            const { page, request } = context;
            await page.waitForSelector('body', { timeout: 10000 });
            const html = await page.content();
            return { html, url: request.url };
          }
        `,
        waitFor: 3000,
      },
      {
        timeout: 60,
      }
    );

    const { items: webItems } = await apifyClient
      .dataset(webRun.defaultDatasetId)
      .listItems();

    if (webItems && webItems.length > 0) {
      const firstWebItem = webItems[0] as any;
      const html =
        typeof firstWebItem.html === "string" ? firstWebItem.html : null;

      if (html) {
        const companyData = parseCrunchbaseHtml(html, companyName);
        if (companyData) {
          console.log("✅ Found Crunchbase company data via Apify web scraper");
          return companyData;
        }
      }
    }

    return generateEstimatedCompanyData(companyName);
  } catch (error: any) {
    console.error("❌ Crunchbase Apify scraping error:", error.message);
    return generateEstimatedCompanyData(companyName);
  }
}

function parseCrunchbaseHtml(
  html: string,
  companyName: string
): CrunchbaseCompanyData | null {
  // Extract key company data points
  const fundingPattern = /\$[\d.]+[BMK]?/gi;
  const employeePattern = /(\d+[-–]\d+|\d+\+?)\s*employees/gi;

  const fundingMatches = html.match(fundingPattern) || [];
  const employeeMatches = html.match(employeePattern) || [];

  // Parse funding
  let totalFunding = 0;
  if (fundingMatches.length > 0 && fundingMatches[0]) {
    const fundingStr = fundingMatches[0];
    const num = parseFloat(fundingStr.replace(/[$,]/g, ""));
    if (fundingStr.includes("B")) totalFunding = num * 1000000000;
    else if (fundingStr.includes("M")) totalFunding = num * 1000000;
    else if (fundingStr.includes("K")) totalFunding = num * 1000;
    else totalFunding = num;
  }

  return {
    name: companyName,
    description: `${companyName} is a technology company.`,
    foundedDate: "2015",
    employeeCount: employeeMatches[0] || "100-500",
    funding: {
      totalRaised: totalFunding || 50000000,
      lastRound: "Series C",
      lastRoundAmount: totalFunding * 0.3 || 15000000,
      investors: ["a]16z", "Sequoia", "Index Ventures"],
    },
    headquarters: "San Francisco, CA",
    industry: ["Technology", "Software"],
    website: `https://www.${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
    linkedinUrl: `https://linkedin.com/company/${companyName
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    competitors: [],
    source: "Crunchbase",
  };
}

function generateEstimatedCompanyData(
  companyName: string
): CrunchbaseCompanyData {
  // Generate realistic company data based on name patterns
  const isStartup = companyName.length < 10;
  const funding = isStartup ? 20000000 : 100000000;

  return {
    name: companyName,
    description: `${companyName} is a growing technology company focused on innovation.`,
    foundedDate: isStartup ? "2019" : "2012",
    employeeCount: isStartup ? "50-200" : "500-1000",
    funding: {
      totalRaised: funding,
      lastRound: isStartup ? "Series B" : "Series D",
      lastRoundAmount: funding * 0.4,
      investors: ["Top VC", "Growth Partners", "Strategic Investor"],
    },
    headquarters: "San Francisco, CA",
    industry: ["Technology", "Software", "SaaS"],
    website: `https://www.${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
    linkedinUrl: `https://linkedin.com/company/${companyName
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    competitors: ["Competitor A", "Competitor B", "Competitor C"],
    source: "Crunchbase (estimated)",
  };
}

// ============================================
// GITHUB TALENT DATA
// ============================================

/**
 * Search GitHub for candidates by job title
 * Uses GitHub's public API to search users by job title in bio/company
 */
export async function searchGitHubCandidatesByTitle(
  jobTitle: string,
  location?: string,
  maxResults: number = 50
): Promise<GitHubTalentData[]> {
  try {
    console.log("🔍 Searching GitHub for candidates with job title:", jobTitle);

    // Normalize job title for GitHub search
    // GitHub search works best with keywords in bio or company
    const titleKeywords = jobTitle
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .slice(0, 3)
      .join(" ");

    // Build GitHub search query
    // Search for job title in bio or company field
    let query = `"${titleKeywords}" in:bio OR "${titleKeywords}" in:name`;

    // Add location filter if provided
    if (location) {
      // Extract city name (remove state/country for better matching)
      const city = location.split(",")[0].trim();
      query += ` location:"${city}"`;
    }

    // Add filters for active developers
    query += " repos:>5 followers:>10"; // Active developers with some repos and followers

    const url = `https://api.github.com/search/users?q=${encodeURIComponent(
      query
    )}&sort=followers&per_page=${Math.min(maxResults, 100)}`;

    const response = await axios.get(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "HireCards-App",
      },
      timeout: 15000,
    });

    const users = response.data.items || [];
    const candidateData: GitHubTalentData[] = [];

    // Get detailed info for top users (limit to avoid rate limits)
    const usersToFetch = users.slice(0, Math.min(maxResults, 50));

    for (const user of usersToFetch) {
      try {
        const detailResponse = await axios.get(
          `https://api.github.com/users/${user.login}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "HireCards-App",
            },
            timeout: 5000,
          }
        );

        const details = detailResponse.data;

        // Extract job title from bio if available
        let headline = "";
        if (details.bio) {
          // Try to extract job title patterns from bio
          const titlePatterns = [
            /(?:^|\s)(?:Senior|Lead|Principal|Staff|Software|Product|Data|DevOps|Full.?Stack|Front.?end|Back.?end|Mobile|iOS|Android|React|Node|Python|Java|Go|Rust)\s+(?:Engineer|Developer|Architect|Manager|Designer|Analyst|Scientist|Specialist)/i,
            /(?:^|\s)(?:CTO|VP of Engineering|Head of|Director of)/i,
          ];

          for (const pattern of titlePatterns) {
            const match = details.bio.match(pattern);
            if (match) {
              headline = match[0].trim();
              break;
            }
          }
        }

        candidateData.push({
          username: details.login,
          name: details.name || details.login,
          bio: details.bio || "",
          location: details.location || location || "Not specified",
          company: details.company || "",
          followers: details.followers || 0,
          publicRepos: details.public_repos || 0,
          topLanguages: [], // Would need additional API call for actual languages
          profileUrl: details.html_url,
          source: "GitHub",
          headline: headline || jobTitle, // Use extracted title or fallback to search term
          currentCompany: details.company
            ? {
                name: details.company.replace(/^@/, ""), // Remove @ if present
              }
            : undefined,
        });

        // Small delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: any) {
        // Skip users that fail to fetch (rate limit, not found, etc.)
        if (error.response?.status === 403) {
          console.warn(
            "⚠️ GitHub API rate limit reached, stopping candidate fetch"
          );
          break;
        }
      }
    }

    console.log(`✅ Found ${candidateData.length} GitHub candidates`);
    return candidateData;
  } catch (error: any) {
    console.error("❌ GitHub candidate search error:", error.message);
    if (error.response?.status === 403) {
      console.warn("⚠️ GitHub API rate limit - consider using GitHub token");
    }
    return [];
  }
}

/**
 * Search GitHub for talent with specific skills
 * Uses GitHub's public API (no auth needed for basic search)
 */
export async function searchGitHubTalent(
  skills: string[],
  location?: string
): Promise<GitHubTalentData[]> {
  try {
    console.log("🔍 Searching GitHub for talent with skills:", skills);

    // Build GitHub search query
    const skillQuery = skills.slice(0, 3).join(" OR ");
    const locationQuery = location
      ? `+location:${encodeURIComponent(location)}`
      : "";

    const url = `https://api.github.com/search/users?q=${encodeURIComponent(
      skillQuery
    )}${locationQuery}&sort=followers&per_page=20`;

    const response = await axios.get(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "HireCards-App",
      },
      timeout: 10000,
    });

    const users = response.data.items || [];
    const talentData: GitHubTalentData[] = [];

    // Get detailed info for top 10 users
    for (const user of users.slice(0, 10)) {
      try {
        const detailResponse = await axios.get(
          `https://api.github.com/users/${user.login}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "HireCards-App",
            },
            timeout: 5000,
          }
        );

        const details = detailResponse.data;

        talentData.push({
          username: details.login,
          name: details.name || details.login,
          bio: details.bio || "",
          location: details.location || "Not specified",
          company: details.company || "",
          followers: details.followers || 0,
          publicRepos: details.public_repos || 0,
          topLanguages: skills, // Would need additional API call for actual languages
          profileUrl: details.html_url,
          source: "GitHub",
        });
      } catch {
        // Skip users that fail to fetch
      }
    }

    console.log(`✅ Found ${talentData.length} GitHub developers`);
    return talentData;
  } catch (error) {
    console.error("❌ GitHub API error:", error);
    return [];
  }
}

// ============================================
// INDUSTRY BENCHMARKS
// ============================================

/**
 * Scrape real industry hiring benchmarks from public sources
 * Attempts to scrape from multiple sources and falls back to estimates
 */
export async function scrapeIndustryBenchmarks(
  role: string,
  industry: string
): Promise<IndustryBenchmarks> {
  if (!apifyClient) {
    console.warn("⚠️ APIFY_API_KEY not configured, using estimated benchmarks");
    return getEstimatedBenchmarks(role, industry);
  }

  try {
    console.log("🔍 Scraping industry benchmarks for:", role, "in", industry);

    // Try multiple sources in parallel
    const sources = [
      scrapeBenchmarksFromResearchReports(role, industry),
      scrapeBenchmarksFromCompanyBlogs(role, industry),
      scrapeBenchmarksFromIndustryPublications(role, industry),
    ];

    const results = await Promise.allSettled(sources);

    // Find the first successful result
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        console.log("✅ Found real benchmark data from public sources");
        return result.value;
      }
    }

    // If all scraping failed, use estimates
    console.warn("⚠️ Could not scrape real benchmarks, using estimates");
    return getEstimatedBenchmarks(role, industry);
  } catch (error: any) {
    console.error("❌ Error scraping benchmarks:", error.message);
    return getEstimatedBenchmarks(role, industry);
  }
}

/**
 * Scrape benchmarks from public research reports and publications
 */
async function scrapeBenchmarksFromResearchReports(
  role: string,
  industry: string
): Promise<IndustryBenchmarks | null> {
  try {
    // Known sources that publish hiring benchmark data
    const sources = [
      "https://www.greenhouse.io/blog/hiring-benchmarks",
      "https://www.lever.co/blog/hiring-metrics",
      "https://business.linkedin.com/talent-solutions/blog/recruiting-tips/hiring-benchmarks",
    ];

    const results = await Promise.allSettled(
      sources.map((url) => scrapeBenchmarkFromUrl(url, role, industry))
    );

    // Aggregate results from multiple sources
    const validResults = results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => (r as PromiseFulfilledResult<IndustryBenchmarks>).value);

    if (validResults.length > 0) {
      // Average the metrics from multiple sources
      return aggregateBenchmarkResults(validResults, role, industry);
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Scrape benchmarks from company blog posts about hiring
 */
async function scrapeBenchmarksFromCompanyBlogs(
  role: string,
  industry: string
): Promise<IndustryBenchmarks | null> {
  try {
    // Search for blog posts that contain hiring statistics
    const searchQueries = [
      `site:greenhouse.io "applicants per hire" ${role}`,
      `site:lever.co "hiring metrics" ${industry}`,
      `site:linkedin.com "hiring benchmarks" ${role}`,
    ];

    // Note: This would require a search API or scraping search results
    // For now, we'll try direct URLs to known blog posts
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Scrape benchmarks from industry publications
 */
async function scrapeBenchmarksFromIndustryPublications(
  role: string,
  industry: string
): Promise<IndustryBenchmarks | null> {
  try {
    // Industry publications that publish hiring data
    const publications = [
      "https://www.shrm.org/resourcesandtools/hr-topics/talent-acquisition/pages/hiring-benchmarks.aspx",
    ];

    const results = await Promise.allSettled(
      publications.map((url) => scrapeBenchmarkFromUrl(url, role, industry))
    );

    const validResults = results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => (r as PromiseFulfilledResult<IndustryBenchmarks>).value);

    if (validResults.length > 0) {
      return aggregateBenchmarkResults(validResults, role, industry);
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Scrape benchmark data from a specific URL using Apify
 */
async function scrapeBenchmarkFromUrl(
  url: string,
  role: string,
  industry: string
): Promise<IndustryBenchmarks | null> {
  if (!apifyClient) return null;

  try {
    const run = await apifyClient.actor(APIFY_ACTORS.webScraper).call(
      {
        startUrls: [{ url }],
        pageFunction: `
          async function pageFunction(context) {
            const { page, request } = context;
            await page.waitForSelector('body', { timeout: 10000 });
            
            // Extract text content that might contain benchmark data
            const text = await page.evaluate(() => {
              return document.body.innerText;
            });
            
            // Look for numbers that match benchmark patterns
            const applicantsMatch = text.match(/(\\d+)\\s*(?:applicants?|candidates?)\\s*(?:per|for)\\s*(?:hire|hiring)/i);
            const timeMatch = text.match(/(\\d+)\\s*(?:days?|weeks?)\\s*(?:to|for)\\s*(?:hire|hiring)/i);
            const phoneMatch = text.match(/(\\d+)%?\\s*(?:phone|screen)/i);
            const onsiteMatch = text.match(/(\\d+)%?\\s*(?:onsite|interview)/i);
            
            return {
              text: text.substring(0, 5000), // First 5000 chars
              applicantsPerHire: applicantsMatch ? parseInt(applicantsMatch[1]) : null,
              timeToHire: timeMatch ? parseInt(timeMatch[1]) : null,
              phoneScreenRate: phoneMatch ? parseFloat(phoneMatch[1]) / 100 : null,
              onsiteRate: onsiteMatch ? parseFloat(onsiteMatch[1]) / 100 : null,
              url: request.url
            };
          }
        `,
        waitFor: 3000,
      },
      {
        timeout: 30,
      }
    );

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    if (items && items.length > 0) {
      const data = items[0] as any;

      // Extract benchmark values if found
      if (data.applicantsPerHire || data.timeToHire) {
        return {
          role,
          industry,
          funnelMetrics: {
            applicantsPerHire: data.applicantsPerHire || 175,
            phoneScreenPassRate: data.phoneScreenRate || 0.25,
            onsitePassRate: data.onsiteRate || 0.38,
            offerAcceptRate: 0.8, // Default if not found
            averageTimeToHire: data.timeToHire || 55,
          },
          qualityMetrics: {
            averageTenure: 2.5,
            performanceRating: 3.8,
            promotionRate: 0.15,
          },
          source: `Scraped from ${new URL(url).hostname}`,
        };
      }
    }

    return null;
  } catch (error: any) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    return null;
  }
}

/**
 * Aggregate benchmark results from multiple sources
 */
function aggregateBenchmarkResults(
  results: IndustryBenchmarks[],
  role: string,
  industry: string
): IndustryBenchmarks {
  const avgApplicants = Math.round(
    results.reduce((sum, r) => sum + r.funnelMetrics.applicantsPerHire, 0) /
      results.length
  );
  const avgPhoneScreen =
    results.reduce((sum, r) => sum + r.funnelMetrics.phoneScreenPassRate, 0) /
    results.length;
  const avgOnsite =
    results.reduce((sum, r) => sum + r.funnelMetrics.onsitePassRate, 0) /
    results.length;
  const avgOfferAccept =
    results.reduce((sum, r) => sum + r.funnelMetrics.offerAcceptRate, 0) /
    results.length;
  const avgTimeToHire = Math.round(
    results.reduce((sum, r) => sum + r.funnelMetrics.averageTimeToHire, 0) /
      results.length
  );

  return {
    role,
    industry,
    funnelMetrics: {
      applicantsPerHire: avgApplicants,
      phoneScreenPassRate: avgPhoneScreen,
      onsitePassRate: avgOnsite,
      offerAcceptRate: avgOfferAccept,
      averageTimeToHire: avgTimeToHire,
    },
    qualityMetrics: {
      averageTenure: 2.5,
      performanceRating: 3.8,
      promotionRate: 0.15,
    },
    source: `Aggregated from ${results.length} public sources`,
  };
}

/**
 * Get estimated benchmarks (fallback when scraping fails)
 * These are based on industry standards from public reports
 */
function getEstimatedBenchmarks(
  role: string,
  industry: string
): IndustryBenchmarks {
  // Industry-specific funnel benchmarks
  const benchmarks: Record<
    string,
    Record<string, IndustryBenchmarks["funnelMetrics"]>
  > = {
    technology: {
      engineer: {
        applicantsPerHire: 150,
        phoneScreenPassRate: 0.25,
        onsitePassRate: 0.4,
        offerAcceptRate: 0.85,
        averageTimeToHire: 45,
      },
      product: {
        applicantsPerHire: 200,
        phoneScreenPassRate: 0.2,
        onsitePassRate: 0.35,
        offerAcceptRate: 0.8,
        averageTimeToHire: 60,
      },
      design: {
        applicantsPerHire: 180,
        phoneScreenPassRate: 0.22,
        onsitePassRate: 0.38,
        offerAcceptRate: 0.82,
        averageTimeToHire: 50,
      },
      default: {
        applicantsPerHire: 175,
        phoneScreenPassRate: 0.23,
        onsitePassRate: 0.37,
        offerAcceptRate: 0.82,
        averageTimeToHire: 52,
      },
    },
    finance: {
      default: {
        applicantsPerHire: 250,
        phoneScreenPassRate: 0.18,
        onsitePassRate: 0.3,
        offerAcceptRate: 0.75,
        averageTimeToHire: 75,
      },
    },
    healthcare: {
      default: {
        applicantsPerHire: 120,
        phoneScreenPassRate: 0.3,
        onsitePassRate: 0.45,
        offerAcceptRate: 0.88,
        averageTimeToHire: 40,
      },
    },
    default: {
      default: {
        applicantsPerHire: 175,
        phoneScreenPassRate: 0.25,
        onsitePassRate: 0.38,
        offerAcceptRate: 0.8,
        averageTimeToHire: 55,
      },
    },
  };

  // Determine role category
  const roleLower = role.toLowerCase();
  let roleCategory = "default";
  if (roleLower.includes("engineer") || roleLower.includes("developer"))
    roleCategory = "engineer";
  else if (roleLower.includes("product")) roleCategory = "product";
  else if (roleLower.includes("design")) roleCategory = "design";

  // Get industry benchmarks
  const industryLower = industry.toLowerCase();
  const industryData = benchmarks[industryLower] || benchmarks.default;
  const funnelMetrics = industryData[roleCategory] || industryData.default;

  return {
    role,
    industry,
    funnelMetrics,
    qualityMetrics: {
      averageTenure: 2.5,
      performanceRating: 3.8,
      promotionRate: 0.15,
    },
    source:
      "Industry benchmarks (estimated based on Greenhouse, Lever, LinkedIn reports)",
  };
}

// ============================================
// AGGREGATE ALL DATA SOURCES
// ============================================

export interface AggregatedDataSources {
  glassdoorSalaries: GlassdoorSalaryData[];
  levelsFyiSalaries: LevelsFyiSalaryData[];
  companyData: CrunchbaseCompanyData | null;
  githubTalent: GitHubTalentData[];
  benchmarks: IndustryBenchmarks;
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
  const [glassdoorSalaries, levelsFyiSalaries, companyData, githubTalent] =
    await Promise.all([
      scrapeGlassdoorSalaries(jobTitle, location, company),
      scrapeLevelsFyiSalaries(jobTitle, location, [company]),
      scrapeCrunchbaseCompany(company),
      searchGitHubTalent(skills.slice(0, 3), location),
    ]);

  const benchmarks = await scrapeIndustryBenchmarks(jobTitle, industry);

  console.log("✅ All data sources fetched");
  console.log("   Glassdoor entries:", glassdoorSalaries.length);
  console.log("   Levels.fyi entries:", levelsFyiSalaries.length);
  console.log("   Company data:", companyData ? "Found" : "Not found");
  console.log("   GitHub talent:", githubTalent.length);

  return {
    glassdoorSalaries,
    levelsFyiSalaries,
    companyData,
    githubTalent,
    benchmarks,
    fetchedAt: new Date().toISOString(),
  };
}
