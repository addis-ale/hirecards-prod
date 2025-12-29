"use client";

import React from "react";
import { Card } from "@/lib/cardCategories";
import { cn } from "@/lib/utils";

interface CardPreviewProps {
  card: Card;
  isCurrent?: boolean;
  onClick?: () => void;
}

export function CardPreview({ card, isCurrent, onClick }: CardPreviewProps) {
  const Icon = card.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg",
        isCurrent
          ? "border-purple-500 shadow-md"
          : "border-gray-200 hover:border-purple-300"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
            card.gradient
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1" style={{ color: "#102a63" }}>
            {card.label}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {card.teaser}
          </p>
        </div>
      </div>
      {isCurrent && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs font-medium text-purple-600">
            Currently Viewing
          </span>
        </div>
      )}
    </div>
  );
}

