/**
 * Job Description URL Scraper
 *
 * This module provides functionality to scrape job descriptions from various job boards
 * and extract structured information using AI.
 */

import * as cheerio from "cheerio";
import axios from "axios";

interface ScrapedJobData {
  title: string;
  description: string;
  location?: string;
  company?: string;
  salary?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  rawText: string;
  source: string;
}

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;

/**
 * Scrape a job description from a URL using ScrapingBee
 */
export async function scrapeJobURL(url: string): Promise<ScrapedJobData> {
  try {
    console.log("🚀 ScrapingBee scrape:", url);

    if (!SCRAPINGBEE_API_KEY) {
      throw new Error("SCRAPINGBEE_API_KEY not configured");
    }

    const response = await axios.get("https://app.scrapingbee.com/api/v1/", {
      params: {
        api_key: SCRAPINGBEE_API_KEY,
        url,
        // Important: enable JS rendering
        render_js: "true",
        premium_proxy: "true",
        wait: "5000", // wait extra for React pages
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const hostname = new URL(url).hostname.toLowerCase();

    let scrapedData: ScrapedJobData;

    if (hostname.includes("linkedin.com")) {
      scrapedData = scrapeLinkedIn($);
    } else if (hostname.includes("indeed.com")) {
      scrapedData = scrapeIndeed($);
    } else if (hostname.includes("workday.com")) {
      scrapedData = scrapeWorkday($);
    } else if (hostname.includes("myworkdayjobs.com")) {
      scrapedData = scrapeWorkday($);
    } else if (hostname.includes("ashbyhq.com")) {
      scrapedData = scrapeAshby($, url);
    } else {
      scrapedData = scrapeGenericJobBoard($);
    }

    console.log("✅ ScrapingBee success");
    return scrapedData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ ScrapingBee error:", errorMessage);
    throw new Error("Failed to scrape job URL using ScrapingBee");
  }
}

/**
 * Scrape LinkedIn job postings
 */
function scrapeLinkedIn($: cheerio.CheerioAPI): ScrapedJobData {
  const title = $("h1.top-card-layout__title, h1.topcard__title")
    .first()
    .text()
    .trim();
  const company = $("a.topcard__org-name-link, .topcard__flavor--black-link")
    .first()
    .text()
    .trim();
  const location = $("span.topcard__flavor--bullet, .topcard__flavor")
    .first()
    .text()
    .trim();

  const description = $(".description__text, .show-more-less-html__markup")
    .text()
    .trim();

  // Extract salary if available
  const salary = $(".salary, .compensation").text().trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    salary: salary || undefined,
    requirements: extractListItems($, "requirements"),
    responsibilities: extractListItems($, "responsibilities"),
    benefits: extractListItems($, "benefits"),
    rawText,
    source: "LinkedIn",
  };
}

/**
 * Scrape Indeed job postings
 */
function scrapeIndeed($: cheerio.CheerioAPI): ScrapedJobData {
  const title = $("h1.jobsearch-JobInfoHeader-title, h1").first().text().trim();
  const company = $(
    ".jobsearch-InlineCompanyRating-companyHeader, .jobsearch-CompanyInfoContainer"
  )
    .first()
    .text()
    .trim();
  const location = $(
    ".jobsearch-JobInfoHeader-subtitle div, .jobsearch-JobComponent-location"
  )
    .first()
    .text()
    .trim();

  const description = $("#jobDescriptionText, .jobsearch-jobDescriptionText")
    .text()
    .trim();

  const salary = $(".jobsearch-JobMetadataHeader-item, .salary-snippet")
    .text()
    .trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    salary: salary || undefined,
    requirements: extractListItems($, "requirements"),
    responsibilities: extractListItems($, "responsibilities"),
    benefits: extractListItems($, "benefits"),
    rawText,
    source: "Indeed",
  };
}

/**
 * Scrape Workday job postings
 */
function scrapeWorkday($: cheerio.CheerioAPI): ScrapedJobData {
  const title = $('h1[data-automation-id="jobPostingHeader"], h1')
    .first()
    .text()
    .trim();
  const location = $('[data-automation-id="locations"], .jobLocation')
    .first()
    .text()
    .trim();

  const description = $(
    '[data-automation-id="jobPostingDescription"], .jobDescription'
  )
    .text()
    .trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    requirements: extractListItems($, "requirements"),
    responsibilities: extractListItems($, "responsibilities"),
    benefits: extractListItems($, "benefits"),
    rawText,
    source: "Workday",
  };
}

/**
 * Scrape Ashby job postings
 */
function scrapeAshby($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  // Get all text from the page
  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  // Try to find title - Ashby often puts it in h1 or h2
  let title = "";

  // Look through all headings and get the first substantial one
  $("h1, h2, h3").each((_, elem) => {
    const text = $(elem).text().trim();
    if (text && text.length > 5 && text.length < 100 && !title) {
      title = text;
    }
  });

  // Fallback to page title
  if (!title) {
    const pageTitle = $("title").text();
    title = pageTitle.split("|")[0].split("-")[0].trim();
  }

  // Extract structured fields from sidebar (Location, Employment Type, etc.)
  let company = "";
  let location = "";
  let locationType = "";
  let department = "";
  let salary = "";

  // Ashby often has a sidebar with labeled fields
  // Look for patterns like "Location\nSydney Office" or "Department\nCommercial"
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i];
    const next = lines[i + 1];

    // Try to extract location even if "Location" label is missing
    // Look for common location patterns
    const locationPatterns = [
      /^Location$/i,
      /^Where$/i,
      /^Office Location$/i,
      /^Job Location$/i,
    ];

    const isLocationLabel = locationPatterns.some((pattern) =>
      pattern.test(current)
    );

    if (isLocationLabel && !location) {
      console.log(`🔍 Found Location field, next line: "${next}"`);
      // Handle multiple locations (could be comma-separated on one line or multiple lines)
      // Check if next line contains comma-separated locations
      if (next && next.includes(",")) {
        // All locations on one line: "Mexico, Colombia, Peru, Ecuador"
        location = next;
        console.log(`✅ Location extracted (comma-separated): "${location}"`);
      } else {
        // Multiple lines for locations
        const locations = [next];

        // Check if next line(s) are also locations (not a field label)
        const fieldLabels = [
          "Employment Type",
          "Location Type",
          "Department",
          "Compensation",
          "Remote Type",
        ];
        let j = i + 2;
        while (
          j < lines.length &&
          !fieldLabels.includes(lines[j]) &&
          lines[j].length < 50
        ) {
          // If it looks like a location (short, not a label), add it
          if (lines[j] && !lines[j].includes(":") && lines[j] !== next) {
            locations.push(lines[j]);
            j++;
          } else {
            break;
          }
        }

        location = locations.join(", ");
        console.log(`✅ Location extracted (multi-line): "${location}"`);
      }
    } else if (current === "Employment Type") {
      // employmentType = next; // Unused variable
    } else if (current === "Location Type") {
      locationType = next;
      // Normalize work model values
      const lower = locationType.toLowerCase();
      if (lower.includes("remote") || lower === "remote") {
        locationType = "Remote";
      } else if (lower.includes("hybrid")) {
        locationType = "Hybrid";
      } else if (
        lower.includes("office") ||
        lower.includes("on-site") ||
        lower.includes("onsite")
      ) {
        locationType = "On-site";
      }
    } else if (current === "Department") {
      department = next;
    } else if (current === "Compensation" && i + 1 < lines.length) {
      // Compensation might span multiple lines
      salary = lines.slice(i + 1, i + 3).join(" ");
    }

    if (!salary) {
      const compLabel = $("*")
        .filter((_, el) => $(el).text().trim() === "Compensation")
        .first();

      if (compLabel.length) {
        salary = compLabel.next().text().trim();
      }
    }

    if (!salary) {
      const bodyText = $.text();
      const match = bodyText.match(
        /\$[\d,.]+(?:K|M)?\s*[\–-]\s*\$[\d,.]+(?:K|M)?/i
      );
      if (match) {
        salary = match[0];
      }
    }

    salary = salary.replace(/\s+/g, " ").trim();
  }

  // Try to find company name in the page
  // Often appears near the top or in meta tags
  const companyMeta = $('meta[property="og:site_name"]').attr("content");
  if (companyMeta) {
    company = companyMeta;
  } else {
    // Try to extract from URL hostname (e.g., jobs.ashbyhq.com/COMPANY_NAME/...)
    const urlParts = url.split("/");
    if (urlParts.length > 3 && urlParts[2].includes("ashbyhq.com")) {
      const potentialCompany = urlParts[3];
      if (
        potentialCompany &&
        potentialCompany.length > 2 &&
        potentialCompany.length < 50
      ) {
        company =
          potentialCompany.charAt(0).toUpperCase() + potentialCompany.slice(1);
      }
    }

    // If still no company, look for company name patterns in text
    // But exclude common field labels
    const excludeWords = [
      "Location",
      "Department",
      "Employment Type",
      "Location Type",
      "Compensation",
      "Remote",
      "Hybrid",
      "On-site",
    ];
    if (!company) {
      $("*").each((_, elem) => {
        const text = $(elem).text().trim();
        if (
          text.match(/^[A-Z][a-zA-Z\s]+$/) &&
          text.length > 3 &&
          text.length < 30 &&
          !excludeWords.includes(text) &&
          !company
        ) {
          company = text;
        }
      });
    }
  }

  // For Ashby, the entire page text is the best we can get for description
  // The AI is smart enough to extract the relevant parts
  const description = rawText;

  // If location still not found, try to extract from meta tags or structured data
  if (!location) {
    console.log("🔍 Trying alternative location extraction methods...");

    // Try Open Graph tags
    const ogLocationMeta = $('meta[property="og:location"]').attr("content");
    if (ogLocationMeta) {
      location = ogLocationMeta;
      console.log(`✅ Location extracted from Open Graph: "${location}"`);
    }

    // Try JSON-LD structured data
    if (!location) {
      $('script[type="application/ld+json"]').each((_, elem) => {
        if (location) return; // Already found
        try {
          const jsonData = JSON.parse($(elem).html() || "{}");
          if (
            jsonData.jobLocation?.address?.addressCountry ||
            jsonData.jobLocation?.address?.addressLocality
          ) {
            const parts = [
              jsonData.jobLocation?.address?.addressLocality,
              jsonData.jobLocation?.address?.addressRegion,
              jsonData.jobLocation?.address?.addressCountry,
            ].filter(Boolean);
            location = parts.join(", ");
            console.log(`✅ Location extracted from JSON-LD: "${location}"`);
          }
        } catch {
          // JSON parse failed, continue
        }
      });
    }

    // Try searching for country names in raw text
    if (!location) {
      const countries = [
        "Sweden",
        "United States",
        "United Kingdom",
        "Canada",
        "Germany",
        "France",
        "Spain",
        "Italy",
        "Netherlands",
        "Australia",
        "India",
        "Singapore",
        "Japan",
        "Brazil",
        "Mexico",
      ];
      for (const country of countries) {
        if (rawText.includes(country)) {
          location = country;
          console.log(`✅ Location extracted from text search: "${location}"`);
          break;
        }
      }
    }
  }

  console.log("🔍 Ashby scrape result:", {
    title: title.substring(0, 50),
    company,
    location: location || "❌ NOT FOUND",
    locationType,
    department,
    salary: salary.substring(0, 50),
    textLength: description.length,
  });

  if (!location) {
    console.warn(
      "⚠️ Location NOT extracted from Ashby page! Check if page structure changed or use AI extraction."
    );
  }

  return {
    title: title || "Job Position",
    description: description,
    location: location || undefined,
    company: company || undefined,
    salary: salary || undefined,
    requirements: [],
    responsibilities: [],
    benefits: [],
    rawText,
    source: "Ashby",
  };
}

/**
 * Generic scraping for unknown job boards
 */
function scrapeGenericJobBoard(
  $: cheerio.CheerioAPI
): ScrapedJobData {
  // Try to find title using common patterns
  const title = $(
    'h1, [class*="title" i], [class*="job" i] h1, [class*="position" i]'
  )
    .first()
    .text()
    .trim();

  // Try to find location
  const location = $('[class*="location" i], [data-location], .location')
    .first()
    .text()
    .trim();

  // Try to find company
  const company = $('[class*="company" i], .company-name')
    .first()
    .text()
    .trim();

  // Try to find description - look for the largest text block
  let description = "";
  $('[class*="description" i], [class*="content" i], main, article').each(
    (_, elem) => {
      const text = $(elem).text().trim();
      if (text.length > description.length) {
        description = text;
      }
    }
  );

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    requirements: extractListItems($, "requirements"),
    responsibilities: extractListItems($, "responsibilities"),
    benefits: extractListItems($, "benefits"),
    rawText,
    source: "Generic",
  };
}

/**
 * Extract list items from a section (requirements, responsibilities, benefits)
 */
function extractListItems(
  $: cheerio.CheerioAPI,
  section: string
): string[] {
  const items: string[] = [];

  // Look for section headers and extract list items
  const sectionRegex = new RegExp(section, "i");

  // Find elements that might contain the section
  $("h2, h3, h4, h5, strong, b").each((_, elem) => {
    const text = $(elem).text().trim();
    if (sectionRegex.test(text)) {
      // Get the next sibling elements (ul, ol, or p tags)
      let next = $(elem).next();
      let count = 0;

      while (next.length && count < 5) {
        if (next.is("ul, ol")) {
          next.find("li").each((_, li) => {
            const item = $(li).text().trim();
            if (item) items.push(item);
          });
          break;
        } else if (next.is("p")) {
          const item = next.text().trim();
          if (item) items.push(item);
        }
        next = next.next();
        count++;
      }
    }
  });

  return items;
}

/**
 * Parse scraped data using AI to extract structured fields
 */
export async function parseScrapedJobData(
  scrapedData: ScrapedJobData
): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OpenAI API key not configured");
    return extractBasicFields(scrapedData);
  }

  try {
    console.log("📄 Sending to AI:", {
      title: scrapedData.title,
      company: scrapedData.company,
      location: scrapedData.location,
      descriptionLength: scrapedData.description.length,
      descriptionPreview: scrapedData.description.substring(0, 200),
    });

    const prompt = `You are an expert at parsing job descriptions. Analyze the following content and determine if it's a legitimate job posting.

Job Title: ${scrapedData.title}
Company: ${scrapedData.company || "Not specified"}
Location: ${scrapedData.location || "Not specified"}

Description:
${scrapedData.description.substring(0, 4000)}

CRITICAL: First, determine if this is actually a job posting. If it's NOT a job posting (e.g., company homepage, random article, search page, error page), set confidence to 0.0 and return minimal data.

If it IS a valid job posting, extract the following:
- Company name (CRITICAL: Extract the ACTUAL hiring company name, NOT the job board/platform name like "LinkedIn", "Indeed", etc. Look for phrases like "at [Company]", "join [Company]", or company names in the job description)
- Job title (clean format)
- Location (city/state/country or "Remote")
- Work model (Remote, Hybrid, On-site)
- Experience level (Entry Level, Mid-Level, Senior, Lead, Principal)
- Salary range (extract min and max as separate numbers, remove currency symbols and commas)
- Key required skills (top 5-7 skills)
- Critical requirements (must-haves)
- Timeline/urgency (if mentioned)
- Department (Engineering, Product, Design, Marketing, Sales, etc.)

IMPORTANT FOR SALARY:
- Extract minSalary and maxSalary as pure numbers (no currency symbols, no commas)
- Example: "$120,000 - $150,000" → minSalary: "120000", maxSalary: "150000"
- Example: "£50k-£70k" → minSalary: "50000", maxSalary: "70000"
- If only one number is mentioned, set both min and max to that number
- If no salary is mentioned, set both to null

Return ONLY valid JSON with this exact structure:
{
  "isJobPosting": true/false,
  "company": "actual hiring company name (NOT job board name) or null",
  "jobTitle": "extracted role title or null",
  "location": "city/country or Remote or null",
  "workModel": "Remote/Hybrid/On-site or null",
  "experienceLevel": "level or null",
  "minSalary": "number string or null (e.g., '120000')",
  "maxSalary": "number string or null (e.g., '150000')",
  "skills": ["skill1", "skill2"] or [],
  "requirements": ["req1", "req2"] or [],
  "timeline": "timeline or null",
  "department": "department or null",
  "confidence": 0.0-1.0
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at parsing job descriptions. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    console.log("🤖 AI parsed job data:", {
      isJobPosting: parsed.isJobPosting,
      confidence: parsed.confidence,
      jobTitle: parsed.jobTitle,
      location: parsed.location,
      skillsCount: parsed.skills?.length || 0,
    });

    // Prioritize AI-extracted company name, but fall back to scraped company
    // Make sure we never use the job board name (source) as the company
    const extractedCompany = parsed.company || scrapedData.company;
    const jobBoardNames = ["LinkedIn", "Indeed", "Workday", "Ashby", "Generic"];
    const isJobBoardName = jobBoardNames.some((board) =>
      extractedCompany?.toLowerCase().includes(board.toLowerCase())
    );

    return {
      ...parsed,
      company: isJobBoardName ? scrapedData.company : extractedCompany, // Use scraped company if AI returned job board name
      source: scrapedData.source,
      isURL: true,
    };
  } catch (error) {
    console.error("AI parsing error:", error);
    return extractBasicFields(scrapedData);
  }
}

/**
 * Extract basic fields without AI (fallback)
 */
function extractBasicFields(
  scrapedData: ScrapedJobData
): Record<string, unknown> {
  const description = scrapedData.description.toLowerCase();

  // Determine work model
  let workModel = null;
  if (description.includes("remote")) workModel = "Remote";
  else if (description.includes("hybrid")) workModel = "Hybrid";
  else if (description.includes("on-site") || description.includes("onsite"))
    workModel = "On-site";

  // Determine experience level
  let experienceLevel = null;
  if (description.includes("senior") || description.includes("sr."))
    experienceLevel = "Senior";
  else if (description.includes("lead")) experienceLevel = "Lead";
  else if (description.includes("principal")) experienceLevel = "Principal";
  else if (description.includes("junior") || description.includes("entry"))
    experienceLevel = "Entry Level";
  else if (
    description.includes("mid-level") ||
    description.includes("mid level")
  )
    experienceLevel = "Mid-Level";

  return {
    jobTitle: scrapedData.title,
    location: scrapedData.location || null,
    workModel,
    experienceLevel,
    minSalary: null,
    maxSalary: null,
    skills: scrapedData.requirements?.slice(0, 5) || [],
    requirements: scrapedData.requirements || [],
    timeline: null,
    department: null,
    company: scrapedData.company,
    source: scrapedData.source,
    confidence: 0.6,
    isURL: true,
  };
}
