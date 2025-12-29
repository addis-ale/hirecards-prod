"use client";

import React from "react";
import { ScoreImpactRow } from "./ScoreImpactTable";

interface FixMeNowBoxesProps {
  rows: ScoreImpactRow[];
  totalUplift: string;
  cardId: string;
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  feasibilityScore?: string;
  onOpenSuggestions?: () => void;
}

export function FixMeNowBoxes({
  rows,
  totalUplift,
  cardId,
  onNavigateToCard,
  currentCardId,
  feasibilityScore,
  onOpenSuggestions,
}: FixMeNowBoxesProps) {
  // Show empty state if no suggestions available
  if (!rows || rows.length === 0) {
    return (
      <div 
        className="p-8 text-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onOpenSuggestions?.()}
      >
        <p className="text-slate-600 dark:text-slate-400 font-bold text-base mb-2">
          No improvement suggestions available at this time.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 font-bold">
          Check back later for personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="space-y-3 cursor-pointer"
      onClick={() => onOpenSuggestions?.()}
    >
      {rows.map((row, index) => (
        <div
          key={index}
          className="p-4 bg-white dark:bg-slate-900 rounded-lg border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            // Open suggestions modal instead of navigating
            onOpenSuggestions?.();
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                {row.fix}
              </h4>
              {row.tooltip && (
                <p className="text-xs text-slate-600 dark:text-slate-400">{row.tooltip}</p>
              )}
            </div>
            <div className="ml-4 text-right">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {row.impact}
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            {row.talentPoolImpact && (
              <span className="text-blue-600 dark:text-blue-400">📈 {row.talentPoolImpact}</span>
            )}
            {row.riskReduction && (
              <span className="text-red-600 dark:text-red-400">⚠️ {row.riskReduction}</span>
            )}
          </div>
        </div>
      ))}
      <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
            Total Potential Uplift
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-lg">
            {totalUplift}
          </span>
        </div>
      </div>
    </div>
  );
}

