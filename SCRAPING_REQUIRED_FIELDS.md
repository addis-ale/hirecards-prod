# Required Fields for Scraping from Different Sources

This document outlines what fields are required for scraping from each data source.

---

## 📋 JOB DESCRIPTION SCRAPING (ScrapingBee)

### Input Required

- **Job URL** (LinkedIn, Indeed, Workday, Ashby, or generic job board)

### Fields Extracted (Automatic)

No specific fields required - the scraper extracts:

- `title` - Job title
- `description` - Full job description text
- `company` - Company name
- `location` - Job location
- `salary` - Salary range (if available)
- `requirements` - Job requirements array
- `responsibilities` - Responsibilities array
- `benefits` - Benefits array
- `rawText` - Full page text
- `source` - Platform name (LinkedIn, Indeed, etc.)

### Supported Platforms

- ✅ LinkedIn (`linkedin.com/jobs`)
- ✅ Indeed (`indeed.com/viewjob`)
- ✅ Workday (`*.workday.com` or `*.myworkdayjobs.com`)
- ✅ Ashby (`*.ashbyhq.com`)
- ✅ Generic job boards (fallback)

### Requirements

- ✅ `SCRAPINGBEE_API_KEY` environment variable
- ✅ Valid job URL

---

## 🔍 SIMILAR JOBS SEARCH (Apify)

### Input Required

- ✅ **Job Title** (`scrapedData.title` or `aiExtractedData.jobTitle`)
- ✅ **Location** (`scrapedData.location` or `aiExtractedData.location`) - Optional but recommended

### Fields Used for Search

```typescript
{
  jobTitle: "Senior Software Engineer",  // REQUIRED
  location: "San Francisco, CA",         // OPTIONAL (improves results)
  workplaceType: "Remote" | "Hybrid" | "On-site",  // OPTIONAL
  employmentType: "Full-time" | "Part-time",        // OPTIONAL
  experienceLevel: "Senior",             // OPTIONAL
  salary: "$150k-$200k"                  // OPTIONAL
}
```

### What Gets Searched

1. **LinkedIn Jobs** (via Apify actor `zn01OAlzP853oqn4Z`)

   - Searches by job title + location
   - Returns up to 200 jobs
   - Includes: title, company, location, salary, description

2. **Indeed Jobs** (via Apify actor)

   - Searches by job title + location
   - Returns up to 200 jobs
   - Includes: title, company, location, salary, description

3. **Glassdoor Jobs** (via Apify actor `bebity/glassdoor-jobs-scraper`)
   - Searches by job title + location
   - Returns up to 200 jobs
   - Includes: title, company, location, salary, description

### Requirements

- ✅ `APIFY_API_KEY` environment variable
- ✅ **Job Title** (minimum required)
- ⚠️ **Location** (highly recommended for accurate results)

### What Happens if Fields Missing

- ❌ If no job title: Similar jobs search is **skipped**
- ⚠️ If no location: Search still runs but results may be less relevant

---

## 👥 CANDIDATE SEARCH (Apify LinkedIn People Search)

### Input Required

- ✅ **Job Title** (`scrapedData.title` or `aiExtractedData.jobTitle`) - **REQUIRED**
- ✅ **Location** (`scrapedData.location` or `aiExtractedData.location`) - **OPTIONAL** (but recommended)

### Fields Used for Search

```typescript
{
  currentJobTitles: ["Senior Software Engineer"],  // REQUIRED
  locations: ["San Francisco, CA"],                // OPTIONAL
  maxItems: 100,                                   // Default
  takePages: 4                                     // Default
}
```

### What Gets Searched

- **LinkedIn People Search** (via Apify actor `M2FMdjRVeF1HPGFcc`)
  - Searches by current job title + location
  - Returns up to 100 candidate profiles
  - Includes: name, headline, company, location, skills, experience

### Candidate Data Structure

```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  location: {
    linkedinText: string;
  }
  currentPositions: [
    {
      companyName: "Company Name", // ← Used for Talent Map Card
      title: "Job Title",
      current: true,
    },
  ];
  // ... other fields
}
```

### Requirements

- ✅ `APIFY_API_KEY` environment variable
- ✅ **Job Title** (minimum required)
- ⚠️ **Location** (highly recommended for accurate results)

### What Happens if Fields Missing

- ❌ If no job title: Candidate search is **skipped**
- ⚠️ If no location: Search still runs but results may be less relevant

---

## 💰 SALARY DATA (Apify Glassdoor)

### Input Required

- ✅ **Job Title** (`scrapedData.title` or `aiExtractedData.jobTitle`) - **REQUIRED**
- ✅ **Location** (`scrapedData.location` or `aiExtractedData.location`) - **REQUIRED**
- ⚠️ **Company** (`scrapedData.company` or `aiExtractedData.company`) - **OPTIONAL**

### Fields Used for Search

```typescript
{
  jobTitle: "Senior Software Engineer",  // REQUIRED
  location: "San Francisco, CA",        // REQUIRED
  company: "Google"                      // OPTIONAL (improves accuracy)
}
```

### What Gets Searched

- **Glassdoor Salaries** (via Apify actor `bebity/glassdoor-jobs-scraper`)
  - Searches salary data by job title + location + company
  - Returns salary ranges with min, max, median
  - Includes: salary ranges, sample size, last updated

### Requirements

- ✅ `APIFY_API_KEY` environment variable
- ✅ **Job Title** (required)
- ✅ **Location** (required)
- ⚠️ **Company** (optional but improves accuracy)

### What Happens if Fields Missing

- ❌ If no job title: Salary search is **skipped**
- ❌ If no location: Salary search is **skipped**
- ⚠️ If no company: Search still runs but may be less accurate

---

## 📊 INDUSTRY BENCHMARKS

### Input Required

- ✅ **Job Title** (`scrapedData.title` or `aiExtractedData.jobTitle`) - **REQUIRED**
- ⚠️ **Industry** (defaults to "technology") - **OPTIONAL**

### Current Status

- ⚠️ **Currently returns `null`** - No real data source implemented
- This affects **Funnel Card** generation (requires benchmarks)

### Requirements

- ⚠️ **Needs implementation** - Currently no data source

---

## 🎯 SUMMARY: Minimum Required Fields

### For Basic Job Scraping (ScrapingBee)

- ✅ **Job URL** only

### For Similar Jobs Search (Apify)

- ✅ **Job Title** (minimum)
- ⚠️ **Location** (highly recommended)

### For Candidate Search (Apify)

- ✅ **Job Title** (minimum)
- ⚠️ **Location** (highly recommended)

### For Salary Data (Apify)

- ✅ **Job Title** (required)
- ✅ **Location** (required)
- ⚠️ **Company** (optional)

### For Full Card Generation

**Minimum Required:**

- ✅ Job Title
- ✅ Job Description (from URL or text)

**Recommended for Best Results:**

- ✅ Job Title
- ✅ Location
- ✅ Company Name
- ✅ Job Description

---

## 🔄 FIELD EXTRACTION FLOW

```
1. User Input (URL or Text)
   ↓
2. ScrapingBee Scrapes URL
   → Extracts: title, description, company, location, salary, etc.
   ↓
3. AI Extraction (if description available)
   → Extracts: jobTitle, location, company, skills, experienceLevel, etc.
   ↓
4. Merge Scraped + AI Data
   → Uses scraped data first, AI data as fallback
   ↓
5. Use Merged Data for Apify Searches
   → Similar Jobs: needs jobTitle + location
   → Candidates: needs jobTitle + location
   → Salaries: needs jobTitle + location + company
```

---

## ⚠️ COMMON ISSUES

### Issue 1: No Similar Jobs Found

**Cause:** Missing job title or location
**Solution:** Ensure job title is extracted from description

### Issue 2: No Candidates Found

**Cause:** Missing job title or location
**Solution:** Ensure job title is extracted from description

### Issue 3: No Salary Data

**Cause:** Missing job title or location
**Solution:** Ensure both job title and location are available

### Issue 4: Talent Map Card Not Dynamic

**Cause:** No candidates found OR company names not extracted
**Solution:**

- Ensure candidate search runs (needs job title + location)
- Check that `currentPositions[0].companyName` is being extracted

---

## 📝 FIELD PRIORITY ORDER

When multiple sources provide the same field, priority is:

1. **Scraped Data** (from ScrapingBee) - Highest priority
2. **AI Extracted Data** (from GPT) - Fallback
3. **Manual Input** (from chatbot) - Last resort

Example for `location`:

```typescript
const location =
  scrapedData.location || aiExtractedData.location || manualInput.location;
```
