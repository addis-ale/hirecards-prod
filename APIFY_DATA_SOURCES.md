# Apify Data Sources Documentation

This document lists all data sources that the application scrapes using Apify actors, including the actor IDs/usernames and what data they provide.

---

## Overview

The application uses **Apify** (https://apify.com) to scrape data from various job boards and professional networks. All scraping requires an `APIFY_API_KEY` environment variable.

---

## Data Sources & Apify Actors

### 1. **LinkedIn Jobs** 
**Purpose:** Find similar job postings for market analysis

**Actor ID:** `zn01OAlzP853oqn4Z`  
**Actor Name:** LinkedIn Jobs Scraper (Custom/Private Actor)  
**Location:** `src/app/api/scrape-job/route.ts`  
**Function:** `searchSimilarJobsOnLinkedIn()`

**Data Scraped:**
- Job titles
- Company names
- Locations
- Job descriptions
- Posted dates
- Salary information (if available)
- Employment type
- Experience level

**Usage:**
- Used in Market Card generation
- Provides market intelligence for similar roles
- Helps calculate market tightness

---

### 2. **Indeed Jobs**
**Purpose:** Find similar job postings on Indeed

**Actor ID:** `MXLpngmVpE8WTESQr`  
**Actor Name:** Indeed Job Scraper (PPR)  
**Location:** `src/app/api/scrape-job/route.ts`  
**Function:** `searchSimilarJobsOnIndeed()`

**Data Scraped:**
- Job titles
- Company names
- Locations
- Job descriptions
- Salary ranges
- Job URLs
- Posted dates

**Usage:**
- Used in Market Card generation
- Provides additional job market data
- Combined with LinkedIn data for comprehensive market analysis

---

### 3. **Glassdoor Jobs**
**Purpose:** Find similar jobs and salary data from Glassdoor

**Actor ID:** `bebity/glassdoor-jobs-scraper`  
**Actor Username:** `bebity`  
**Actor Name:** Glassdoor Jobs Scraper  
**Location:** 
- `src/app/api/scrape-job/route.ts` (for similar jobs)
- `src/app/api/scrape-job/dataSources.ts` (for salary data)

**Functions:**
- `searchSimilarJobsOnGlassdoor()` (route.ts)
- `scrapeGlassdoorSalaries()` (dataSources.ts)

**Data Scraped:**
- Job postings with salary information
- Company details
- Location data
- Salary ranges (min, max, median)
- Review counts
- Job descriptions

**Usage:**
- Used in Pay Card generation
- Provides salary benchmarks
- Market analysis for similar roles

---

### 4. **LinkedIn People Search**
**Purpose:** Find candidate profiles matching the job requirements

**Actor ID:** `M2FMdjRVeF1HPGFcc`  
**Actor Name:** LinkedIn Profile Search Mass Scraper  
**Location:** `src/app/api/scrape-job/route.ts`  
**Function:** `searchCandidatesWithApify()`

**Data Scraped:**
- Candidate profiles
- Current company
- Job titles
- Locations
- Profile URLs
- Experience information
- Skills (if available)

**Usage:**
- Used in Talent Map Card generation
- Provides candidate sourcing data
- Shows where talent comes from (companies)

---


## Summary Table

| Data Source | Actor ID/Username | Purpose | Used In |
|------------|------------------|---------|---------|
| **LinkedIn Jobs** | `zn01OAlzP853oqn4Z` | Similar job postings | Market Card |
| **Indeed Jobs** | `MXLpngmVpE8WTESQr` | Similar job postings | Market Card |
| **Glassdoor Jobs** | `bebity/glassdoor-jobs-scraper` | Jobs + Salary data | Pay Card, Market Card |
| **LinkedIn People** | `M2FMdjRVeF1HPGFcc` | Candidate profiles | Talent Map Card |

---

## Actor Usernames

1. **`bebity`** - Glassdoor Jobs Scraper
2. **Custom/Private Actors:**
   - `zn01OAlzP853oqn4Z` - LinkedIn Jobs Scraper
   - `MXLpngmVpE8WTESQr` - Indeed Job Scraper
   - `M2FMdjRVeF1HPGFcc` - LinkedIn Profile Search

---

## Configuration

All Apify actors require:
- **Environment Variable:** `APIFY_API_KEY`
- **Location:** Set in `.env` file or environment variables

If `APIFY_API_KEY` is not configured:
- Functions return empty arrays `[]` or `null`
- No scraping occurs
- Cards will not have external data

---

## Notes

1. **Private Actors:** Some actors use ID-based references (like `zn01OAlzP853oqn4Z`) which are private/custom actors. These may require specific access.

2. **No Estimates:** As of the latest update, all hardcoded estimates have been removed. If scraping fails, functions return `null` or empty arrays instead of fake data.

3. **Timeout Settings:**
   - LinkedIn Jobs: 180 seconds (3 minutes)
   - Indeed Jobs: 180 seconds (3 minutes)
   - Glassdoor Jobs: 120 seconds (2 minutes)
   - LinkedIn People: 180 seconds (3 minutes)

---

## Data Flow

```
Job Description URL
    ↓
ScrapingBee (Scrapes job posting)
    ↓
Apify Actors (Scrape external data)
    ├─ LinkedIn Jobs → Market Card
    ├─ Indeed Jobs → Market Card
    ├─ Glassdoor Jobs → Pay Card + Market Card
    └─ LinkedIn People → Talent Map Card
    ↓
AI Card Generation
    ↓
Frontend Display
```

---

## Future Improvements

- Consider caching scraped data to reduce API calls
- Add more data sources for comprehensive market analysis
- Implement retry logic for failed scraping attempts

