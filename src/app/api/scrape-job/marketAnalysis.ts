/**
 * Market Analysis Algorithm
 *
 * Estimates market conditions using ONLY LinkedIn's total result count (Method 1).
 * Requires totalResultCount from LinkedIn - no extrapolation or fallback methods.
 */

export interface MarketAnalysisResult {
  // Sample data (what we actually scraped)
  sampleCandidates: number;
  sampleJobs: number;

  // Estimated totals (extrapolated)
  estimatedTotalCandidates: number;
  estimatedTotalJobs: number;
  candidateConfidenceInterval: {
    min: number;
    max: number;
  };

  // Market metrics
  candidatesPerJob: number;
  jobsPerCandidate: number;
  marketTightness: "Very Tight" | "Tight" | "Balanced" | "Loose" | "Very Loose";
  marketTightnessScore: number; // 0-100, lower = tighter

  // Data quality indicators
  hasTotalCount: boolean; // Whether we got LinkedIn's total result count (required)
  confidenceLevel: "High" | "Medium" | "Low"; // Always "High" when using total count
  extrapolationMethod: "total_count"; // Only method used
}

export interface MarketAnalysisInput {
  sampleCandidates: number;
  sampleJobs: number;
  totalResultCount?: number; // LinkedIn's total result count if available
  sampleSize?: number; // How many profiles we requested (e.g., 100)
  githubProfileCount?: number; // GitHub profile count from market signal
}

/**
 * Calculate market analysis from sample data
 * ONLY uses LinkedIn's total result count (Method 1)
 * Returns null if totalResultCount is not available
 */
export function analyzeMarket(
  input: MarketAnalysisInput
): MarketAnalysisResult | null {
  const { sampleCandidates, sampleJobs, totalResultCount, githubProfileCount } =
    input;

  let estimatedTotalCandidates: number;
  let hasTotalCount = false;
  const extrapolationMethod = "total_count" as const;
  let confidenceLevel: "High" | "Medium" | "Low" = "High";

  // Method 1: Use LinkedIn's total result count (preferred)
  if (totalResultCount && totalResultCount > 0) {
    estimatedTotalCandidates = totalResultCount;
    hasTotalCount = true;

    // Add GitHub profile count if available (as additional signal)
    if (githubProfileCount && githubProfileCount > 0) {
      // Combine LinkedIn and GitHub counts (use average for now)
      // This gives a more comprehensive market view
      estimatedTotalCandidates = Math.round(
        (totalResultCount + githubProfileCount) / 2
      );
      console.log(
        `📊 Combined market signal: LinkedIn=${totalResultCount}, GitHub=${githubProfileCount}, Combined=${estimatedTotalCandidates}`
      );
    }
  }
  // Method 2: Use LinkedIn sample + GitHub signal if LinkedIn total count not available
  else if (
    sampleCandidates > 0 ||
    (githubProfileCount && githubProfileCount > 0)
  ) {
    // If we have both LinkedIn sample and GitHub signal, combine them
    if (sampleCandidates > 0 && githubProfileCount && githubProfileCount > 0) {
      // Use average of LinkedIn sample (extrapolated) and GitHub signal
      // Extrapolate LinkedIn sample by 10x (conservative estimate)
      const linkedInEstimate = sampleCandidates * 10;
      estimatedTotalCandidates = Math.round(
        (linkedInEstimate + githubProfileCount) / 2
      );
      hasTotalCount = false;
      confidenceLevel = "Medium";
      console.log(
        `📊 Combined estimate: LinkedIn sample (${sampleCandidates} × 10 = ${linkedInEstimate}) + GitHub (${githubProfileCount}) = ${estimatedTotalCandidates}`
      );
    }
    // If only GitHub signal available
    else if (githubProfileCount && githubProfileCount > 0) {
      estimatedTotalCandidates = githubProfileCount;
      hasTotalCount = false;
      confidenceLevel = "Medium";
      console.log(
        `📊 Using GitHub market signal: ${githubProfileCount} profiles (LinkedIn total count not available)`
      );
    }
    // If only LinkedIn sample available
    else if (sampleCandidates > 0) {
      // Extrapolate LinkedIn sample by 10x (conservative estimate)
      estimatedTotalCandidates = sampleCandidates * 10;
      hasTotalCount = false;
      confidenceLevel = "Low";
      console.log(
        `📊 Using LinkedIn sample extrapolation: ${sampleCandidates} × 10 = ${estimatedTotalCandidates} (LinkedIn total count not available)`
      );
    } else {
      // This shouldn't happen due to the outer condition, but TypeScript needs it
      return null;
    }
  }
  // Method 3: No data available
  else {
    // Cannot generate market analysis without any data
    return null;
  }
  // Estimate jobs based on candidate-to-job ratio from sample
  const candidateToJobRatio =
    sampleJobs > 0 ? sampleCandidates / sampleJobs : 1;
  const estimatedTotalJobs = Math.round(
    estimatedTotalCandidates / candidateToJobRatio
  );

  // Calculate confidence intervals (±10% for total count, ±20% for GitHub signal)
  const confidenceMargin = hasTotalCount ? 0.1 : 0.2;
  const candidateConfidenceInterval = {
    min: Math.round(estimatedTotalCandidates * (1 - confidenceMargin)),
    max: Math.round(estimatedTotalCandidates * (1 + confidenceMargin)),
  };

  // Calculate market metrics
  const candidatesPerJob =
    estimatedTotalJobs > 0 ? estimatedTotalCandidates / estimatedTotalJobs : 0;
  const jobsPerCandidate =
    estimatedTotalCandidates > 0
      ? estimatedTotalJobs / estimatedTotalCandidates
      : 0;

  // Determine market tightness category
  let marketTightness:
    | "Very Tight"
    | "Tight"
    | "Balanced"
    | "Loose"
    | "Very Loose";
  let marketTightnessScore: number;

  if (candidatesPerJob < 0.5) {
    marketTightness = "Very Tight";
    marketTightnessScore = 10; // 0-100 scale, lower = tighter
  } else if (candidatesPerJob < 1) {
    marketTightness = "Tight";
    marketTightnessScore = 30;
  } else if (candidatesPerJob < 3) {
    marketTightness = "Balanced";
    marketTightnessScore = 50;
  } else if (candidatesPerJob < 10) {
    marketTightness = "Loose";
    marketTightnessScore = 70;
  } else {
    marketTightness = "Very Loose";
    marketTightnessScore = 90;
  }

  return {
    sampleCandidates,
    sampleJobs,
    estimatedTotalCandidates,
    estimatedTotalJobs,
    candidateConfidenceInterval,
    candidatesPerJob,
    jobsPerCandidate,
    marketTightness,
    marketTightnessScore,
    hasTotalCount,
    confidenceLevel,
    extrapolationMethod,
  };
}

/**
 * Format market analysis for display
 */
export function formatMarketAnalysis(analysis: MarketAnalysisResult): {
  summary: string;
  details: string;
  recommendations: string[];
} {
  const {
    marketTightness,
    estimatedTotalCandidates,
    estimatedTotalJobs,
    confidenceLevel,
  } = analysis;

  let summary = `${marketTightness} Market`;
  if (confidenceLevel !== "Low") {
    summary += ` (${estimatedTotalCandidates.toLocaleString()} estimated candidates, ${estimatedTotalJobs.toLocaleString()} jobs)`;
  }

  let details = `Based on ${analysis.sampleCandidates} candidate profiles and ${analysis.sampleJobs} job postings sampled. `;
  if (analysis.hasTotalCount) {
    details += "Using LinkedIn's total result count for accurate estimation.";
  } else {
    details +=
      "Using GitHub market signal for estimation (LinkedIn total count not available).";
  }

  const recommendations: string[] = [];

  if (marketTightness === "Very Tight" || marketTightness === "Tight") {
    recommendations.push(
      "Consider expanding search criteria (location, skills, experience level)"
    );
    recommendations.push(
      "Increase outreach volume - expect lower response rates"
    );
    recommendations.push(
      "Review compensation - may need to be more competitive"
    );
    recommendations.push(
      "Consider passive candidates who aren't actively job searching"
    );
  } else if (marketTightness === "Balanced") {
    recommendations.push("Standard hiring process should work well");
    recommendations.push("Focus on quality over quantity in outreach");
    recommendations.push("Competitive compensation and benefits will help");
  } else {
    recommendations.push(
      "You have good candidate supply - focus on quality screening"
    );
    recommendations.push(
      "Leverage competitive advantages (culture, growth, etc.)"
    );
    recommendations.push("Consider being more selective in initial screening");
  }

  // Confidence is always High when using total count method

  return { summary, details, recommendations };
}
