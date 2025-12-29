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

/**
 * Scrape a job description from a URL using Puppeteer
 * Works for both static HTML and JavaScript-rendered pages
 */

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
  // Helper: fetch HTML via ScrapingBee
  const fetchViaBee = async () => {
    if (!SCRAPINGBEE_API_KEY) {
      throw new Error("SCRAPINGBEE_API_KEY not configured");
    }

    console.log("🐝 Calling ScrapingBee with render_js...");

    const response = await axios.get("https://app.scrapingbee.com/api/v1", {
      params: {
        api_key: SCRAPINGBEE_API_KEY,
        url: url,
        render_js: "true",
        premium_proxy: "true",
        wait: "5000",
        wait_for: "body",
      },
      timeout: 30000,
      maxRedirects: 5,
    });

    if (response.status !== 200) {
      throw new Error(`ScrapingBee returned status ${response.status}`);
    }

    return response.data as string;
  };

  // Helper: fetch HTML directly (best-effort)
  const fetchDirect = async () => {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: (s: any) => s >= 200 && s < 400,
    });
    return response.data as string;
  };

  // Puppeteer removed - not compatible with serverless deployments
  // ScrapingBee handles JavaScript rendering

  // Helper: detect if HTML is a React/JS shell that needs rendering
  const isJavaScriptShell = (html: string): boolean => {
    const lowerHtml = html.toLowerCase();
    return (
      lowerHtml.includes("you need to enable javascript") ||
      lowerHtml.includes("enable javascript to run this app") ||
      (lowerHtml.includes('<div id="root"></div>') && html.length < 5000) ||
      (lowerHtml.includes('<div id="app"></div>') && html.length < 5000)
    );
  };

  try {
    console.log("🚀 scrapeJobURL:", url);

    let html: string | null = null;
    let usedPuppeteer = false;

    // Strategy 1: Try ScrapingBee if configured
    if (SCRAPINGBEE_API_KEY) {
      try {
        html = await fetchViaBee();

        // Check if we got a JS shell
        if (isJavaScriptShell(html)) {
          console.warn(
            "⚠️ ScrapingBee returned JS shell, page may need more rendering time"
          );
          // Still use it - might have some content
        } else {
          console.log("✅ Scraping via ScrapingBee successful");
        }
      } catch (err: any) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message || err?.message || "";

        // Check if it's a credits/limit issue
        if (
          status === 401 ||
          message.includes("limit reached") ||
          message.includes("credit")
        ) {
          console.error(`❌ ScrapingBee: Out of credits or limit reached`);
          console.error(`   Message: ${message}`);
          console.warn(
            `⚠️ Falling back to direct fetch (may not work for JS-heavy sites)`
          );
          // Fall through to direct fetch
        } else {
          console.error(
            `❌ ScrapingBee failed${
              status ? ` (status ${status})` : ""
            }: ${message}`
          );
          throw new Error(`ScrapingBee failed: ${message}`);
        }
      }
    }

    // Strategy 2: Try direct fetch if ScrapingBee didn't work
    if (!html) {
      try {
        console.log("🔄 Trying direct fetch...");
        html = await fetchDirect();
        console.log("✅ Direct fetch successful");
      } catch (err) {
        console.error("❌ All scraping methods failed");
        throw new Error(
          "Unable to fetch page content. Please ensure SCRAPINGBEE_API_KEY is configured."
        );
      }
    }

    if (!html || typeof html !== "string" || html.length < 100) {
      throw new Error("Empty or invalid HTML fetched");
    }

    const $ = cheerio.load(html);
    const hostname = new URL(url).hostname.toLowerCase();

    let scrapedData: ScrapedJobData;
    if (hostname.includes("linkedin.com")) {
      scrapedData = scrapeLinkedIn($, url);
    } else if (hostname.includes("indeed.com")) {
      scrapedData = scrapeIndeed($, url);
    } else if (hostname.includes("greenhouse.io")) {
      scrapedData = scrapeGreenhouse($, url);
    } else if (hostname.includes("lever.co")) {
      scrapedData = scrapeLever($, url);
    } else if (hostname.includes("workday.com")) {
      scrapedData = scrapeWorkday($, url);
    } else if (hostname.includes("myworkdayjobs.com")) {
      scrapedData = scrapeWorkday($, url);
    } else if (hostname.includes("ashbyhq.com")) {
      scrapedData = scrapeAshby($, url);
    } else {
      scrapedData = scrapeGenericJobBoard($, url);
    }

    return scrapedData;
  } catch (error) {
    console.error("❌ scrapeJobURL error:", error);
    throw new Error("Failed to scrape job URL");
  }
}

// Puppeteer helper removed - using ScrapingBee for all rendering

/**
 * Scrape LinkedIn job postings
 */
function scrapeLinkedIn($: cheerio.CheerioAPI, url: string): ScrapedJobData {
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
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "LinkedIn",
  };
}

/**
 * Scrape Indeed job postings
 */
function scrapeIndeed($: cheerio.CheerioAPI, url: string): ScrapedJobData {
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
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Indeed",
  };
}

/**
 * Scrape Greenhouse job postings
 */
function scrapeGreenhouse($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  const title = $("#header .app-title, h1.app-title").first().text().trim();
  const company = $(".company-name").first().text().trim();
  const location = $(".location").first().text().trim();

  const description = $("#content, .content").text().trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Greenhouse",
  };
}

/**
 * Scrape Lever job postings
 */
function scrapeLever($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  const title = $(".posting-headline h2, h2").first().text().trim();
  const company = $(".main-header-text-item-company, .company-name")
    .first()
    .text()
    .trim();
  const location = $(".posting-categories .location, .workplaceTypes")
    .first()
    .text()
    .trim();

  const description = $(".section-wrapper, .posting-description").text().trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Lever",
  };
}

/**
 * Scrape Workday job postings
 */
function scrapeWorkday($: cheerio.CheerioAPI, url: string): ScrapedJobData {
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
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
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
  $("h1, h2, h3").each((_: any, elem: any) => {
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
  let employmentType = "";
  let locationType = "";
  let department = "";
  let salary = "";

  // Ashby often has a sidebar with labeled fields
  // Look for patterns like "Location\nSydney Office" or "Department\nCommercial"
  const lines = rawText
    .split("\n")
    .map((l: any) => l.trim())
    .filter((l: any) => l);

  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i];
    const next = lines[i + 1];

    if (current === "Location" && !location) {
      // Handle multiple locations (could be comma-separated on one line or multiple lines)
      // Check if next line contains comma-separated locations
      if (next && next.includes(",")) {
        // All locations on one line: "Mexico, Colombia, Peru, Ecuador"
        location = next;
      } else {
        // Multiple lines for locations
        let locations = [next];

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
      }
    } else if (current === "Employment Type") {
      employmentType = next;
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
        .filter((_: any, el: any) => $(el).text().trim() === "Compensation")
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
      $("*").each((_: any, elem: any) => {
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

  console.log("🔍 Ashby scrape result:", {
    title: title.substring(0, 50),
    company,
    location,
    locationType,
    department,
    salary: salary.substring(0, 50),
    textLength: description.length,
  });

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
  $: cheerio.CheerioAPI,
  url: string
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
    (_: any, elem: any) => {
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
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Generic",
  };
}

/**
 * Extract list items from a section (requirements, responsibilities, benefits)
 */
function extractListItems(
  $: cheerio.CheerioAPI,
  section: string,
  context: string
): string[] {
  const items: string[] = [];

  // Look for section headers and extract list items
  const sectionRegex = new RegExp(section, "i");

  // Find elements that might contain the section
  $("h2, h3, h4, h5, strong, b").each((_: any, elem: any) => {
    const text = $(elem).text().trim();
    if (sectionRegex.test(text)) {
      // Get the next sibling elements (ul, ol, or p tags)
      let next = $(elem).next();
      let count = 0;

      while (next.length && count < 5) {
        if (next.is("ul, ol")) {
          next.find("li").each((_: any, li: any) => {
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
): Promise<any> {
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

    return {
      ...parsed,
      company: scrapedData.company,
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
function extractBasicFields(scrapedData: ScrapedJobData): any {
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
