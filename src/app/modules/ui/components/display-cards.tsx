"use client";

import { cn } from "@/lib/utils";

import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-48 w-120 -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-md after:bg-linear-to-l after:from-white dark:after:from-slate-950 after:to-transparent after:content-[''] hover:border-slate-900 dark:hover:border-white/20 *:flex *:items-center *:gap-2",
        className
      )}
    >
      <div>
        <span className="relative inline-block rounded-full bg-slate-900 dark:bg-slate-800 p-1">
          {icon}
        </span>
        <p className={cn("text-xl font-bold mb-2 text-slate-900 dark:text-white", titleClassName)}>
          {title}
        </p>
      </div>
      <p className="text-base font-medium leading-relaxed line-clamp-3 text-slate-600 dark:text-slate-400">
        {description}
      </p>
      <p className="text-slate-400 dark:text-slate-500 text-sm font-bold mt-auto">
        {date}
      </p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] -translate-x-20 hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 dark:before:bg-slate-950/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-32 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 dark:before:bg-slate-950/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-84 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 -translate-x-16">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
