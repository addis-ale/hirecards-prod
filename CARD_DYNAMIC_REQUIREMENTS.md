# Card Dynamic Requirements

This document explains why some cards may not be dynamic and what requirements they need to generate.

## Cards That May Not Be Dynamic

### 1. **Talent Map Card** 🗺️

**Why it might not be dynamic:**
- Requires LinkedIn candidate data from Apify People Search

**Requirements:**
- ✅ `candidates.length > 0` (at least 1 LinkedIn candidate profile)
- ✅ Apify API key configured (`APIFY_API_KEY`)
- ✅ Apify People Search actor working (`M2FMdjRVeF1HPGFcc`)

**Generation Condition:**
```typescript
if (candidates.length > 0) {
  const talentMapCard = await generateTalentMapCard(candidates);
}
```

**What happens if requirements not met:**
- Card is not generated (`peopleAnalysisCards = null`)
- Card shows static/placeholder data in UI

**How to make it dynamic:**
1. Ensure Apify API key is configured
2. Ensure job title and location are available for candidate search
3. Wait for Apify People Search to complete (can take 1-3 minutes)
4. Need at least 1 candidate profile returned

---

### 2. **Funnel Card** 📊

**Why it might not be dynamic:**
- Requires industry benchmarks data
- Requires Market Card to be generated first

**Requirements:**
- ✅ `marketCard` must be generated (from Market Card)
- ✅ `benchmarks` must be available (industry benchmarks from `dataSources`)
- ✅ Market Card generation must succeed

**Generation Condition:**
```typescript
if (similarJobs.length > 0 || candidates.length > 0 || dataSources) {
  const marketCard = await generateMarketCard(...);
  const funnelCard = await generateFunnelCard(marketCard, benchmarks);
}
```

**Inside `generateFunnelCard`:**
```typescript
if (!benchmarks) {
  console.warn("⚠️ No benchmark data available, cannot generate Funnel Card");
  return null; // Card is NOT generated
}
```

**What happens if requirements not met:**
- If `benchmarks` is `null`, Funnel Card returns `null`
- Card shows static/placeholder data in UI

**How to make it dynamic:**
1. Ensure `scrapeIndustryBenchmarks()` returns valid data
2. Ensure Market Card is generated successfully
3. Industry benchmarks are fetched from `dataSources.benchmarks`

**Note:** Currently, `scrapeIndustryBenchmarks()` may return `null` if Apify is not configured or scraping fails.

---

### 3. **Reality Card** 🎯

**Why it might not be dynamic:**
- Requires ALL other cards to be generated first
- Depends on: Role Card, Skill Card, Market Card, Pay Card, Funnel Card

**Requirements:**
- ✅ `roleCard` must be generated
- ✅ `skillCard` must be generated
- ✅ `marketCard` must be generated
- ✅ `payCard` must be generated
- ✅ `funnelCard` must be generated (this is the bottleneck!)

**Generation Condition:**
```typescript
const allCardsForReality = { 
  roleCard, 
  skillCard, 
  marketCard, 
  payCard, 
  funnelCard 
};
const realityCard = await generateRealityCard(allCardsForReality);
```

**What happens if requirements not met:**
- If any required card is `null`, Reality Card may still generate but with incomplete data
- Card shows static/placeholder data in UI

**How to make it dynamic:**
1. Ensure all prerequisite cards are generated:
   - Role Card ✅ (always generated)
   - Skill Card ✅ (always generated)
   - Market Card ✅ (needs similarJobs or candidates)
   - Pay Card ✅ (needs similarJobs)
   - Funnel Card ⚠️ (needs benchmarks - this is the issue!)

2. **The main blocker:** Funnel Card needs benchmarks, so if benchmarks are not available, Funnel Card is `null`, which means Reality Card gets incomplete data.

---

## Summary: Why Cards Are Not Dynamic

| Card | Main Blocker | Solution |
|------|-------------|----------|
| **Talent Map** | No candidates from Apify | Configure Apify API key, ensure candidate search runs |
| **Funnel** | No industry benchmarks | Ensure `scrapeIndustryBenchmarks()` returns data |
| **Reality** | Depends on Funnel Card | Fix Funnel Card first (needs benchmarks) |

---

## Current Data Flow

```
1. Job Scraping ✅
   ↓
2. AI Extraction ✅
   ↓
3. Apify Searches (if configured):
   ├─ Similar Jobs (LinkedIn/Indeed) → for Market & Pay Cards
   ├─ Candidates (LinkedIn) → for Talent Map Card
   └─ Industry Benchmarks → for Funnel Card ⚠️
   ↓
4. Card Generation:
   ├─ Group 1: Role, Skill, Fit, Message, Outreach ✅
   ├─ Group 2: Talent Map (needs candidates) ⚠️
   ├─ Group 3: Market, Pay, Funnel (needs benchmarks), Reality (needs all) ⚠️
   └─ Group 4: Interview, Scorecard, Plan ✅
```

---

## Quick Fix: Make All Cards Dynamic

### Option 1: Ensure Apify is Configured
```bash
# In .env.local
APIFY_API_KEY=your_apify_key_here
```

### Option 2: Provide Fallback Benchmarks
If benchmarks are not available, provide default/estimated benchmarks so Funnel Card can still generate.

### Option 3: Make Funnel Card Work Without Benchmarks
Modify `generateFunnelCard()` to use estimated benchmarks if real data is not available (but this goes against the "no hardcoded data" requirement).

---

## Debugging: Check if Cards Are Generated

1. **Check browser console** for these logs:
   - `✅ People Analysis Cards complete` → Talent Map generated
   - `✅ Combined Analysis Cards complete` → Market, Pay, Funnel, Reality generated
   - `⚠️ No benchmark data available` → Funnel Card NOT generated
   - `⚠️ No candidates found` → Talent Map Card NOT generated

2. **Check sessionStorage:**
   ```javascript
   const data = JSON.parse(sessionStorage.getItem("scrapedJobData"));
   console.log("Talent Map:", data.peopleAnalysisCards?.talentMapCard);
   console.log("Funnel:", data.combinedAnalysisCards?.funnelCard);
   console.log("Reality:", data.combinedAnalysisCards?.realityCard);
   ```

3. **Check API response:**
   - Look at Network tab → `/api/scrape-job` response
   - Check `peopleAnalysisCards`, `combinedAnalysisCards` fields

