"use client";

import React from "react";

export function shouldShowInline(content: React.ReactNode, sectionId: string): boolean {
  // Show all content inline - no modals needed
  return true;
}

export function renderContentPreview(
  content: React.ReactNode,
  isSmall: boolean,
  title: string,
  onOpen: () => void,
  tone: string,
  sectionId: string,
  allowEdit: boolean
): React.ReactNode {
  const toneColors: Record<string, { accent: string }> = {
    info: { accent: "#2563eb" },
    warning: { accent: "#d97706" },
    purple: { accent: "#7c3aed" },
    success: { accent: "#16a34a" },
    danger: { accent: "#dc2626" },
  };

  const colors = toneColors[tone] || toneColors.info;

  // Always show all content directly - no preview or "see more" button
  return (
    <div className="p-4">
      <h3 className="text-sm font-bold mb-3" style={{ color: colors.accent }}>
        {title}
      </h3>
      <div className="text-sm">
        {content}
      </div>
    </div>
  );
}

