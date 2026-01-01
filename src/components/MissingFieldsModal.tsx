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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="sm:max-w-2xl !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !bottom-auto !inset-x-auto !inset-y-auto h-auto max-h-[90vh] rounded-lg border data-[state=closed]:slide-out-to-bottom-0 data-[state=open]:slide-in-from-bottom-0"
      >
        <SheetHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <SheetTitle>Missing Fields Detected</SheetTitle>
          </div>
          <SheetDescription>
            After scraping the job description, we found {missingFields.length} missing field{missingFields.length !== 1 ? "s" : ""} that could improve your HireCard quality.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="bg-muted rounded-md p-4">
            <p className="text-sm font-medium mb-2 text-foreground">
              Missing Fields:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onGetCardsAnyway}
              variant="outline"
              className="flex-1"
            >
              Get My Cards Anyway
            </Button>
            <Button
              onClick={onCompleteFields}
              className="flex-1"
            >
              Complete the Missing Fields
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

