# Data Flow Documentation: What We Scrape & How Cards Are Generated

## 📊 OVERVIEW

This document explains the complete data flow from scraping to card generation.

---

## 🔍 STEP 1: INITIAL DATA SCRAPING

### Input
- **Job URL** (LinkedIn, Indeed, Greenhouse, Lever, Workday, Ashby, etc.)
- OR **Text description** (manual input)

### What We Scrape (from job URL)

**From `jobScraper.ts` using ScrapingBee:**

```javascript
{
  title: "Senior Software Engineer",
  description: "Full job description text...",
  company: "Google", // ⚠️ Actual hiring company, NOT job board
  location: "San Francisco, CA",
  salary: "$150,000 - $200,000",
  requirements: ["5+ years experience", "Python", "React"],
  responsibilities: ["Build features", "Code reviews"],
  benefits: ["Health insurance", "401k"],
  rawText: "Full page text",
  source: "LinkedIn" // Job board/platform name
}
```

**Supported Platforms:**
- LinkedIn
- Indeed
- Greenhouse
- Lever
- Workday
- Ashby
- Generic job boards (fallback)

---

## 🤖 STEP 2: AI ENHANCEMENT

### AI Extraction (`extractJobDetailsWithAI`)

**Uses OpenAI GPT-4o-mini to extract structured data:**

```javascript
{
  jobTitle: "Senior Software Engineer",
  company: "Google", // Extracted from description if missing
  location: "San Francisco, CA",
  workModel: "Hybrid",
  experienceLevel: "Senior",
  minSalary: "150000",
  maxSalary: "200000",
  skills: ["Python", "React", "TypeScript", "AWS"],
  requirements: ["5+ years", "BS in CS"],
  timeline: "ASAP",
  department: "Engineering",
  confidence: 0.95
}
```

**Key Features:**
- Validates it's actually a job posting
- Extracts company name (filters out job board names)
- Normalizes salary to numbers
- Identifies skills and requirements
- Determines experience level

---

## 🌐 STEP 3: EXTERNAL DATA SOURCES

### 3.1 Similar Jobs Search

**LinkedIn Jobs (via Apify):**
- Searches for similar job titles
- Filters by location, work type, experience level
- Returns up to **200 jobs**
- Includes: title, company, salary, location, description

**Indeed Jobs (via Apify):**
- Parallel search on Indeed
- Returns up to **200 jobs**
- Combined with LinkedIn for **~400 total similar jobs**

**Data Structure:**
```javascript
{
  id: "job-123",
  title: "Senior Software Engineer",
  company: { name: "Meta" },
  location: { city: "San Francisco", state: "CA" },
  salary: { min: 160000, max: 220000 },
  platform: "linkedin" | "indeed"
}
```

### 3.2 Candidate Search

**LinkedIn People Search (via Apify):**
- Searches by job title and location
- Returns up to **100 candidate profiles**
- Includes: name, headline, company, location, skills, experience

**GitHub Candidate Search (via GitHub API):**
- Searches by job title in bio/company
- Returns up to **50 candidate profiles**
- Includes: username, bio, location, company, followers, repos

**Combined: ~150 total candidates**

**Data Structure:**
```javascript
{
  id: "linkedin-123",
  firstName: "John",
  lastName: "Doe",
  headline: "Senior Software Engineer at Google",
  currentCompany: { name: "Google" },
  location: { linkedinText: "San Francisco, CA" },
  platform: "linkedin" | "github"
}
```

### 3.3 Additional Data Sources

**Glassdoor Salaries (via Apify):**
- Scrapes salary data for job title + location
- Returns: min, max, median salary ranges
- Sample size and last updated date

**Levels.fyi Salaries (via Apify Web Scraper):**
- Tech-focused compensation data
- Company-specific salary ranges
- Total compensation breakdown (base + stock + bonus)

**Crunchbase Company Data (via Apify):**
- Company intelligence
- Funding, employees, industry, competitors
- Headquarters location

**GitHub Talent (via GitHub API):**
- Developer profiles with skills
- Used for Talent Map Card

**Industry Benchmarks:**
- Funnel metrics (applicants per hire, pass rates)
- Quality metrics (tenure, performance)
- Based on role type and industry

---

## 🎴 STEP 4: CARD GENERATION (4 GROUPS)

### GROUP 1: Job Analysis Cards (5 cards)
**Uses:** Scraped job data only

#### 1. Role Card
**Data Used:**
- `jobData.title`
- `jobData.description`
- `jobData.responsibilities`
- `jobData.company`

**Output:**
- Role summary
- Key outcomes
- Success criteria
- Day-to-day activities

#### 2. Skill Card
**Data Used:**
- `jobData.requirements`
- `jobData.skills`
- `jobData.description`

**Output:**
- Technical skills
- Product skills
- Behavioral skills
- Must-have vs nice-to-have

#### 3. Message Card
**Data Used:**
- `jobData.description`
- `jobData.company`
- `roleCard` (from above)

**Output:**
- Core pitch
- Value propositions
- Unique selling points

#### 4. Outreach Card
**Data Used:**
- `jobData.title`
- `jobData.company`
- `messageCard` (from above)

**Output:**
- Email templates
- LinkedIn messages
- Outreach sequences

#### 5. Fit Card
**Data Used:**
- `jobData.description`
- `jobData.workModel`
- `jobData.locationType`

**Output:**
- Work style fit
- Culture fit
- Team structure

---

### GROUP 2: People Analysis Cards (1 card)
**Uses:** Candidate profiles only

#### 6. Talent Map Card
**Data Used:**
- `candidates[]` (LinkedIn + GitHub)
- `githubTalent[]` (from dataSources)

**Output:**
- Top companies where candidates work
- Career progression patterns
- Geographic distribution
- Common backgrounds

---

### GROUP 3: Combined Analysis Cards (4 cards)
**Uses:** Job data + Similar jobs + Candidates + External data

#### 7. Market Card
**Data Used:**
- `similarJobs[]` (LinkedIn + Indeed)
- `candidates[]` (LinkedIn + GitHub)
- `jobData.location`
- `jobData.title`

**Market Analysis Algorithm:**
1. Sample data: 150 candidates, 400 jobs
2. Extrapolation:
   - If LinkedIn provides total count → use it (high confidence)
   - Otherwise → ratio-based estimation (medium confidence)
3. Market tightness calculation:
   - Candidates per job ratio
   - Categories: Very Tight, Tight, Balanced, Loose, Very Loose

**Output:**
- Estimated total candidates (with confidence intervals)
- Estimated total jobs
- Market tightness score
- Supply/demand ratio
- Recommendations

#### 8. Pay Card
**Data Used:**
- `jobData.salary` (from scraped job)
- `similarJobs[]` (salary ranges from 400 jobs)
- `glassdoorSalaries[]` (from Glassdoor)
- `levelsFyiSalaries[]` (from Levels.fyi)
- `jobData.location`

**Output:**
- Your salary vs market
- Percentile ranking
- Competitiveness analysis
- Recommendations

#### 9. Funnel Card
**Data Used:**
- `marketCard` (supply/demand ratio)
- `benchmarks` (industry funnel metrics)
- `jobData.experienceLevel`

**Output:**
- Expected applicants per hire
- Outreach volume needed
- Conversion rates by stage
- Time to hire estimates

#### 10. Reality Card
**Data Used:**
- `roleCard`
- `skillCard`
- `marketCard`
- `payCard`
- `funnelCard`

**Output:**
- Overall reality score (0-10)
- Red flags
- Strengths
- Honest assessment

---

### GROUP 4: Derived Strategy Cards (3 cards)
**Uses:** Other cards (synthesized)

#### 11. Interview Card
**Data Used:**
- `skillCard` (must-have skills)
- `roleCard` (key outcomes)

**Output:**
- Interview questions by skill
- Assessment criteria
- Evaluation rubrics

#### 12. Scorecard Card
**Data Used:**
- `skillCard` (competencies)
- `interviewCard` (assessment stages)

**Output:**
- Evaluation scorecard
- Rating criteria
- Decision framework

#### 13. Plan Card
**Data Used:**
- `roleCard`
- `skillCard`
- `marketCard`
- `realityCard`

**Output:**
- Hiring plan
- Timeline
- Action items
- Resource needs

---

## 📈 DATA FLOW SUMMARY

```
1. USER INPUT (Job URL or Text)
   ↓
2. SCRAPE JOB POSTING
   → title, description, company, location, salary, requirements
   ↓
3. AI EXTRACTION
   → Enhanced structured data (skills, experience level, etc.)
   ↓
4. PARALLEL DATA FETCHING
   ├─→ Similar Jobs (LinkedIn + Indeed) → 400 jobs
   ├─→ Candidates (LinkedIn + GitHub) → 150 profiles
   ├─→ Glassdoor Salaries → Salary ranges
   ├─→ Levels.fyi Salaries → Tech compensation
   ├─→ Crunchbase → Company intelligence
   └─→ Industry Benchmarks → Funnel metrics
   ↓
5. CARD GENERATION (Sequential Groups)
   ├─→ GROUP 1: Job Analysis (5 cards)
   ├─→ GROUP 2: People Analysis (1 card)
   ├─→ GROUP 3: Combined Analysis (4 cards)
   └─→ GROUP 4: Derived Strategy (3 cards)
   ↓
6. RETURN ALL 13 CARDS
```

---

## 🔑 KEY DATA POINTS

### From Job Scraping:
- ✅ Job title
- ✅ Company name (actual hiring company)
- ✅ Location
- ✅ Salary range
- ✅ Full description
- ✅ Requirements
- ✅ Responsibilities
- ✅ Benefits

### From Similar Jobs:
- ✅ 200 LinkedIn jobs
- ✅ 200 Indeed jobs
- ✅ Salary ranges
- ✅ Company names
- ✅ Locations

### From Candidates:
- ✅ 100 LinkedIn profiles
- ✅ 50 GitHub profiles
- ✅ Current companies
- ✅ Experience history
- ✅ Skills
- ✅ Locations

### From External Sources:
- ✅ Glassdoor salary data
- ✅ Levels.fyi compensation
- ✅ Crunchbase company data
- ✅ Industry benchmarks

---

## 🎯 CARD DEPENDENCIES

**Independent Cards (can generate immediately):**
- Role Card
- Skill Card
- Fit Card

**Depends on Similar Jobs:**
- Market Card
- Pay Card

**Depends on Candidates:**
- Talent Map Card
- Market Card

**Depends on Other Cards:**
- Message Card → needs Role Card
- Outreach Card → needs Message Card
- Funnel Card → needs Market Card
- Reality Card → needs all Group 1 + Group 3 cards
- Interview Card → needs Skill Card + Role Card
- Scorecard Card → needs Skill Card + Interview Card
- Plan Card → needs multiple cards

---

## 💡 IMPORTANT NOTES

1. **Company Name Validation:**
   - Always uses actual hiring company (e.g., "Google")
   - Never uses job board name (e.g., "LinkedIn")
   - Filters out job board names automatically

2. **Market Analysis:**
   - Uses statistical extrapolation when we can't scrape all candidates
   - Provides confidence intervals
   - Handles incomplete data gracefully

3. **Multi-Source Aggregation:**
   - Combines LinkedIn + GitHub for candidates
   - Combines LinkedIn + Indeed for jobs
   - Aggregates Glassdoor + Levels.fyi for salaries

4. **Error Handling:**
   - Falls back to estimated data if scraping fails
   - Continues card generation even with partial data
   - Logs warnings for missing data

