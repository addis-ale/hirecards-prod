"use client";

import { useState } from "react";
import { Zap, Target, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollMorphHero from "@/app/modules/ui/components/scroll-morph-hero";
import { heroCards } from "./hero-cards-data";

export const HomeHeroSection = () => {
  const [roleDescription, setRoleDescription] = useState("");

  return (
    <section className="relative h-screen flex flex-col overflow-hidden bg-linear-to-b from-white via-gray-50/30 to-white">
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-slate-100/20 rounded-full blur-[100px]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Scroll Morph Hero with Cards */}
      <div className="relative z-10 h-full pt-32">
        <ScrollMorphHero
          cards={heroCards}
          title="Know the Market Before You Hire"
          description="Transform any job description into interactive 'Battle Cards'. Get instant clarity on salary benchmarks, candidate supply, and interview strategy in 5 minutes."
        />
      </div>

      {/* Input Section Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-50 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            {/* Label above input */}

            <div className="relative group">
              {/* Simplified glow effect - removed blur for performance */}
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-[22px] opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

              <div className="relative bg-white rounded-3xl p-1.5 border border-slate-200 shadow-2xl">
                <div className="bg-white rounded-2xl p-3 shadow-inner">
                  <textarea
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Paste a LinkedIn JD link or describe the role (e.g., 'Senior React Dev for a Fintech startup in London')..."
                    className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none focus:border-0 resize-none text-sm text-slate-900 placeholder:text-slate-400 min-h-[80px] font-medium"
                    style={{ outline: "none", boxShadow: "none" }}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-0 pt-2 border-t border-slate-100">
                    <Button
                      className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-6 rounded-2xl font-bold text-base text-primary-foreground shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] bg-primary hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                      disabled={!roleDescription.trim()}
                    >
                      <span>Generate Battle Cards</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature pills - simplified for performance */}
    </section>
  );
};
