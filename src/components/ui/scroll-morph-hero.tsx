"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { LucideIcon } from "lucide-react";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface Card {
  id: string;
  title: string;
  description?: string;
  score?: string;
  icon?: LucideIcon;
  color?: string;
  metricValue?: string;
  metricLabel?: string;
}

interface FlipCardProps {
  card: Card;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
  };
}

// --- FlipCard Component ---
const CARD_WIDTH = 240;
const CARD_HEIGHT = 330;

function FlipCard({ card, index, total, phase, target }: FlipCardProps) {
  const Icon = card.icon;
  const isLeft = target.x < 0;

  return (
    <div
      style={{
        position: "absolute",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        zIndex: 10 - (index % 3), // Lowered z-index
        transform: `translate3d(${target.x}px, ${target.y}px, 0) rotate(${target.rotation}deg) scale(${target.scale})`,
        opacity: target.opacity,
      }}
      className="group pointer-events-auto"
    >
      <div className="relative h-full w-full">
        <Card
          className={cn(
            "h-full w-full flex flex-col shadow-2xl border-0 overflow-hidden rounded-[24px]",
            card.color ? `bg-linear-to-br ${card.color}` : "bg-slate-900"
          )}
        >
          {/* Decorative element - removed blur for performance */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full" />

          <CardHeader className="flex-1 flex flex-col justify-between p-6 relative z-10">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">
                  {card.title.split(" ")[0]}
                </span>
                <CardTitle className="text-xl font-black text-white mt-1">
                  {card.title}
                </CardTitle>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                {Icon && <Icon className="w-5 h-5 text-white" />}
              </div>
            </div>

            <div className="my-auto flex flex-col gap-1">
              <div className="text-4xl font-black text-white tracking-tighter">
                {card.metricValue || "****"}
              </div>
              <div className="text-xs font-medium text-white/50 uppercase tracking-widest">
                {card.metricLabel || "Metric"}
              </div>
            </div>

            <div className="mt-auto">
              {card.description && (
                <div className="text-sm font-semibold text-white/90 leading-snug line-clamp-2">
                  "{card.description}"
                </div>
              )}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Live Market Data
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

// --- Main Hero Component ---
interface ScrollMorphHeroProps {
  cards: Card[];
  title: string;
  description: string;
}

function ScrollMorphHero({
  cards,
  title,
  description,
}: ScrollMorphHeroProps) {
  const TOTAL_CARDS = cards.length;
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Container */}
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">
        {/* Center Text */}
        <div className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-auto top-[25%] -translate-y-1/2 px-4 max-w-[600px] mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-4 text-balance leading-[1.1]">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-4">
            {description}
          </p>
        </div>

        {/* Main Container - Framed Side Layout */}
        <div className="relative hidden md:flex items-center justify-center w-full h-full overflow-visible pointer-events-none">
          {containerSize.width > 0 && cards.slice(0, 6).map((card, i) => {
            const isMobile = containerSize.width < 768;
            const isLeft = i < 3;
            const positionInSide = i % 3; // 0, 1, 2 for each side

            // Horizontal position: tight stack
            const cardSafetyPadding = isMobile ? 10 : 30;
            const maxSafeX =
              containerSize.width / 2 - CARD_WIDTH / 2 - cardSafetyPadding;

            // Tight stacking like the banking image
            // We want them overlapping significantly
            const xStep = isMobile ? 15 : 25;
            const xBase = maxSafeX * 0.95;
            let x = isLeft
              ? -(xBase - positionInSide * xStep)
              : xBase - positionInSide * xStep;

            // Vertical position - stacked and fanned
            const yStep = isMobile ? 30 : 45;
            let y = positionInSide * yStep;

            // Shift down to center/frame the input form
            const verticalOffset = isMobile ? 80 : 100;
            y += verticalOffset;

            // Rotation: Creative incline to match the banking image
            // Top card (index 0) is flat or slightly tilted
            // Cards below it tilt more aggressively
            const rotationAngles = [10, 22, 35];
            let rotation = isLeft
              ? rotationAngles[positionInSide]
              : -rotationAngles[positionInSide];

            const target = {
              x,
              y,
              rotation,
              scale: isMobile ? 0.65 : 0.9,
              opacity: 1,
            };

            return (
              <FlipCard
                key={card.id}
                card={card}
                index={i}
                total={6}
                phase="circle"
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(ScrollMorphHero);
