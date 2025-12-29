import { cn } from "@/lib/utils";
import React from "react";

export function FeaturesSectionWithHoverEffects({ features }: { features: { title: string; description: string; icon: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 py-10 max-w-5xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title + index} {...feature} index={index} totalFeatures={features.length} />
      ))}
    </div>
  );
}

export const Feature = ({
  title,
  description,
  icon,
  index,
  totalFeatures,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  totalFeatures: number;
}) => {
  // Determine color scheme based on title keywords
  const getColorScheme = () => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('help') || titleLower.includes('expansion') || titleLower.includes('motivator') || titleLower.includes('great')) {
      return {
        border: 'group-hover/feature:bg-emerald-500',
        icon: 'text-emerald-600 dark:text-emerald-400',
        title: 'text-emerald-900 dark:text-emerald-100',
        badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
      };
    }
    if (titleLower.includes('hurt') || titleLower.includes('failure') || titleLower.includes('risk') || titleLower.includes('dropout') || titleLower.includes('hate')) {
      return {
        border: 'group-hover/feature:bg-red-500',
        icon: 'text-red-600 dark:text-red-400',
        title: 'text-red-900 dark:text-red-100',
        badge: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
      };
    }
    if (titleLower.includes('red flag') || titleLower.includes('warning') || titleLower.includes('caution') || titleLower.includes('brutal')) {
      return {
        border: 'group-hover/feature:bg-amber-500',
        icon: 'text-amber-600 dark:text-amber-400',
        title: 'text-amber-900 dark:text-amber-100',
        badge: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
      };
    }
    return {
      border: 'group-hover/feature:bg-primary',
      icon: 'text-neutral-600 dark:text-slate-400',
      title: 'text-neutral-800 dark:text-slate-100',
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
    };
  };

  const colors = getColorScheme();

  return (
    <div
      className={cn(
        "flex flex-col md:border-r py-10 relative group/feature dark:border-white/10 border-slate-200",
        (index % 2 === 0) && "md:border-l",
        index < 2 && "md:border-b",
        // Additional border logic for 2 columns
        index >= 2 && index < 4 && totalFeatures > 4 && "md:border-b",
        index >= 4 && index < 6 && totalFeatures > 6 && "md:border-b",
        index >= 6 && index < 8 && totalFeatures > 8 && "md:border-b"
      )}
    >
      {index < totalFeatures - (totalFeatures % 3 === 0 ? 3 : totalFeatures % 3) && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-white/5 to-transparent pointer-events-none" />
      )}
      {index >= totalFeatures - (totalFeatures % 3 === 0 ? 3 : totalFeatures % 3) && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-white/5 to-transparent pointer-events-none" />
      )}
      <div className={cn("mb-4 relative z-10 px-10", colors.icon)}>
        {icon}
      </div>
      <div className="mb-3 relative z-10 px-10">
        <div className={cn("absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-slate-700 transition-all duration-200 origin-center", colors.border)} />
        <span className={cn("text-sm font-black uppercase tracking-wider transition duration-200 inline-block", colors.title)}>
          {title}
        </span>
      </div>
      <div className="text-sm text-neutral-700 dark:text-slate-300 relative z-10 px-10 leading-relaxed">
        {description}
      </div>
    </div>
  );
};
