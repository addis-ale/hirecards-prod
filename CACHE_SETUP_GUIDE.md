# Job Cache Setup Guide

This guide explains how to set up the job caching system to avoid re-scraping and re-generating cards.

---

## 🎯 What It Does

The caching system:
- ✅ Caches scraped job data (90 days)
- ✅ Caches AI-extracted data (90 days)
- ✅ Caches all generated cards (90 days)
- ✅ Caches external data from Apify (14-30 days)
- ✅ Returns cached data instantly if still valid
- ✅ Only refreshes expired parts (not everything)

---

## 📋 Prerequisites

1. **Supabase Project** (or PostgreSQL database)
2. **Environment Variables** configured

---

## 🔧 Setup Steps

### Step 1: Configure Environment Variables

Add to your `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Step 2: Run Database Migration

**Option A: Using Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_create_jobs_cache.sql`
4. Paste and run the SQL

**Option B: Using Supabase CLI**

```bash
supabase migration up
```

**Option C: Manual SQL**

Run the SQL from `supabase/migrations/001_create_jobs_cache.sql` in your database.

### Step 3: Verify Table Creation

Check that the table was created:

```sql
SELECT * FROM jobs_cache LIMIT 1;
```

You should see the table structure (even if empty).

---

## 🚀 How It Works

### Cache Lookup Flow

```
1. User submits job URL
   ↓
2. Check cache by URL hash
   ↓
3. Found? → Check expiration
   ↓
4. All valid? → Return cached data ✅ (50-200ms)
   ↓
5. Some expired? → Refresh only expired parts
   ↓
6. Not found? → Full scrape → Save to cache
```

### What Gets Cached

- ✅ **Scraped Data** (from ScrapingBee) - 90 days
- ✅ **AI Extracted Data** - 90 days
- ✅ **Similar Jobs** (from Apify) - 14 days
- ✅ **Candidates** (from Apify) - 14 days
- ✅ **Salary Data** (from Apify) - 30 days
- ✅ **All Generated Cards** - 90 days

---

## 📊 Expected Results

### Performance
- **First request:** 30-60 seconds (full scrape)
- **Cached requests:** 50-200ms (instant)

### Cost Reduction
- **Apify calls:** 80-90% reduction
- **AI API calls:** 80-90% reduction
- **ScrapingBee calls:** 80-90% reduction

### Database Size
- **Per job:** ~50-100KB
- **10,000 jobs:** ~500MB - 1GB
- **100,000 jobs:** ~5GB - 10GB

---

## 🔍 Testing

### Test Cache Hit

1. Submit a job URL: `https://linkedin.com/jobs/view/123456`
2. Wait for first scrape (30-60s)
3. Submit the same URL again
4. Should return instantly from cache ✅

### Test Cache Miss

1. Submit a new job URL (never seen before)
2. Should perform full scrape
3. Should save to cache

### Check Cache Status

```sql
-- See all cached jobs
SELECT 
  job_url,
  company,
  job_title,
  location,
  cards_generated_at,
  last_accessed_at,
  access_count
FROM jobs_cache
ORDER BY last_accessed_at DESC
LIMIT 10;
```

---

## 🛠️ Troubleshooting

### Issue: "Supabase not configured"

**Solution:** Ensure environment variables are set:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Issue: "Table does not exist"

**Solution:** Run the migration SQL manually in Supabase dashboard.

### Issue: Cache not working

**Check:**
1. Database connection is working
2. Table exists: `SELECT * FROM jobs_cache LIMIT 1;`
3. Environment variables are loaded
4. Check browser console for cache logs

### Issue: Old data being returned

**Solution:** This is expected if data is still within validity period. To force refresh:
- Wait for expiration (14-90 days depending on data type)
- Or manually delete from cache:
  ```sql
  DELETE FROM jobs_cache WHERE job_url = 'your-url';
  ```

---

## 📝 Cache Management

### View Cache Statistics

```sql
-- Total cached jobs
SELECT COUNT(*) FROM jobs_cache;

-- Most accessed jobs
SELECT 
  job_url,
  company,
  job_title,
  access_count,
  last_accessed_at
FROM jobs_cache
ORDER BY access_count DESC
LIMIT 10;

-- Cache age distribution
SELECT 
  CASE 
    WHEN updated_at > NOW() - INTERVAL '7 days' THEN '0-7 days'
    WHEN updated_at > NOW() - INTERVAL '30 days' THEN '7-30 days'
    WHEN updated_at > NOW() - INTERVAL '90 days' THEN '30-90 days'
    ELSE '90+ days'
  END as age_group,
  COUNT(*) as count
FROM jobs_cache
GROUP BY age_group;
```

### Clean Up Old Cache

```sql
-- Delete entries older than 90 days
DELETE FROM jobs_cache 
WHERE updated_at < NOW() - INTERVAL '90 days';
```

### Manual Cache Invalidation

```sql
-- Delete specific job from cache
DELETE FROM jobs_cache WHERE job_url = 'https://linkedin.com/jobs/view/123456';

-- Delete all cache
TRUNCATE TABLE jobs_cache;
```

---

## ✅ Verification Checklist

- [ ] Environment variables configured
- [ ] Database migration run successfully
- [ ] `jobs_cache` table exists
- [ ] First job scrape works
- [ ] Second request (same URL) returns from cache
- [ ] Cache save logs appear in console
- [ ] Cache lookup logs appear in console

---

## 🎉 Success Indicators

You'll know it's working when:

1. **First request:** Console shows `🔄 Cache miss, performing full scrape...`
2. **Second request:** Console shows `✅ All cached data is valid, returning from cache`
3. **Response time:** Second request is < 200ms
4. **Database:** `jobs_cache` table has entries

---

That's it! Your caching system is now set up and will significantly reduce costs and improve performance! 🚀

