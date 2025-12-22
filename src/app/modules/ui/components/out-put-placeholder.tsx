"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
} from "@/app/modules/ui/components/animated-cards-stack"
import { heroCards } from "./hero-cards-data"
import { CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function getSectionClass(theme: string | undefined) {
  return theme === "dark"
    ? "bg-destructive text-secondary px-8 py-24"
    : "bg-slate-50 px-8 py-24"
}

function getCardVariant(theme: string | undefined) {
  return theme === "dark" ? "dark" : "light"
}

export const OutPutPlaceholder = () => {
  const { theme } = useTheme()

  return (
    <section className={getSectionClass(theme)}>
      <div className="mb-12">
        <h3 className="text-center text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
          Stop guessing. <br className="hidden sm:block" />
          Start hiring with precision.
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600 leading-relaxed">
          See a live example below, a clear, data-driven view of your best hiring options, including cost, timing, and risk tradeoffs.
        </p>
      </div>
      <ContainerScroll className="container h-[400vh]">
        <div className="sticky left-0 top-0 h-svh w-full py-12 flex items-center justify-center">
          <CardsContainer className="mx-auto w-full max-w-3xl h-[500px]">
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
                  <div className={cn(
                    "h-full w-full flex flex-col p-8",
                    card.color ? `bg-linear-to-br ${card.color}` : "bg-slate-900"
                  )}>
                    {/* Header */}
                    <div className="flex justify-between items-start w-full mb-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">
                          {card.title.split(" ")[0]}
                        </span>
                        <h4 className="text-2xl font-black text-white mt-1">
                          {card.title}
                        </h4>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                    </div>

                    {/* Metric */}
                    <div className="my-auto flex flex-col gap-2">
                      <div className="text-6xl font-black text-white tracking-tighter">
                        {card.metricValue || "****"}
                      </div>
                      <div className="text-sm font-medium text-white/50 uppercase tracking-widest">
                        {card.metricLabel || "Metric"}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-auto pt-8 border-t border-white/10">
                      <p className="text-lg font-medium text-white/90 leading-snug">
                        "{card.description}"
                      </p>
                    </div>
                  </div>
                </CardTransformed>
              );
            })}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}