"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ResultCard } from "@/components/cards/ResultCard";
import {
  cardCategories,
  allCards,
  getCardsByCategory,
} from "@/lib/cardCategories";

export default function ResultsView() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);

  // Get current card from session or URL params
  React.useEffect(() => {
    const activeTab = sessionStorage.getItem("activeTab");
    if (activeTab) {
      setCurrentCardId(activeTab);
    }
  }, []);

  const filteredCards = selectedCategory
    ? getCardsByCategory(selectedCategory)
    : allCards;

  const selectedCategoryData = selectedCategory
    ? cardCategories.find((cat) => cat.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4 uppercase">
            HireCards Battle Deck
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
            Your strategy before you go to market
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`
                px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all
                ${
                  !selectedCategory
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white"
                }
              `}
            >
              All Cards
            </button>
            {cardCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all
                  ${
                    selectedCategory === category.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white"
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              <ResultCard
                card={card}
                onClick={() => router.push(`/cards/${card.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
