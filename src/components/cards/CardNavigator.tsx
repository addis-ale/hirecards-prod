"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { allCards, getCardById } from "@/lib/cardCategories";
import { cn } from "@/lib/utils";

interface CardNavigatorProps {
  currentCardId: string;
  onNavigateToCard: (cardId: string) => void;
}

export function CardNavigator({ currentCardId, onNavigateToCard }: CardNavigatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show navigator when near bottom of page
      const isNearBottom = scrollPosition + windowHeight >= documentHeight - 100;
      setIsVisible(isNearBottom || scrollPosition < 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentIndex = allCards.findIndex((card) => card.id === currentCardId);
  const currentCard = getCardById(currentCardId);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigateToCard(allCards[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < allCards.length - 1) {
      onNavigateToCard(allCards[currentIndex + 1].id);
    }
  };

  if (!currentCard) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              currentIndex === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex-1 mx-4 text-center">
            <div className="text-sm text-gray-600">
              Card {currentIndex + 1} of {allCards.length}
            </div>
            <div className="font-semibold text-gray-900">{currentCard.label}</div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === allCards.length - 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              currentIndex === allCards.length - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

