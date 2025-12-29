"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { detailedHeroCards } from "./detailed-results-data";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, ChevronRight } from "lucide-react";

export function TimelineResults() {
  const data = detailedHeroCards.map((card, index) => ({
    title: card.title,
    content: (
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
             <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10"
              )}>
                {card.icon && <card.icon className="w-6 h-6 text-primary" />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{card.subtitle}</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{card.title}</h4>
              </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">{card.metricLabel}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{card.metricValue}</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-black text-primary">{card.uplift}</span>
                </div>
            </div>
        </div>

        {/* Hover Features Grid */}
        <FeaturesSectionWithHoverEffects features={card.features} />
      </div>
    ),
  }));

  // Add the final Math Card
  data.push({
    title: "Score Math",
    content: (
        <div className="px-4 py-10 space-y-10">
            <div className="p-8 rounded-[40px] bg-slate-900 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
                
                <div className="relative z-10 space-y-6">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-500" /> The Journey to 9.9
                    </h3>
                    <p className="text-slate-400 font-bold max-w-2xl leading-relaxed">
                        Achieving a perfect hire isn't about one single card. It's the cumulative effect of fixing alignment, market scope, and process speed across the entire deck.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        {[
                            { label: "Reality", val: "+1.0" },
                            { label: "Role", val: "+1.0" },
                            { label: "Skill", val: "+0.8" },
                            { label: "Market", val: "+0.9" },
                            { label: "Talent", val: "+0.6" },
                            { label: "Pay", val: "+0.8" },
                            { label: "Funnel", val: "+0.8" },
                            { label: "Fit", val: "+0.7" },
                            { label: "Msg", val: "+0.6" },
                            { label: "Int", val: "+0.9" },
                            { label: "Score", val: "+0.6" },
                            { label: "Plan", val: "+0.9" },
                        ].map((item, i) => (
                            <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                                <span className="text-[10px] font-black text-white/40 uppercase">{item.label}</span>
                                <span className="text-lg font-black text-white">{item.val}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <p className="text-xs font-black text-white/40 uppercase tracking-widest">Maximum Reachable Score</p>
                            <div className="flex items-center gap-3">
                                <span className="text-5xl font-black text-white">9.9</span>
                                <div className="px-3 py-1 bg-emerald-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest">Capped</div>
                            </div>
                        </div>
                        <div className="p-6 rounded-3xl bg-primary/20 border border-primary/30 text-center">
                            <p className="text-sm font-black text-primary uppercase mb-1">Starting Score</p>
                            <p className="text-3xl font-black text-white">5.5</p>
                        </div>
                        <ChevronRight className="hidden md:block w-12 h-12 text-white/10" />
                        <div className="p-6 rounded-3xl bg-white/10 border border-white/20 text-center">
                            <p className="text-sm font-black text-white/60 uppercase mb-1">Potential Uplift</p>
                            <p className="text-3xl font-black text-white">≈ +9.0</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center space-y-4">
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Bottom Line</h4>
                <p className="text-slate-600 dark:text-slate-400 font-bold max-w-xl mx-auto">
                    If you align fast, move within 14 days, and pay proper rates → <span className="text-primary underline">You will hire.</span>
                </p>
            </div>
        </div>
    )
  });

  return (
    <div className="w-full bg-white dark:bg-slate-950 transition-colors duration-500">
       <div className="relative z-10">
          <Timeline data={data} />
       </div>
    </div>
  );
}
