"use client"

import { useState } from "react"
import {
  Briefcase,
  Code2,
  TrendingUp,
  Map,
  DollarSign,
  Filter,
  Users,
  MessageSquare,
  Mic,
  ClipboardCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Zap,
  Target,
} from "lucide-react"

const cards = [
  {
    id: "reality",
    name: "Reality",
    description: "Market reality check & hiring feasibility",
    boost: 1.0,
    icon: Target,
    category: "foundation",
    gradient: "from-red-500 to-pink-600",
    size: "large",
  },
  {
    id: "role",
    name: "Role",
    description: "Define job requirements & responsibilities",
    boost: 1.0,
    icon: Briefcase,
    category: "foundation",
    gradient: "from-amber-500 to-orange-600",
    size: "large",
  },
  {
    id: "skill",
    name: "Skill",
    description: "Technical & soft skill mapping",
    boost: 0.8,
    icon: Code2,
    category: "analysis",
    gradient: "from-blue-500 to-indigo-600",
    size: "medium",
  },
  {
    id: "market",
    name: "Market",
    description: "Industry trends & demand signals",
    boost: 0.9,
    icon: TrendingUp,
    category: "research",
    gradient: "from-emerald-500 to-teal-600",
    size: "medium",
  },
  {
    id: "talent-map",
    name: "Talent Map",
    description: "Candidate pool visualization",
    boost: 0.6,
    icon: Map,
    category: "research",
    gradient: "from-violet-500 to-purple-600",
    size: "small",
  },
  {
    id: "pay",
    name: "Pay",
    description: "Compensation benchmarking",
    boost: 0.8,
    icon: DollarSign,
    category: "analysis",
    gradient: "from-green-500 to-emerald-600",
    size: "large",
  },
  {
    id: "funnel",
    name: "Funnel",
    description: "Recruitment pipeline analytics",
    boost: 0.8,
    icon: Filter,
    category: "process",
    gradient: "from-cyan-500 to-blue-600",
    size: "small",
  },
  {
    id: "fit",
    name: "Fit",
    description: "Culture & team alignment score",
    boost: 0.7,
    icon: Users,
    category: "analysis",
    gradient: "from-pink-500 to-rose-600",
    size: "medium",
  },
  {
    id: "message",
    name: "Message",
    description: "Outreach templates & sequences",
    boost: 0.6,
    icon: MessageSquare,
    category: "outreach",
    gradient: "from-sky-500 to-cyan-600",
    size: "small",
  },
  {
    id: "interview",
    name: "Interview",
    description: "Question bank & evaluation rubrics",
    boost: 0.9,
    icon: Mic,
    category: "process",
    gradient: "from-orange-500 to-red-600",
    size: "medium",
  },
  {
    id: "scorecard",
    name: "Scorecard",
    description: "Candidate assessment matrix",
    boost: 0.6,
    icon: ClipboardCheck,
    category: "evaluation",
    gradient: "from-teal-500 to-green-600",
    size: "small",
  },
  {
    id: "plan",
    name: "Plan",
    description: "Hiring timeline & milestones",
    boost: 0.9,
    icon: Calendar,
    category: "strategy",
    gradient: "from-indigo-500 to-violet-600",
    size: "medium",
  },
]

const categories = [
  { id: "all", label: "All Cards" },
  { id: "foundation", label: "Foundation" },
  { id: "analysis", label: "Analysis" },
  { id: "research", label: "Research" },
  { id: "process", label: "Process" },
  { id: "outreach", label: "Outreach" },
  { id: "evaluation", label: "Evaluation" },
  { id: "strategy", label: "Strategy" },
]

export default function HireCardsDashboard() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const filteredCards = activeCategory === "all" ? cards : cards.filter((card) => card.category === activeCategory)

  const totalBoost = filteredCards.reduce((acc, card) => acc + card.boost, 0).toFixed(1)

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-zinc-500">Hiring Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="text-white">Hire</span>
                <span className="text-emerald-500">Cards</span>
              </h1>
              <p className="text-zinc-400 mt-2 max-w-md">
                Navigate your hiring strategy with precision. Each card unlocks deeper insights.
              </p>
            </div>

            {/* Boost Meter */}
            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-zinc-400">Total Boost</span>
              </div>
              <div className="text-2xl font-bold text-white">+{totalBoost}</div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-white text-black font-medium"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </header>

        {/* Cards Grid - Bento Style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredCards.map((card, index) => {
            const Icon = card.icon
            const isHovered = hoveredCard === card.id

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${
                  card.size === "large"
                    ? "col-span-2 row-span-2"
                    : card.size === "medium"
                      ? "col-span-1 sm:col-span-2 lg:col-span-1"
                      : "col-span-1"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Card Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="absolute inset-0 bg-zinc-900 group-hover:bg-zinc-900/20 transition-colors duration-500" />

                {/* Border Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl sm:rounded-3xl border transition-colors duration-300 ${
                    isHovered ? "border-white/20" : "border-zinc-800"
                  }`}
                />

                {/* Content */}
                <div
                  className={`relative z-10 p-4 sm:p-6 flex flex-col h-full ${card.size === "large" ? "min-h-[280px] sm:min-h-[320px]" : "min-h-[140px] sm:min-h-[160px]"}`}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-auto">
                    <div
                      className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon
                        className={`${card.size === "large" ? "w-6 h-6 sm:w-8 sm:h-8" : "w-5 h-5 sm:w-6 sm:h-6"} text-white`}
                      />
                    </div>

                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        isHovered ? "bg-white text-black" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>+{card.boost}</span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-semibold transition-colors duration-300 ${
                          card.size === "large" ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                        } ${isHovered ? "text-white" : "text-zinc-100"}`}
                      >
                        {card.name}
                      </h3>
                      <ArrowUpRight
                        className={`w-4 h-4 transition-all duration-300 ${
                          isHovered
                            ? "opacity-100 translate-x-0 -translate-y-0"
                            : "opacity-0 -translate-x-2 translate-y-2"
                        }`}
                      />
                    </div>

                    <p
                      className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isHovered ? "text-white/80" : "text-zinc-500"
                      } ${card.size === "small" ? "hidden sm:block" : ""}`}
                    >
                      {card.description}
                    </p>

                    {/* Extra content for large cards */}
                    {card.size === "large" && (
                      <div className="mt-4 pt-4 border-t border-zinc-800/50 group-hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-700`}
                                style={{ width: `${card.boost * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-zinc-500 group-hover:text-white/60">
                            {Math.round(card.boost * 100)}% impact
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Particles */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/40 animate-ping"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          animationDelay: `${i * 150}ms`,
                          animationDuration: "1.5s",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-white">{filteredCards.length}</div>
              <div className="text-xs sm:text-sm text-zinc-500">Active Cards</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500">+{totalBoost}</div>
              <div className="text-xs sm:text-sm text-zinc-500">Combined Boost</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {categories.filter((c) => c.id !== "all").length}
              </div>
              <div className="text-xs sm:text-sm text-zinc-500">Categories</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-amber-500">94%</div>
              <div className="text-xs sm:text-sm text-zinc-500">Completion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
