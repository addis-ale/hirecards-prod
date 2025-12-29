"use client";

import React from "react";

interface CalloutProps {
  children: React.ReactNode;
  variant?: "info" | "warning" | "success" | "danger";
  className?: string;
}

export function Callout({ children, variant = "info", className }: CalloutProps) {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-green-50 border-green-200 text-green-900",
    danger: "bg-red-50 border-red-200 text-red-900",
  };

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} ${className || ""}`}>
      {children}
    </div>
  );
}

