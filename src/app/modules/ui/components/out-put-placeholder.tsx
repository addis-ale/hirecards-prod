"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  useContainerScrollContext,
} from "@/app/modules/ui/components/animated-cards-stack";
import { heroCards } from "./hero-cards-data";
import { CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useTransform, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function getSectionClass(theme: string | undefined) {
  return theme === "dark"
    ? "bg-destructive text-secondary px-8 py-24"
    : "bg-slate-50 px-8 py-24";
}

function getCardVariant(theme: string | undefined) {
  return theme === "dark" ? "dark" : "light";
}

// CTA Card Component that appears after all cards flip
const CTACard = ({ arrayLength }: { arrayLength: number }) => {
  const { scrollYProgress } = useContainerScrollContext();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  // CTA appears after all cards have flipped
  // Last card finishes at: arrayLength / (arrayLength + 1)
  const ctaStart = arrayLength / (arrayLength + 1);
  const ctaEnd = 1;

  const opacity = useTransform(smoothProgress, [ctaStart, ctaEnd], [0, 1]);
  const scale = useTransform(smoothProgress, [ctaStart, ctaEnd], [0.9, 1]);
  const y = useTransform(smoothProgress, [ctaStart, ctaEnd], [20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: arrayLength * 10,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1,
        width: "100vw",
        height: "100%",
      }}
      className="flex items-center justify-center"
    >
      <motion.div
        style={{
          opacity,
          scale,
          y,
          width: "100%",
          maxWidth: "70vw",
        }}
        className="mx-auto p-16 md:p-20 rounded-[40px] bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border-0 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
            READY TO STOP
            <br />
            WINGING IT?
          </h3>
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 tracking-tight">
            LET'S BUILD SOMETHING BETTER.
          </h4>
          <p className="text-xl md:text-2xl text-white/80 max-w-6xl leading-relaxed">
            Join the teams who stopped winging it and started winning at hiring
          </p>
          <Button
            size="lg"
            className="group mt-6 px-12 py-8 rounded-2xl font-bold text-lg md:text-xl shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] bg-white text-slate-900 hover:bg-slate-100 transition-all hover:-translate-y-0.5"
          >
            <span>Generate Battle Cards</span>
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export const OutPutPlaceholder = () => {
  const { theme } = useTheme();

  return (
    <section className={getSectionClass(theme)}>
      <div className="mb-12">
        <h3 className="text-center text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
          Stop guessing. <br className="hidden sm:block" />
          Start hiring with precision.
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600 leading-relaxed">
          See a live example below, a clear, data-driven view of your best
          hiring options, including cost, timing, and risk tradeoffs.
        </p>
      </div>
      <ContainerScroll className="container h-[400vh]">
        <div className="sticky left-0 top-0 h-svh w-full py-12 flex items-center justify-center">
          <CardsContainer className="mx-auto w-full max-w-2xl h-[450px]">
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
                    {/* Header */}
                    <div className="flex justify-between items-start w-full mb-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">
                          {card.title.split(" ")[0]}
                        </span>
                        <h4 className="text-xl font-black text-white mt-1">
                          {card.title}
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                        {Icon && <Icon className="w-5 h-5 text-white" />}
                      </div>
                    </div>

                    {/* Metric */}
                    <div className="my-auto flex flex-col gap-2">
                      <div className="text-5xl font-black text-white tracking-tighter">
                        {card.metricValue || "****"}
                      </div>
                      <div className="text-xs font-medium text-white/50 uppercase tracking-widest">
                        {card.metricLabel || "Metric"}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                      <p className="text-base font-medium text-white/90 leading-snug">
                        "{card.description}"
                      </p>
                    </div>
                  </div>
                </CardTransformed>
              );
            })}
            <CTACard arrayLength={heroCards.length} />
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  );
};
