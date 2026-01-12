import { NextRequest, NextResponse } from "next/server";

/**
 * Intelligent extraction endpoint
 * Analyzes user messages in real-time and extracts structured job information
 */
export async function POST(request: NextRequest) {
  try {
    const { message, currentData } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid message" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        extracted: {},
        hasNewData: false,
      });
    }

    // Use AI to intelligently extract any job-related information from the message
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
            content: `You are an expert at extracting job-related information from conversational text.

Given a user's message, extract ANY relevant job information they mention:
- Job title/role (e.g., "backend engineer", "product manager", "designer")
- Department (Engineering, Product, Design, Marketing, Sales, etc.)
- Location (city, country, "remote", "hybrid", "on-site")
- Work model ("Remote", "Hybrid", "On-site")
- Experience level ("Entry Level", "Mid-Level", "Senior", "Lead", "Principal")
- Skills (programming languages, tools, technologies) - extract as an array
- Salary information (numbers mentioned with $ or salary/compensation keywords)
- Timeline/urgency ("ASAP", "2 weeks", "next month")
- Must-haves/requirements (things they say are "required", "must have", "critical")
- Nice-to-haves/flexible items

Be intelligent about context:
- "We're hiring a senior React developer" → role: "Senior React Developer", criticalSkills: ["React"], level: "Senior"
- "Looking for someone in SF or remote" → location: "San Francisco", workModel: "Remote"
- "Need someone ASAP" → timeline: "ASAP"
- "Budget is 120-150k" → minSalary: "120000", maxSalary: "150000"
- "Must know Python and AWS" → criticalSkills: ["Python", "AWS"], requirements: "Python, AWS"
- "Engineering team needs help" → department: "Engineering"

ONLY extract information that is EXPLICITLY mentioned. Don't infer or guess.
Return null for fields not mentioned.

Current data already captured: ${JSON.stringify(currentData)}

Return ONLY valid JSON:
{
  "roleTitle": "string or null",
  "department": "string or null",
  "location": "string or null",
  "workModel": "Remote/Hybrid/On-site or null",
  "experienceLevel": "Entry Level/Mid-Level/Senior/Lead/Principal or null",
  "criticalSkills": ["array of strings"],
  "minSalary": "string number or null",
  "maxSalary": "string number or null",
  "nonNegotiables": "string or null",
  "flexible": "string or null",
  "timeline": "string or null",
  "confidence": 0.0-1.0
}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const extracted = JSON.parse(data.choices[0].message.content);

    // Filter out null values and check if we got any new data
    const validExtracted: Record<string, unknown> = {};
    let hasNewData = false;

    Object.keys(extracted).forEach((key) => {
      if (
        extracted[key] !== null &&
        extracted[key] !== undefined &&
        key !== "confidence"
      ) {
        // For arrays, check if not empty
        if (Array.isArray(extracted[key]) && extracted[key].length > 0) {
          validExtracted[key] = extracted[key];
          hasNewData = true;
        }
        // For strings, check if not empty
        else if (
          typeof extracted[key] === "string" &&
          extracted[key].trim() !== ""
        ) {
          validExtracted[key] = extracted[key];
          hasNewData = true;
        }
      }
    });

    return NextResponse.json({
      success: true,
      extracted: validExtracted,
      hasNewData,
      confidence: extracted.confidence || 0.7,
    });
  } catch (error) {
    console.error("Error in intelligent extraction:", error);
    return NextResponse.json({
      success: true,
      extracted: {},
      hasNewData: false,
    });
  }
}

