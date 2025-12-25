"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { cn } from "@/lib/utils"
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
  Target,
} from "lucide-react"

export default function Home() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = 45000 // 45 seconds total
    const startTime = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const rawProgress = (elapsed / totalDuration) * 100

      // Add some variance to make it feel more organic
      const variance = Math.sin(elapsed / 1000) * 2
      const newProgress = Math.min(rawProgress + variance, 100)

      setProgress(newProgress)

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress)
      }
    }

    requestAnimationFrame(updateProgress)
  }, [])

  return <DynamicLoader progress={progress} />
}


interface LoaderBlackProps {
  progress?: number
  className?: string
}

export function DynamicLoader({ progress = 0, className }: LoaderBlackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [typedText, setTypedText] = useState("")
  const [currentPhase, setCurrentPhase] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([])
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  const phases = useMemo(() => [
    { threshold: 0, text: "Initializing talent radar...", status: "BOOT" },
    { threshold: 25, text: "Scanning opportunity matrix...", status: "SCAN" },
    { threshold: 50, text: "Correlating market vectors...", status: "PROC" },
    { threshold: 75, text: "Finalizing your advantage...", status: "SYNC" },
  ], [])

  const cards = useMemo(() => [
    { id: "reality", name: "Reality", icon: Target, gradient: "from-red-500 to-pink-600" },
    { id: "role", name: "Role", icon: Briefcase, gradient: "from-amber-500 to-orange-600" },
    { id: "skills", name: "Skills", icon: Code2, gradient: "from-blue-500 to-cyan-600" },
    { id: "demand", name: "Demand", icon: TrendingUp, gradient: "from-green-500 to-emerald-600" },
    { id: "supply", name: "Supply", icon: Map, gradient: "from-purple-500 to-violet-600" },
    { id: "salary", name: "Salary", icon: DollarSign, gradient: "from-yellow-500 to-amber-600" },
    { id: "sourcing", name: "Sourcing", icon: Filter, gradient: "from-indigo-500 to-blue-600" },
    { id: "screening", name: "Screening", icon: Users, gradient: "from-pink-500 to-rose-600" },
    { id: "assessment", name: "Assessment", icon: MessageSquare, gradient: "from-teal-500 to-cyan-600" },
    { id: "interview", name: "Interview", icon: Mic, gradient: "from-orange-500 to-red-600" },
    { id: "evaluation", name: "Evaluation", icon: ClipboardCheck, gradient: "from-lime-500 to-green-600" },
    { id: "offer", name: "Offer", icon: Calendar, gradient: "from-fuchsia-500 to-purple-600" },
  ], [])

  // Geometric canvas animation - triangular mesh
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    let time = 0
    const points: Array<{ x: number; y: number; baseX: number; baseY: number }> = []
    const cols = 12
    const rows = 12
    const spacing = Math.max(canvas.offsetWidth, canvas.offsetHeight) / 8

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - cols / 2) * spacing + canvas.offsetWidth / 4
        const y = (j - rows / 2) * spacing + canvas.offsetHeight / 4
        points.push({ x, y, baseX: x, baseY: y })
      }
    }

    const animate = () => {
      // Use white for light mode, black for dark mode
      const isDark = document.documentElement.classList.contains('dark')
      ctx.fillStyle = isDark ? "#000000" : "#ffffff"
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      time += 0.008

      // Update points with wave motion
      points.forEach((p, i) => {
        const wave = Math.sin(time + i * 0.1) * 15
        const wave2 = Math.cos(time * 0.7 + i * 0.05) * 10
        p.x = p.baseX + wave
        p.y = p.baseY + wave2
      })

      // Draw connections
      points.forEach((p, i) => {
        points.forEach((p2, j) => {
          if (i >= j) return
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < spacing * 1.5) {
            const alpha = (1 - dist / (spacing * 1.5)) * 0.15
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Draw points
      points.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  // Phase detection
  useEffect(() => {
    const phase = phases.findIndex((p, i) => {
      const next = phases[i + 1]
      return next ? progress >= p.threshold && progress < next.threshold : progress >= p.threshold
    })
    setCurrentPhase(Math.max(0, phase))
  }, [progress, phases])

  // Typewriter effect
  useEffect(() => {
    const targetText = phases[currentPhase]?.text || ""
    setTypedText("")
    let i = 0
    const interval = setInterval(() => {
      if (i < targetText.length) {
        setTypedText(targetText.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [currentPhase, phases])

  // Generate rising particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = [...prev, { id: Date.now(), x: Math.random() * 100, delay: 0 }]
        return newParticles.slice(-20)
      })
    }, 300)
    return () => clearInterval(interval)
  }, [])

  // Progressively reveal cards based on progress
  useEffect(() => {
    const cardsToShow = Math.floor((progress / 100) * cards.length)
    const newVisibleCards = Array.from({ length: cardsToShow }, (_, i) => i)
    setVisibleCards(newVisibleCards)
  }, [progress, cards.length])

  return (
    <div className={cn("relative w-full min-h-screen bg-white dark:bg-black overflow-hidden", className)}>
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
        {/* Top status bar */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-slate-900 dark:bg-white rounded-full animate-pulse" />
            <span className="text-slate-600 dark:text-white/40 text-xs font-mono tracking-[0.2em]">HIRECARDS ENGINE</span>
          </div>
          <div className="text-slate-500 dark:text-white/30 text-xs font-mono">SYS:{phases[currentPhase]?.status || "INIT"}</div>
        </div>

        {/* Central display - Cards Grid */}
        <div className="flex flex-col items-center w-full max-w-4xl px-6">
          {/* Cards showcase */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 mb-8 w-full">
            {cards.map((card, index) => {
              const Icon = card.icon
              const isVisible = visibleCards.includes(index)
              const delay = index * 0.1

              return (
                <div
                  key={card.id}
                  className={cn(
                    "relative aspect-square rounded-xl md:rounded-2xl transition-all duration-700 transform",
                    isVisible
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-50 translate-y-10"
                  )}
                  style={{
                    transitionDelay: `${delay}s`,
                  }}
                >
                  {/* Card background with gradient */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br transition-all duration-500",
                    card.gradient,
                    isVisible ? "opacity-100" : "opacity-0"
                  )} />
                  
                  {/* Card border */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-white/20" />

                  {/* Card content */}
                  <div className="relative z-10 p-3 md:p-4 flex flex-col items-center justify-center h-full">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white mb-2" />
                    <span className="text-[10px] md:text-xs font-medium text-white text-center leading-tight">
                      {card.name}
                    </span>
                  </div>

                  {/* Shimmer effect */}
                  {isVisible && (
                    <div className="absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{
                          animation: "shimmer 2s infinite",
                          animationDelay: `${delay}s`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress text */}
          <div className="text-center mb-8">
            <div className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-2">
              {visibleCards.length}/{cards.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-white/60">
             You Will Get
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
            {phases.map((phase, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-500 border",
                    i <= currentPhase
                      ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white shadow-lg shadow-slate-900/20 dark:shadow-white/20"
                      : "bg-transparent border-slate-300 dark:border-white/20",
                  )}
                />
                <span
                  className={cn(
                    "text-[9px] font-mono tracking-widest transition-colors duration-500",
                    i <= currentPhase ? "text-slate-700 dark:text-white/70" : "text-slate-400 dark:text-white/20",
                  )}
                >
                  {phase.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom insight */}
        {progress > 40 && (
          <div className="absolute bottom-12 left-0 right-0 text-center animate-fade-in">
            <div className="inline-block px-6 py-4 border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.02]">
              <p className="text-slate-600 dark:text-white/40 text-xs font-light tracking-wide max-w-md leading-relaxed">
                Every data point we analyze brings you closer to opportunities others overlook.
                <span className="text-slate-800 dark:text-white/60"> This is precision hiring.</span>
              </p>
            </div>
          </div>
        )}
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
          0%, 100% {
            border-radius: 0;
            transform: rotate(0deg);
          }
          50% {
            border-radius: 20%;
            transform: rotate(5deg);
          }
        }

        @keyframes morph2 {
          0%, 100% {
            border-radius: 0;
            transform: rotate(0deg) scale(1.05);
          }
          50% {
            border-radius: 30%;
            transform: rotate(-5deg) scale(1.1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
