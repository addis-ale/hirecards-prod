# Indeed Jobs Integration

## 🎯 Overview

This integration adds Indeed job scraping alongside the existing LinkedIn integration, allowing you to search for jobs across both platforms simultaneously and compare results.

## 🔄 How It Works

1. **User pastes a job URL** (LinkedIn OR Indeed) or job description
2. **ScrapingBee + Our scraper** fetches the job details
3. **OpenAI AI** extracts structured data (title, location, salary, etc.)
4. **Apify searches BOTH platforms** in parallel:
   - LinkedIn Jobs Scraper (existing)
   - Indeed Jobs Scraper (NEW!)
5. **Combined results** - Up to 400 jobs total (200 from each platform)
6. **Debug buttons show all data** with platform badges

## 📋 Setup Instructions

### 1. You Already Have Everything!

Since you already have Apify set up for LinkedIn, the Indeed integration uses the same API key. No additional setup needed!

Your `.env.local` should have:

```env
OPENAI_API_KEY=your_openai_api_key_here
APIFY_API_KEY=your_apify_api_key_here
SCRAPINGBEE_API_KEY=your_scrapingbee_api_key_here
```

### 2. Restart Your Dev Server

```bash
npm run dev
```

## 🎨 Features

### Dual Platform Search
- **Automatically searches both LinkedIn AND Indeed** for similar jobs
- Runs searches in parallel for faster results
- Combines results into a single list

### Platform Detection
- Automatically detects if you paste a LinkedIn or Indeed URL
- Tracks which platform each job came from
- Shows platform badges in the UI (blue for LinkedIn, orange for Indeed)

### Debug: Scraped Data Button
- Shows the original job you pasted
- AI-enhanced with extracted fields
- All the same info as before

### Job Data Button - NOW WITH BOTH PLATFORMS!
- Shows similar jobs from **LinkedIn AND Indeed**
- Platform badges on each job card:
  - 🔵 **LINKEDIN** badge for LinkedIn jobs
  - 🟠 **INDEED** badge for Indeed jobs
- Summary shows breakdown: "Found 100 jobs total (50 LinkedIn + 50 Indeed)"
- Each job card shows:
  - Company logo and name
  - Location
  - Workplace type (Remote/Hybrid/On-site)
  - Employment type (Full-time/Contract)
  - Salary range (if available)
  - Platform-specific links ("View on LinkedIn →" or "View on Indeed →")

## 🔍 Search Parameters

### Indeed Filters (Automatically Applied)
- **Job Title**: Extracted from your job posting
- **Location**: City, state, country
- **Job Type**: Full-time, Part-time, Contract, Internship, Temporary
- **Remote**: Remote or Hybrid positions
- **Sort**: By relevance (best matches first)
- **Max Results**: Up to 200 jobs per platform

### LinkedIn Filters (Existing)
- Same filters as before
- Experience level, workplace type, etc.

## 💰 Pricing

- **LinkedIn Jobs** (Apify): $1 per 1,000 jobs scraped
- **Indeed Jobs** (Apify): Pay-per-result (similar pricing)
- **Total Cost**: ~$0.40 per search (200 LinkedIn + 200 Indeed jobs)
- **OpenAI**: ~$0.01 per job for AI extraction
- **ScrapingBee**: Varies based on plan

**Note**: The actual number of jobs returned may be less than 200 per platform depending on:
- Available jobs matching your criteria
- Location-specific job market
- Filters applied (job type, remote, etc.)

## 🚀 Usage Example

### Example 1: Paste LinkedIn URL
```
Input: https://www.linkedin.com/jobs/view/4227647589/
Result: 
- Scrapes LinkedIn job
- Searches LinkedIn for up to 200 similar jobs
- Searches Indeed for up to 200 similar jobs
- Shows up to 400 total jobs with platform badges
```

### Example 2: Paste Indeed URL
```
Input: https://www.indeed.com/viewjob?jk=abc123
Result:
- Scrapes Indeed job
- Searches LinkedIn for up to 200 similar jobs
- Searches Indeed for up to 200 similar jobs
- Shows up to 400 total jobs with platform badges
```

### Example 3: Paste Job Description
```
Input: "Senior React Developer for a Fintech startup in London"
Result:
- AI extracts job details
- Searches LinkedIn for up to 200 similar jobs
- Searches Indeed for up to 200 similar jobs
- Shows up to 400 total jobs with platform badges
```

## 🛠️ Technical Details

### API Route
- Location: `src/app/api/scrape-job/route.ts`
- LinkedIn Actor: `zn01OAlzP853oqn4Z`
- Indeed Actor: `MXLpngmVpE8WTESQr`
- Timeout: 3 minutes per platform
- Searches run in **parallel** for speed

### Data Normalization
- Indeed jobs are normalized to match LinkedIn format
- Both platforms use the same `ApifyJobData` interface
- Platform field added to track source: `platform: "linkedin" | "indeed"`

### UI Components
- Hero Section: `src/app/modules/landing-page/ui/components/home-hero-section.tsx`
- Platform badges with color coding
- Breakdown counter in header: "(LI: 50 + IN: 50)"
- Summary shows platform distribution

## 📊 Data Structure

### Combined Job Data
```typescript
{
  id: string;
  title: string;
  linkedinUrl?: string; // LinkedIn jobs
  url?: string; // Indeed jobs
  company: { name, logo, employeeCount };
  location: { city, state, country, linkedinText };
  salary: { text, min, max, currency };
  employmentType: string;
  workplaceType: string;
  benefits: string[];
  platform: "linkedin" | "indeed"; // NEW!
}
```

## ⚠️ Troubleshooting

### No Indeed Jobs Found
- Check that APIFY_API_KEY is set in .env.local
- Verify the Apify actor `MXLpngmVpE8WTESQr` is accessible
- Check console for error messages
- Indeed might have fewer jobs for some searches (expected)

### Slow Loading
- Searching both platforms takes longer (~1-3 minutes)
- Searches run in parallel for efficiency
- Loader stays visible for minimum 45 seconds

### API Errors
- Verify Apify API key is correct
- Check Apify dashboard for quota/credits
- Review console logs for detailed errors

## 🎯 Benefits of Dual Platform Search

1. **More comprehensive data** - 100 jobs instead of 50
2. **Better salary insights** - Indeed often has better salary data than LinkedIn
3. **Market validation** - Cross-reference data between platforms
4. **Redundancy** - If one API fails, you still have data from the other
5. **Better candidate reach** - See where jobs are posted most

## 🔮 Future Enhancements

- [ ] Add filtering by platform (show only LinkedIn or only Indeed)
- [ ] Compare salary ranges between platforms
- [ ] Show which platform has more jobs for this role
- [ ] Support other countries (currently defaults to US for Indeed)
- [ ] Add Glassdoor, ZipRecruiter, etc.

---

**Need help?** Check the Apify actor documentation: 
- LinkedIn: https://console.apify.com/actors/zn01OAlzP853oqn4Z
- Indeed: https://console.apify.com/actors/MXLpngmVpE8WTESQr
