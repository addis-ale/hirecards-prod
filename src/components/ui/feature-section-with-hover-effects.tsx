import { cn } from "@/lib/utils";
import React from "react";

export function FeaturesSectionWithHoverEffects({
  features,
}: {
  features: { title: string; description: string; icon: React.ReactNode }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

export const Feature = ({
  title,
  description,
  icon,
  index,
  totalFeatures = 6,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  totalFeatures?: number;
}) => {
  const isLeftCol = index % 2 === 0;
  const isRightCol = !isLeftCol;

  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-12 relative group/feature dark:border-neutral-800 h-full min-h-[220px]",
        isLeftCol && "lg:border-l dark:border-neutral-800",
        // Keep bottom border for all items to maintain stable height
        "lg:border-b dark:border-neutral-800",
        // Radius matching for the corners
        index === 0 && "rounded-tl-[32px]",
        index === 1 && "rounded-tr-[32px]",
        index === totalFeatures - 2 && isLeftCol && "rounded-bl-[32px]",
        index === totalFeatures - 1 && isRightCol && "rounded-br-[32px]"
      )}
    >
      <div
        className={cn(
          "opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-slate-950/5 dark:from-white/10 to-transparent pointer-events-none",
          index === 0 && "rounded-tl-[32px]",
          index === 1 && "rounded-tr-[32px]",
          index === totalFeatures - 2 && isLeftCol && "rounded-bl-[32px]",
          index === totalFeatures - 1 && isRightCol && "rounded-br-[32px]"
        )}
      />

      <div className="mb-6 relative z-10 px-10 text-neutral-600 dark:text-neutral-400 scale-110 origin-left">
        {icon}
      </div>
      <div className="text-xl font-bold mb-3 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-8 group-hover/feature:h-12 w-1.5 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-slate-950 transition-all duration-200 origin-center" />
        <span className="transition duration-200 inline-block text-neutral-800 dark:text-neutral-100 uppercase tracking-tight font-black leading-tight">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10 font-bold leading-relaxed">
        {description}
      </p>
    </div>
  );
};
