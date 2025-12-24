"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  useContainerScrollContext,
} from "@/app/modules/landing-page/ui/components/animated-cards-stack";
import { heroCards } from "./hero-cards-data";
import { cn } from "@/lib/utils";
import {
  motion,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function getSectionClass() {
  return "bg-slate-50 dark:bg-slate-950 px-8 py-24 transition-colors duration-300";
}

function getCardVariant(theme: string | undefined) {
  return theme === "dark" ? "dark" : "light";
}

const FinalBanner = ({ arrayLength }: { arrayLength: number }) => {
  const { scrollYProgress } = useContainerScrollContext();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  // Banner appears as the very last thing
  const start = arrayLength / (arrayLength + 1);
  const end = 1;

  const opacity = useTransform(smoothProgress, [start, end], [0, 1]);
  const scale = useTransform(smoothProgress, [start, end], [0.95, 1]);
  const yAnim = useTransform(smoothProgress, [start, end], [40, 0]);
  const translateY = useMotionTemplate`calc(-50% + ${yAnim}px)`;

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y: translateY,
        position: "absolute",
        left: "50%",
        top: "55%",
        x: "-50%",
        width: "100%",
        zIndex: 100,
      }}
      className="max-w-5xl mx-auto px-4 pointer-events-none"
      suppressHydrationWarning
    >
      <div className="relative group pointer-events-auto overflow-hidden rounded-[48px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-12 md:p-20 min-h-[550px] shadow-2xl transition-colors duration-300 flex flex-col items-center justify-center text-center">
        {/* Project DNA: Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-40" />

        {/* Project DNA: Animated Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/15 dark:bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter uppercase">
                READY TO STOP
                <br />
                <span className="text-primary">WINGING IT?</span>
              </h3>
              <h4 className="text-lg md:text-xl lg:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                LET&apos;S BUILD SOMETHING BETTER.
              </h4>
            </div>

            <p className="text-slate-600 dark:text-slate-400 font-bold text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Join the teams who stopped winging it and started winning at
              hiring
            </p>
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              className="group px-10 py-7 rounded-2xl font-black text-lg md:text-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:-translate-y-1 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.3)] dark:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)]"
            >
              <span>FIX MY HIRING MESS</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const OutPutPlaceholder = () => {
  const { theme } = useTheme();

  return (
    <section className={getSectionClass()} suppressHydrationWarning>
      <div className="mb-12">
        <h3 className="text-center text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 uppercase">
          Zero in on the truth. <br className="hidden sm:block" />
          Build a strategy that wins.
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
          Dive deep into the precise data points that separate a successful hire
          from a costly restart. Your complete hiring playbook, decoded.
        </p>
      </div>
      <ContainerScroll className="container h-[300svh]">
        <div className="sticky left-0 top-0 h-svh w-full flex items-center justify-center">
          <div className="relative w-full max-w-5xl mx-auto h-[620px]">
            <CardsContainer className="mx-auto w-full max-w-2xl h-[520px] mt-16">
              {heroCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <CardTransformed
                    arrayLength={heroCards.length}
                    key={card.id}
                    variant={getCardVariant(theme)}
                    index={index + 1}
                    className="p-0 overflow-hidden rounded-[32px] border-0 shadow-2xl"
                  >
                    <div
                      className={cn(
                        "h-full w-full flex flex-col p-6",
                        card.color
                          ? `bg-linear-to-br ${card.color}`
                          : "bg-slate-900"
                      )}
                    >
                      {/* Header Row */}
                      <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col flex-1">
                          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                            {card.title.split(" ")[0]}
                          </span>
                          <h4 className="text-xl font-black text-white leading-tight">
                            {card.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-3xl font-black text-white tracking-tight leading-none">
                              {card.metricValue}
                            </div>
                            <div className="text-xs font-semibold text-white/60 uppercase">
                              {card.metricLabel}
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center border border-white/20">
                            {Icon && <Icon className="w-5 h-5 text-white" />}
                          </div>
                        </div>
                      </div>

                      {/* Key Insights */}
                      {card.keyInsights && (
                        <div className="mt-4">
                          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Key Insights</span>
                          <ul className="mt-2 space-y-1.5">
                            {card.keyInsights.slice(0, 3).map((insight: string, idx: number) => (
                              <li key={idx} className="text-sm text-white leading-snug flex items-start gap-2">
                                <span className="text-white/50 font-bold">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Brutal Truth */}
                      {card.brutalTruth && (
                        <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/20">
                          <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">⚡ Brutal Truth</span>
                          <p className="text-sm text-white leading-relaxed mt-2">
                            {card.brutalTruth}
                          </p>
                        </div>
                      )}

                      {/* Helps & Hurts */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {card.helps && (
                          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">What Helps</span>
                            <ul className="mt-2 space-y-1">
                              {card.helps.slice(0, 3).map((item: string, idx: number) => (
                                <li key={idx} className="text-sm text-white leading-snug flex items-start gap-1.5">
                                  <span className="text-emerald-300 font-bold">+</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {card.hurts && (
                          <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/30">
                            <span className="text-xs font-bold text-red-300 uppercase tracking-wider">What Hurts</span>
                            <ul className="mt-2 space-y-1">
                              {card.hurts.slice(0, 3).map((item: string, idx: number) => (
                                <li key={idx} className="text-sm text-white leading-snug flex items-start gap-1.5">
                                  <span className="text-red-300 font-bold">−</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                    </div>
                  </CardTransformed>
                );
              })}
            </CardsContainer>
            <FinalBanner arrayLength={heroCards.length} />
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
};
