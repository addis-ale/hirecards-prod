"use client";

import DisplayCards from "@/app/modules/ui/components/display-cards";
import { Upload, Database, Share2 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="size-4 text-primary" />,
      title: "SHARE YOUR REQUIREMENTS",
      description:
        "Tell us about your role requirements, ideal candidate profile, and hiring needs. The more details, the better your battle cards.",
      date: "Step 1",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] -translate-x-20 hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Database className="size-4 text-primary" />,
      title: "GENERATED FROM REAL DATA",
      description:
        "Comprehensive battle cards generated from real-world scraped data, complete with key competencies, interview questions, and evaluation criteria tailored to your role.",
      date: "Step 2",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] translate-x-32 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Share2 className="size-4 text-primary" />,
      title: "SHARE & START HIRING",
      description:
        "Get your deck instantly. Share with your hiring team. Run structured interviews that help you identify the best candidates.",
      date: "Step 3",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] translate-x-84 translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-950 px-8 py-24 transition-colors duration-300">
      <div className="">
        <h2 className="text-center text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          How We Fix Your Chaos
        </h2>
        <p className="text-center text-lg text-slate-500 dark:text-slate-400 mb-4">
          (In Three Actually Simple Steps)
        </p>
        <p className="text-center text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          From mess to masterpiece faster than your average hiring round
        </p>
      </div>

      <div className="flex min-h-[500px] w-full items-center justify-center overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <DisplayCards cards={steps} />
        </div>
      </div>
    </section>
  );
};
