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
}

export function FixMeNowBoxes({
  rows,
  totalUplift,
  cardId,
  onNavigateToCard,
  currentCardId,
  feasibilityScore,
}: FixMeNowBoxesProps) {
  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all cursor-pointer"
          onClick={() => {
            // Handle navigation if needed
            if (row.fix.includes("skills") && onNavigateToCard) {
              onNavigateToCard("skill");
            } else if (row.fix.includes("comp") && onNavigateToCard) {
              onNavigateToCard("pay");
            }
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                {row.fix}
              </h4>
              {row.tooltip && (
                <p className="text-xs text-gray-600">{row.tooltip}</p>
              )}
            </div>
            <div className="ml-4 text-right">
              <div className="text-lg font-bold text-emerald-600">
                {row.impact}
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            {row.talentPoolImpact && (
              <span className="text-blue-600">📈 {row.talentPoolImpact}</span>
            )}
            {row.riskReduction && (
              <span className="text-red-600">⚠️ {row.riskReduction}</span>
            )}
          </div>
        </div>
      ))}
      <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-emerald-900">
            Total Potential Uplift
          </span>
          <span className="text-emerald-700 font-bold text-lg">
            {totalUplift}
          </span>
        </div>
      </div>
    </div>
  );
}

