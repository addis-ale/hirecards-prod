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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#102a63" }}>
            Card Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The card you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/results")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View All Cards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/results")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to All Cards</span>
          </button>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-16 h-16 rounded-lg ${card.gradient} flex items-center justify-center flex-shrink-0`}
                >
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1
                    className="text-lg font-bold mb-1 tracking-tight leading-tight"
                    style={{ color: "#102a63" }}
                  >
                    {card.label}
                  </h1>
                  <p className="text-gray-600 text-sm">{card.teaser}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
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

