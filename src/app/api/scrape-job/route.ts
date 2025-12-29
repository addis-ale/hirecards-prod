import { NextRequest, NextResponse } from "next/server";
import { scrapeJobURL } from "@/lib/jobScraper";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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
4. Experience Level (Junior, Mid, Senior, Lead, etc.)
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
  "experienceLevel": "Senior",
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

    if (isURL) {
      // If it's a URL, scrape it
      scrapedData = await scrapeJobURL(input.trim());
      inputType = "url";
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

    if (textToAnalyze && textToAnalyze.length > 50) {
      const aiExtractedData = await extractJobDetailsWithAI(
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
    }

    return NextResponse.json({
      success: true,
      data: scrapedData,
      inputType,
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
