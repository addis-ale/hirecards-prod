# Apify LinkedIn Jobs Integration

## 🎯 Overview

This integration connects your job scraper with Apify's LinkedIn Jobs Scraper to find similar jobs based on the job you paste.

## 🔄 How It Works

1. **User pastes a LinkedIn job URL** into the input field
2. **ScrapingBee + Our scraper** fetches the job details
3. **OpenAI AI** extracts structured data (title, location, salary, etc.)
4. **Apify searches LinkedIn** for similar jobs using extracted parameters
5. **Two debug buttons appear**:
   - 🐛 **Debug: Scraped Data** - Shows the original job data
   - 📊 **Job Data** - Shows 20-50 similar jobs from LinkedIn

## 📋 Setup Instructions

### 1. Get Your Apify API Key

1. Go to [Apify Console](https://console.apify.com/)
2. Sign up or log in
3. Navigate to **Settings** → **Integrations**
4. Copy your **API Token**

### 2. Add to Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
APIFY_API_KEY=your_apify_api_key_here
SCRAPINGBEE_API_KEY=your_scrapingbee_api_key_here
```

### 3. Restart Your Dev Server

```bash
npm run dev
```

## 🎨 Features

### Debug: Scraped Data Button
- Shows the original job you pasted
- AI-enhanced with extracted fields
- Skills shown as blue badges
- Location, salary, experience level

### Job Data Button
- Shows similar jobs from LinkedIn
- Same title and location
- Different companies for comparison
- Each job card shows:
  - Company logo and name
  - Location
  - Workplace type (Remote/Hybrid/On-site)
  - Employment type (Full-time/Contract)
  - Salary range (if available)
  - Number of applicants and views
  - Benefits
  - Direct link to LinkedIn

## 🔍 Search Parameters

Apify automatically searches for jobs using these filters extracted from your original job:

- **Job Title**: Extracted from job title
- **Location**: City, state, country
- **Workplace Type**: Remote, Hybrid, On-site
- **Employment Type**: Full-time, Part-time, Contract
- **Experience Level**: Entry level, Mid-Senior level, etc.
- **Salary Range**: Min-max range
- **Posted Date**: Past week (for fresh results)

## 💰 Pricing

- **Apify**: $1 per 1,000 jobs scraped
- **OpenAI**: ~$0.01 per job for AI extraction
- **ScrapingBee**: Varies based on plan

## 🚀 Usage Example

1. Paste: `https://www.linkedin.com/jobs/view/4227647589/`
2. Click "Generate Battle Cards"
3. Wait for the 45-second loader (or until Apify finishes)
4. See two debug buttons:
   - **Debug: Scraped Data** - The original job
   - **Job Data (50 JOBS)** - Similar jobs on LinkedIn

## 🛠️ Technical Details

### API Route
- Location: `src/app/api/scrape-job/route.ts`
- Calls Apify actor: `zn01OAlzP853oqn4Z`
- Timeout: 3 minutes
- Returns up to 50 similar jobs

### Components
- Hero Section: `src/app/modules/landing-page/ui/components/home-hero-section.tsx`
- Two collapsible debug panels
- Responsive design
- Beautiful job cards with company logos

## ⚠️ Troubleshooting

### No Similar Jobs Found
- Check that APIFY_API_KEY is set in .env.local
- Verify the Apify actor is accessible
- Check console for error messages

### Slow Loading
- Apify can take 1-3 minutes to search LinkedIn
- Loader stays visible for minimum 45 seconds
- Check your Apify account for rate limits

### API Errors
- Verify all API keys are correct
- Check Apify dashboard for quota/credits
- Review console logs for detailed errors

## 📊 Data Structure

### Scraped Job Data
```typescript
{
  title: string;
  company: string;
  location: string;
  salary: string;
  experienceLevel: string;
  employmentType: string;
  skills: string[];
  // ... more fields
}
```

### Similar Jobs Data
```typescript
{
  id: string;
  title: string;
  linkedinUrl: string;
  company: { name, logo, employeeCount };
  location: { linkedinText, parsed };
  salary: { text, min, max, currency };
  employmentType: string;
  workplaceType: string;
  applicants: number;
  views: number;
  benefits: string[];
}
```

## 🎯 Next Steps

- Add filtering/sorting for similar jobs
- Export similar jobs to CSV
- Compare salaries across jobs
- Show job posting trends
- Add more search filters

---

**Need help?** Check the Apify actor documentation: https://console.apify.com/actors/zn01OAlzP853oqn4Z
