import OpenAI from "openai";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

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

    const prompt = `Analyze this job posting and create a Role Card with the following structure.

Job Data:
Title: ${jobData.title || "Not provided"}
Description: ${jobData.description || "Not provided"}
Company: ${jobData.company || "Not provided"}
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
    return JSON.parse(content);
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
    return JSON.parse(content);
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
    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Error generating Fit Card:", error);
    return null;
  }
}

/**
 * GROUP 2: PEOPLE ANALYSIS CARDS
 * Generated from candidate profile data
 */

/**
 * Generate Talent Map Card - Where candidates come from
 */
export async function generateTalentMapCard(candidates: any[]): Promise<any> {
  if (!openai || !candidates || candidates.length === 0) return null;

  try {
    console.log("🤖 Generating Talent Map Card with AI...");

    // Extract company data from candidates
    const companies = candidates
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

    const prompt = `Analyze where the best candidates for this role come from.

REAL DATA FROM ${candidates.length} CANDIDATES:
Top Companies (with candidate counts): ${topCompanies.join(", ")}

All Unique Companies: ${uniqueCompanies.slice(0, 30).join(", ")}

IMPORTANT: Use ONLY the REAL company names listed above. Do NOT make up "Company A", "Company B", etc.

Return ONLY valid JSON using ACTUAL company names from the data:
{
  "primaryFeeders": ["List 6-8 ACTUAL companies from the data above with most candidates"],
  "secondaryFeeders": ["List 4-6 ACTUAL companies from the data above with fewer candidates"],
  "avoidList": ["List 3 companies that might not be good fits - use real names or write 'Unknown startups', etc."],
  "talentFlowMap": [
    {
      "flow": "Company A → Industry/Stage",
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
  "brutalTruth": "Honest insight about sourcing strategy",
  "redFlags": ["3 sourcing mistakes"],
  "donts": ["3 things to avoid"],
  "fixes": ["3 sourcing improvements"],
  "hiddenBottleneck": "What limits talent pool"
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
    return JSON.parse(content);
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
  candidates: any[]
): Promise<any> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Market Card with AI...");

    const linkedInJobs = similarJobs.filter(j => j.platform === "linkedin").length;
    const indeedJobs = similarJobs.filter(j => j.platform === "indeed").length;
    const totalJobs = linkedInJobs + indeedJobs;
    const candidateCount = candidates.length;

    const ratio = candidateCount > 0 ? (totalJobs / candidateCount).toFixed(1) : "N/A";
    const tightness = candidateCount < totalJobs * 0.3 ? "Very tight" : 
                      candidateCount < totalJobs * 0.7 ? "Tight" :
                      candidateCount < totalJobs * 1.2 ? "Balanced" : "Loose";

    const prompt = `Analyze the talent market for this role.

Job: ${jobData.title}
Location: ${jobData.location}
Similar Jobs Found: ${totalJobs} (LinkedIn: ${linkedInJobs}, Indeed: ${indeedJobs})
Available Candidates: ${candidateCount}
Supply/Demand Ratio: ${ratio} jobs per candidate
Market Tightness: ${tightness}

Return ONLY valid JSON:
{
  "talentAvailability": {
    "total": ${candidateCount},
    "qualified": ${Math.round(candidateCount * 0.7)},
    "currentlyEmployed": ${Math.round(candidateCount * 0.85)},
    "openToWork": ${Math.round(candidateCount * 0.15)}
  },
  "supplyDemand": {
    "openJobs": ${totalJobs},
    "availableCandidates": ${candidateCount},
    "ratio": "${ratio}:1",
    "marketTightness": "${tightness}"
  },
  "talentSupply": {
    "midLevel": "High/Medium/Low based on analysis",
    "senior": "High/Medium/Low based on analysis",
    "productMinded": "High/Medium/Low based on role"
  },
  "insights": ["3-4 market observations"],
  "redFlags": ["3 market challenges"],
  "opportunities": ["3 market advantages"],
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
    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Error generating Market Card:", error);
    return null;
  }
}

/**
 * Generate Pay Card - Compensation analysis
 */
export async function generatePayCard(
  jobData: any,
  similarJobs: any[]
): Promise<any> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Pay Card with AI...");

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

    const prompt = `Analyze compensation for this role.

Job: ${jobData.title}
Location: ${jobData.location}
Your Salary: ${jobData.salary || "Not disclosed"}
Market Data: ${salariesWithData.length} jobs with salary info
Average Range: ${avgMin ? `$${avgMin}k-$${avgMax}k` : "Insufficient data"}

Return ONLY valid JSON:
{
  "marketCompensation": [
    { "label": "Base (P50)", "value": "Market 50th percentile" },
    { "label": "Base (P75)", "value": "Market 75th percentile" },
    { "label": "Total comp", "value": "With equity/bonus" }
  ],
  "recommendedRange": "Suggested competitive range",
  "location": "${jobData.location}",
  "currency": "USD or EUR or GBP",
  "brutalTruth": "Honest assessment of compensation competitiveness",
  "redFlags": ["3 compensation issues"],
  "donts": ["3 compensation mistakes"],
  "fixes": ["3 ways to improve offer"],
  "hiddenBottleneck": "What really limits hiring on comp",
  "timelineToFailure": "When comp kills offers"
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
    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Error generating Pay Card:", error);
    return null;
  }
}

/**
 * Generate Funnel Card - Outreach volume needed
 */
export async function generateFunnelCard(marketCard: any): Promise<any> {
  if (!openai) return null;

  try {
    console.log("🤖 Generating Funnel Card with AI...");

    const tightness = marketCard?.supplyDemand?.marketTightness || "Balanced";

    const prompt = `Calculate hiring funnel metrics.

Market Tightness: ${tightness}
Talent Pool: ${marketCard?.talentAvailability?.qualified || "Unknown"}

Return ONLY valid JSON:
{
  "funnelStages": [
    { "label": "Outreach", "value": "150" },
    { "label": "Replies", "value": "30" },
    { "label": "Screens", "value": "15" },
    { "label": "Interviews", "value": "5" },
    { "label": "Offers", "value": "2" },
    { "label": "Hires", "value": "1" }
  ],
  "benchmarks": [
    { "label": "Reply rate", "value": "20%" },
    { "label": "Screen rate", "value": "50%" },
    { "label": "Offer rate", "value": "33%" },
    { "label": "Accept rate", "value": "50%" }
  ],
  "funnelHealthComparison": [
    { "type": "Weak funnel", "outcome": "Result if metrics poor" },
    { "type": "Average funnel", "outcome": "Result if metrics okay" },
    { "type": "Strong funnel", "outcome": "Result if metrics good" }
  ],
  "brutalTruth": "Reality about hiring volume",
  "redFlags": ["3 funnel warning signs"],
  "donts": ["3 funnel mistakes"],
  "fixes": ["3 funnel improvements"],
  "hiddenBottleneck": "What kills conversion",
  "bottomLine": "Key takeaway about volume"
}

Adjust numbers based on market tightness.`;

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
    return JSON.parse(content);
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
    return JSON.parse(content);
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
    return JSON.parse(content);
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
    return JSON.parse(content);
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
    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Error generating Plan Card:", error);
    return null;
  }
}
