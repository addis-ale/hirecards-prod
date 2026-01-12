"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/lib/cardCategories";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ResultCardProps {
  card: Card;
  onClick?: () => void;
}

export function ResultCard({ card, onClick }: ResultCardProps) {
  const [hasDynamicData, setHasDynamicData] = useState(false);
  const [dynamicPreview, setDynamicPreview] = useState<string | null>(null);

  // Check for dynamic data from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("scrapedJobData");
      if (stored) {
        const data = JSON.parse(stored);
        const jobAnalysisCards = data.jobAnalysisCards;
        
        if (jobAnalysisCards) {
          // Check if this specific card has data
          let cardData = null;
          if (card.id === "role" && jobAnalysisCards.roleCard) {
            cardData = jobAnalysisCards.roleCard;
            setDynamicPreview(cardData.roleSummary || cardData.roleMission || null);
          } else if (card.id === "skill" && jobAnalysisCards.skillCard) {
            cardData = jobAnalysisCards.skillCard;
            const skills = [
              ...(cardData.technicalSkills || []),
              ...(cardData.mustHaveSkills || [])
            ].slice(0, 3);
            setDynamicPreview(skills.length > 0 ? `Skills: ${skills.join(", ")}` : null);
          } else if (card.id === "fit" && jobAnalysisCards.fitCard) {
            cardData = jobAnalysisCards.fitCard;
            setDynamicPreview(cardData.persona || cardData.brutalTruth || null);
          } else if (card.id === "message" && jobAnalysisCards.messageCard) {
            cardData = jobAnalysisCards.messageCard;
            setDynamicPreview(cardData.corePitch || null);
          } else if (card.id === "outreach" && jobAnalysisCards.outreachCard) {
            cardData = jobAnalysisCards.outreachCard;
            setDynamicPreview(cardData.introduction || null);
          }
          
          if (cardData) {
            setHasDynamicData(true);
          }
        }
        
        // Check for Talent Map Card (in peopleAnalysisCards)
        if (card.id === "talentmap" && data.peopleAnalysisCards?.talentMapCard) {
          const talentMapData = data.peopleAnalysisCards.talentMapCard;
          const primaryFeeders = talentMapData.primaryFeeders || [];
          if (primaryFeeders.length > 0) {
            setDynamicPreview(`Top companies: ${primaryFeeders.slice(0, 3).join(", ")}`);
            setHasDynamicData(true);
          }
        }
        
        // Check for Market Card (in combinedAnalysisCards)
        if (card.id === "market" && data.combinedAnalysisCards?.marketCard) {
          const marketData = data.combinedAnalysisCards.marketCard;
          const tightness = marketData.supplyDemand?.marketTightness || marketData.marketTightness;
          const candidates = marketData.talentAvailability?.total || marketData.estimatedTotalCandidates;
          if (tightness || candidates) {
            setDynamicPreview(tightness ? `${tightness} market - ${candidates?.toLocaleString() || 'N/A'} candidates` : null);
            setHasDynamicData(true);
          }
        }
        
        // Check for Pay Card (in combinedAnalysisCards)
        if (card.id === "pay" && data.combinedAnalysisCards?.payCard) {
          const payData = data.combinedAnalysisCards.payCard;
          const recommendedRange = payData.recommendedRange;
          const median = payData.glassdoorMedian || payData.marketCompensation?.find((c: Record<string, unknown>) => typeof c.label === 'string' && c.label.includes("P50"))?.value;
          if (recommendedRange || median) {
            setDynamicPreview(recommendedRange || `Median: ${median}`);
            setHasDynamicData(true);
          }
        }
        
        // Check for Funnel Card (in combinedAnalysisCards)
        if (card.id === "funnel" && data.combinedAnalysisCards?.funnelCard) {
          const funnelData = data.combinedAnalysisCards.funnelCard;
          const stages = funnelData.funnelStages || [];
          if (stages.length > 0) {
            const firstStage = stages[0];
            setDynamicPreview(`${firstStage.label}: ${firstStage.value}`);
            setHasDynamicData(true);
          }
        }
        
        // Check for Reality Card (in combinedAnalysisCards)
        if (card.id === "reality" && data.combinedAnalysisCards?.realityCard) {
          const realityData = data.combinedAnalysisCards.realityCard;
          const score = realityData.feasibilityScore || realityData.score;
          const insights = realityData.keyInsights || [];
          if (score || insights.length > 0) {
            setDynamicPreview(score ? `Feasibility Score: ${score}` : insights[0] || null);
            setHasDynamicData(true);
          }
        }
        
        // Check for Interview Card (in derivedStrategyCards)
        if (card.id === "interview" && data.derivedStrategyCards?.interviewCard) {
          const interviewData = data.derivedStrategyCards.interviewCard;
          const loop = interviewData.optimalLoop || [];
          if (loop.length > 0) {
            setDynamicPreview(`Interview process: ${loop.length} stages`);
            setHasDynamicData(true);
          }
        }
        
        // Check for Scorecard Card (in derivedStrategyCards)
        if (card.id === "scorecard" && data.derivedStrategyCards?.scorecardCard) {
          const scorecardData = data.derivedStrategyCards.scorecardCard;
          const competencies = scorecardData.competencies || [];
          if (competencies.length > 0) {
            setDynamicPreview(`${competencies.length} competencies: ${competencies.slice(0, 3).join(", ")}`);
            setHasDynamicData(true);
          }
        }
        
        // Check for Plan Card (in derivedStrategyCards)
        if (card.id === "plan" && data.derivedStrategyCards?.planCard) {
          const planData = data.derivedStrategyCards.planCard;
          const first7Days = planData.first7Days || [];
          if (first7Days.length > 0) {
            setDynamicPreview(`First 7 days: ${first7Days.length} action items`);
            setHasDynamicData(true);
          }
        }
      }
    } catch (error) {
      console.error("Error loading dynamic card data:", error);
    }
  }, [card.id]);

  // Generate key insights - use dynamic data if available
  const keyInsights = hasDynamicData && dynamicPreview
    ? [
        dynamicPreview.substring(0, 80) + (dynamicPreview.length > 80 ? "..." : ""),
        `Generated from your job description`,
        `Impact score: ${card.impact || "N/A"}`,
      ]
    : [
        card.teaser,
        `Focus on ${card.category.replace(/-/g, " ")} strategies`,
        `Impact score: ${card.impact || "N/A"}`,
      ];

  // Generate helps and hurts based on category
  const getHelpsAndHurts = () => {
    const categoryHelps: Record<string, string[]> = {
      foundation: [
        "Clear role definition",
        "Strong alignment",
        "Product-led focus",
      ],
      "market-intelligence": [
        "Data-driven decisions",
        "Market research",
        "Talent mapping",
      ],
      "outreach-engagement": [
        "Personalized messaging",
        "Quick follow-ups",
        "Value proposition",
      ],
      selection: [
        "Structured interviews",
        "Clear criteria",
        "Fast feedback",
      ],
    };

    const categoryHurts: Record<string, string[]> = {
      foundation: [
        "Vague requirements",
        "Poor alignment",
        "Unclear goals",
      ],
      "market-intelligence": [
        "No market data",
        "Assumptions",
        "Outdated info",
      ],
      "outreach-engagement": [
        "Generic messages",
        "Slow responses",
        "Weak value prop",
      ],
      selection: [
        "Unstructured process",
        "Vague criteria",
        "Slow decisions",
      ],
    };

    return {
      helps: categoryHelps[card.category] || ["Clear strategy", "Data-driven", "Fast execution"],
      hurts: categoryHurts[card.category] || ["Vague approach", "No data", "Slow process"],
    };
  };

  const { helps, hurts } = getHelpsAndHurts();
  const brutalTruth = `Focusing on ${card.label.toLowerCase()} is critical. Without proper ${card.category.replace(/-/g, " ")}, your hiring process will struggle to deliver results.`;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-all hover:scale-[1.02] h-full"
    >
      <div
        className={cn(
          "h-full w-full flex flex-col p-6 rounded-[32px] border-0 shadow-2xl overflow-hidden",
          card.gradient || "bg-gradient-to-br from-slate-600 to-slate-900"
        )}
      >
        {/* Header Row */}
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col flex-1">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
              {card.label.split(" ")[0]}
            </span>
            <h4 className="text-xl font-black text-white leading-tight">
              {card.label}
            </h4>
            {hasDynamicData && (
              <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-400/30 rounded text-xs font-bold text-green-300">
                <span>✨</span>
                <span>Dynamic</span>
              </span>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="group px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
            >
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                See More
              </span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Key Insights */}
        {keyInsights && (
          <div className="mt-4">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
              Key Insights
            </span>
            <ul className="mt-2 space-y-1.5">
              {keyInsights
                .slice(0, 3)
                .map((insight: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-white leading-snug flex items-start gap-2"
                  >
                    <span className="text-white/50 font-bold">
                      •
                    </span>
                    <span>{insight}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Brutal Truth */}
        {brutalTruth && (
          <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/20">
            <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">
              ⚡ Brutal Truth
            </span>
            <p className="text-sm text-white leading-relaxed mt-2">
              {brutalTruth}
            </p>
          </div>
        )}

        {/* Helps & Hurts */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {helps && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                What Helps
              </span>
              <ul className="mt-2 space-y-1">
                {helps
                  .slice(0, 3)
                  .map((item: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-white leading-snug flex items-start gap-1.5"
                    >
                      <span className="text-emerald-300 font-bold">
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {hurts && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/30">
              <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                What Hurts
              </span>
              <ul className="mt-2 space-y-1">
                {hurts
                  .slice(0, 3)
                  .map((item: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-white leading-snug flex items-start gap-1.5"
                    >
                      <span className="text-red-300 font-bold">
                        −
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

