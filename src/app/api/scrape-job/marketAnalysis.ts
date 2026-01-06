/**
 * Market Analysis Algorithm
 * 
 * Estimates market conditions from sample data using statistical extrapolation.
 * Handles incomplete data by using confidence intervals and ratio-based estimation.
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
  hasTotalCount: boolean; // Whether we got LinkedIn's total result count
  confidenceLevel: "High" | "Medium" | "Low"; // Based on sample size and data quality
  extrapolationMethod: "total_count" | "ratio_based" | "fallback";
}

export interface MarketAnalysisInput {
  sampleCandidates: number;
  sampleJobs: number;
  totalResultCount?: number; // LinkedIn's total result count if available
  sampleSize?: number; // How many profiles we requested (e.g., 100)
}

/**
 * Calculate market analysis from sample data
 */
export function analyzeMarket(input: MarketAnalysisInput): MarketAnalysisResult {
  const {
    sampleCandidates,
    sampleJobs,
    totalResultCount,
    sampleSize = 100,
  } = input;

  // Determine extrapolation method
  let estimatedTotalCandidates: number;
  let estimatedTotalJobs: number;
  let hasTotalCount = false;
  let extrapolationMethod: "total_count" | "ratio_based" | "fallback";
  let confidenceLevel: "High" | "Medium" | "Low" = "Low";

  // Method 1: Use LinkedIn's total result count if available
  if (totalResultCount && totalResultCount > 0) {
    estimatedTotalCandidates = totalResultCount;
    // Estimate jobs based on candidate-to-job ratio from sample
    const candidateToJobRatio = sampleJobs > 0 ? sampleCandidates / sampleJobs : 1;
    estimatedTotalJobs = Math.round(estimatedTotalCandidates / candidateToJobRatio);
    hasTotalCount = true;
    extrapolationMethod = "total_count";
    confidenceLevel = "High";
  }
  // Method 2: Ratio-based extrapolation with confidence intervals
  else if (sampleCandidates > 0 && sampleJobs > 0) {
    const candidateToJobRatio = sampleCandidates / sampleJobs;
    
    // Estimate based on sample ratio
    // Assume we're sampling from a larger pool
    // Use a conservative multiplier based on sample size
    const sampleCoverage = Math.min(sampleCandidates / sampleSize, 1); // How much of our sample we got
    const extrapolationMultiplier = sampleCoverage > 0.8 ? 10 : 5; // More conservative if we got fewer results
    
    estimatedTotalCandidates = Math.round(sampleCandidates * extrapolationMultiplier);
    estimatedTotalJobs = Math.round(sampleJobs * extrapolationMultiplier);
    extrapolationMethod = "ratio_based";
    confidenceLevel = sampleCandidates >= 50 ? "Medium" : "Low";
  }
  // Method 3: Fallback estimation
  else {
    // Very rough estimates when we have minimal data
    estimatedTotalCandidates = sampleCandidates > 0 ? sampleCandidates * 5 : 100;
    estimatedTotalJobs = sampleJobs > 0 ? sampleJobs * 5 : 200;
    extrapolationMethod = "fallback";
    confidenceLevel = "Low";
  }

  // Calculate confidence intervals (±30% for ratio-based, ±10% for total count)
  const confidenceMargin = hasTotalCount ? 0.1 : 0.3;
  const candidateConfidenceInterval = {
    min: Math.round(estimatedTotalCandidates * (1 - confidenceMargin)),
    max: Math.round(estimatedTotalCandidates * (1 + confidenceMargin)),
  };

  // Calculate market metrics
  const candidatesPerJob = estimatedTotalJobs > 0 
    ? estimatedTotalCandidates / estimatedTotalJobs 
    : 0;
  const jobsPerCandidate = estimatedTotalCandidates > 0 
    ? estimatedTotalJobs / estimatedTotalCandidates 
    : 0;

  // Determine market tightness category
  let marketTightness: "Very Tight" | "Tight" | "Balanced" | "Loose" | "Very Loose";
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
  const { marketTightness, estimatedTotalCandidates, estimatedTotalJobs, confidenceLevel } = analysis;

  let summary = `${marketTightness} Market`;
  if (confidenceLevel !== "Low") {
    summary += ` (${estimatedTotalCandidates.toLocaleString()} estimated candidates, ${estimatedTotalJobs.toLocaleString()} jobs)`;
  }

  let details = `Based on ${analysis.sampleCandidates} candidate profiles and ${analysis.sampleJobs} job postings sampled. `;
  if (analysis.hasTotalCount) {
    details += "Using LinkedIn's total result count for accurate estimation.";
  } else {
    details += `Extrapolated using ${analysis.extrapolationMethod.replace("_", " ")} method. `;
    details += `Estimated range: ${analysis.candidateConfidenceInterval.min.toLocaleString()} - ${analysis.candidateConfidenceInterval.max.toLocaleString()} candidates.`;
  }

  const recommendations: string[] = [];
  
  if (marketTightness === "Very Tight" || marketTightness === "Tight") {
    recommendations.push("Consider expanding search criteria (location, skills, experience level)");
    recommendations.push("Increase outreach volume - expect lower response rates");
    recommendations.push("Review compensation - may need to be more competitive");
    recommendations.push("Consider passive candidates who aren't actively job searching");
  } else if (marketTightness === "Balanced") {
    recommendations.push("Standard hiring process should work well");
    recommendations.push("Focus on quality over quantity in outreach");
    recommendations.push("Competitive compensation and benefits will help");
  } else {
    recommendations.push("You have good candidate supply - focus on quality screening");
    recommendations.push("Leverage competitive advantages (culture, growth, etc.)");
    recommendations.push("Consider being more selective in initial screening");
  }

  if (confidenceLevel === "Low") {
    recommendations.push("⚠️ Low confidence in estimates - consider gathering more data");
  }

  return { summary, details, recommendations };
}

