"use client";

import React from "react";

interface ScoreProgressRingProps {
  currentScore: number;
  previousScore?: number;
  maxScore: number;
  size?: number;
  strokeWidth?: number;
  showChange?: boolean;
}

export function ScoreProgressRing({
  currentScore,
  previousScore,
  maxScore,
  size = 120,
  strokeWidth = 8,
  showChange = false,
}: ScoreProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (currentScore / maxScore) * 100;
  const offset = circumference - (progress / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 8) return "#10b981"; // green
    if (score >= 6) return "#3b82f6"; // blue
    if (score >= 4) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(currentScore)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {currentScore.toFixed(1)}
          </div>
          {showChange && previousScore !== undefined && previousScore !== currentScore && (
            <div className={`text-xs ${currentScore > previousScore ? 'text-green-300' : 'text-red-300'}`}>
              {currentScore > previousScore ? '+' : ''}
              {(currentScore - previousScore).toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

