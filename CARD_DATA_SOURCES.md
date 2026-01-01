# Card Data Source Requirements

This document categorizes all 13 cards by what scraped data they need.

---

## 📋 CATEGORY 1: JOB DATA ONLY
**These cards analyze the job posting itself**

### 1. ROLE CARD
**Needs:** Job description, responsibilities, requirements
- ✅ Job title
- ✅ Job description text
- ✅ Responsibilities section
- ✅ Company description
- ❌ Does NOT need candidate data

**Why:** Defines what the role is about, outcomes, and success criteria from the JD itself.

---

### 2. SKILL CARD
**Needs:** Job requirements, skills listed, tech stack
- ✅ Required skills from job posting
- ✅ Nice-to-have skills
- ✅ Tools/technologies mentioned
- ✅ Experience level required
- ❌ Does NOT need candidate data directly

**Why:** Extracts and categorizes skills from job requirements into technical, product, and behavioral.

---

### 3. MESSAGE CARD
**Needs:** Job description, role mission, unique aspects
- ✅ What makes this role unique
- ✅ Company mission/culture
- ✅ Role responsibilities
- ❌ Does NOT need candidate data

**Why:** Creates pitch based on what the job offers, not who applies.

---

### 4. OUTREACH CARD
**Needs:** Same as Message Card + company details
- ✅ Job description
- ✅ Company name
- ✅ Role highlights
- ❌ Does NOT need candidate data

**Why:** Templates are about selling the role, not about candidates.

---

## 👥 CATEGORY 2: PEOPLE DATA ONLY
**These cards analyze candidate profiles**

### 5. TALENT MAP CARD
**Needs:** Candidate profiles showing current/past companies
- ✅ Companies candidates work at/worked at
- ✅ Career progression patterns
- ✅ Common backgrounds
- ❌ Does NOT need job posting details

**Why:** Shows where to source candidates based on where similar people work.

**Data from LinkedIn People Search:**
```javascript
{
  "company": "Stripe",
  "previousCompanies": ["Google", "Facebook"],
  "title": "Senior Analytics Engineer"
}
```

---

## 🔄 CATEGORY 3: BOTH JOB + PEOPLE DATA
**These cards need analysis of both**

### 6. MARKET CARD
**Needs:** Job competition + candidate availability
- ✅ **From Jobs:** Similar jobs count (LinkedIn + Indeed)
- ✅ **From People:** Candidate count (LinkedIn People Search)
- ✅ **From Job:** Location, seniority level
- ✅ **From People:** Geographic distribution

**Why:** Compares supply (candidates) vs demand (jobs).

**Calculation:**
- Total candidates found: 50
- Similar jobs found: 200 LinkedIn + 150 Indeed = 350
- Ratio: 50:350 = 1:7 (tight market)

---

### 7. PAY CARD
**Needs:** Job salary + market salary data
- ✅ **From Job:** Stated salary/range
- ✅ **From Similar Jobs:** Salary ranges from 400 similar jobs
- ✅ **From Job:** Location (affects market rates)
- ⚠️ **Optional from People:** Candidate expected salary (if available)

**Why:** Compares your offer vs market reality.

**Calculation:**
```javascript
// From scraped job
yourSalary = "€80k-€95k"

// From similar jobs
marketSalaries = [
  "€85k-€100k",
  "€90k-€110k",
  "€80k-€95k",
  // ... 400 total
]

// Analysis: You're at bottom 25th percentile
```

---

### 8. FIT CARD
**Needs:** Role characteristics + candidate preferences
- ✅ **From Job:** Role type, culture, work style
- ✅ **From Job:** Team structure, autonomy level
- ⚠️ **From People:** What similar candidates value (inferred from profiles)

**Why:** Matches job characteristics to candidate motivations.

**Note:** Mostly job-based, people data is secondary.

---

### 9. FUNNEL CARD
**Needs:** Market tightness (from Market Card)
- ✅ **From Market Card:** Supply/demand ratio
- ✅ **From Job:** Seniority level
- ✅ **From People:** Candidate count

**Why:** More competitive market = need more outreach volume.

**Calculation:**
```javascript
if (candidateCount < jobCount * 0.5) {
  marketTightness = "Very tight";
  outreachNeeded = 150;
  conversionRate = "15%";
} else {
  marketTightness = "Balanced";
  outreachNeeded = 100;
  conversionRate = "25%";
}
```

---

### 10. REALITY CARD
**Needs:** Everything (synthesizes all other cards)
- ✅ **From Job:** Requirements, salary, location
- ✅ **From Similar Jobs:** Competition level
- ✅ **From People:** Candidate availability
- ✅ **From All Cards:** Red flags, issues, strengths

**Why:** Master score based on all factors.

**Score Calculation:**
```javascript
realityScore = 
  + marketAvailability (0-2 points)
  + salaryCompetitiveness (0-2 points)
  + roleClarity (0-2 points)
  + skillReasonability (0-2 points)
  + locationFlexibility (0-2 points)
= 0-10 total
```

---

## 🔨 CATEGORY 4: DERIVED FROM OTHER CARDS
**These cards synthesize data from previous cards**

### 11. INTERVIEW CARD
**Needs:** Skills Card + Role Card
- ✅ **From Skill Card:** Must-have vs nice-to-have skills
- ✅ **From Role Card:** Key outcomes to assess
- ❌ Does NOT need raw job/people data

**Why:** Interview questions based on what skills matter.

---

### 12. SCORECARD CARD
**Needs:** Skill Card + Interview Card
- ✅ **From Skill Card:** Competencies to evaluate
- ✅ **From Interview Card:** What stages assess what
- ❌ Does NOT need raw job/people data

**Why:** Evaluation rubric based on required skills.

---

### 13. PLAN CARD
**Needs:** All cards (master synthesis)
- ✅ **From Reality Card:** Urgency level
- ✅ **From Market Card:** Sourcing strategy
- ✅ **From Funnel Card:** Volume needed
- ✅ **From All Cards:** Action items
- ❌ Does NOT need raw job/people data directly

**Why:** Action plan based on insights from all cards.

---

## 📊 SUMMARY TABLE

| Card | Job Data | People Data | Both | Derived |
|------|----------|-------------|------|---------|
| 1. Reality Card | | | ✅ | ✅ (from all cards) |
| 2. Role Card | ✅ | | | |
| 3. Skill Card | ✅ | | | |
| 4. Market Card | | | ✅ | |
| 5. Talent Map Card | | ✅ | | |
| 6. Pay Card | | | ✅ | |
| 7. Funnel Card | | | ✅ | |
| 8. Fit Card | ✅ | ⚠️ (optional) | | |
| 9. Message Card | ✅ | | | |
| 10. Outreach Card | ✅ | | | |
| 11. Interview Card | | | | ✅ (from Skills + Role) |
| 12. Scorecard Card | | | | ✅ (from Skills + Interview) |
| 13. Plan Card | | | | ✅ (from all cards) |

---

## 🎯 GENERATION ORDER

**Phase 1: Job-Only Cards** (can generate immediately after scraping job)
1. Role Card
2. Skill Card
3. Message Card
4. Outreach Card
5. Fit Card

**Phase 2: People-Only Cards** (after LinkedIn People Search)
1. Talent Map Card

**Phase 3: Combined Cards** (after scraping similar jobs + people)
1. Market Card
2. Pay Card
3. Funnel Card

**Phase 4: Derived Cards** (after all primary cards)
1. Interview Card
2. Scorecard Card
3. Plan Card
4. Reality Card (last - needs all others)

---

## 🔍 DATA REQUIREMENTS BREAKDOWN

### From Job Posting Scrape:
```javascript
{
  title: "Senior Analytics Engineer",
  description: "...",
  responsibilities: "...",
  requirements: "...",
  skills: ["SQL", "dbt", "Python"],
  location: "Amsterdam",
  salary: "€80k-€95k",
  company: "Mollie",
  employmentType: "Full-time",
  workplaceType: "Remote"
}
```

### From Similar Jobs (LinkedIn + Indeed):
```javascript
{
  jobs: [
    {
      title: "Analytics Engineer",
      salary: { min: 85000, max: 100000 },
      location: "Amsterdam",
      company: "Stripe"
    },
    // ... 400 total
  ],
  linkedInJobsCount: 200,
  indeedJobsCount: 200
}
```

### From LinkedIn People Search:
```javascript
{
  candidates: [
    {
      name: "John Doe",
      title: "Senior Analytics Engineer",
      company: "Stripe",
      previousCompanies: ["Google", "Facebook"],
      location: "Amsterdam",
      skills: ["SQL", "dbt", "Python"]
    },
    // ... up to 50
  ],
  candidatesCount: 50
}
```

---

## 💡 IMPLEMENTATION STRATEGY

**Sequential Processing:**
```javascript
// 1. Scrape job
const jobData = await scrapeJob(url);

// 2. Generate job-only cards immediately
const roleCard = await generateRoleCard(jobData);
const skillCard = await generateSkillCard(jobData);
const messageCard = await generateMessageCard(jobData, roleCard);
const outreachCard = await generateOutreachCard(jobData, messageCard);
const fitCard = await generateFitCard(jobData);

// 3. Search for similar jobs & candidates (parallel)
const [similarJobs, candidates] = await Promise.all([
  searchSimilarJobs(jobData.title, jobData.location),
  searchCandidates(jobData.title, jobData.location)
]);

// 4. Generate people-only cards
const talentMapCard = await generateTalentMapCard(candidates);

// 5. Generate combined cards
const marketCard = await generateMarketCard(jobData, similarJobs, candidates);
const payCard = await generatePayCard(jobData, similarJobs);
const funnelCard = await generateFunnelCard(marketCard);

// 6. Generate derived cards
const interviewCard = await generateInterviewCard(skillCard, roleCard);
const scorecardCard = await generateScorecardCard(skillCard, interviewCard);
const planCard = await generatePlanCard(allCards);
const realityCard = await generateRealityCard(allCards);

// 7. Return all cards
return { roleCard, skillCard, marketCard, ... };
```

---

## ✅ VALIDATION CHECKLIST

Before generating each card type, ensure you have:

**Job-Only Cards:**
- [ ] Job title extracted
- [ ] Job description parsed
- [ ] Skills/requirements identified
- [ ] Company info available

**People-Only Cards:**
- [ ] Candidate profiles scraped
- [ ] Company history extracted
- [ ] At least 10+ candidates found

**Combined Cards:**
- [ ] Similar jobs count > 50
- [ ] Candidate count > 10
- [ ] Salary data from at least 20% of jobs
- [ ] Location match verified

**Derived Cards:**
- [ ] All prerequisite cards generated
- [ ] No null/undefined in source cards
- [ ] Cross-references validated

