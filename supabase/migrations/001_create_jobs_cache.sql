-- Create jobs_cache table for caching scraped job data and generated cards

CREATE TABLE IF NOT EXISTS jobs_cache (
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
  normalized_location TEXT,                         -- For fuzzy matching

  -- Scraped Data (from ScrapingBee)
  scraped_data JSONB,                               -- Full scraped job data
  scraped_at TIMESTAMP,

  -- AI Extracted Data
  ai_extracted_data JSONB,                          -- AI extraction results
  ai_extracted_at TIMESTAMP,

  -- External Data (from Apify)
  similar_jobs JSONB,                               -- Similar jobs array
  similar_jobs_count INTEGER DEFAULT 0,
  candidates JSONB,                                 -- Candidate profiles
  candidates_count INTEGER DEFAULT 0,
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
  access_count INTEGER DEFAULT 0
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_job_url_hash ON jobs_cache(job_url_hash);
CREATE INDEX IF NOT EXISTS idx_composite_key ON jobs_cache(composite_key);
CREATE INDEX IF NOT EXISTS idx_company_title ON jobs_cache(company, job_title);
CREATE INDEX IF NOT EXISTS idx_updated_at ON jobs_cache(updated_at);
CREATE INDEX IF NOT EXISTS idx_last_accessed_at ON jobs_cache(last_accessed_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_jobs_cache_updated_at
  BEFORE UPDATE ON jobs_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

