# Job Caching & Database Strategy

This document outlines how to implement a database cache to avoid re-scraping and re-generating cards for the same job.

---

## 🎯 GOAL

Avoid re-scraping from Apify and re-generating AI cards when we've already processed the same job.

---

## 🔑 UNIQUE IDENTIFIER STRATEGY

### Option 1: Job URL (Primary Key) ⭐ **RECOMMENDED**

**Pros:**

- ✅ Most unique identifier
- ✅ Easy to check (exact match)
- ✅ Works for all platforms

**Cons:**

- ⚠️ Same job posted on multiple platforms = multiple entries
- ⚠️ URL might change if job is reposted

**Implementation:**

```typescript
// Hash the URL for consistent key
const jobKey = hashURL(jobURL);
// Example: "linkedin.com/jobs/view/123456" → "abc123def456"
```

### Option 2: Composite Key (Company + Title + Location)

**Pros:**

- ✅ Identifies same job across platforms
- ✅ Handles reposts with different URLs

**Cons:**

- ⚠️ More complex matching logic
- ⚠️ False positives (different jobs with same title at same company)
- ⚠️ Location variations ("SF" vs "San Francisco")

**Implementation:**

```typescript
const jobKey = `${normalizeCompany(company)}_${normalizeTitle(
  title
)}_${normalizeLocation(location)}`;
// Example: "google_senior-software-engineer_san-francisco-ca"
```

### Option 3: Hybrid Approach ⭐ **BEST**

**Use both:**

1. **Primary lookup:** Job URL (fast, exact match)
2. **Fallback lookup:** Composite key (if URL not found, check for similar job)

**Implementation:**

```typescript
// First try URL
let cached = await db.getByURL(jobURL);

// If not found, try composite key
if (!cached) {
  cached = await db.getByCompositeKey(company, title, location);
}
```

---

## 📊 DATABASE SCHEMA

### Table: `jobs_cache`

```sql
CREATE TABLE jobs_cache (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Unique Identifiers
  job_url TEXT UNIQUE NOT NULL,                    -- Primary lookup
  job_url_hash TEXT UNIQUE NOT NULL,                -- Hashed for indexing
  composite_key TEXT NOT NULL,                      -- For fallback lookup
  platform TEXT NOT NULL,                           -- linkedin, indeed, etc.

  -- Job Metadata (for matching)
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT,
  normalized_title TEXT,                            -- For fuzzy matching
  normalized_location TEXT,                          -- For fuzzy matching

  -- Scraped Data (from ScrapingBee)
  scraped_data JSONB,                               -- Full scraped job data
  scraped_at TIMESTAMP,

  -- AI Extracted Data
  ai_extracted_data JSONB,                          -- AI extraction results
  ai_extracted_at TIMESTAMP,

  -- External Data (from Apify)
  similar_jobs JSONB,                               -- Similar jobs array
  similar_jobs_count INTEGER,
  candidates JSONB,                                 -- Candidate profiles
  candidates_count INTEGER,
  salary_data JSONB,                                -- Glassdoor salary data
  external_data_fetched_at TIMESTAMP,

  -- Generated Cards
  job_analysis_cards JSONB,                         -- Role, Skill, Fit, Message, Outreach
  people_analysis_cards JSONB,                      -- Talent Map
  combined_analysis_cards JSONB,                    -- Market, Pay, Funnel, Reality
  derived_strategy_cards JSONB,                     -- Interview, Scorecard, Plan
  cards_generated_at TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  access_count INTEGER DEFAULT 0,

  -- Indexes
  INDEX idx_job_url_hash (job_url_hash),
  INDEX idx_composite_key (composite_key),
  INDEX idx_company_title (company, job_title),
  INDEX idx_updated_at (updated_at),
  INDEX idx_last_accessed_at (last_accessed_at)
);
```

---

## 🔍 MATCHING LOGIC

### Step 1: Exact URL Match

```typescript
async function findCachedJob(jobURL: string) {
  const urlHash = hashURL(jobURL);
  return await db.query("SELECT * FROM jobs_cache WHERE job_url_hash = $1", [
    urlHash,
  ]);
}
```

### Step 2: Composite Key Match (Fallback)

```typescript
async function findCachedJobByComposite(
  company: string,
  title: string,
  location: string
) {
  const compositeKey = generateCompositeKey(company, title, location);
  return await db.query("SELECT * FROM jobs_cache WHERE composite_key = $1", [
    compositeKey,
  ]);
}
```

### Step 3: Fuzzy Match (Optional - for similar jobs)

```typescript
async function findSimilarCachedJob(
  company: string,
  title: string,
  location: string
) {
  const normalizedTitle = normalizeTitle(title);
  const normalizedLocation = normalizeLocation(location);

  return await db.query(
    `SELECT * FROM jobs_cache 
     WHERE normalized_title = $1 
     AND normalized_location = $2 
     AND company ILIKE $3
     AND updated_at > NOW() - INTERVAL '30 days'
     ORDER BY updated_at DESC
     LIMIT 1`,
    [normalizedTitle, normalizedLocation, `%${company}%`]
  );
}
```

---

## 🛠️ NORMALIZATION FUNCTIONS

### Normalize Job Title

```typescript
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to one
    .trim();
}

// Examples:
// "Senior Software Engineer" → "senior-software-engineer"
// "Sr. Software Engineer" → "sr-software-engineer"
// "Software Engineer (Senior)" → "software-engineer-senior"
```

### Normalize Location

```typescript
function normalizeLocation(location: string): string {
  return location
    .toLowerCase()
    .replace(/[^a-z0-9\s,]/g, "") // Remove special chars
    .replace(/\s*,\s*/g, "-") // Commas to hyphens
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to one
    .trim();
}

// Examples:
// "San Francisco, CA" → "san-francisco-ca"
// "SF, California" → "sf-california"
// "Remote" → "remote"
```

### Normalize Company

```typescript
function normalizeCompany(company: string): string {
  return company
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to one
    .trim();
}

// Examples:
// "Google LLC" → "google-llc"
// "Google, Inc." → "google-inc"
```

### Generate Composite Key

```typescript
function generateCompositeKey(
  company: string,
  title: string,
  location?: string
): string {
  const normalizedCompany = normalizeCompany(company);
  const normalizedTitle = normalizeTitle(title);
  const normalizedLocation = location
    ? normalizeLocation(location)
    : "no-location";

  return `${normalizedCompany}_${normalizedTitle}_${normalizedLocation}`;
}

// Example:
// generateCompositeKey("Google", "Senior Software Engineer", "San Francisco, CA")
// → "google_senior-software-engineer_san-francisco-ca"
```

---

## 💾 CACHING STRATEGY

### What to Cache

#### ✅ Always Cache (Long-term)

- **Scraped Data** (from ScrapingBee) - Valid for 30-90 days
- **AI Extracted Data** - Valid for 30-90 days
- **Generated Cards** - Valid for 30-90 days

#### ⚠️ Cache with Expiration (Short-term)

- **Similar Jobs** (from Apify) - Valid for 7-14 days (market changes)
- **Candidates** (from Apify) - Valid for 7-14 days (people move jobs)
- **Salary Data** (from Apify) - Valid for 30 days (salaries change slowly)

#### ❌ Don't Cache

- Real-time data that changes frequently
- User-specific data

### Cache Invalidation Rules

```typescript
interface CacheValidity {
  scrapedData: number; // 90 days
  aiExtracted: number; // 90 days
  similarJobs: number; // 14 days
  candidates: number; // 14 days
  salaryData: number; // 30 days
  generatedCards: number; // 90 days
}

const CACHE_VALIDITY: CacheValidity = {
  scrapedData: 90 * 24 * 60 * 60 * 1000, // 90 days
  aiExtracted: 90 * 24 * 60 * 60 * 1000, // 90 days
  similarJobs: 14 * 24 * 60 * 60 * 1000, // 14 days
  candidates: 14 * 24 * 60 * 60 * 1000, // 14 days
  salaryData: 30 * 24 * 60 * 60 * 1000, // 30 days
  generatedCards: 90 * 24 * 60 * 60 * 1000, // 90 days
};

function isCacheValid(cachedData: any, dataType: keyof CacheValidity): boolean {
  const validityPeriod = CACHE_VALIDITY[dataType];
  const cacheAge = Date.now() - new Date(cachedData.updated_at).getTime();
  return cacheAge < validityPeriod;
}
```

---

## 🔄 CACHE LOOKUP FLOW

```typescript
async function getOrScrapeJob(jobURL: string) {
  // Step 1: Try exact URL match
  let cached = await findCachedJob(jobURL);

  if (cached) {
    // Step 2: Check if scraped data is still valid
    if (isCacheValid(cached, "scrapedData")) {
      console.log("✅ Using cached scraped data");

      // Step 3: Check if external data needs refresh
      const needsExternalRefresh =
        !isCacheValid(cached, "similarJobs") ||
        !isCacheValid(cached, "candidates") ||
        !isCacheValid(cached, "salaryData");

      if (needsExternalRefresh) {
        console.log("⚠️ External data expired, refreshing...");
        // Only refresh external data (Apify), keep scraped data
        const externalData = await fetchExternalData(cached.scraped_data);
        await updateCache(cached.id, { externalData });
      }

      // Step 4: Check if cards need regeneration
      const needsCardRegeneration =
        !isCacheValid(cached, "generatedCards") || needsExternalRefresh;

      if (needsCardRegeneration) {
        console.log("⚠️ Cards expired, regenerating...");
        const cards = await generateCards(
          cached.scraped_data,
          cached.externalData
        );
        await updateCache(cached.id, { cards });
      }

      // Update access metadata
      await updateAccessMetadata(cached.id);

      return {
        scrapedData: cached.scraped_data,
        externalData: cached.externalData,
        cards: cached.cards,
        fromCache: true,
      };
    }
  }

  // Step 5: If not cached or expired, do full scrape
  console.log("🔄 Cache miss, performing full scrape...");
  const result = await performFullScrape(jobURL);

  // Step 6: Save to cache
  await saveToCache(jobURL, result);

  return {
    ...result,
    fromCache: false,
  };
}
```

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup

- [ ] Create `jobs_cache` table
- [ ] Add indexes for fast lookups
- [ ] Set up database connection (Supabase/PostgreSQL)

### Phase 2: Normalization Functions

- [ ] Implement `normalizeTitle()`
- [ ] Implement `normalizeLocation()`
- [ ] Implement `normalizeCompany()`
- [ ] Implement `generateCompositeKey()`
- [ ] Implement `hashURL()`

### Phase 3: Cache Lookup

- [ ] Implement `findCachedJob()` (URL lookup)
- [ ] Implement `findCachedJobByComposite()` (fallback)
- [ ] Implement `isCacheValid()` (expiration check)

### Phase 4: Cache Storage

- [ ] Implement `saveToCache()` (new entries)
- [ ] Implement `updateCache()` (partial updates)
- [ ] Implement `updateAccessMetadata()` (track usage)

### Phase 5: Integration

- [ ] Modify `/api/scrape-job` to check cache first
- [ ] Add cache hit/miss logging
- [ ] Add cache statistics endpoint

### Phase 6: Cache Management

- [ ] Implement cache cleanup (delete old entries)
- [ ] Add cache warming (pre-populate popular jobs)
- [ ] Add cache invalidation API (manual refresh)

---

## 🎯 RECOMMENDED APPROACH

### Primary Strategy: **URL-Based Caching**

1. **Use Job URL as primary key** (most reliable)
2. **Store composite key for fallback** (handle reposts)
3. **Cache everything for 90 days** (scraped + cards)
4. **Refresh external data every 14 days** (Apify data)
5. **Regenerate cards if external data refreshed**

### Benefits:

- ✅ Fast lookups (O(1) with hash index)
- ✅ Handles same job on multiple platforms
- ✅ Reduces Apify costs significantly
- ✅ Faster response times for cached jobs
- ✅ Reduces AI API costs (card generation)

### Example Flow:

```
User submits: "https://linkedin.com/jobs/view/123456"
  ↓
Check cache by URL hash
  ↓
Found? → Check expiration
  ↓
Valid? → Return cached data ✅
  ↓
Expired? → Refresh only expired parts
  ↓
Not found? → Full scrape → Save to cache
```

---

## 📊 EXPECTED IMPROVEMENTS

### Cost Reduction

- **Apify API calls:** 80-90% reduction (only new jobs)
- **AI API calls:** 80-90% reduction (only new jobs)
- **ScrapingBee calls:** 80-90% reduction (only new jobs)

### Performance

- **Response time:** 50-200ms (cached) vs 30-60s (full scrape)
- **User experience:** Instant results for popular jobs

### Database Size

- **Estimate:** ~50-100KB per job (with all data)
- **10,000 jobs:** ~500MB - 1GB
- **100,000 jobs:** ~5GB - 10GB

---

## 🔧 QUICK START

### 1. Add to `.env.local`

```bash
DATABASE_URL=your_supabase_or_postgres_url
```

### 2. Create Migration

```sql
-- Run this in your database
CREATE TABLE jobs_cache (...);  -- See schema above
```

### 3. Modify `route.ts`

```typescript
// Before scraping
const cached = await getCachedJob(jobURL);
if (cached && isCacheValid(cached)) {
  return NextResponse.json(cached);
}

// After scraping
await saveToCache(jobURL, result);
```

---

This strategy will significantly reduce costs and improve performance! 🚀
