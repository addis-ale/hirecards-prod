"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CardPreview } from "@/components/cards/CardPreview";
import { cardCategories, allCards, getCardsByCategory } from "@/lib/cardCategories";

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
    ? cardCategories.find(cat => cat.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/results")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Results</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#102a63" }}>
                Journey to 9.9
              </h1>
              <p className="text-gray-600 mt-1">
                Explore all cards to maximize your hiring score
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${!selectedCategory
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300"
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
                  px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${selectedCategory === category.id
                    ? `${category.gradient} text-white shadow-md`
                    : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300"
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {selectedCategoryData && (
            <p className="mt-3 text-sm text-gray-600">
              {selectedCategoryData.description}
            </p>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CardPreview
                card={card}
                isCurrent={currentCardId === card.id}
                onClick={() => router.push(`/cards/${card.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: "#102a63" }}>
            Score Impact Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">+3.8</div>
              <div className="text-sm text-gray-600 mt-1">Foundation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">+2.3</div>
              <div className="text-sm text-gray-600 mt-1">Market Intelligence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">+2.1</div>
              <div className="text-sm text-gray-600 mt-1">Outreach & Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">+1.5</div>
              <div className="text-sm text-gray-600 mt-1">Selection</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <div className="text-3xl font-bold text-emerald-600">+9.0</div>
            <div className="text-sm text-gray-600 mt-1">Total Potential Uplift</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}