# How to Add a New Apify Actor

This guide shows you how to add a new Apify actor to scrape data from additional sources.

## Step 1: Add Actor to APIFY_ACTORS Constant

In `src/app/api/scrape-job/dataSources.ts`, add your new actor to the `APIFY_ACTORS` object:

```typescript
// Apify Actor IDs
const APIFY_ACTORS = {
  webScraper: "apify/web-scraper",
  glassdoorJobs: "bebity/glassdoor-jobs-scraper",
  crunchbase: "curious_coder/crunchbase-scraper",
  levelsFyi: "apify/web-scraper",
  // 👇 ADD YOUR NEW ACTOR HERE
  yourNewActor: "username/actor-name", // Replace with actual actor ID
};
```

**Finding Actor IDs:**

- Go to [Apify Store](https://apify.com/store)
- Search for the actor you want to use
- The actor ID is in the format: `username/actor-name`
- Example: `bebity/glassdoor-jobs-scraper`

## Step 2: Create a Scraping Function

Create a new async function that uses your actor. Here are two patterns:

### Pattern A: Using a Dedicated Actor (like Glassdoor)

```typescript
/**
 * Scrape data from [Your Source] using Apify
 */
export async function scrapeYourSource(
  param1: string,
  param2: string
): Promise<YourDataType[]> {
  // Check if Apify is configured
  if (!apifyClient) {
    console.warn("⚠️ APIFY_API_KEY not configured, returning estimated data");
    return generateEstimatedData(param1, param2);
  }

  try {
    console.log("🔍 Scraping [Your Source] via Apify for:", param1);

    // Call the Apify actor
    const run = await apifyClient.actor(APIFY_ACTORS.yourNewActor).call(
      {
        // 👇 Configure actor input parameters
        // Check the actor's documentation for required parameters
        keyword: param1,
        location: param2,
        maxItems: 10,
        // ... other parameters
      },
      {
        timeout: 60, // 60 seconds timeout
      }
    );

    // Get results from the dataset
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    if (items && items.length > 0) {
      // Parse and transform the data
      const parsedData = items.map((item: any) => {
        return {
          // Transform Apify output to your data structure
          field1: item.field1,
          field2: item.field2,
          source: "[Your Source] (via Apify)",
        };
      });

      console.log(`✅ Found ${parsedData.length} items from [Your Source]`);
      return parsedData;
    }

    // Fallback if no results
    return generateEstimatedData(param1, param2);
  } catch (error: any) {
    console.error("❌ [Your Source] Apify scraping error:", error.message);
    return generateEstimatedData(param1, param2);
  }
}
```

### Pattern B: Using Web Scraper (for custom websites)

```typescript
/**
 * Scrape data from a custom website using Apify web scraper
 */
export async function scrapeCustomWebsite(
  url: string,
  jobTitle: string
): Promise<YourDataType[]> {
  if (!apifyClient) {
    console.warn("⚠️ APIFY_API_KEY not configured");
    return generateEstimatedData(jobTitle, "");
  }

  try {
    console.log("🔍 Scraping custom website via Apify:", url);

    // Use web scraper with custom pageFunction
    const run = await apifyClient.actor(APIFY_ACTORS.webScraper).call(
      {
        startUrls: [{ url }],
        pageFunction: `
          async function pageFunction(context) {
            const { page, request } = context;
            
            // Wait for page to load
            await page.waitForSelector('body', { timeout: 10000 });
            
            // Extract data from the page
            const data = await page.evaluate(() => {
              // Use DOM selectors to extract data
              const title = document.querySelector('.job-title')?.textContent;
              const salary = document.querySelector('.salary')?.textContent;
              
              return {
                title: title,
                salary: salary,
                url: window.location.href
              };
            });
            
            return data;
          }
        `,
        waitFor: 3000, // Wait 3 seconds after page load
      },
      {
        timeout: 60,
      }
    );

    // Get results
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    if (items && items.length > 0) {
      // Parse the scraped data
      const parsedData = items.map((item: any) => ({
        // Transform to your data structure
        jobTitle: item.title,
        salary: item.salary,
        source: "Custom Website (via Apify)",
      }));

      return parsedData;
    }

    return generateEstimatedData(jobTitle, "");
  } catch (error: any) {
    console.error("❌ Custom website scraping error:", error.message);
    return generateEstimatedData(jobTitle, "");
  }
}
```

## Step 3: Define Your Data Interface

Add a TypeScript interface for your data structure:

```typescript
export interface YourDataType {
  field1: string;
  field2: number;
  field3?: string; // Optional field
  source: string;
}
```

## Step 4: Create Fallback Function (Optional but Recommended)

Create a fallback function that returns estimated data when scraping fails:

```typescript
function generateEstimatedData(param1: string, param2: string): YourDataType[] {
  // Return estimated/default data
  return [
    {
      field1: param1,
      field2: 0,
      source: "Estimated (fallback)",
    },
  ];
}
```

## Step 5: Integrate into fetchAllDataSources (Optional)

If you want your new data source to be automatically fetched, add it to `fetchAllDataSources()`:

```typescript
export async function fetchAllDataSources(
  jobTitle: string,
  company: string,
  location: string,
  skills: string[],
  industry: string = "technology"
): Promise<AggregatedDataSources> {
  // ... existing code ...

  // Fetch all sources in parallel
  const [
    glassdoorSalaries,
    levelsFyiSalaries,
    companyData,
    githubTalent,
    yourNewData, // 👇 Add your new data source
  ] = await Promise.all([
    scrapeGlassdoorSalaries(jobTitle, location, company),
    scrapeLevelsFyiSalaries(jobTitle, location, [company]),
    scrapeCrunchbaseCompany(company),
    searchGitHubTalent(skills.slice(0, 3), location),
    scrapeYourSource(jobTitle, location), // 👇 Call your new function
  ]);

  // ... rest of the function ...
}
```

## Step 6: Update AggregatedDataSources Interface

If you added it to `fetchAllDataSources`, update the interface:

```typescript
export interface AggregatedDataSources {
  glassdoorSalaries: GlassdoorSalaryData[];
  levelsFyiSalaries: LevelsFyiSalaryData[];
  companyData: CrunchbaseCompanyData | null;
  githubTalent: GitHubTalentData[];
  benchmarks: IndustryBenchmarks;
  yourNewData: YourDataType[]; // 👇 Add your new data type
  fetchedAt: string;
}
```

## Example: Adding a LinkedIn Jobs Scraper

Here's a complete example of adding a new actor:

```typescript
// 1. Add to APIFY_ACTORS
const APIFY_ACTORS = {
  // ... existing actors
  linkedinJobs: "apify/linkedin-jobs-scraper", // Example actor
};

// 2. Define interface
export interface LinkedInJobData {
  title: string;
  company: string;
  location: string;
  salary?: string;
  url: string;
  source: string;
}

// 3. Create scraping function
export async function scrapeLinkedInJobs(
  jobTitle: string,
  location: string
): Promise<LinkedInJobData[]> {
  if (!apifyClient) {
    console.warn("⚠️ APIFY_API_KEY not configured");
    return [];
  }

  try {
    console.log("🔍 Scraping LinkedIn jobs via Apify");

    const run = await apifyClient.actor(APIFY_ACTORS.linkedinJobs).call(
      {
        searchKeywords: jobTitle,
        location: location,
        maxItems: 50,
      },
      { timeout: 60 }
    );

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    if (items && items.length > 0) {
      return items.map((item: any) => ({
        title: item.title || "",
        company: item.company || "",
        location: item.location || "",
        salary: item.salary,
        url: item.url || "",
        source: "LinkedIn (via Apify)",
      }));
    }

    return [];
  } catch (error: any) {
    console.error("❌ LinkedIn jobs scraping error:", error.message);
    return [];
  }
}
```

## Tips

1. **Check Actor Documentation**: Each actor has different input parameters. Check the actor's page on Apify Store for documentation.

2. **Handle Errors Gracefully**: Always wrap actor calls in try-catch and provide fallbacks.

3. **Type Safety**: Use TypeScript interfaces to ensure type safety for your data.

4. **Logging**: Add console.log statements to track what's happening during scraping.

5. **Timeouts**: Set appropriate timeouts (usually 30-60 seconds) to avoid hanging requests.

6. **Rate Limiting**: Be aware of Apify's rate limits and costs. Some actors consume more compute units than others.

## Common Apify Actors You Might Want to Add

- `apify/linkedin-jobs-scraper` - LinkedIn job listings
- `apify/indeed-scraper` - Indeed job listings
- `apify/instagram-scraper` - Instagram profiles
- `apify/twitter-scraper` - Twitter/X data
- `apify/google-maps-scraper` - Google Maps data
- `apify/amazon-scraper` - Amazon product data
- Custom actors you create yourself

## Need Help?

- [Apify Documentation](https://docs.apify.com/)
- [Apify Store](https://apify.com/store)
- [Apify Actor Input Schema](https://docs.apify.com/platform/actors/development/actor-definition/input-schema)
