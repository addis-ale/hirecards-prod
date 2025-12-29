"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCardById, allCards } from "@/lib/cardCategories";
import { HireCardTabs } from "@/components/HireCardTabs";
import { CardNavigator } from "@/components/cards/CardNavigator";

export default function CardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params?.cardId as string;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const card = getCardById(cardId);

  useEffect(() => {
    // Check subscription status
    const plan = sessionStorage.getItem("selectedPlan");
    setIsSubscribed(!!plan);
    setLoading(false);
    // Set active tab in session storage for navigation
    if (cardId) {
      sessionStorage.setItem("activeTab", cardId);
    }
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900 dark:text-white" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 uppercase">
            Card Not Found
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-bold mb-6">
            The card you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/results")}
            className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg"
          >
            View All Cards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-24">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push("/results")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-black uppercase tracking-wider">Back to All Cards</span>
          </button>
          <div className="text-center">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              {card.label.split(" ")[0]}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 uppercase leading-tight">
              {card.label}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">
              {card.teaser}
            </p>
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border-2 border-slate-200 dark:border-slate-700 shadow-2xl mb-4 transition-colors duration-300 overflow-hidden">
          <HireCardTabs isSubscribed={isSubscribed} initialCardId={cardId} />
        </div>

        {/* All Cards Navigator - Fixed at bottom, controlled by CardNavigator component */}
        <CardNavigator
          currentCardId={cardId}
          onNavigateToCard={(cardId) => router.push(`/cards/${cardId}`)}
        />

        {/* Spacer to prevent content from being hidden behind fixed navigator */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}

