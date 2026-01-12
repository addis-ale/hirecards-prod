"use client";

import { useEffect } from "react";

export function useScoreChangeNotification() {
  useEffect(() => {
    // Listen for score changes from cards
    const handleScoreChange = (event: CustomEvent) => {
      const { cardId, newScore, oldScore } = event.detail;
      console.log(`Score changed for ${cardId}: ${oldScore} → ${newScore}`);
      // You can add toast notifications or other UI feedback here
    };

    window.addEventListener("scoreChange", handleScoreChange as EventListener);

    return () => {
      window.removeEventListener("scoreChange", handleScoreChange as EventListener);
    };
  }, []);

  return null;
}

