"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AlertCircle } from "lucide-react";

interface MissingFieldsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingFields: string[];
  onGetCardsAnyway: () => void;
  onCompleteFields: () => void;
}

export default function MissingFieldsModal({
  open,
  onOpenChange,
  missingFields,
  onGetCardsAnyway,
  onCompleteFields,
}: MissingFieldsModalProps) {
  console.log("MissingFieldsModal render:", { open, missingFieldsCount: missingFields.length });
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="sm:max-w-2xl mx-auto h-auto max-h-[90vh] rounded-t-lg border-t left-1/2 -translate-x-1/2 fixed bottom-0 z-[10000]"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '42rem',
          width: '100%',
          zIndex: 10000
        }}
      >
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <SheetTitle className="text-lg">Missing Fields Detected</SheetTitle>
          </div>
          <SheetDescription className="text-sm">
            After scraping the job description, we found {missingFields.length} missing field{missingFields.length !== 1 ? "s" : ""} that could improve your HireCard quality.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 pb-6">
          <div className="bg-muted rounded-lg p-4 max-h-[40vh] overflow-y-auto">
            <p className="text-sm font-semibold mb-3 text-foreground">
              Missing Fields:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              {missingFields.map((field, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-amber-500">•</span>
                  {field}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onGetCardsAnyway}
              variant="outline"
              className="flex-1 h-12 text-base"
            >
              Get My Cards Anyway
            </Button>
            <Button
              onClick={onCompleteFields}
              className="flex-1 h-12 text-base font-semibold"
            >
              Complete the Missing Fields
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

