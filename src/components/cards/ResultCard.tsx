"use client";

import React from "react";
import { Card } from "@/lib/cardCategories";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ResultCardProps {
  card: Card;
  onClick?: () => void;
}

export function ResultCard({ card, onClick }: ResultCardProps) {
  const Icon = card.icon;

  // Generate key insights from teaser
  const keyInsights = [
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

