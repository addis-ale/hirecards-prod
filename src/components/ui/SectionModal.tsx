"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  Icon: React.ComponentType<{ className?: string }>;
  tone?: "info" | "warning" | "success" | "danger" | "purple";
  allowEdit?: boolean;
  children: React.ReactNode;
}

export function SectionModal({
  isOpen,
  onClose,
  title,
  subtitle,
  Icon,
  tone = "info",
  allowEdit: _allowEdit = false,
  children,
}: SectionModalProps) {
  const toneColors: Record<string, { accent: string; bg: string }> = {
    info: { accent: "#2563eb", bg: "rgba(37,99,235,0.1)" },
    warning: { accent: "#d97706", bg: "rgba(217,119,6,0.1)" },
    purple: { accent: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
    success: { accent: "#16a34a", bg: "rgba(22,163,74,0.1)" },
    danger: { accent: "#dc2626", bg: "rgba(220,38,38,0.1)" },
  };

  const colors = toneColors[tone] || toneColors.info;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-xl shadow-xl z-50 overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: colors.accent }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: "#102a63" }}>
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-sm text-gray-600">{subtitle}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

