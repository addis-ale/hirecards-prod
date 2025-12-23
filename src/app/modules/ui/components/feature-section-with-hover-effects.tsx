"use client";

import { cn } from "@/lib/utils";
import {
  Users,
  Zap,
  Shield,
  Clock,
  DollarSign,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface Feature {
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturesSectionWithHoverEffectsProps {
  features?: Feature[];
}

export function FeaturesSectionWithHoverEffects({
  features,
}: FeaturesSectionWithHoverEffectsProps) {
  const defaultFeatures: Feature[] = [
    {
      title: "Built for hiring teams",
      description:
        "Designed for recruiters, hiring managers, and talent acquisition teams who need real market insights.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Lightning fast insights",
      description:
        "Get comprehensive battle cards in seconds, not days. No more waiting for market research reports.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Data-driven decisions",
      description:
        "Make hiring decisions based on real market data, not guesswork. Know exactly what you're competing against.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Save time & money",
      description:
        "Stop wasting weeks on market research. Get instant clarity on salaries, supply, and strategy.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Transparent pricing",
      description:
        "No hidden fees, no surprises. Simple, transparent pricing that scales with your hiring needs.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "Proven results",
      description:
        "Join teams who've reduced time-to-hire by 40% and improved offer acceptance rates significantly.",
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    {
      title: "24/7 Support",
      description:
        "Our team is always here to help. Get answers to your questions whenever you need them.",
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      title: "And everything else",
      description:
        "Everything you need to hire smarter, faster, and with confidence. All in one place.",
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 py-10 max-w-7xl mx-auto">
      {displayFeatures.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  subtitle,
  description,
  icon,
  index,
}: {
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  const isEvenRow = index < 2;
  
  return (
    <div
      className={cn(
        "flex flex-col md:border-r py-10 relative group/feature border-slate-200",
        index % 2 === 0 && "md:border-l border-slate-200",
        isEvenRow && "md:border-b border-slate-200"
      )}
    >
      {isEvenRow && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      )}
      {!isEvenRow && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-slate-600">
        {icon}
      </div>
      {subtitle && (
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 relative z-10 px-10">
          {subtitle}
        </div>
      )}
      <div className="text-xl font-black mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-slate-300 group-hover/feature:bg-slate-900 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-slate-900">
          {title}
        </span>
      </div>
      <p className="text-sm text-slate-600 max-w-md relative z-10 px-10 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

