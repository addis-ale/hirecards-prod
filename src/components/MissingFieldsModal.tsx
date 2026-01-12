"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

interface MissingFieldsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingFields: string[];
  onGetCardsAnyway: () => void;
  onCompleteFields: () => void;
  onBackToLanding?: () => void;
}

export default function MissingFieldsModal({
  open,
  onOpenChange,
  missingFields,
  onGetCardsAnyway,
  onCompleteFields,
  onBackToLanding,
}: MissingFieldsModalProps) {
  console.log("MissingFieldsModal render:", {
    open,
    missingFieldsCount: missingFields.length,
  });

  const handleBackToLanding = () => {
    onOpenChange(false);
    if (onBackToLanding) {
      onBackToLanding();
    } else {
      // Fallback: use full page reload to reset state
      window.location.href = "/";
    }
  };

  if (!open) return null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in-0 zoom-in-95 duration-300 min-h-[500px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-foreground">
              Enhance Your HireCards
            </h2>
          </div>
          <button
            onClick={handleBackToLanding}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Main Description */}
        <div className="mb-6 space-y-3">
          <p className="text-base text-foreground leading-relaxed">
            We&apos;ve successfully extracted information from your job description, but we found{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-500">
              {missingFields.length} additional field{missingFields.length !== 1 ? "s" : ""}
            </span>{" "}
            that could significantly improve the quality and accuracy of your HireCards.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
              <span className="font-semibold">💡 Why complete these fields?</span>{" "}
              Providing complete information enables our AI to generate more precise job analysis, 
              better candidate matching, and more actionable hiring strategies. Your HireCards will 
              be more comprehensive and tailored to your specific needs.
            </p>
          </div>
        </div>

        <div className="space-y-4 pb-6 flex-1 flex flex-col">
          {/* Missing Fields List */}
          <div className="bg-muted rounded-lg p-5 flex-1 min-h-[200px] overflow-y-auto border border-border">
            <p className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wide">
              Fields We Need to Complete:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {missingFields.map((field, index) => (
                <li 
                  key={index} 
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{field}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onCompleteFields}
                className="flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                Complete Fields & Generate Cards
              </Button>
              <Button
                onClick={onGetCardsAnyway}
                variant="outline"
                className="flex-1 h-12 text-base border-2"
                size="lg"
              >
                Generate with Available Data
              </Button>
            </div>
            <Button
              onClick={handleBackToLanding}
              variant="ghost"
              className="w-full h-10 text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to Landing Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
