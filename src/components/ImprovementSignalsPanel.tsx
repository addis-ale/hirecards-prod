"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ImprovementSignalsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  cardData: any;
  onApplySuggestion: (signalId: string, targetTab: string, scoreIncrease?: number) => void;
  onNavigateToTab: (tabId: string) => void;
}

export function ImprovementSignalsPanel({
  isOpen,
  onClose,
  currentScore,
  cardData,
  onApplySuggestion,
  onNavigateToTab,
}: ImprovementSignalsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "#102a63" }}>
                  Improvement Suggestions
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">
                    Current Score: <span className="font-bold">{currentScore}/10</span>
                  </p>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <p>No improvement suggestions available at this time.</p>
                  <p className="text-sm mt-2">Check back later for personalized recommendations.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

