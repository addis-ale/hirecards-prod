import React from "react";
import { 
  AlertCircle, 
  BarChart3, 
  Layers, 
  DollarSign, 
  Send, 
  CheckSquare,
  Target,
  FileText,
  MessageSquare,
  ClipboardCheck,
  Calendar,
  Zap,
  UserPlus
} from "lucide-react";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

const IconTarget = () => <IconAdjustmentsBolt />; // Fallback or custom

export const detailedHeroCards = [
  {
    id: "1",
    title: "Reality Card",
    subtitle: "The Truth About Making This Hire",
    icon: AlertCircle,
    color: "from-purple-500 to-pink-600",
    metricValue: "5.5/10",
    metricLabel: "Feasibility Score",
    uplift: "+1.0 max",
    features: [
      {
        title: "What’s Really Going On",
        description: "You're competing for senior Analytics Engineers who are fully employed, well-paid, and selective. If scope and speed aren’t sharp, you’re entering with untied shoelaces.",
        icon: <IconHelp />,
      },
      {
        title: "What Helps Your Case",
        description: "Product-facing analytics (rare), a stack seniors want (dbt, Snowflake, Looker), and clear domain ownership instead of 'own everything' chaos.",
        icon: <IconHeart />,
      },
      {
        title: "What Hurts Your Case",
        description: "Amsterdam-only requirement, 4+ step loops, comp below €90k, and mismatched internal alignment across PM / Data / Engineering.",
        icon: <IconAdjustmentsBolt />,
      },
      {
        title: "Brutal Truth",
        description: "If the team doesn't agree on 'good' in week one, a restart at week 5-7 is guaranteed. Internal alignment is often harder than the market.",
        icon: <IconTerminal2 />,
      },
      {
        title: "Red Flags",
        description: "JD reads like BI maintenance, stakeholders give different success definitions, or compensation is 'still being figured out.'",
        icon: <IconRouteAltLeft />,
      },
      {
        title: "Don’t Do This",
        description: "Post-and-pray, pretend data debt is tiny, or start sourcing before alignment is real. Avoid adding 'nice-to-haves' that shrink the pool.",
        icon: <IconEaseInOut />,
      },
      {
        title: "Fix This Now",
        description: "Align on 3 non-negotiables (+0.2), pre-approve comp (+0.3), pre-block slots (+0.2), and clarify modelling ownership (+0.3).",
        icon: <IconCurrencyDollar />,
      },
      {
        title: "Timeline to Failure",
        description: "If alignment isn’t fixed by Day 7 → expect a stall/reset around week 5–7. You won’t know it’s happening until candidates ghost you.",
        icon: <IconCloud />,
      },
      {
        title: "Bottom Line",
        description: "Align fast, move within 10–14 days, pay proper senior rates, and run targeted outbound. If you do this, you will hire. If not, you won't.",
        icon: <IconTerminal2 />,
      },
    ]
  },
  {
    id: "2",
    title: "Role Card",
    subtitle: "What This Role Exists to Achieve",
    icon: Target,
    color: "from-blue-500 to-indigo-600",
    metricValue: "+1.0",
    metricLabel: "Uplift Potential",
    uplift: "+1.0",
    features: [
      {
        title: "Role Mission",
        description: "Own the modelling layer behind merchant analytics. Design stable dbt models that shape the Insights product for thousands of merchants.",
        icon: <IconTarget />,
      },
      {
        title: "Top Outcomes",
        description: "Deliver reliable dbt models, replace legacy pipelines, define metrics with Product, and raise modelling standards across the org.",
        icon: <Zap />,
      },
      {
        title: "What Great Looks Like",
        description: "Thinks in systems, writes tested models, handles ambiguity with structure, and defines patterns others adopt.",
        icon: <IconHeart />,
      },
      {
        title: "What You Won’t Do",
        description: "No dashboard maintenance, ad-hoc requests, glue-code pipelines, or 'do-everything' data roles.",
        icon: <IconAdjustmentsBolt />,
      },
      {
        title: "JD Rewrite: After",
        description: "Own the modelling layer powering Mollie’s merchant-facing analytics. Design stable models used by thousands of merchants.",
        icon: <IconTerminal2 />,
      },
      {
        title: "Failure Modes",
        description: "Generic JDs, undefined ownership, or hidden data debt that causes interview collapses.",
        icon: <IconRouteAltLeft />,
      },
      {
        title: "Fix This Now",
        description: "Rewrite JD into outcomes (+0.3), add ownership clarity (+0.2), remove BI tasks (+0.1), and highlight product impact (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "3",
    title: "Skill Card",
    subtitle: "Skills That Predict Success",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    metricValue: "+0.8",
    metricLabel: "Uplift Potential",
    uplift: "+0.8",
    features: [
      {
        title: "Core Technical Skills",
        description: "Advanced SQL, strong dbt (macros, refs), dimensional modelling, and data reliability engineering.",
        icon: <IconTerminal2 />,
      },
      {
        title: "Product Skills",
        description: "Translate messy logic to clean models, define metrics with Product, and reason through tradeoffs.",
        icon: <Zap />,
      },
      {
        title: "Upskillable Guide",
        description: "Can train Looker or Airflow quickly, but NOT modelling fundamentals, dbt proficiency, or ownership mindset.",
        icon: <IconEaseInOut />,
      },
      {
        title: "Why Ranking Matters",
        description: "Adding unnecessary skills (e.g., Python 'just because') shrinks the pool. Removing false constraints expands it.",
        icon: <IconAdjustmentsBolt />,
      },
      {
        title: "Red Flags",
        description: "Only built dashboards, avoids documentation, weak testing discipline, or no 'ownership' vocabulary.",
        icon: <IconRouteAltLeft />,
      },
      {
        title: "Fix This Now",
        description: "Remove non-essential skills (+0.3), prioritise top 5 locals (+0.2), and add modelling evaluation (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "4",
    title: "Market Card",
    subtitle: "Addressable Talent Market",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-600",
    metricValue: "+0.9",
    metricLabel: "Uplift Potential",
    uplift: "+0.9",
    features: [
      {
        title: "Market Reality",
        description: "Senior AEs match the persona only 10% of the time. They are selective, employed, and motivated by craft.",
        icon: <IconHelp />,
      },
      {
        title: "Addressable Market",
        description: "Amsterdam fits: 250-400. EU relocation: 1,500+. Remote-flex EU: 3,000+. Move fast or lose.",
        icon: <IconCloud />,
      },
      {
        title: "Competitive Pressure",
        description: "Adyen, Klarna, bunq move in 7-12 days. If you are slow or vague, they win by default.",
        icon: <IconAdjustmentsBolt />,
      },
      {
        title: "Market Expansion",
        description: "Allowing EU relocation (+35%) and hybrid setups (+20%) are the biggest supply levers.",
        icon: <IconRouteAltLeft />,
      },
      {
        title: "Fix This Now",
        description: "Allow EU relocation (+0.4), simplify interview loop (+0.2), and tighten JD to outcomes (+0.1).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "5",
    title: "Talent Map Card",
    subtitle: "Where Strong Candidates Come From",
    icon: UserPlus,
    color: "from-orange-500 to-red-600",
    metricValue: "+0.6",
    metricLabel: "Uplift Potential",
    uplift: "+0.6",
    features: [
      {
        title: "Primary Sources",
        description: "Adyen, bunq, Booking, bol, Klarna. These environments train owners, not searchers.",
        icon: <IconRouteAltLeft />,
      },
      {
        title: "Secondary Sources",
        description: "Modern consultancies or specialised bank pods. Good fundamentals, but validate autonomy.",
        icon: <IconHelp />,
      },
      {
        title: "Talent Flow",
        description: "Fintechs trade the same persona. Messaging must align with their definition of 'real AE work'.",
        icon: <IconTerminal2 />,
      },
      {
        title: "Fix This Now",
        description: "Target frustration-driven candidates (+0.2), prioritise domain owners (+0.2), and use pain-based messaging (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "6",
    title: "Pay Card",
    subtitle: "What the Market Pays",
    icon: DollarSign,
    color: "from-green-500 to-emerald-600",
    metricValue: "+0.8",
    metricLabel: "Uplift Potential",
    uplift: "+0.8",
    features: [
      {
        title: "Amsterdam Market",
        description: "Base: €85k–€100k. Total Comp: €95k–€115k. Range: €6,100–€7,900/month.",
        icon: <IconCurrencyDollar />,
      },
      {
        title: "Why Pay Matters",
        description: "If you offer €80k, you hire someone who *thinks* they are senior. US remote cos pay +20% more.",
        icon: <IconAdjustmentsBolt />,
      },
      {
        title: "Fix This Now",
        description: "Align comp before sourcing (+0.4), share range early (+0.2), and offer flexibility (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "7",
    title: "Funnel Card",
    subtitle: "How Much You Actually Need",
    icon: Send,
    color: "from-indigo-500 to-violet-600",
    metricValue: "+0.8",
    metricLabel: "Uplift Potential",
    uplift: "+0.8",
    features: [
      {
        title: "Expected Funnel",
        description: "1 hire requires 150 messages, 25 replies, and 8 technical rounds. It's a normal ratio.",
        icon: <IconCloud />,
      },
      {
        title: "Time is Quality",
        description: "Time gaps >72h or slow calendar coordination are the #1 funnel killers.",
        icon: <IconEaseInOut />,
      },
      {
        title: "Fix This Now",
        description: "Warm candidates every 72h (+0.2), remove long take-homes (+0.2), and pre-block calendars (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "8",
    title: "Fit Card",
    subtitle: "Persona Profile",
    icon: CheckSquare,
    color: "from-pink-500 to-rose-600",
    metricValue: "+0.7",
    metricLabel: "Uplift Potential",
    uplift: "+0.7",
    features: [
      {
        title: "Persona Snapshot",
        description: "Modelling craftsman. They engineer data into product features, not dashboards.",
        icon: <IconHelp />,
      },
      {
        title: "Motivators",
        description: "Ownership, customer impact, and modelling craft. They hate BI maintenance disguises.",
        icon: <IconHeart />,
      },
      {
        title: "Fix This Now",
        description: "Tailor outreach (+0.3), highlight ownership (+0.2), and show messy truth early (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "9",
    title: "Message Card",
    subtitle: "How To Talk To Seniors",
    icon: MessageSquare,
    color: "from-yellow-500 to-orange-600",
    metricValue: "+0.6",
    metricLabel: "Uplift Potential",
    uplift: "+0.6",
    features: [
      {
        title: "Core Positioning",
        description: "You own the modelling layer, not dashboards. Your dbt models power live insights.",
        icon: <IconTerminal2 />,
      },
      {
        title: " স্ট্যান্ড আউট",
        description: "Be concrete about the problem, the ownership, and the mess. Generic pitches fail.",
        icon: <IconRouteAltLeft />,
      },
      {
        title: "Fix This Now",
        description: "Lead with impact, not stack (+0.2), personalise (+0.2), and use soft CTAs (+0.1).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "10",
    title: "Interview Card",
    subtitle: "Loop That Actually Matters",
    icon: ClipboardCheck,
    color: "from-red-500 to-orange-600",
    metricValue: "+0.9",
    metricLabel: "Uplift Potential",
    uplift: "+0.9",
    features: [
      {
        title: "Standard Loop",
        description: "Screen → Modelling Deep Dive → Product Collab → Values. 3-4 steps max.",
        icon: <IconEaseInOut />,
      },
      {
        title: "What to Assess",
        description: "Modelling craft, SQL fluency, semantic design, and ability to reason with tradeoffs.",
        icon: <IconTerminal2 />,
      },
      {
        title: "Fix This Now",
        description: "Standardise questions (+0.3), remove rounds (+0.2), and enforce 24h feedback (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "11",
    title: "Scorecard Card",
    subtitle: "Alignment Tool",
    icon: CheckSquare,
    color: "from-teal-500 to-emerald-600",
    metricValue: "+0.6",
    metricLabel: "Uplift Potential",
    uplift: "+0.6",
    features: [
      {
        title: "Core Competencies",
        description: "Evaluate: Modelling, Reliability, Product Thinking, Collaboration, Communication, Ownership.",
        icon: <IconRouteAltLeft />,
      },
      {
        title: "Rating Anchors",
        description: "1-4 scale. From 'Slows the team' to 'Raises the bar'. No subjective chaos.",
        icon: <IconAdjustmentsBolt />,
      },
      {
        title: "Fix This Now",
        description: "Add hooks/anchors (+0.2), standardise format (+0.2), and weekly calibration (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  },
  {
    id: "12",
    title: "Plan Card",
    subtitle: "First 7 Days",
    icon: Calendar,
    color: "from-purple-500 to-indigo-600",
    metricValue: "+0.9",
    metricLabel: "Uplift Potential",
    uplift: "+0.9",
    features: [
      {
        title: "First 7 Days",
        description: "Finalise cards, lock comp, book slots, rewrite JD, and target 50-80 profiles.",
        icon: <Zap />,
      },
      {
        title: "Weekly Rhythm",
        description: "Review leaks, remove blockers in 24h, and update messaging based on replies.",
        icon: <IconCloud />,
      },
      {
        title: "Fix This Now",
        description: "Enforce 24h feedback (+0.3), pre-block calendars (+0.2), and 2 outbound waves (+0.2).",
        icon: <IconCurrencyDollar />,
      },
    ]
  }
];
