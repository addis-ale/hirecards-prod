interface CalculateRealityScoreParams {
  feasibilityScore?: string;
  helpsCase?: string[];
  hurtsCase?: string[];
  keyInsights?: string[];
  realityCheck1?: string;
  realityCheck2?: string;
  hiddenBottleneck?: string;
  timelineToFailure?: string;
  bottomLine1?: string;
  bottomLine2?: string;
}

export function calculateRealityScore(params: CalculateRealityScoreParams): number {
  // Extract numeric score from feasibilityScore string (e.g., "5.5/10" -> 5.5)
  let baseScore = 5.5;
  
  if (params.feasibilityScore) {
    const match = params.feasibilityScore.match(/(\d+\.?\d*)/);
    if (match) {
      baseScore = parseFloat(match[1]);
    }
  }

  // Adjust based on helps/hurts
  const helpsCount = params.helpsCase?.length || 0;
  const hurtsCount = params.hurtsCase?.length || 0;
  
  const adjustment = (helpsCount * 0.1) - (hurtsCount * 0.15);
  
  return Math.max(0, Math.min(9.9, baseScore + adjustment));
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return "Strong — well-positioned to hire";
  if (score >= 6) return "Possible — but only if alignment, speed, and comp tighten immediately.";
  if (score >= 4) return "Challenging — significant improvements needed";
  return "Not feasible — major changes required";
}

export function getScoreSubtext(score: number): string {
  if (score >= 8) return "Market conditions and internal alignment are favorable.";
  if (score >= 6) return "Not possible if criteria remain rigid or process is slow/vague.";
  if (score >= 4) return "Current approach will likely fail without immediate action.";
  return "Fundamental changes to strategy and requirements are necessary.";
}

