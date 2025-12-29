"use client";

import React from "react";

export interface ScoreImpactRow {
  fix: string;
  impact: string;
  tooltip?: string;
  talentPoolImpact?: string;
  riskReduction?: string;
}

interface ScoreImpactTableProps {
  rows: ScoreImpactRow[];
  totalUplift: string;
  cardId?: string;
}

export function ScoreImpactTable({
  rows,
  totalUplift,
  cardId,
}: ScoreImpactTableProps) {
  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div
          key={index}
          className="p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">{row.fix}</span>
            <span className="text-emerald-600 font-bold">{row.impact}</span>
          </div>
          {row.tooltip && (
            <p className="text-xs text-gray-600 mt-1">{row.tooltip}</p>
          )}
        </div>
      ))}
      <div className="mt-4 pt-3 border-t border-gray-300">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">Total Uplift</span>
          <span className="text-emerald-600 font-bold text-lg">{totalUplift}</span>
        </div>
      </div>
    </div>
  );
}

