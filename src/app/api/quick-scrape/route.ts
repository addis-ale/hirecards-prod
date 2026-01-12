import { NextRequest, NextResponse } from "next/server";
import { scrapeJobURL } from "@/lib/jobScraper";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface ExtractedJobData {
  location?: string;
  locationType?: string;
  salary?: string;
  experienceLevel?: string;
  employmentType?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  department?: string;
}

async function extractJobDetailsWithAI(
  description: string
): Promise<ExtractedJobData> {
  if (!openai) {
    console.warn("OpenAI API key not configured, skipping AI extraction");
    return {};
  }

  try {
    const prompt = `You are a job listing data extraction expert. Extract structured information from the following job description.

Job Description:
${description.substring(0, 8000)}

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
            "You are a job listing data extraction expert. Always return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    
    // Remove markdown code blocks if present
    const jsonContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    const extracted = JSON.parse(jsonContent) as ExtractedJobData;
    return extracted;
  } catch (error) {
    console.error("AI extraction error:", error);
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid URL. Please provide a job URL." },
        { status: 400 }
      );
    }

    // Check if it's a valid URL
    const urlPattern =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if (!urlPattern.test(url.trim())) {
      return NextResponse.json(
        { error: "Invalid URL format." },
        { status: 400 }
      );
    }

    // Scrape using ScrapingBee
    let scrapedData: Record<string, unknown>;
    try {
      scrapedData = await scrapeJobURL(url.trim()) as Record<string, unknown>;
    } catch (scrapeError) {
      const errorMessage = scrapeError instanceof Error ? scrapeError.message : String(scrapeError);
      return NextResponse.json(
        { error: `Scraping failed: ${errorMessage}` },
        { status: 500 }
      );
    }

    // Use AI to extract additional details
    const textToAnalyze =
      (typeof scrapedData.description === 'string' ? scrapedData.description : '') ||
      (typeof scrapedData.descriptionPlainText === 'string' ? scrapedData.descriptionPlainText : '') ||
      (typeof scrapedData.rawText === 'string' ? scrapedData.rawText : '') ||
      "";

    let aiExtractedData: ExtractedJobData = {};
    if (textToAnalyze.length > 100) {
      aiExtractedData = await extractJobDetailsWithAI(textToAnalyze);
    }

    // Extract salary range
    let minSalary: string | null = null;
    let maxSalary: string | null = null;
    const scrapedSalary = typeof scrapedData.salary === 'string' ? scrapedData.salary : null;
    if (scrapedSalary || aiExtractedData.salary) {
      const salaryText = scrapedSalary || aiExtractedData.salary || "";
      const rangeMatch = salaryText.match(/\$?(\d+(?:,\d{3})*(?:K|M)?)\s*[-–—]\s*\$?(\d+(?:,\d{3})*(?:K|M)?)/i);
      if (rangeMatch) {
        minSalary = rangeMatch[1].replace(/[Kk]/g, "000").replace(/[Mm]/g, "000000").replace(/,/g, "");
        maxSalary = rangeMatch[2].replace(/[Kk]/g, "000").replace(/[Mm]/g, "000000").replace(/,/g, "");
      } else {
        const singleMatch = salaryText.match(/\$?(\d+(?:,\d{3})*(?:K|M)?)/i);
        if (singleMatch) {
          const value = singleMatch[1].replace(/[Kk]/g, "000").replace(/[Mm]/g, "000000").replace(/,/g, "");
          minSalary = value;
          maxSalary = value;
        }
      }
    }

    // Extract the 10 required fields
    const extractedFields = {
      roleTitle: (typeof scrapedData.title === 'string' ? scrapedData.title : null),
      department: (typeof scrapedData.department === 'string' ? scrapedData.department : null) || aiExtractedData.department || null,
      experienceLevel: (typeof scrapedData.experienceLevel === 'string' ? scrapedData.experienceLevel : null) || aiExtractedData.experienceLevel || null,
      location: (typeof scrapedData.location === 'string' ? scrapedData.location : null) || aiExtractedData.location || null,
      workModel: (typeof scrapedData.locationType === 'string' ? scrapedData.locationType : null) || aiExtractedData.locationType || null,
      criticalSkills: (Array.isArray(scrapedData.skills) ? scrapedData.skills : null) || aiExtractedData.skills || null,
      minSalary: minSalary,
      maxSalary: maxSalary,
      nonNegotiables: (Array.isArray(scrapedData.requirements) ? scrapedData.requirements.join(", ") : null) || aiExtractedData.requirements?.join(", ") || null,
      flexible: (Array.isArray(scrapedData.benefits) ? scrapedData.benefits.join(", ") : null) || aiExtractedData.benefits?.join(", ") || null,
      timeline: null, // Timeline is rarely in job descriptions
    };

    // Identify missing fields
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
      scrapedData,
      extractedFields,
      missingFields,
      hasMissingFields: missingFields.length > 0,
    });
  } catch (error) {
    console.error("Error in quick-scrape API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to scrape job URL";
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

