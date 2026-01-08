import OpenAI from "openai";
import type { 
  GlassdoorSalaryData, 
  LevelsFyiSalaryData, 
  CrunchbaseCompanyData,
  GitHubTalentData,
  IndustryBenchmarks,
  AggregatedDataSources 
} from "./dataSources";
import { analyzeMarket, formatMarketAnalysis, type MarketAnalysisInput } from "./marketAnalysis";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Ensure company name is the actual hiring company, not the job board/platform
 */
function ensureHiringCompany(company: string | undefined, source: string | undefined): string {
  if (!company) return "Unknown";
  
  const jobBoardNames = ["LinkedIn", "Indeed", "Greenhouse", "Lever", "Workday", "Ashby", "Generic", "ScrapingBee"];
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
  marketCard: "LinkedIn X-ray, Github, StackOverflow, public job boards, Crunchbase",
  payCard: "Glassdoor/Indeed scraping, Levels.fyi, Salary Project (open), job ads etc...",
  realityCard: "Derived from MarketCard/PayCard + benchmarks; Quality of Hire data",
  funnelCard: "Benchmarks, open reports, agency funnel datasets",
  fitCard: "Public persona research; DISC, industry reports, Psychometrics, Similar to https://www.crystalknows",
  messageCard: "Public hiring research, EVP docs, competitor career pages",
  interviewCard: "Interview playbooks best practices + industry frameworks",
  planCard: "Public Industry frameworks, best practices, recruiter knowledge",
  skillCard: "Manual intake from HM; competency frameworks; reference JDs from similar companies.",
  scoreCard: "Interview guides; external interview frameworks; recruiter inputs.",
  talentMapCard: "LinkedIn X-ray, job boards, Crunchbase, public org charts, funding databases.",
};

/**
 * GROUP 1: JOB ANALYSIS CARDS
 * Generated from job posting data only
 */

/**
 * Generate Role Card - What the person will do and success criteria
 */
export async function generateRoleCard(jobData: any): Promise<any> {
  if (!openai) {
    console.warn("OpenAI not configured, returning mock role card");
    return null;
  }

  try {
    console.log("🤖 Generating Role Card with AI...");
    
    // Ensure we use the actual hiring company, not the job board
    const company = ensureHiringCompany(jobData.company, jobData.source);

    const prompt = `Analyze this job posting and create a Role Card with the following structure.

Job Data:
Title: ${jobData.title || "Not provided"}
Description: ${jobData.description || "Not provided"}
Company: ${ensureHiringCompany(jobData.company, jobData.source) || "Not provided"}
Responsibilities: ${jobData.responsibilities || "Not provided"}

Return ONLY valid JSON with this exact structure:
{
  "roleSummary": "2-sentence summary of what makes this role unique (not generic)",
  "roleMission": "What this person owns - be specific about impact",
  "outcomes": ["5 clear success outcomes in first 6-12 months"],
  "whatGreatLooksLike": ["6 characteristics of ideal candidate"],
  "redFlags": ["3 warning signs in the JD or role"],
  "donts": ["3 hiring mistakes to avoid for this role"],
  "fixes": ["3 specific improvements to make hire successful"],
  "brutalTruth": "One honest, direct insight about this role"
}

Be specific to THIS job. Avoid generic advice. Focus on what's actually in the description.`;

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
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const roleCard = JSON.parse(content);
    
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
export async function generateSkillCard(jobData: any): Promise<any> {
  if (!openai) {
    console.warn("OpenAI not configured, returning mock skill card");
    return null;
  }

  try {
    console.log("🤖 Generating Skill Card with AI...");

    // Extract full description text
    const fullDescription = jobData.description || jobData.requirements || "";
    const descriptionSample = fullDescription.substring(0, 2000); // First 2000 chars

    const prompt = `Analyze this job posting and extract required skills into categories.

Job Title: ${jobData.title || "Not provided"}

Full Job Description/Requirements:
${descriptionSample}

Explicitly Mentioned Skills: ${JSON.stringify(jobData.skills || [])}

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

Extract from the actual job description above. If not explicitly mentioned, infer from the role requirements.`;

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
    const skillCard = JSON.parse(content);
    
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
export async function generateMessageCard(jobData: any, roleCard: any): Promise<any> {
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
    const messageCard = JSON.parse(content);
    
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
export async function generateOutreachCard(jobData: any, messageCard: any): Promise<any> {
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
    const outreachCard = JSON.parse(content);
    
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
export async function generateFitCard(jobData: any): Promise<any> {
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
    const fitCard = JSON.parse(content);
    
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
 * Uses LinkedIn candidates + GitHub talent data
 */
export async function generateTalentMapCard(
  candidates: any[],
  githubTalent?: GitHubTalentData[],
  companyData?: CrunchbaseCompanyData | null
): Promise<any> {
  if (!openai || (!candidates || candidates.length === 0) && (!githubTalent || githubTalent.length === 0)) return null;

  try {
    console.log("🤖 Generating Talent Map Card with AI...");
    console.log("   📊 LinkedIn candidates:", candidates?.length || 0);
    console.log("   📊 GitHub talent:", githubTalent?.length || 0);

    // Extract company data from LinkedIn candidates
    const companies = (candidates || [])
      .map(c => c.currentCompany?.name || c.company)
      .filter(Boolean);
    
    const uniqueCompanies = [...new Set(companies)];
    const companyCount = companies.reduce((acc: any, company) => {
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {});

    const topCompanies = Object.entries(companyCount)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 15)
      .map(([company, count]) => `${company} (${count} candidates)`);

    console.log(`📊 Candidate company analysis: ${topCompanies.join(", ")}`);

    // Build GitHub talent context
    let githubContext = "";
    if (githubTalent && githubTalent.length > 0) {
      const topGithubDevs = githubTalent.slice(0, 5).map(g => 
        `- ${g.name} (@${g.username}): ${g.followers} followers, ${g.publicRepos} repos, ${g.company || 'Independent'}`
      ).join("\n");
      githubContext = `
GITHUB TALENT DATA (${githubTalent.length} developers):
${topGithubDevs}`;
    }

    // Build Crunchbase context
    let companyContext = "";
    if (companyData) {
      companyContext = `
TARGET COMPANY DATA (Crunchbase):
- Company: ${companyData.name}
- Employees: ${companyData.employeeCount}
- Funding: $${(companyData.funding.totalRaised / 1000000).toFixed(1)}M raised
- Industry: ${companyData.industry.join(", ")}
- Competitors: ${companyData.competitors.join(", ")}`;
    }

    const prompt = `Analyze where the best candidates for this role come from using REAL DATA.

LINKEDIN DATA (${candidates?.length || 0} CANDIDATES):
Top Companies (with candidate counts): ${topCompanies.join(", ")}
All Unique Companies: ${uniqueCompanies.slice(0, 30).join(", ")}
${githubContext}
${companyContext}

IMPORTANT: Use ONLY the REAL company names and data listed above. Do NOT make up fake data.

Return ONLY valid JSON using ACTUAL data:
{
  "primaryFeeders": ["List 6-8 ACTUAL companies from the data above with most candidates"],
  "secondaryFeeders": ["List 4-6 ACTUAL companies from the data above with fewer candidates"],
  "githubTalent": ${githubTalent && githubTalent.length > 0 ? JSON.stringify(githubTalent.slice(0, 5).map(g => ({
    name: g.name,
    username: g.username,
    followers: g.followers,
    company: g.company || "Independent",
    profileUrl: g.profileUrl
  }))) : "[]"},
  "avoidList": ["List 3 companies that might not be good fits"],
  "talentFlowMap": [
    {
      "flow": "Real Company → Industry/Stage",
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
    "linkedin": "${candidates?.length || 0} candidates analyzed",
    "github": "${githubTalent?.length || 0} developers found",
    "crunchbase": "${companyData ? 'Company data available' : 'Not available'}"
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a talent sourcing strategist. Analyze where to find the best candidates. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const talentMapCard = JSON.parse(content);
    
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
  jobData: any,
  similarJobs: any[],
  candidates: any[],
  candidateSearchResult?: { totalResultCount?: number; sampleSize: number; source?: string },
  multiSourceResult?: { linkedIn: any; github: any; totalCandidates: number; totalResultCount?: number } | null
): Promise<any> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Market Card with AI...");

    const linkedInJobs = similarJobs.filter(j => j.platform === "linkedin").length;
    const indeedJobs = similarJobs.filter(j => j.platform === "indeed").length;
    const totalJobs = linkedInJobs + indeedJobs;
    const candidateCount = candidates.length;
    
    // Get source breakdown if available
    const linkedInCandidates = multiSourceResult?.linkedIn?.candidates?.length || 
      candidates.filter((c: any) => c.platform !== "github").length;
    const githubCandidates = multiSourceResult?.github?.count || 
      candidates.filter((c: any) => c.platform === "github").length;

    // Use market analysis algorithm
    const marketInput: MarketAnalysisInput = {
      sampleCandidates: candidateCount,
      sampleJobs: totalJobs,
      totalResultCount: candidateSearchResult?.totalResultCount,
      sampleSize: candidateSearchResult?.sampleSize || 100,
    };

    const marketAnalysis = analyzeMarket(marketInput);
    const formattedAnalysis = formatMarketAnalysis(marketAnalysis);

    console.log("📊 Market Analysis:", {
      tightness: marketAnalysis.marketTightness,
      estimatedCandidates: marketAnalysis.estimatedTotalCandidates,
      estimatedJobs: marketAnalysis.estimatedTotalJobs,
      confidence: marketAnalysis.confidenceLevel,
      method: marketAnalysis.extrapolationMethod,
    });

    const prompt = `Analyze the talent market for this role.

Job: ${jobData.title}
Location: ${jobData.location}
Similar Jobs Found: ${totalJobs} (LinkedIn: ${linkedInJobs}, Indeed: ${indeedJobs})
Sample Candidates: ${candidateCount} (LinkedIn: ${linkedInCandidates}, GitHub: ${githubCandidates})
Estimated Total Candidates: ${marketAnalysis.estimatedTotalCandidates.toLocaleString()} (${marketAnalysis.candidateConfidenceInterval.min.toLocaleString()}-${marketAnalysis.candidateConfidenceInterval.max.toLocaleString()})
Estimated Total Jobs: ${marketAnalysis.estimatedTotalJobs.toLocaleString()}
Candidates per Job: ${marketAnalysis.candidatesPerJob.toFixed(2)}
Market Tightness: ${marketAnalysis.marketTightness} (${formattedAnalysis.summary})
Confidence Level: ${marketAnalysis.confidenceLevel}
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
    const marketCard = JSON.parse(content);
    
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
 * Uses real data from Glassdoor, Levels.fyi, and Indeed
 */
export async function generatePayCard(
  jobData: any,
  similarJobs: any[],
  glassdoorData?: GlassdoorSalaryData[],
  levelsFyiData?: LevelsFyiSalaryData[]
): Promise<any> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Pay Card with AI...");
    console.log("   📊 Glassdoor entries:", glassdoorData?.length || 0);
    console.log("   📊 Levels.fyi entries:", levelsFyiData?.length || 0);

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

    let levelsFyiContext = "";
    if (levelsFyiData && levelsFyiData.length > 0) {
      const topCompanies = levelsFyiData.slice(0, 3).map(l => 
        `${l.company}: $${l.totalCompensation.toLocaleString()} total comp (base: $${l.baseSalary.toLocaleString()}, stock: $${l.stockGrant.toLocaleString()})`
      ).join("\n");
      levelsFyiContext = `
Levels.fyi Data (Tech Companies):
${topCompanies}`;
    }

    const prompt = `Analyze compensation for this role using REAL MARKET DATA.

Job: ${jobData.title}
Location: ${jobData.location}
Posted Salary: ${jobData.salary || "Not disclosed"}

REAL MARKET DATA:
${glassdoorContext || "No Glassdoor data available"}
${levelsFyiContext || "No Levels.fyi data available"}

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
  "levelsFyiAverage": ${levelsFyiData?.length ? Math.round(levelsFyiData.reduce((sum, l) => sum + l.totalCompensation, 0) / levelsFyiData.length) : "null"},
  "brutalTruth": "Honest assessment based on real market data",
  "redFlags": ["3 compensation issues based on data"],
  "donts": ["3 compensation mistakes"],
  "fixes": ["3 ways to improve offer based on market"],
  "hiddenBottleneck": "What really limits hiring on comp",
  "timelineToFailure": "When comp kills offers",
  "dataSourcesSummary": {
    "glassdoor": "${glassdoorData?.[0]?.source || 'Not available'}",
    "levelsFyi": "${levelsFyiData?.[0]?.source || 'Not available'}",
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
    const payCard = JSON.parse(content);
    
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
  marketCard: any,
  benchmarks?: IndustryBenchmarks
): Promise<any> {
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

    // Calculate funnel based on real benchmarks
    const applicantsPerHire = benchmarks?.funnelMetrics.applicantsPerHire || 150;
    const phoneScreenRate = benchmarks?.funnelMetrics.phoneScreenPassRate || 0.25;
    const onsiteRate = benchmarks?.funnelMetrics.onsitePassRate || 0.40;
    const offerAcceptRate = benchmarks?.funnelMetrics.offerAcceptRate || 0.85;

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
    { "label": "Screen pass rate", "value": "${benchmarks ? (benchmarks.funnelMetrics.phoneScreenPassRate * 100).toFixed(0) : 25}%" },
    { "label": "Onsite pass rate", "value": "${benchmarks ? (benchmarks.funnelMetrics.onsitePassRate * 100).toFixed(0) : 40}%" },
    { "label": "Offer accept rate", "value": "${benchmarks ? (benchmarks.funnelMetrics.offerAcceptRate * 100).toFixed(0) : 85}%" }
  ],
  "timeToHire": "${benchmarks?.funnelMetrics.averageTimeToHire || 45} days",
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
    "benchmarkSource": "${benchmarks?.source || 'Industry average'}",
    "applicantsPerHire": ${applicantsPerHire},
    "timeToHire": ${benchmarks?.funnelMetrics.averageTimeToHire || 45}
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
    const funnelCard = JSON.parse(content);
    
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
export async function generateRealityCard(allCards: any): Promise<any> {
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
    const realityCard = JSON.parse(content);
    
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
export async function generateInterviewCard(skillCard: any, roleCard: any): Promise<any> {
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
    const interviewCard = JSON.parse(content);
    
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
export async function generateScorecardCard(skillCard: any, interviewCard: any): Promise<any> {
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
    const scoreCard = JSON.parse(content);
    
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
export async function generatePlanCard(allCards: any): Promise<any> {
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
    const planCard = JSON.parse(content);
    
    // Add data sources
    planCard.dataSources = CARD_DATA_SOURCES.planCard;
    
    return planCard;
  } catch (error) {
    console.error("❌ Error generating Plan Card:", error);
    return null;
  }
}
