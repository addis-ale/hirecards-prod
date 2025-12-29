"use client";

import React from "react";

interface OverviewCardProps {
  data?: any;
}

export function OverviewCard({ data }: OverviewCardProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#102a63" }}>
        Overview
      </h3>
      <p className="text-gray-600">Overview content coming soon...</p>
    </div>
  );
}

