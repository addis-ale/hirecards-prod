import OpenAI from "openai";
import type { 
  GlassdoorSalaryData, 
  IndustryBenchmarks,
} from "./dataSources";
import { analyzeMarket, formatMarketAnalysis, type MarketAnalysisInput } from "./marketAnalysis";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Type definitions for job data and cards
interface JobData {
  title?: string;
  description?: string;
  company?: string;
  source?: string;
  location?: string;
  requirements?: string;
  responsibilities?: string;
  skills?: string[];
  employmentType?: string;
  workplaceType?: string;
  salary?: string;
  department?: string;
}

interface SimilarJob {
  title?: string;
  company?: { name?: string };
  platform?: string;
  descriptionText?: string;
  salary?: {
    min?: number;
    max?: number;
    text?: string;
  };
}

interface Candidate {
  currentPositions?: Array<{ companyName?: string; current?: boolean }>;
  currentCompany?: { name?: string; company_name?: string };
  company?: { name?: string } | string;
  experience?: Array<{ companyName?: string; company?: { name?: string } }>;
  platform?: string;
}

interface CardData {
  [key: string]: unknown;
}

/**
 * Extract JSON from OpenAI response, handling markdown code blocks
 * Sometimes OpenAI returns JSON wrapped in ```json ... ``` blocks
 */
function extractJSON(content: string): Record<string, unknown> {
  if (!content) return {};
  
  // Remove markdown code blocks if present
  const jsonContent = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  
  // If content still starts with { or [, it's valid JSON
  if (jsonContent.startsWith("{") || jsonContent.startsWith("[")) {
    try {
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error("❌ Failed to parse JSON after removing markdown:", error);
      console.error("Content:", jsonContent.substring(0, 200));
      return {};
    }
  }
  
  // If no valid JSON found, return empty object
  console.warn("⚠️ No valid JSON found in response");
  return {};
}

/**
 * Ensure company name is the actual hiring company, not the job board/platform
 */
function ensureHiringCompany(company: string | undefined): string {
  if (!company) return "Unknown";
  
  const jobBoardNames = ["LinkedIn", "Indeed", "Workday", "Ashby", "Generic", "ScrapingBee"];
  const isJobBoard = jobBoardNames.some(board => 
    company.toLowerCase().includes(board.toLowerCase()) || 
    company.toLowerCase() === board.toLowerCase()
  );
  
  if (isJobBoard) {
    console.warn(`⚠️ Company name "${company}" appears to be a job board. Using "Unknown" instead.`);
    return "Unknown";
  }
  
  return company;
}

// Data sources mapping for each card type
const CARD_DATA_SOURCES: Record<string, string> = {
  roleCard: "Manual intake from HM; internal job descriptions (if they have it)",
  marketCard: "LinkedIn X-ray, StackOverflow, public job boards",
  payCard: "Glassdoor/Indeed scraping, Salary Project (open), job ads etc...",
  realityCard: "Derived from MarketCard/PayCard + benchmarks; Quality of Hire data",
  funnelCard: "Benchmarks, open reports, agency funnel datasets",
  fitCard: "Public persona research; DISC, industry reports, Psychometrics, Similar to https://www.crystalknows",
  messageCard: "Public hiring research, EVP docs, competitor career pages",
  interviewCard: "Interview playbooks best practices + industry frameworks",
  planCard: "Public Industry frameworks, best practices, recruiter knowledge",
  skillCard: "Manual intake from HM; competency frameworks; reference JDs from similar companies.",
  scoreCard: "Interview guides; external interview frameworks; recruiter inputs.",
  talentMapCard: "LinkedIn X-ray, job boards, public org charts, funding databases.",
};

/**
 * GROUP 1: JOB ANALYSIS CARDS
 * Generated from job posting data only
 */

/**
 * Generate Role Card - What the person will do and success criteria
 */
export async function generateRoleCard(jobData: JobData, similarJobs?: SimilarJob[]): Promise<CardData | null> {
  if (!openai) {
    console.warn("OpenAI not configured, returning mock role card");
    return null;
  }

  try {
    console.log("🤖 Generating Role Card with AI...");

    // Extract job descriptions from similar jobs (especially Glassdoor)
    let similarJobsContext = "";
    if (similarJobs && similarJobs.length > 0) {
      const jobsWithDescriptions = similarJobs
        .filter(job => job.descriptionText && job.descriptionText.length > 100)
        .slice(0, 5); // Use top 5 similar jobs with descriptions
      
      if (jobsWithDescriptions.length > 0) {
        console.log(`📋 Using ${jobsWithDescriptions.length} similar job descriptions to improve JD`);
        similarJobsContext = `\n\nSIMILAR JOBS FOR REFERENCE (use these to improve the JD):
${jobsWithDescriptions.map((job, idx) => `
Job ${idx + 1} (${job.company?.name || 'Company'} - ${job.platform || 'platform'}):
Title: ${job.title}
Description: ${job.descriptionText?.substring(0, 500) || 'No description'}
`).join('\n')}

Use insights from these similar jobs to create a better, more competitive job description.`;
      }
    }

    const prompt = `Analyze this job posting and create a comprehensive Role Card with the following structure.

Job Data:
Title: ${jobData.title || "Not provided"}
Description: ${jobData.description || "Not provided"}
Company: ${ensureHiringCompany(jobData.company, jobData.source) || "Not provided"}
Responsibilities: ${jobData.responsibilities || "Not provided"}
Requirements: ${jobData.requirements || "Not provided"}${similarJobsContext}

Return ONLY valid JSON with this exact structure:
{
  "roleSummary": "2-sentence summary of what makes this role unique (not generic)",
  "roleMission": "What this person owns - be specific about impact",
  "outcomes": ["5 clear success outcomes in first 6-12 months"],
  "whatGreatLooksLike": ["6 characteristics of ideal candidate"],
  "whatYoullWorkWith": ["3-4 items: tools, technologies, systems, or teams mentioned in the JD"],
  "whatYouWontDo": ["3-4 items: what this role explicitly is NOT (e.g., 'Dashboard maintenance', 'Ad-hoc requests')"],
  "redFlags": ["3 warning signs in the JD or role"],
  "donts": ["3 hiring mistakes to avoid for this role"],
  "fixes": ["3 specific improvements to make hire successful"],
  "jdBefore": "A generic, poorly written version of this job description (what NOT to write)",
  "jdAfter": "An improved, outcome-focused version of this job description (what TO write)",
  "fullJdSnippet": "A complete, well-written job description ready to use, formatted as a multi-line string with proper structure",
  "commonFailureModes": ["4 common ways role definitions fail for this type of role"],
  "brutalTruth": "One honest, direct insight about this role"
}

Be specific to THIS job. Avoid generic advice. Focus on what's actually in the description. Extract tools/technologies from the JD for whatYoullWorkWith.

When creating jdBefore, jdAfter, and fullJdSnippet, use insights from the similar jobs above to make the improved JD more competitive and aligned with market standards.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert hiring analyst. Extract structured role data from job postings. Return only valid JSON, no markdown, no explanation."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2500, // Increased for more comprehensive output
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const roleCard = extractJSON(content);
    
    // Generate scoreImpactRows from fixes if not provided
    if (roleCard.fixes && Array.isArray(roleCard.fixes) && roleCard.fixes.length > 0 && !roleCard.scoreImpactRows) {
      const impacts = ["+0.3", "+0.2", "+0.2", "+0.1", "+0.1"];
      const talentImpacts = ["+20% persona relevance", "+18% engagement", "+15% conversion", "+10% accuracy", "+12% signal quality"];
      const riskReductions = ["-15% misalignment", "-10% rejection risk", "-20% restart risk", "-5% interview waste", "-15% bad hires"];
      roleCard.scoreImpactRows = roleCard.fixes.slice(0, 5).map((fix: string, index: number) => ({
        fix: fix,
        impact: impacts[index] || "+0.1",
        tooltip: `Why it matters: ${fix}`,
        talentPoolImpact: talentImpacts[index] || "+10% improvement",
        riskReduction: riskReductions[index] || "-10% risk",
      }));
    }
    
    // Add data sources
    roleCard.dataSources = CARD_DATA_SOURCES.roleCard;
    
    console.log("✅ Role Card generated successfully");
    return roleCard;
  } catch (error) {
    console.error("❌ Error generating Role Card:", error);
    return null;
  }
}

/**
 * Generate Skill Card - Technical, product, and behavioral skills
 */
export async function generateSkillCard(jobData: JobData, similarJobs?: SimilarJob[]): Promise<CardData | null> {
  if (!openai) {
    console.warn("OpenAI not configured, returning mock skill card");
    return null;
  }

  try {
    console.log("🤖 Generating Skill Card with AI...");

    // Extract full description text
    const fullDescription = jobData.description || jobData.requirements || "";
    const descriptionSample = fullDescription.substring(0, 2000); // First 2000 chars

    // Extract skills context from similar jobs
    let similarJobsSkillsContext = "";
    if (similarJobs && similarJobs.length > 0) {
      const jobsWithDescriptions = similarJobs
        .filter(job => job.descriptionText && job.descriptionText.length > 100)
        .slice(0, 5); // Use top 5 similar jobs
      
      if (jobsWithDescriptions.length > 0) {
        console.log(`🔧 Using ${jobsWithDescriptions.length} similar job descriptions for skill extraction`);
        similarJobsSkillsContext = `\n\nSIMILAR JOBS FOR SKILL REFERENCE (extract additional skills from these):
${jobsWithDescriptions.map((job, idx) => `
Job ${idx + 1} (${job.company?.name || 'Company'} - ${job.platform || 'platform'}):
Title: ${job.title}
Description: ${job.descriptionText?.substring(0, 800) || 'No description'}
`).join('\n')}

Use these similar jobs to identify additional skills, tools, and technologies that might be relevant but not explicitly mentioned in the main job description.`;
      }
    }

    const prompt = `Analyze this job posting and extract required skills into categories.

Job Title: ${jobData.title || "Not provided"}

Full Job Description/Requirements:
${descriptionSample}

Explicitly Mentioned Skills: ${JSON.stringify(jobData.skills || [])}${similarJobsSkillsContext}

IMPORTANT: You MUST fill ALL arrays with actual skills from the description above. Do NOT return empty arrays.

Return ONLY valid JSON with this exact structure (each array MUST have the specified number of items):
{
  "technicalSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "productSkills": ["skill1", "skill2", "skill3", "skill4"],
  "behaviouralSkills": ["skill1", "skill2", "skill3", "skill4"],
  "mustHaveSkills": ["skill1", "skill2", "skill3", "skill4"],
  "upskillableSkills": ["skill1", "skill2", "skill3", "skill4"],
  "redFlags": ["red flag 1", "red flag 2", "red flag 3", "red flag 4"],
  "donts": ["dont 1", "dont 2", "dont 3", "dont 4"],
  "brutalTruth": "One honest insight about the skill requirements"
}

Extract from the actual job description above. If not explicitly mentioned, infer from the role requirements.

Use the similar jobs above to identify additional skills, tools, and technologies that are commonly required for this type of role but may not be explicitly stated in the main job description.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a technical recruiter expert. Extract and categorize skills from job postings. Return only valid JSON."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const skillCard = extractJSON(content);
    
    // Generate scoreImpactRows from donts/redFlags if not provided
    if ((skillCard.donts || skillCard.redFlags) && !skillCard.scoreImpactRows) {
      const fixes = skillCard.donts || skillCard.redFlags || [];
      if (fixes.length > 0) {
        const impacts = ["+0.3", "+0.2", "+0.2", "+0.1", "+0.1"];
        const talentImpacts = ["+25% pool expansion", "+15% persona match", "+12% signal quality", "+10% more candidates", "+18% engagement"];
        const riskReductions = ["-15% false negatives", "-10% interview waste", "-15% bad hires", "-5% HM conflict", "-12% dropout"];
        skillCard.scoreImpactRows = fixes.slice(0, 5).map((fix: string, index: number) => ({
          fix: fix,
          impact: impacts[index] || "+0.1",
          tooltip: `Why it matters: ${fix}`,
          talentPoolImpact: talentImpacts[index] || "+10% improvement",
          riskReduction: riskReductions[index] || "-10% risk",
        }));
      }
    }
    
    // Add data sources
    skillCard.dataSources = CARD_DATA_SOURCES.skillCard;
    
    console.log("✅ Skill Card generated successfully");
    return skillCard;
  } catch (error) {
    console.error("❌ Error generating Skill Card:", error);
    return null;
  }
}

/**
 * Generate Message Card - How to pitch the role
 */
export async function generateMessageCard(jobData: JobData, roleCard: CardData): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Message Card with AI...");

    const prompt = `Create compelling messaging for this role.

Job: ${jobData.title}
Company: ${jobData.company}
Role Mission: ${roleCard?.roleMission || jobData.description?.substring(0, 200)}

Return ONLY valid JSON:
{
  "corePitch": "2-sentence value proposition that would make a senior candidate respond",
  "scrollStoppers": ["3 attention-grabbing hooks specific to this role"],
  "templates": ["2 different message approaches"],
  "brutalTruth": "Why messaging fails for this type of role",
  "donts": ["3 messaging mistakes"],
  "fixThisNow": "One critical messaging improvement",
  "hiddenBottleneck": "What really stops candidates from responding"
}

Make it specific to THIS role and company.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a recruitment messaging expert. Create compelling outreach messages. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const messageCard = extractJSON(content);
    
    // Add data sources
    messageCard.dataSources = CARD_DATA_SOURCES.messageCard;
    
    return messageCard;
  } catch (error) {
    console.error("❌ Error generating Message Card:", error);
    return null;
  }
}

/**
 * Generate Outreach Card - Email templates
 */
export async function generateOutreachCard(jobData: JobData, messageCard: CardData): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Outreach Card with AI...");

    const corePitch = messageCard?.corePitch || `${jobData.title} role at ${jobData.company}`;
    
    const prompt = `Create outreach templates for this role.

Job: ${jobData.title}
Company: ${jobData.company}
Core Pitch: ${corePitch}

Return ONLY valid JSON:
{
  "introduction": "Context about outreach strategy",
  "message1": "Cold outreach email (150 words max)",
  "message2": "Follow-up message (100 words max)",
  "message3": "Alternative approach for passive candidates",
  "brutalTruth": "Why outreach fails for this role",
  "redFlags": ["3 outreach mistakes"],
  "donts": ["3 things to avoid"],
  "fixes": ["3 outreach improvements"],
  "hiddenBottleneck": "What stops replies",
  "timelineToFailure1": "When bad outreach kills pipeline",
  "timelineToFailure2": "Response rate death spiral"
}

Templates should be professional but conversational. Mention specific role details.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a recruitment outreach expert. Write effective cold emails. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const outreachCard = extractJSON(content);
    
    // Add data sources (same as messageCard since it's derived from it)
    outreachCard.dataSources = CARD_DATA_SOURCES.messageCard;
    
    return outreachCard;
  } catch (error) {
    console.error("❌ Error generating Outreach Card:", error);
    return null;
  }
}

/**
 * Generate Fit Card - Candidate motivations
 */
export async function generateFitCard(jobData: JobData): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Fit Card with AI...");

    const prompt = `Analyze what type of candidate fits this role and what motivates them.

Job: ${jobData.title}
Company: ${jobData.company}
Type: ${jobData.employmentType} ${jobData.workplaceType || ""}
Description: ${jobData.description?.substring(0, 300)}

Return ONLY valid JSON:
{
  "persona": "Brief description of ideal candidate archetype",
  "motivatedBy": ["5-6 things that drive this persona"],
  "avoids": ["4-5 turn-offs for this persona"],
  "candidateEvaluation": ["What candidates assess when evaluating this role"],
  "decisionMakingYes": ["Why they accept offers"],
  "decisionMakingNo": ["Why they decline offers"],
  "brutalTruth": "Honest insight about candidate decision-making",
  "redFlags": ["3 signals candidate isn't right fit"],
  "donts": ["3 mistakes in assessing fit"],
  "fixes": ["3 ways to improve fit assessment"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a candidate psychology expert. Analyze what motivates different candidate personas. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1200,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const fitCard = extractJSON(content);
    
    // Add data sources
    fitCard.dataSources = CARD_DATA_SOURCES.fitCard;
    
    return fitCard;
  } catch (error) {
    console.error("❌ Error generating Fit Card:", error);
    return null;
  }
}

/**
 * GROUP 2: PEOPLE ANALYSIS CARDS
 * Generated from candidate profile data + GitHub talent
 */

/**
 * Generate Talent Map Card - Where candidates come from
 * Uses LinkedIn candidates data
 */
export async function generateTalentMapCard(
  candidates: Candidate[],
  _githubTalent?: undefined,
  _companyData?: undefined
): Promise<CardData | null> {
  if (!openai || !candidates || candidates.length === 0) return null;

  try {
    console.log("🤖 Generating Talent Map Card with AI...");
    console.log("   📊 LinkedIn candidates:", candidates?.length || 0);

    // Extract company data from LinkedIn candidates - try multiple fields
    const companies = (candidates || [])
      .map(c => {
        // Try multiple possible fields where company name might be stored
        // Priority order based on actual Apify response structure
        return c.currentPositions?.[0]?.companyName ||  // NEW: Apify returns companyName in currentPositions array
               c.currentCompany?.name || 
               c.currentCompany?.company_name ||
               (typeof c.company === 'object' ? c.company?.name : c.company) ||
               c.experience?.[0]?.companyName ||
               c.experience?.[0]?.company?.name ||
               // Also check if currentPositions has multiple entries
               (c.currentPositions && Array.isArray(c.currentPositions) && c.currentPositions.length > 0 
                 ? c.currentPositions.find((pos) => pos.current)?.companyName || c.currentPositions[0]?.companyName
                 : null) ||
               null;
      })
      .filter((name): name is string => Boolean(name))
      .filter((name: string) => {
        // Filter out generic/placeholder names
        const lower = name.toLowerCase().trim();
        return !lower.includes('company') && 
               !lower.match(/^[a-z]$/i) && // Single letters like "A", "B"
               !lower.match(/^[a-z]{1,3}$/i) && // Short codes like "BCD"
               name.length > 2; // Must be at least 3 characters
      });
    
    console.log(`📊 Extracted ${companies.length} company names from ${candidates.length} candidates`);
    console.log(`📊 Sample companies: ${companies.slice(0, 10).join(", ")}`);
    
    if (companies.length === 0) {
      console.warn("⚠️ No valid company names found in candidate data. Checking candidate structure...");
      console.log("📋 Sample candidate structure:", JSON.stringify(candidates[0], null, 2));
      return null;
    }
    
    const companyCount = companies.reduce((acc: Record<string, number>, company) => {
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {});

    const topCompanies = Object.entries(companyCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20) // Increased to 20 to give AI more options
      .map(([company, count]) => `${company} (${count} candidates)`);

    console.log(`📊 Top companies with counts: ${topCompanies.join(", ")}`);

    // Create a strict list of ONLY real company names for the AI
    const realCompanyList = Object.keys(companyCount)
      .sort((a, b) => (companyCount[b] as number) - (companyCount[a] as number))
      .slice(0, 30)
      .map((company, index) => `${index + 1}. ${company} (${companyCount[company]} candidates)`)
      .join("\n");

    const prompt = `You are analyzing talent sourcing data. You MUST use ONLY the real company names provided below.

REAL COMPANY DATA FROM ${candidates?.length || 0} LINKEDIN CANDIDATES:
${realCompanyList}

CRITICAL RULES:
1. You MUST use ONLY company names from the list above
2. Copy the EXACT company names as they appear (case-sensitive)
3. DO NOT create fake company names like "Company A", "BCD", "XYZ Corp", etc.
4. If you need more companies than listed, use the ones with fewer candidates
5. Every company name in your response MUST appear in the list above

Return ONLY valid JSON using EXACT company names from the list:
{
  "primaryFeeders": ["EXACT company names from list above with most candidates (6-8 companies)"],
  "secondaryFeeders": ["EXACT company names from list above with fewer candidates (4-6 companies)"],
  "avoidList": ["EXACT company names from list above that might not be good fits (3 companies)"],
  "talentFlowMap": [
    {
      "flow": "EXACT Company Name → Industry/Stage",
      "path": "Career progression pattern",
      "note": "Why this path matters"
    }
  ],
  "personaInsights": [
    {
      "type": "Candidate archetype",
      "motivated": "What drives them",
      "needs": "What they require",
      "hates": "What they avoid"
    }
  ],
  "brutalTruth": "Honest insight about sourcing strategy based on data",
  "redFlags": ["3 sourcing mistakes"],
  "donts": ["3 things to avoid"],
  "fixes": ["3 sourcing improvements"],
  "hiddenBottleneck": "What limits talent pool",
  "dataSourcesSummary": {
    "linkedin": "${candidates?.length || 0} candidates analyzed"
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a talent sourcing strategist. You MUST use ONLY the exact company names provided in the user's message. Never invent or create fake company names. Return only valid JSON with real company names." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2, // Lower temperature for more deterministic output
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const talentMapCard = extractJSON(content);
    
    // Validate that all company names in the response are from the real list
    const allRealCompanies = Object.keys(companyCount);
    const validateCompanyName = (name: string): string | null => {
      if (!name || typeof name !== 'string') return null;
      // Check if it's an exact match (case-insensitive)
      const matched = allRealCompanies.find(real => 
        real.toLowerCase().trim() === name.toLowerCase().trim()
      );
      return matched || null;
    };
    
    // Clean up primaryFeeders
    if (talentMapCard.primaryFeeders && Array.isArray(talentMapCard.primaryFeeders)) {
      talentMapCard.primaryFeeders = talentMapCard.primaryFeeders
        .map((name: string) => validateCompanyName(name))
        .filter(Boolean)
        .slice(0, 8);
    }
    
    // Clean up secondaryFeeders
    if (talentMapCard.secondaryFeeders && Array.isArray(talentMapCard.secondaryFeeders)) {
      talentMapCard.secondaryFeeders = talentMapCard.secondaryFeeders
        .map((name: string) => validateCompanyName(name))
        .filter(Boolean)
        .slice(0, 6);
    }
    
    // Clean up avoidList
    if (talentMapCard.avoidList && Array.isArray(talentMapCard.avoidList)) {
      talentMapCard.avoidList = talentMapCard.avoidList
        .map((name: string) => validateCompanyName(name))
        .filter(Boolean)
        .slice(0, 3);
    }
    
    // Clean up talentFlowMap
    if (talentMapCard.talentFlowMap && Array.isArray(talentMapCard.talentFlowMap)) {
      talentMapCard.talentFlowMap = talentMapCard.talentFlowMap.map((flow: Record<string, unknown>) => {
        if (flow.flow && typeof flow.flow === 'string') {
          // Extract company name from flow string (format: "Company Name → Industry")
          const companyMatch = flow.flow.split('→')[0]?.trim();
          const validated = validateCompanyName(companyMatch);
          if (validated) {
            flow.flow = flow.flow.replace(companyMatch, validated);
          }
        }
        return flow;
      }).filter((flow: Record<string, unknown>) => {
        // Only keep flows that have a valid company name
        if (flow.flow && typeof flow.flow === 'string') {
          const companyMatch = flow.flow.split('→')[0]?.trim();
          return validateCompanyName(companyMatch) !== null;
        }
        return false;
      });
    }
    
    console.log(`✅ Validated Talent Map Card - Primary Feeders: ${talentMapCard.primaryFeeders?.length || 0}, Secondary: ${talentMapCard.secondaryFeeders?.length || 0}`);
    
    // Add data sources
    talentMapCard.dataSources = CARD_DATA_SOURCES.talentMapCard;
    
    return talentMapCard;
  } catch (error) {
    console.error("❌ Error generating Talent Map Card:", error);
    return null;
  }
}

/**
 * GROUP 3: COMBINED ANALYSIS CARDS
 * Generated from job + people + similar jobs data
 */

/**
 * Generate Market Card - Supply vs demand analysis
 */
export async function generateMarketCard(
  jobData: JobData,
  similarJobs: SimilarJob[],
  candidates: Candidate[],
  candidateSearchResult?: { totalResultCount?: number; sampleSize: number; source?: string },
  multiSourceResult?: { linkedIn: unknown; github: unknown; totalCandidates: number; totalResultCount?: number } | null
): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Market Card with AI...");

    const linkedInJobs = similarJobs.filter(j => j.platform === "linkedin").length;
    const indeedJobs = similarJobs.filter(j => j.platform === "indeed").length;
    const totalJobs = linkedInJobs + indeedJobs;
    const candidateCount = candidates.length;
    
    // Get source breakdown if available
    const linkedInCandidates = (multiSourceResult?.linkedIn && typeof multiSourceResult.linkedIn === 'object' && 'candidates' in multiSourceResult.linkedIn && Array.isArray(multiSourceResult.linkedIn.candidates) ? multiSourceResult.linkedIn.candidates.length : 0) || 
      candidates.filter((c) => c.platform !== "github").length;
    const githubCandidates = (multiSourceResult?.github && typeof multiSourceResult.github === 'object' && 'count' in multiSourceResult.github && typeof multiSourceResult.github.count === 'number' ? multiSourceResult.github.count : 0) || 
      candidates.filter((c) => c.platform === "github").length;

    // Get GitHub market signal
    let githubMarketSignal: { totalProfiles: number; confidence: string } | null = null;
    try {
      const { getGithubMarketSignal } = await import("./githubMarketSignal");
      const jobTitle = jobData.title || jobData.department || "";
      const location = jobData.location || "";
      
      if (jobTitle && location) {
        githubMarketSignal = await getGithubMarketSignal(jobTitle, location);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn("⚠️ Failed to get GitHub market signal:", errorMessage);
      // Continue without GitHub signal
    }

    // Use market analysis algorithm
    const marketInput: MarketAnalysisInput = {
      sampleCandidates: candidateCount,
      sampleJobs: totalJobs,
      totalResultCount: candidateSearchResult?.totalResultCount,
      sampleSize: candidateSearchResult?.sampleSize || 100,
      githubProfileCount: githubMarketSignal?.totalProfiles,
    };

    const marketAnalysis = analyzeMarket(marketInput);
    
    // Only generate Market Card if we have LinkedIn's total result count
    if (!marketAnalysis) {
      console.warn("⚠️ Cannot generate Market Card: LinkedIn total result count not available");
      return null;
    }
    
    const formattedAnalysis = formatMarketAnalysis(marketAnalysis);

    console.log("📊 Market Analysis:", {
      tightness: marketAnalysis.marketTightness,
      estimatedCandidates: marketAnalysis.estimatedTotalCandidates,
      estimatedJobs: marketAnalysis.estimatedTotalJobs,
      confidence: marketAnalysis.confidenceLevel,
      method: marketAnalysis.extrapolationMethod,
      githubSignal: githubMarketSignal?.totalProfiles || "N/A",
    });

    // Build data sources summary
    let dataSourcesSummary = `LinkedIn: ${marketAnalysis.estimatedTotalCandidates.toLocaleString()} candidates`;
    if (githubMarketSignal) {
      dataSourcesSummary += `, GitHub: ${githubMarketSignal.totalProfiles.toLocaleString()} profiles (${githubMarketSignal.confidence} confidence)`;
    }

    const prompt = `Analyze the talent market for this role.

Job: ${jobData.title}
Location: ${jobData.location}
Similar Jobs Found: ${totalJobs} (LinkedIn: ${linkedInJobs}, Indeed: ${indeedJobs})
Sample Candidates: ${candidateCount} (LinkedIn: ${linkedInCandidates}${githubCandidates > 0 ? `, GitHub: ${githubCandidates}` : ""})
${githubMarketSignal ? `GitHub Market Signal: ${githubMarketSignal.totalProfiles.toLocaleString()} profiles (${githubMarketSignal.confidence} confidence)` : ""}
Estimated Total Candidates: ${marketAnalysis.estimatedTotalCandidates.toLocaleString()} (${marketAnalysis.candidateConfidenceInterval.min.toLocaleString()}-${marketAnalysis.candidateConfidenceInterval.max.toLocaleString()})
${githubMarketSignal ? `(Combined LinkedIn + GitHub signal)` : `(LinkedIn total count)`}
Estimated Total Jobs: ${marketAnalysis.estimatedTotalJobs.toLocaleString()}
Candidates per Job: ${marketAnalysis.candidatesPerJob.toFixed(2)}
Market Tightness: ${marketAnalysis.marketTightness} (${formattedAnalysis.summary})
Confidence Level: ${marketAnalysis.confidenceLevel}
Data Sources: ${dataSourcesSummary}
${formattedAnalysis.details}

Return ONLY valid JSON:
{
  "talentAvailability": {
    "total": ${marketAnalysis.estimatedTotalCandidates},
    "qualified": ${Math.round(marketAnalysis.estimatedTotalCandidates * 0.7)},
    "currentlyEmployed": ${Math.round(marketAnalysis.estimatedTotalCandidates * 0.85)},
    "openToWork": ${Math.round(marketAnalysis.estimatedTotalCandidates * 0.15)},
    "confidenceInterval": {
      "min": ${marketAnalysis.candidateConfidenceInterval.min},
      "max": ${marketAnalysis.candidateConfidenceInterval.max}
    },
    "sampleSize": ${candidateCount},
    "confidenceLevel": "${marketAnalysis.confidenceLevel}"
  },
  "supplyDemand": {
    "openJobs": ${marketAnalysis.estimatedTotalJobs},
    "availableCandidates": ${marketAnalysis.estimatedTotalCandidates},
    "candidatesPerJob": ${marketAnalysis.candidatesPerJob.toFixed(2)},
    "jobsPerCandidate": ${marketAnalysis.jobsPerCandidate.toFixed(2)},
    "marketTightness": "${marketAnalysis.marketTightness}",
    "marketTightnessScore": ${marketAnalysis.marketTightnessScore},
    "sampleJobs": ${totalJobs},
    "sampleCandidates": ${candidateCount}
  },
  "talentSupply": {
    "midLevel": "High/Medium/Low based on analysis",
    "senior": "High/Medium/Low based on analysis",
    "productMinded": "High/Medium/Low based on role"
  },
  "insights": ["3-4 market observations based on the analysis"],
  "redFlags": ["3 market challenges based on tightness"],
  "opportunities": ["3 market advantages"],
  "recommendations": ${JSON.stringify(formattedAnalysis.recommendations)},
  "extrapolationMethod": "${marketAnalysis.extrapolationMethod}",
  "hasTotalCount": ${marketAnalysis.hasTotalCount},
  "geographic": {
    "primaryLocations": ["Top 3 locations from candidates"],
    "remoteAvailability": 60
  },
  "primaryLocation": "${jobData.location}"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a talent market analyst. Analyze supply and demand for roles. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const marketCard = extractJSON(content);
    
    // Add market analysis data and data sources
    marketCard.marketAnalysis = {
      estimatedTotalCandidates: marketAnalysis.estimatedTotalCandidates,
      estimatedTotalJobs: marketAnalysis.estimatedTotalJobs,
      candidateConfidenceInterval: marketAnalysis.candidateConfidenceInterval,
      candidatesPerJob: marketAnalysis.candidatesPerJob,
      jobsPerCandidate: marketAnalysis.jobsPerCandidate,
      marketTightness: marketAnalysis.marketTightness,
      marketTightnessScore: marketAnalysis.marketTightnessScore,
      confidenceLevel: marketAnalysis.confidenceLevel,
      extrapolationMethod: marketAnalysis.extrapolationMethod,
      hasTotalCount: marketAnalysis.hasTotalCount,
      formattedSummary: formattedAnalysis.summary,
      formattedDetails: formattedAnalysis.details,
    };
    marketCard.dataSources = CARD_DATA_SOURCES.marketCard;
    
    return marketCard;
  } catch (error) {
    console.error("❌ Error generating Market Card:", error);
    return null;
  }
}

/**
 * Generate Pay Card - Compensation analysis
 * Uses real data from Glassdoor and Indeed
 */
export async function generatePayCard(
  jobData: JobData,
  similarJobs: SimilarJob[],
  glassdoorData?: GlassdoorSalaryData[]
): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Pay Card with AI...");
    console.log("   📊 Glassdoor entries:", glassdoorData?.length || 0);

    // Extract salary data from similar jobs
    const salariesWithData = similarJobs
      .filter(j => j.salary && (j.salary.min || j.salary.max || j.salary.text))
      .map(j => ({
        min: j.salary.min,
        max: j.salary.max,
        text: j.salary.text,
      }));

    const avgMin = salariesWithData.length > 0
      ? Math.round(salariesWithData.reduce((sum, s) => sum + (s.min || 0), 0) / salariesWithData.filter(s => s.min).length)
      : null;
    
    const avgMax = salariesWithData.length > 0
      ? Math.round(salariesWithData.reduce((sum, s) => sum + (s.max || 0), 0) / salariesWithData.filter(s => s.max).length)
      : null;

    // Build comprehensive salary context from all sources
    let glassdoorContext = "";
    if (glassdoorData && glassdoorData.length > 0) {
      const gd = glassdoorData[0];
      glassdoorContext = `
Glassdoor Data (${gd.sampleSize} reports):
- Salary Range: $${gd.baseSalary.min.toLocaleString()} - $${gd.baseSalary.max.toLocaleString()}
- Median: $${gd.baseSalary.median.toLocaleString()}
- Source: ${gd.source}`;
    }

    const prompt = `Analyze compensation for this role using REAL MARKET DATA.

Job: ${jobData.title}
Location: ${jobData.location}
Posted Salary: ${jobData.salary || "Not disclosed"}

REAL MARKET DATA:
${glassdoorContext || "No Glassdoor data available"}

Similar Jobs Data: ${salariesWithData.length} jobs with salary info
Average Range from Jobs: ${avgMin ? `$${avgMin.toLocaleString()}-$${avgMax?.toLocaleString()}` : "Insufficient data"}

Based on this REAL DATA, return ONLY valid JSON:
{
  "marketCompensation": [
    { "label": "Base (P25)", "value": "25th percentile from data" },
    { "label": "Base (P50)", "value": "50th percentile (median)" },
    { "label": "Base (P75)", "value": "75th percentile" },
    { "label": "Base (P90)", "value": "90th percentile for top talent" },
    { "label": "Total Comp (Big Tech)", "value": "Include equity/bonus" }
  ],
  "recommendedRange": "Competitive range based on real data",
  "location": "${jobData.location}",
  "currency": "USD",
  "glassdoorMedian": ${glassdoorData?.[0]?.baseSalary.median || "null"},
  "brutalTruth": "Honest assessment based on real market data",
  "redFlags": ["3 compensation issues based on data"],
  "donts": ["3 compensation mistakes"],
  "fixes": ["3 ways to improve offer based on market"],
  "hiddenBottleneck": "What really limits hiring on comp",
  "timelineToFailure": "When comp kills offers",
  "dataSourcesSummary": {
    "glassdoor": "${glassdoorData?.[0]?.source || 'Not available'}",
    "jobBoards": "${salariesWithData.length} jobs analyzed"
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a compensation analyst. Analyze market rates and competitiveness. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const payCard = extractJSON(content);
    
    // Add data sources
    payCard.dataSources = CARD_DATA_SOURCES.payCard;
    
    return payCard;
  } catch (error) {
    console.error("❌ Error generating Pay Card:", error);
    return null;
  }
}

/**
 * Generate Funnel Card - Outreach volume needed
 * Uses real industry benchmarks data
 */
export async function generateFunnelCard(
  marketCard: CardData,
  benchmarks?: IndustryBenchmarks
): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Funnel Card with AI...");
    console.log("   📊 Using industry benchmarks:", benchmarks?.source || "None");

    const tightness = marketCard?.supplyDemand?.marketTightness || "Balanced";

    // Build real benchmarks context
    let benchmarksContext = "";
    if (benchmarks) {
      const fm = benchmarks.funnelMetrics;
      benchmarksContext = `
REAL INDUSTRY BENCHMARKS (${benchmarks.source}):
- Applicants per hire: ${fm.applicantsPerHire}
- Phone screen pass rate: ${(fm.phoneScreenPassRate * 100).toFixed(0)}%
- Onsite pass rate: ${(fm.onsitePassRate * 100).toFixed(0)}%
- Offer accept rate: ${(fm.offerAcceptRate * 100).toFixed(0)}%
- Average time to hire: ${fm.averageTimeToHire} days

QUALITY METRICS:
- Average tenure: ${benchmarks.qualityMetrics.averageTenure} years
- Performance rating: ${benchmarks.qualityMetrics.performanceRating}/5
- Promotion rate: ${(benchmarks.qualityMetrics.promotionRate * 100).toFixed(0)}%`;
    }

    // Calculate funnel based on real benchmarks only (no fallbacks)
    if (!benchmarks) {
      console.warn("⚠️ No benchmark data available, cannot generate Funnel Card");
      return null;
    }
    
    const applicantsPerHire = benchmarks.funnelMetrics.applicantsPerHire;
    const phoneScreenRate = benchmarks.funnelMetrics.phoneScreenPassRate;
    const onsiteRate = benchmarks.funnelMetrics.onsitePassRate;

    const outreach = Math.round(applicantsPerHire * 1.5);
    const replies = Math.round(outreach * 0.20);
    const screens = Math.round(replies * phoneScreenRate);
    const interviews = Math.round(screens * onsiteRate);
    const offers = Math.max(2, Math.round(interviews * 0.4));
    const hires = 1;

    const prompt = `Calculate hiring funnel metrics using REAL BENCHMARK DATA.

Market Tightness: ${tightness}
Talent Pool: ${marketCard?.talentAvailability?.qualified || "Unknown"}
${benchmarksContext}

PRE-CALCULATED FUNNEL (based on real benchmarks):
- Outreach: ${outreach}
- Replies: ${replies}
- Screens: ${screens}
- Interviews: ${interviews}
- Offers: ${offers}
- Hires: ${hires}

Using this REAL DATA, return ONLY valid JSON:
{
  "funnelStages": [
    { "label": "Outreach", "value": "${outreach}" },
    { "label": "Replies", "value": "${replies}" },
    { "label": "Screens", "value": "${screens}" },
    { "label": "Interviews", "value": "${interviews}" },
    { "label": "Offers", "value": "${offers}" },
    { "label": "Hires", "value": "${hires}" }
  ],
  "benchmarks": [
    { "label": "Reply rate", "value": "20%" },
    { "label": "Screen pass rate", "value": "${(benchmarks.funnelMetrics.phoneScreenPassRate * 100).toFixed(0)}%" },
    { "label": "Onsite pass rate", "value": "${(benchmarks.funnelMetrics.onsitePassRate * 100).toFixed(0)}%" },
    { "label": "Offer accept rate", "value": "${(benchmarks.funnelMetrics.offerAcceptRate * 100).toFixed(0)}%" }
  ],
  "timeToHire": "${benchmarks.funnelMetrics.averageTimeToHire} days",
  "funnelHealthComparison": [
    { "type": "Weak funnel", "outcome": "Result if metrics 30% below benchmark" },
    { "type": "Average funnel", "outcome": "Result matching industry benchmark" },
    { "type": "Strong funnel", "outcome": "Result if metrics 20% above benchmark" }
  ],
  "brutalTruth": "Reality based on real benchmark data",
  "redFlags": ["3 funnel warning signs based on data"],
  "donts": ["3 funnel mistakes"],
  "fixes": ["3 funnel improvements based on benchmarks"],
  "hiddenBottleneck": "What kills conversion based on data",
  "bottomLine": "Key takeaway based on real metrics",
  "dataSourcesSummary": {
    "benchmarkSource": "${benchmarks.source}",
    "applicantsPerHire": ${applicantsPerHire},
    "timeToHire": ${benchmarks.funnelMetrics.averageTimeToHire}
  }
}

Analyze the funnel based on the real benchmarks provided.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a hiring metrics expert. Calculate realistic funnel volumes. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const funnelCard = extractJSON(content);
    
    // Add data sources
    funnelCard.dataSources = CARD_DATA_SOURCES.funnelCard;
    
    return funnelCard;
  } catch (error) {
    console.error("❌ Error generating Funnel Card:", error);
    return null;
  }
}

/**
 * Generate Reality Card - Master score and feasibility
 */
export async function generateRealityCard(allCards: Record<string, CardData>): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Reality Card with AI...");

    const marketTightness = allCards.marketCard?.supplyDemand?.marketTightness || "Unknown";
    const candidateCount = allCards.marketCard?.talentAvailability?.total || 0;
    const jobCount = allCards.marketCard?.supplyDemand?.openJobs || 0;

    const prompt = `Calculate a Reality Score (0-10) for this hire and identify what helps/hurts.

Market: ${marketTightness}
Candidates Available: ${candidateCount}
Competing Jobs: ${jobCount}
Role Clarity: ${allCards.roleCard ? "Good" : "Poor"}
Comp Competitive: ${allCards.payCard ? "Analyzed" : "Unknown"}

Return ONLY valid JSON:
{
  "realityScore": 6.5,
  "marketConditions": ["3-4 key market factors"],
  "helpingFactors": ["3-4 things working in your favor"],
  "hurtingFactors": ["3-4 challenges/obstacles"],
  "brutalTruth": "Most honest assessment of feasibility",
  "redFlags": ["3 major risks"],
  "fixes": ["3 most impactful improvements"]
}

Score 0-10 where:
0-3 = Nearly impossible
4-5 = Very difficult
6-7 = Challenging but doable
8-9 = Reasonable
10 = Easy`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a hiring feasibility expert. Calculate realistic success probability. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const realityCard = extractJSON(content);
    
    // Add data sources
    realityCard.dataSources = CARD_DATA_SOURCES.realityCard;
    
    return realityCard;
  } catch (error) {
    console.error("❌ Error generating Reality Card:", error);
    return null;
  }
}

/**
 * GROUP 4: DERIVED STRATEGY CARDS
 * Generated from other cards
 */

/**
 * Generate Interview Card - Interview process
 */
export async function generateInterviewCard(skillCard: CardData, roleCard: CardData): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Interview Card with AI...");

    const mustHaves = skillCard?.mustHaveSkills || [];
    const outcomes = roleCard?.outcomes || [];

    const prompt = `Design an interview process for this role.

Must-Have Skills: ${mustHaves.join(", ")}
Key Outcomes: ${outcomes.join(", ")}

Return ONLY valid JSON:
{
  "optimalLoop": [
    "Stage 1: What to assess",
    "Stage 2: What to assess",
    "Stage 3: What to assess",
    "Stage 4: What to assess"
  ],
  "signalQuestions": [
    "Key question for skill 1",
    "Key question for skill 2",
    "Key question for skill 3",
    "Key question for skill 4"
  ],
  "brutalTruth": "What kills interview processes",
  "redFlags": ["3 interview process mistakes"],
  "donts": ["3 things to avoid"],
  "fixes": ["3 process improvements"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an interview design expert. Create effective interview processes. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const interviewCard = extractJSON(content);
    
    // Add data sources
    interviewCard.dataSources = CARD_DATA_SOURCES.interviewCard;
    
    return interviewCard;
  } catch (error) {
    console.error("❌ Error generating Interview Card:", error);
    return null;
  }
}

/**
 * Generate Scorecard Card - Evaluation framework
 */
export async function generateScorecardCard(skillCard: CardData, _interviewCard: CardData): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Scorecard Card with AI...");

    const skills = [
      ...(skillCard?.technicalSkills || []),
      ...(skillCard?.productSkills || []),
      ...(skillCard?.behaviouralSkills || [])
    ].slice(0, 8);

    const prompt = `Create an evaluation scorecard.

Key Competencies: ${skills.join(", ")}

Return ONLY valid JSON:
{
  "competencies": ["6-8 key abilities to assess"],
  "rating1": "Strong Yes - definition",
  "rating2": "Yes - definition",
  "rating3": "No - definition",
  "rating4": "Strong No - definition",
  "evaluationMapping": [
    { "stage": "Screen", "competencies": "What to assess" },
    { "stage": "Technical", "competencies": "What to assess" },
    { "stage": "Final", "competencies": "What to assess" }
  ],
  "brutalTruth": "Why scorecards fail",
  "donts": ["3 scoring mistakes"],
  "fixes": ["3 improvements"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an assessment design expert. Create fair evaluation frameworks. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const scoreCard = extractJSON(content);
    
    // Add data sources
    scoreCard.dataSources = CARD_DATA_SOURCES.scoreCard;
    
    return scoreCard;
  } catch (error) {
    console.error("❌ Error generating Scorecard Card:", error);
    return null;
  }
}

/**
 * Generate Plan Card - Action plan
 */
export async function generatePlanCard(allCards: Record<string, CardData>): Promise<CardData | null> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Plan Card with AI...");

    const prompt = `Create an action plan for this hire.

Market Tightness: ${allCards.marketCard?.supplyDemand?.marketTightness || "Unknown"}
Reality Score: ${allCards.realityCard?.realityScore || "Unknown"}

Return ONLY valid JSON:
{
  "first7Days": [
    "Day 1-2: Action",
    "Day 3-4: Action",
    "Day 5-7: Action"
  ],
  "weeklyRhythm": [
    "Weekly activity 1",
    "Weekly activity 2",
    "Weekly activity 3",
    "Weekly activity 4"
  ],
  "fastestPath": [
    "Critical path item 1",
    "Critical path item 2",
    "Critical path item 3"
  ],
  "brutalTruth": "What derails hiring plans",
  "redFlags": ["3 planning mistakes"],
  "donts": ["3 things to avoid"],
  "fixes": ["3 plan improvements"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a hiring operations expert. Create actionable hiring plans. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const planCard = extractJSON(content);
    
    // Add data sources
    planCard.dataSources = CARD_DATA_SOURCES.planCard;
    
    return planCard;
  } catch (error) {
    console.error("❌ Error generating Plan Card:", error);
    return null;
  }
}
