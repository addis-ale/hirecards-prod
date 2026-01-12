# Card Generation Documentation

This document explains how each card is generated from scraped job description data.

## Overview

Cards are generated in **4 groups** using OpenAI GPT-4o-mini. Each card is created by:

1. Extracting relevant data from scraped job description
2. Combining with external data sources (when available)
3. Sending structured prompts to OpenAI
4. Parsing JSON responses into card data structures

---

## Generation Flow

```
Job URL/Description
    ↓
Scraping (ScrapingBee)
    ↓
AI Extraction (OpenAI)
    ↓
External Data Sources (Apify, Glassdoor)
    ↓
Card Generation (4 Groups)
    ↓
Return to Frontend
```

---

## GROUP 1: JOB ANALYSIS CARDS (5 Cards)

Generated from **job posting data + similar job descriptions** from Glassdoor, LinkedIn, and Indeed.

### 1. Role Card (`generateRoleCard`)

**Purpose:** Define what the person will do and success criteria

**Input Data:**

- Job title
- Job description
- Company name (filtered to exclude job boards)
- Responsibilities
- Requirements
- Similar jobs array (from Glassdoor, LinkedIn, Indeed) - includes job descriptions for JD improvement

**AI Prompt Structure:**

```
Analyze this job posting and create a comprehensive Role Card with:
- roleSummary: 2-sentence summary of what makes this role unique
- roleMission: What this person owns - be specific about impact
- outcomes: 5 clear success outcomes in first 6-12 months
- whatGreatLooksLike: 6 characteristics of ideal candidate
- whatYoullWorkWith: 3-4 tools/technologies/systems from JD
- whatYouWontDo: 3-4 items this role explicitly is NOT
- redFlags: 3 warning signs in the JD or role
- donts: 3 hiring mistakes to avoid
- fixes: 3 specific improvements
- jdBefore: Generic, poorly written version (what NOT to write)
- jdAfter: Improved, outcome-focused version (what TO write) - uses insights from similar jobs to be more competitive
- fullJdSnippet: Complete, well-written job description ready to use - market-aligned using similar job descriptions
- commonFailureModes: 4 common ways role definitions fail
- brutalTruth: One honest, direct insight
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1500`

**Data Sources:** Manual intake from HM; internal job descriptions; similar job descriptions from Glassdoor/LinkedIn/Indeed for market-aligned JD improvements

---

### 2. Skill Card (`generateSkillCard`)

**Purpose:** Extract technical, product, and behavioral skills

**Input Data:**

- Job title
- Full job description (first 2000 chars)
- Explicitly mentioned skills array
- Similar jobs array (from Glassdoor, LinkedIn, Indeed) - includes job descriptions for additional skill extraction

**AI Prompt Structure:**

```
Extract required skills into categories:
- technicalSkills: 5 skills (includes skills from similar jobs if commonly required)
- productSkills: 4 skills (includes skills from similar jobs if commonly required)
- behaviouralSkills: 4 skills
- mustHaveSkills: 4 skills
- upskillableSkills: 4 skills
- redFlags: 4 red flags
- donts: 4 things to avoid
- brutalTruth: One honest insight about skill requirements

Uses similar job descriptions to identify additional skills, tools, and technologies commonly required for this role type but not explicitly stated in the main job description.
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1000`

**Data Sources:** Manual intake from HM; competency frameworks; reference JDs from similar companies; similar job descriptions from Glassdoor/LinkedIn/Indeed to identify additional skills commonly required but not explicitly stated

---

### 3. Fit Card (`generateFitCard`)

**Purpose:** Understand candidate motivations and what makes them say yes/no

**Input Data:**

- Job title
- Company name
- Employment type (Full-time, Part-time, etc.)
- Workplace type (Remote, Hybrid, On-site)
- Job description (first 300 chars)

**AI Prompt Structure:**

```
Analyze what type of candidate fits this role:
- persona: Brief description of ideal candidate archetype
- motivatedBy: 5-6 things that drive this persona
- avoids: 4-5 turn-offs for this persona
- candidateEvaluation: What candidates assess when evaluating this role
- decisionMakingYes: Why they accept offers
- decisionMakingNo: Why they decline offers
- brutalTruth: Honest insight about candidate decision-making
- redFlags: 3 signals candidate isn't right fit
- donts: 3 mistakes in assessing fit
- fixes: 3 ways to improve fit assessment
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.4`  
**Max Tokens:** `1200`

**Data Sources:** Public persona research; DISC, industry reports, Psychometrics

---

### 4. Message Card (`generateMessageCard`)

**Purpose:** How to pitch the role to get responses

**Input Data:**

- Job title
- Company name
- Role mission (from Role Card)
- Job description snippet

**AI Prompt Structure:**

```
Create compelling messaging for this role:
- corePitch: 2-sentence value proposition that would make a senior candidate respond
- scrollStoppers: 3 attention-grabbing hooks specific to this role
- templates: 2 different message approaches
- brutalTruth: Why messaging fails for this type of role
- donts: 3 messaging mistakes
- fixThisNow: One critical messaging improvement
- hiddenBottleneck: What really stops candidates from responding
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.4`  
**Max Tokens:** `1000`

**Data Sources:** Public hiring research, EVP docs, competitor career pages

---

### 5. Outreach Card (`generateOutreachCard`)

**Purpose:** Ready-to-send email and DM templates

**Input Data:**

- Job title
- Company name
- Core pitch (from Message Card)

**AI Prompt Structure:**

```
Create outreach templates for this role:
- introduction: Context about outreach strategy
- message1: Cold outreach email (150 words max)
- message2: Follow-up message (100 words max)
- message3: Alternative approach for passive candidates
- brutalTruth: Why outreach fails for this role
- redFlags: 3 outreach mistakes
- donts: 3 things to avoid
- fixes: 3 outreach improvements
- hiddenBottleneck: What stops replies
- timelineToFailure1: When bad outreach kills pipeline
- timelineToFailure2: Response rate death spiral
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.5`  
**Max Tokens:** `1500`

**Data Sources:** Public hiring research, EVP docs, competitor career pages

---

## GROUP 2: PEOPLE ANALYSIS CARDS (1 Card)

Generated from **candidate profile data** from LinkedIn.

### 6. Talent Map Card (`generateTalentMapCard`)

**Purpose:** Where candidates come from, companies, locations, backgrounds

**Input Data:**

- LinkedIn candidates array (from Apify)
- Company data from candidates (extracted from profiles)
- Top companies with candidate counts

**AI Prompt Structure:**

```
Analyze where the best candidates come from using REAL DATA:

LINKEDIN DATA (X CANDIDATES):
Top Companies (with candidate counts): [Company1 (5), Company2 (3), ...]
All Unique Companies: [List of all companies]

Return ONLY valid JSON using ACTUAL data:
- primaryFeeders: 6-8 ACTUAL companies from data with most candidates
- secondaryFeeders: 4-6 ACTUAL companies with fewer candidates
- avoidList: 3 companies that might not be good fits
- talentFlowMap: Career progression patterns
- personaInsights: Candidate archetypes with motivations/needs/hates
- brutalTruth: Honest insight about sourcing strategy
- redFlags: 3 sourcing mistakes
- donts: 3 things to avoid
- fixes: 3 sourcing improvements
- hiddenBottleneck: What limits talent pool
- dataSourcesSummary: LinkedIn candidate count
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1500`

**Data Sources:** LinkedIn X-ray, job boards, public org charts, funding databases

**Note:** Uses REAL company names from candidate data - does NOT make up fake data

---

## GROUP 3: COMBINED ANALYSIS CARDS (4 Cards)

Generated from **job + people + similar jobs + external data sources**.

### 7. Market Card (`generateMarketCard`)

**Purpose:** Supply vs demand analysis - how competitive is the market

**Input Data:**

- Job data (title, location)
- Similar jobs array (from LinkedIn/Indeed via Apify)
- Candidates array
- Candidate search results (total count, sample size)
- Market analysis algorithm output

**Process:**

1. Count jobs by platform (LinkedIn, Indeed, Glassdoor)
2. Count candidates by source
3. Run `analyzeMarket()` algorithm to calculate:
   - Estimated total candidates
   - Estimated total jobs
   - Candidates per job ratio
   - Market tightness score
   - Confidence intervals
4. Format analysis results
5. Send to AI with real market data

**AI Prompt Structure:**

```
Analyze the talent market for this role:

Job: [Title]
Location: [Location]
Similar Jobs Found: X (LinkedIn: Y, Indeed: Z)
Sample Candidates: X (LinkedIn: Y, GitHub: Z)
Estimated Total Candidates: X (min-max range)
Estimated Total Jobs: X
Candidates per Job: X.XX
Market Tightness: [Tight/Balanced/Loose] ([summary])
Confidence Level: [High/Medium/Low]
[Detailed analysis]

Return ONLY valid JSON:
- talentAvailability: Total, qualified, employed, openToWork, confidence intervals
- supplyDemand: Open jobs, available candidates, ratios, market tightness
- talentSupply: Mid-level, senior, product-minded availability (High/Medium/Low)
- insights: 3-4 market observations
- redFlags: 3 market challenges
- opportunities: 3 market advantages
- recommendations: Based on market analysis
- extrapolationMethod: How data was calculated
- geographic: Primary locations, remote availability
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1200`

**Data Sources:** LinkedIn X-ray, StackOverflow, public job boards

**Key Algorithm:** `analyzeMarket()` in `marketAnalysis.ts` calculates market metrics

---

### 8. Pay Card (`generatePayCard`)

**Purpose:** Compensation analysis using real market data

**Input Data:**

- Job data (title, location, posted salary)
- Similar jobs with salary data
- Glassdoor salary data (from Apify)

**Process:**

1. Extract salaries from similar jobs
2. Calculate averages from job board data
3. Include Glassdoor median/base salary ranges
4. Send all real data to AI for analysis

**AI Prompt Structure:**

```
Analyze compensation for this role using REAL MARKET DATA:

Job: [Title]
Location: [Location]
Posted Salary: [If available]

REAL MARKET DATA:
Glassdoor Data (X reports):
- Salary Range: $X - $Y
- Median: $Z
- Source: [Source]

Similar Jobs Data: X jobs with salary info
Average Range from Jobs: $X-$Y

Based on this REAL DATA, return ONLY valid JSON:
- marketCompensation: P25, P50, P75, P90 percentiles, Total Comp (Big Tech)
- recommendedRange: Competitive range based on real data
- location: [Location]
- currency: USD
- glassdoorMedian: [Number or null]
- brutalTruth: Honest assessment based on real market data
- redFlags: 3 compensation issues based on data
- donts: 3 compensation mistakes
- fixes: 3 ways to improve offer based on market
- hiddenBottleneck: What really limits hiring on comp
- timelineToFailure: When comp kills offers
- dataSourcesSummary: Glassdoor, job boards counts
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1000`

**Data Sources:** Glassdoor/Indeed scraping, Salary Project (open), job ads

---

### 9. Funnel Card (`generateFunnelCard`)

**Purpose:** Calculate outreach volume needed using real industry benchmarks

**Input Data:**

- Market Card (for market tightness)
- Industry Benchmarks (from `scrapeIndustryBenchmarks`)

**Process:**

1. Get market tightness from Market Card
2. Use real industry benchmarks:
   - Applicants per hire
   - Phone screen pass rate
   - Onsite pass rate
   - Offer accept rate
   - Average time to hire
3. Calculate funnel stages:
   - Outreach = applicantsPerHire × 1.5
   - Replies = outreach × 20%
   - Screens = replies × phoneScreenRate
   - Interviews = screens × onsiteRate
   - Offers = max(2, interviews × 40%)
   - Hires = 1
4. Send pre-calculated funnel + benchmarks to AI

**AI Prompt Structure:**

```
Calculate hiring funnel metrics using REAL BENCHMARK DATA:

Market Tightness: [Tight/Balanced/Loose]
Talent Pool: [Number]

REAL INDUSTRY BENCHMARKS ([Source]):
- Applicants per hire: X
- Phone screen pass rate: X%
- Onsite pass rate: X%
- Offer accept rate: X%
- Average time to hire: X days

QUALITY METRICS:
- Average tenure: X years
- Performance rating: X/5
- Promotion rate: X%

PRE-CALCULATED FUNNEL (based on real benchmarks):
- Outreach: X
- Replies: X
- Screens: X
- Interviews: X
- Offers: X
- Hires: 1

Using this REAL DATA, return ONLY valid JSON:
- funnelStages: All 6 stages with values
- benchmarks: Reply rate, screen pass, onsite pass, offer accept
- timeToHire: X days
- funnelHealthComparison: Weak/Average/Strong funnel outcomes
- brutalTruth: Reality based on real benchmark data
- redFlags: 3 funnel warning signs based on data
- donts: 3 funnel mistakes
- fixes: 3 funnel improvements based on benchmarks
- hiddenBottleneck: What kills conversion based on data
- bottomLine: Key takeaway based on real metrics
- dataSourcesSummary: Benchmark source, applicants per hire, time to hire
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1000`

**Data Sources:** Benchmarks, open reports, agency funnel datasets

---

### 10. Reality Card (`generateRealityCard`)

**Purpose:** Master feasibility score (0-10) and what helps/hurts the hire

**Input Data:**

- All previous cards (Role, Skill, Market, Pay, Funnel)

**AI Prompt Structure:**

```
Calculate a Reality Score (0-10) for this hire and identify what helps/hurts:

Market: [Tight/Balanced/Loose]
Candidates Available: [Number]
Competing Jobs: [Number]
Role Clarity: [Good/Poor]
Comp Competitive: [Analyzed/Unknown]

Return ONLY valid JSON:
- realityScore: 6.5 (0-10 scale)
- marketConditions: 3-4 key market factors
- helpingFactors: 3-4 things working in your favor
- hurtingFactors: 3-4 challenges/obstacles
- brutalTruth: Most honest assessment of feasibility
- redFlags: 3 major risks
- fixes: 3 most impactful improvements

Score 0-10 where:
0-3 = Nearly impossible
4-5 = Very difficult
6-7 = Challenging but doable
8-9 = Reasonable
10 = Easy
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1000`

**Data Sources:** Derived from MarketCard/PayCard + benchmarks; Quality of Hire data

---

## GROUP 4: DERIVED STRATEGY CARDS (3 Cards)

Generated from **other cards** - strategy and execution planning.

### 11. Interview Card (`generateInterviewCard`)

**Purpose:** Design the interview process and assessment questions

**Input Data:**

- Skill Card (must-have skills)
- Role Card (key outcomes)

**AI Prompt Structure:**

```
Design an interview process for this role:

Must-Have Skills: [Skill1, Skill2, ...]
Key Outcomes: [Outcome1, Outcome2, ...]

Return ONLY valid JSON:
- optimalLoop: 4 stages with what to assess at each
- signalQuestions: 4 key questions for top skills
- brutalTruth: What kills interview processes
- redFlags: 3 interview process mistakes
- donts: 3 things to avoid
- fixes: 3 process improvements
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.4`  
**Max Tokens:** `1000`

**Data Sources:** Interview playbooks best practices + industry frameworks

---

### 12. Scorecard Card (`generateScorecardCard`)

**Purpose:** Simple evaluation framework to keep team aligned

**Input Data:**

- Skill Card
- Interview Card

**AI Prompt Structure:**

```
Create an evaluation scorecard for this role:

Must-Have Skills: [From Skill Card]
Interview Stages: [From Interview Card]

Return ONLY valid JSON:
- competencies: 5-6 key competencies to evaluate
- evaluationCriteria: What good looks like for each
- redFlags: 3 evaluation mistakes
- donts: 3 things to avoid
- fixes: 3 scorecard improvements
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1000`

**Data Sources:** Interview guides; external interview frameworks; recruiter inputs

---

### 13. Plan Card (`generatePlanCard`)

**Purpose:** Next steps, checklist, SLAs, and actions to run the hiring process

**Input Data:**

- Role Card
- Skill Card
- Market Card
- Reality Card

**AI Prompt Structure:**

```
Create a hiring plan based on these cards:

Role: [From Role Card]
Market: [From Market Card]
Reality Score: [From Reality Card]

Return ONLY valid JSON:
- nextSteps: 5-6 immediate actions
- checklist: Pre-launch checklist items
- timeline: Realistic timeline based on market
- slas: Service level agreements for each stage
- redFlags: 3 planning mistakes
- donts: 3 things to avoid
- fixes: 3 plan improvements
```

**Model:** `gpt-4o-mini`  
**Temperature:** `0.3`  
**Max Tokens:** `1200`

**Data Sources:** Public Industry frameworks, best practices, recruiter knowledge

---

## Generation Order & Dependencies

```
GROUP 1 (Parallel):
  ├─ Role Card (uses similarJobs for JD improvement)
  ├─ Skill Card (uses similarJobs for skill extraction)
  └─ Fit Card (independent)

GROUP 1 (Sequential):
  ├─ Message Card (depends on Role Card)
  └─ Outreach Card (depends on Message Card)

GROUP 2:
  └─ Talent Map Card (depends on candidates from Apify)

GROUP 3 (Sequential):
  ├─ Market Card (depends on similarJobs + candidates)
  ├─ Pay Card (depends on similarJobs + Glassdoor data)
  ├─ Funnel Card (depends on Market Card + benchmarks)
  └─ Reality Card (depends on Role, Skill, Market, Pay, Funnel)

GROUP 4 (Sequential):
  ├─ Interview Card (depends on Skill Card + Role Card)
  ├─ Scorecard Card (depends on Skill Card + Interview Card)
  └─ Plan Card (depends on Role, Skill, Market, Reality)
```

---

## Technical Details

### API Configuration

- **Model:** OpenAI GPT-4o-mini
- **Response Format:** JSON only
- **Temperature Range:** 0.3-0.5 (lower = more consistent, higher = more creative)
- **Max Tokens:** 1000-1500 per card

### Error Handling

- If OpenAI is not configured, cards return `null`
- If generation fails, error is logged and `null` is returned
- Frontend handles `null` cards gracefully

### Data Flow

1. Job URL/Description → ScrapingBee → Scraped HTML
2. HTML → Cheerio parsing → Structured job data
3. Job data → OpenAI extraction → Enhanced job data
4. Enhanced data + External sources → Card generation → Card JSON
5. Card JSON → Frontend → Rendered card components

### External Data Sources

- **Apify:** LinkedIn jobs, Indeed jobs, LinkedIn candidates
- **Glassdoor:** Salary data via Apify actor + job descriptions (used in Role Card and Skill Card)
- **Similar Jobs:** Job descriptions from Glassdoor, LinkedIn, and Indeed (used to improve JD and extract skills)
- **Industry Benchmarks:** Returns null (no real data available)

---

## Card Data Structure

Each card returns a JSON object with:

- **Content fields:** Specific to card type (see prompts above)
- **Standard fields:** `redFlags`, `donts`, `fixes`, `brutalTruth` (most cards)
- **Data sources:** `dataSources` field indicating where data came from

Cards are saved to `sessionStorage` as `scrapedJobData` for persistence across page navigation.

---

## Notes

- All prompts emphasize using **REAL DATA** - AI is instructed not to make up fake information
- Cards are generated **sequentially within groups** to respect dependencies
- **Temperature is kept low (0.3-0.4)** for consistency and accuracy
- **Max tokens are limited** to keep responses focused and cost-effective
- Cards can be **skipped** if `skipCardGeneration=true` is passed to the API
