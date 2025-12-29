"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Loader1() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 45000; // 45 seconds total
    const startTime = Date.now();
    let rafId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = (elapsed / totalDuration) * 100;

      // Add some variance to make it feel more organic
      const variance = Math.sin(elapsed / 1000) * 2;
      const newProgress = Math.min(rawProgress + variance, 100);

      // Only update state if the change is significant to reduce render depth/frequency
      setProgress((prev) => {
        if (Math.abs(newProgress - prev) < 0.1 && newProgress < 100) {
          return prev;
        }
        return newProgress;
      });

      if (newProgress < 100) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <DynamicLoader progress={progress} />;
}

interface LoaderBlackProps {
  progress?: number;
  className?: string;
}

const PHASES = [
  { threshold: 0, text: "Initializing talent radar...", status: "BOOT" },
  { threshold: 25, text: "Scanning opportunity matrix...", status: "SCAN" },
  { threshold: 50, text: "Correlating market vectors...", status: "PROC" },
  { threshold: 75, text: "Finalizing your advantage...", status: "SYNC" },
];

const CARDS = [
  {
    id: "reality",
    name: "Reality Card",
    description: "The Truth About Making This Hire",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "market",
    name: "Market Card",
    description: "Addressable Talent Market",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "skill",
    name: "Skill Card",
    description: "Skills That Predict Success",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "pay",
    name: "Pay Card",
    description: "What The Market Pays",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "funnel",
    name: "Funnel Card",
    description: "How Much You Actually Need",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    id: "interview",
    name: "Interview Card",
    description: "Loop That Actually Works",
    gradient: "from-rose-500 to-red-600",
  },
  {
    id: "role",
    name: "Role Card",
    description: "Outcome-focused mission & product-led impact",
    gradient: "from-orange-400 to-amber-600",
  },
  {
    id: "talentmap",
    name: "Talent Map Card",
    description: "Pinpointing where top talent is moving next",
    gradient: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "fit",
    name: "Fit Card",
    description: "Psychographic motivators for senior hires",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "message",
    name: "Message Card",
    description: "Specificity-driven outreach hooks & truth",
    gradient: "from-cyan-400 to-teal-600",
  },
  {
    id: "outreach",
    name: "Outreach Card",
    description: "Optimized 3-step high-reply sequence",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "scorecard",
    name: "Scorecard Card",
    description: "Standardized criteria to reduce hiring bias",
    gradient: "from-violet-500 to-fuchsia-600",
  },
  {
    id: "plan",
    name: "Plan Card",
    description: "Week-by-week hiring execution roadmap",
    gradient: "from-slate-500 to-slate-700",
  },
];

export function DynamicLoader({ progress = 0, className }: LoaderBlackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typedText, setTypedText] = useState("");
  const [currentPhase, setCurrentPhase] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; delay: number }>
  >([]);
  const [visibleCardsCount, setVisibleCardsCount] = useState(0);

  // Phase detection - only update if different
  useEffect(() => {
    const phase = PHASES.findIndex((p, i) => {
      const next = PHASES[i + 1];
      return next
        ? progress >= p.threshold && progress < next.threshold
        : progress >= p.threshold;
    });
    const newPhase = Math.max(0, phase);
    setCurrentPhase((prev) => (prev !== newPhase ? newPhase : prev));
  }, [progress]);

  // Typewriter effect - only start if phase changed
  useEffect(() => {
    const targetText = PHASES[currentPhase]?.text || "";
    setTypedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < targetText.length) {
        setTypedText(targetText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [currentPhase]);

  // Generate rising particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = [
          ...prev,
          { id: Date.now(), x: Math.random() * 100, delay: 0 },
        ];
        return newParticles.slice(-20);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Progressively reveal cards based on progress - only update if count changed
  useEffect(() => {
    const cardsToShow = Math.floor((progress / 100) * CARDS.length);
    setVisibleCardsCount((prev) => (prev !== cardsToShow ? cardsToShow : prev));
  }, [progress]);

  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-white dark:bg-black overflow-hidden",
        className
      )}
    >
      {/* Geometric mesh background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black opacity-50" />

      {/* Rising particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-slate-400/20 dark:bg-white/20 rounded-full"
            style={{
              left: `${p.x}%`,
              animation: "rise 4s linear forwards",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Central display - Single Card */}
        <div className="flex flex-col items-center w-full max-w-3xl px-6">
          {/* Cards showcase - One at a time */}
          <div className="relative w-56 h-72 md:w-64 md:h-80 mb-12">
            <AnimatePresence mode="wait">
              {CARDS.map((card, index) => {
                const isActive =
                  index === Math.min(visibleCardsCount, CARDS.length - 1);

                if (!isActive) return null;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.9, rotateY: -10, y: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, rotateY: 10, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                      opacity: { duration: 0.3 },
                    }}
                    className="absolute inset-0"
                  >
                    {/* Premium Card Design */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                      {/* Ambient Background Glow */}
                      <motion.div
                        animate={{
                          opacity: [0.15, 0.25, 0.15],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={cn(
                          "absolute -inset-[50%] blur-[60px] bg-gradient-to-br",
                          card.gradient
                        )}
                      />

                      {/* Subtle Texture Overlay */}
                      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]" />

                      {/* Content Container */}
                      <div className="relative z-10 h-full p-8 flex flex-col items-center justify-center">
                        {/* Status Chip */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="absolute top-8 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                        >
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full animate-pulse",
                              card.gradient
                                .split(" ")[0]
                                .replace("from-", "bg-")
                            )}
                          />
                          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-white/40 uppercase">
                            Analyzing
                          </span>
                        </motion.div>

                        <div className="space-y-4 text-center">
                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none"
                          >
                            {card.name.split(" ")[0]}
                            <br />
                            <span className="text-slate-400 dark:text-white/20">
                              {card.name.split(" ")[1]}
                            </span>
                          </motion.h3>

                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className={cn(
                              "h-[1px] w-12 mx-auto",
                              card.gradient
                                .split(" ")[0]
                                .replace("from-", "bg-")
                            )}
                          />

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xs md:text-sm font-medium text-slate-600 dark:text-white/60 leading-relaxed max-w-[160px] mx-auto"
                          >
                            {card.description}
                          </motion.p>
                        </div>

                        {/* Bottom Metric */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="absolute bottom-10 flex flex-col items-center gap-3 w-full px-12"
                        >
                          <div className="flex justify-between w-full text-[8px] font-bold tracking-[0.2em] text-slate-400 dark:text-white/20 uppercase">
                            <span>Precision</span>
                            <span>99.9%</span>
                          </div>
                          <div className="h-[2px] w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className={cn(
                                "h-full w-1/3 opacity-50",
                                card.gradient
                                  .split(" ")[0]
                                  .replace("from-", "bg-")
                              )}
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* Corner Accents */}
                      <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-slate-200 dark:border-white/10 rounded-tl-lg" />
                      <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-slate-200 dark:border-white/10 rounded-br-lg" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Progress text */}
          <div className="text-center mb-8">
            <div className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
              {Math.min(visibleCardsCount + 1, CARDS.length)}
              <span className="text-slate-300 dark:text-white/20">/</span>
              {CARDS.length}
            </div>
            <div className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 dark:text-white/40">
              Building Your Deck
            </div>
          </div>

          {/* Typewriter text */}
          <div className="h-6 mb-8">
            <p className="text-slate-600 dark:text-white/60 text-sm font-mono tracking-wide">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Minimal progress bar */}
          <div className="w-full max-w-md mb-12">
            <div className="h-[1px] bg-slate-300 dark:bg-white/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-slate-900 dark:bg-white transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute inset-y-0 bg-slate-600/50 dark:bg-white/50 w-20 blur-sm"
                style={{
                  left: `${progress}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-mono text-slate-500 dark:text-white/30 tracking-widest">
              <span>START</span>
              <span>COMPLETE</span>
            </div>
          </div>

          {/* Phase indicators - minimal dots */}
          <div className="flex items-center gap-6">
            {PHASES.map((phase, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-500 border",
                    i <= currentPhase
                      ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white shadow-lg shadow-slate-900/20 dark:shadow-white/20"
                      : "bg-transparent border-slate-300 dark:border-white/20"
                  )}
                />
                <span
                  className={cn(
                    "text-[9px] font-mono tracking-widest transition-colors duration-500",
                    i <= currentPhase
                      ? "text-slate-700 dark:text-white/70"
                      : "text-slate-400 dark:text-white/20"
                  )}
                >
                  {phase.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom insight removed as requested */}
      </div>

      <style jsx>{`
        @keyframes rise {
          0% {
            bottom: -10px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            bottom: 100%;
            opacity: 0;
          }
        }

        @keyframes morph1 {
          0%,
          100% {
            border-radius: 0;
            transform: rotate(0deg);
          }
          50% {
            border-radius: 20%;
            transform: rotate(5deg);
          }
        }

        @keyframes morph2 {
          0%,
          100% {
            border-radius: 0;
            transform: rotate(0deg) scale(1.05);
          }
          50% {
            border-radius: 30%;
            transform: rotate(-5deg) scale(1.1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
