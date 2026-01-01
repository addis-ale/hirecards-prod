# 13 HireCards Data Structures - Complete Analysis

This document contains the exact data structures for all 13 cards that need to be populated with AI analysis from scraped job/candidate data.

---

## 1. REALITY CARD
**Purpose:** Feasibility score, market conditions, what helps or hurts your case

```typescript
interface RealityCardData {
  // Core metrics - needs calculation
  realityScore: number; // 0-10 score
  
  // Analysis fields
  marketConditions?: string[];
  helpingFactors?: string[];
  hurtingFactors?: string[];
  brutalTruth?: string;
  
  // Improvement suggestions
  redFlags?: string[];
  fixes?: string[];
}
```

**Data Sources:**
- Job posting analysis (requirements, location, salary)
- Market data (similar jobs on LinkedIn/Indeed)
- Candidate availability (from LinkedIn People Search)

---

## 2. ROLE CARD
**Purpose:** What this person will actually do and what success looks like

```typescript
interface RoleCardData {
  roleSummary: string; // Core role description
  roleMission: string; // What they own
  outcomes: string[]; // Success metrics (5 items)
  whatGreatLooksLike: string[]; // 6 characteristics
  redFlags: string[]; // 3 warning signs
  donts: string[]; // 3 things to avoid
  fixes: string[]; // 3 improvements
  brutalTruth: string; // Honest assessment
}
```

**Static Example:**
```typescript
{
  roleSummary: "Analytics engineering at Mollie is not BI maintenance — it is product-building.",
  outcomes: [
    "Deliver reliable, well-tested dbt models",
    "Replace fragile legacy pipelines",
    "Define meaningful metrics with Product",
    "Improve modelling consistency across teams",
    "Raise modelling standards across the org"
  ],
  whatGreatLooksLike: [
    "Thinks in systems, not dashboards",
    "Writes clean, maintainable, tested models",
    "Communicates modelling choices clearly",
    "Works tightly with PM & Engineering",
    "Handles ambiguity through structure",
    "Defines modelling patterns others adopt"
  ],
  redFlags: ["Generic job description", "Buzzwords over outcomes", "No clear ownership"],
  donts: ["Copy competitor JDs", "Hide data complexity", "List 20+ responsibilities"],
  fixes: ["Show real challenges upfront", "Focus on outcomes not tasks", "Align stakeholders early"],
  brutalTruth: "Be honest about the data debt. Seniors will discover it anyway."
}
```

**Data Sources:**
- Job description text
- Responsibilities section
- Company description
- Similar job postings (to identify patterns)

---

## 3. SKILL CARD
**Purpose:** Must-have abilities, tools, and experience

```typescript
interface SkillCardData {
  technicalSkills: string[]; // 5 items - tools, languages, frameworks
  productSkills: string[]; // 4 items - business/product abilities
  behaviouralSkills: string[]; // 4 items - soft skills
  mustHaveSkills: string[]; // 4 core requirements
  upskillableSkills: string[]; // 4 learnable skills
  redFlags: string[]; // 4 warning signs
  donts: string[]; // 4 hiring mistakes
  brutalTruth: string; // Reality check
}
```

**Static Example:**
```typescript
{
  technicalSkills: [
    "Advanced SQL + testing discipline",
    "Strong dbt (macros, tests, structure, ref patterns)",
    "Dimensional modelling & semantic layer design",
    "Pipeline design + data reliability engineering",
    "BI familiarity (Looker ideal)"
  ],
  productSkills: [
    "Translate messy business logic → clean models",
    "Define metrics with Product",
    "Reason through tradeoffs",
    "Influence analytics UX"
  ],
  behaviouralSkills: [
    "Ownership mindset",
    "Writes clear reasoning",
    "Thrives in ambiguity",
    "Protects modelling quality"
  ],
  mustHaveSkills: [
    "Modelling fundamentals",
    "dbt proficiency",
    "SQL testing discipline",
    "Ownership mindset"
  ],
  upskillableSkills: ["Looker", "Metric layers", "Domain-specific metrics", "Airflow DAG writing"],
  redFlags: ["Only built dashboards", "Avoids documentation", "Weak testing discipline", "No ownership vocabulary"],
  donts: ["Hire BI devs mislabelled as AEs", "Skip modelling exercises", "Over-index on domain experience"],
  brutalTruth: "Most 'analytics engineers' are BI developers. Find system designers."
}
```

**Data Sources:**
- Job requirements section
- Skills listed in job posting
- Candidate profiles (what skills top candidates have)
- Similar jobs (common skill patterns)

---

## 4. MARKET CARD
**Purpose:** Talent pool size and market competition

```typescript
interface MarketCardData {
  talentAvailability: {
    total: number; // Total matching profiles
    qualified: number; // Meeting requirements
    currentlyEmployed: number; // Currently working
    openToWork: number; // Actively looking
  };
  supplyDemand: {
    openJobs: number; // Similar jobs available
    availableCandidates: number; // Potential candidates
    ratio: string; // e.g., "1:3" or "5:1"
    marketTightness: string; // "Tight", "Balanced", "Loose"
  };
  talentSupply: {
    midLevel: string; // "High", "Medium", "Low"
    senior: string;
    productMinded: string;
  };
  insights: string[]; // Market observations
  redFlags: string[]; // Competition issues
  opportunities: string[]; // Advantages
  geographic: {
    primaryLocations: string[];
    remoteAvailability: number; // percentage
  };
  primaryLocation: string; // Main job location
}
```

**Data Sources:**
- LinkedIn People Search results (candidate count)
- LinkedIn Jobs results (job count)
- Indeed Jobs results (job count)
- Location from job posting

---

## 5. TALENT MAP CARD
**Purpose:** Where strongest candidates come from

```typescript
interface TalentMapCardData {
  primaryFeeders: string[]; // 6-8 top companies
  secondaryFeeders: string[]; // 4-6 good companies
  avoidList: string[]; // 3-4 companies to avoid
  talentFlowMap: Array<{
    flow: string; // e.g., "Stripe → Fintech scale-ups"
    path: string; // Career progression
    note: string; // Why this matters
  }>;
  personaInsights: Array<{
    type: string; // e.g., "System builder"
    motivated: string; // What drives them
    needs: string; // What they require
    hates: string; // What they avoid
  }>;
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
}
```

**Data Sources:**
- Candidate profiles (current/past companies)
- Common career paths in similar roles
- Company reputation data

---

## 6. PAY CARD
**Purpose:** Market compensation and budget comparison

```typescript
interface PayCardData {
  marketCompensation: Array<{
    label: string; // "Base", "Total comp", "Published range"
    value: string; // "€85k–€100k"
  }>;
  recommendedRange: string; // Suggested offer
  location: string; // Market location
  currency: string; // EUR, USD, GBP
  brutalTruth: string;
  redFlags: string[]; // 3 comp issues
  donts: string[]; // 3 mistakes
  fixes: string[]; // 3 improvements
  hiddenBottleneck: string;
  timelineToFailure: string;
}
```

**Static Example:**
```typescript
{
  marketCompensation: [
    { label: "Base", value: "€85k–€100k" },
    { label: "Total comp", value: "€95k–€115k" },
    { label: "Published range", value: "€6,100–€7,900/month" }
  ],
  recommendedRange: "€90k–€105k for top-tier senior",
  location: "Amsterdam",
  currency: "EUR",
  brutalTruth: "If you offer €80k, you will not hire a senior. You will hire someone who thinks they're senior.",
  redFlags: ["Candidate wants +20% above top band", "Internal equity blocks competitiveness", "Comp approval takes >5 days"],
  donts: ["Hide comp until final stage", "Use equity as compensation if it's not meaningful", "Expect senior technical talent at mid-level pay"],
  fixes: ["Align comp band before launching the search", "Offer clarity upfront", "Highlight ownership + product impact as value drivers"]
}
```

**Data Sources:**
- Salary from job posting
- Similar jobs salary ranges (LinkedIn/Indeed)
- Location for market comparison

---

## 7. FUNNEL CARD
**Purpose:** Volume of outreach and interviews needed

```typescript
interface FunnelCardData {
  funnelStages: Array<{
    label: string; // "Outreach", "Replies", "Screens", "Offers", "Hires"
    value: string; // "100", "25", "10", "3", "1"
  }>;
  benchmarks: Array<{
    label: string; // Conversion metrics
    value: string; // Percentages
  }>;
  funnelHealthComparison: Array<{
    type: string; // "Weak", "Average", "Strong"
    outcome: string; // Results
  }>;
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
  bottomLine: string;
}
```

**Data Sources:**
- Market tightness (from Market Card)
- Candidate availability
- Job competition level

---

## 8. FIT CARD
**Purpose:** What motivates candidates and makes them say yes/no

```typescript
interface FitCardData {
  persona: string; // Candidate archetype
  motivatedBy: string[]; // 5-6 drivers
  avoids: string[]; // 4-5 turn-offs
  candidateEvaluation: string[]; // What they assess
  decisionMakingYes: string[]; // Why they accept
  decisionMakingNo: string[]; // Why they decline
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
}
```

**Data Sources:**
- Job requirements (what type of person fits)
- Role characteristics
- Company culture indicators

---

## 9. MESSAGE CARD
**Purpose:** How to pitch the role effectively

```typescript
interface MessageCardData {
  corePitch: string; // Main value proposition
  scrollStoppers: string[]; // Attention-grabbing hooks
  templates: string[]; // Message variations
  brutalTruth: string;
  donts: string[];
  fixThisNow: string;
  hiddenBottleneck: string;
}
```

**Data Sources:**
- Role mission (from Role Card)
- Key differentiators
- What makes role unique

---

## 10. OUTREACH CARD
**Purpose:** Ready-to-send templates

```typescript
interface OutreachCardData {
  introduction: string; // Context
  message1: string; // Cold outreach template
  message2: string; // Follow-up template
  message3: string; // Alternative approach
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
  timelineToFailure1: string;
  timelineToFailure2: string;
}
```

**Data Sources:**
- Core pitch (from Message Card)
- Role specifics
- Company info

---

## 11. INTERVIEW CARD
**Purpose:** Interview process and competencies to assess

```typescript
interface InterviewCardData {
  optimalLoop: string[]; // 4-5 stage descriptions
  signalQuestions: string[]; // Key questions per stage
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
}
```

**Data Sources:**
- Role requirements
- Skills needed (from Skill Card)
- Seniority level

---

## 12. SCORECARD CARD
**Purpose:** Evaluation framework

```typescript
interface ScorecardCardData {
  competencies: string[]; // 6-8 key abilities to assess
  rating1: string; // "Strong Yes" definition
  rating2: string; // "Yes" definition
  rating3: string; // "No" definition
  rating4: string; // "Strong No" definition
  evaluationMapping: Array<{
    stage: string; // Interview stage
    competencies: string; // What to assess
  }>;
  brutalTruth: string;
  donts: string[];
  fixes: string[];
}
```

**Data Sources:**
- Key skills (from Skill Card)
- Interview stages (from Interview Card)

---

## 13. PLAN CARD
**Purpose:** Next steps and action checklist

```typescript
interface PlanCardData {
  first7Days: string[]; // 5-7 immediate actions
  weeklyRhythm: string[]; // Ongoing activities
  fastestPath: string[]; // Critical path items
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
}
```

**Data Sources:**
- All previous cards (synthesis)
- Timeline urgency
- Resource availability

---

## DATA FLOW SUMMARY

**Input Data Available:**
1. ✅ **Job Posting** - scraped from URL (title, description, requirements, location, salary)
2. ✅ **Similar Jobs** - LinkedIn (up to 200) + Indeed (up to 200)
3. ✅ **Candidates** - LinkedIn People Search (up to 50 profiles)

**AI Analysis Needed:**
- Extract structured data from job description
- Analyze market conditions from job counts
- Identify skill patterns from requirements
- Calculate talent availability from candidate count
- Generate compensation insights from salary ranges
- Create messaging based on role characteristics
- Build outreach templates from core pitch
- Design interview process from skills needed

**Card Dependencies:**
```
Reality Card ← depends on all other cards
Role Card ← job description
Skill Card ← job requirements
Market Card ← similar jobs + candidates count
Talent Map Card ← candidate profiles (companies)
Pay Card ← salary data from jobs
Funnel Card ← market tightness
Fit Card ← role characteristics
Message Card ← role + skills
Outreach Card ← message card
Interview Card ← skills
Scorecard Card ← skills + interview
Plan Card ← all cards
```

---

## NEXT STEPS

1. **Design AI prompts** for each card type
2. **Create card generation functions** that take scraped data as input
3. **Implement card population** in the API route after scraping
4. **Test with real job URLs** to validate quality

