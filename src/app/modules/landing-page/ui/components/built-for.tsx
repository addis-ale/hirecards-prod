"use client";

import { FeaturesSectionWithHoverEffects } from "@/app/modules/landing-page/ui/components/feature-section-with-hover-effects";
import { Rocket, Users, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollToHeroInput = () => {
  const inputSection = document.getElementById("hero-input-section");
  const textarea = document.getElementById("role-description-input");
  const inputContainer = inputSection?.querySelector(
    ".relative.group"
  ) as HTMLElement;

  if (inputSection) {
    // Calculate position to center the input better
    const rect = inputSection.getBoundingClientRect();
    const scrollPosition =
      window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });

    // Add highlight animation after scroll
    setTimeout(() => {
      if (inputContainer) {
        // Add prominent highlight with pulse - rounded to match input
        inputContainer.style.transition = "all 0.3s ease";
        inputContainer.style.borderRadius = "22px"; // Match the rounded-[22px] from the glow effect
        inputContainer.style.boxShadow =
          "0 0 0 6px rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.3)";
        inputContainer.style.transform = "scale(1.02)";
        inputContainer.classList.add("animate-pulse");

        // Remove highlight after animation
        setTimeout(() => {
          inputContainer.classList.remove("animate-pulse");
          inputContainer.style.boxShadow = "";
          inputContainer.style.transform = "";
          inputContainer.style.borderRadius = "";
        }, 2500);
      }

      // Focus the textarea with a slight delay
      setTimeout(() => {
        textarea?.focus();
        textarea?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);

      // Add a subtle shake animation to draw attention
      if (textarea) {
        setTimeout(() => {
          textarea.style.animation = "shake 0.6s ease-in-out";
          setTimeout(() => {
            textarea.style.animation = "";
          }, 600);
        }, 400);
      }
    }, 700);
  }
};

// Add shake animation CSS (only once)
if (
  typeof document !== "undefined" &&
  !document.head.querySelector("style[data-scroll-animation]")
) {
  const style = document.createElement("style");
  style.setAttribute("data-scroll-animation", "true");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(style);
}

export const BuiltFor = () => {
  const features = [
    {
      title: "Startup Founder",
      subtitle: "Beautiful Delusionals",
      description:
        "Hiring is hard. Doing it wrong is expensive. You need to move fast, but you can't afford to hire the wrong person. Get strategic hiring insights without the overhead of a full talent team.",
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      title: "Talent Acquisition Manager",
      subtitle: "Beautiful Delusionals",
      description:
        "Drowning in reqs. Doing the work of 5 people. Juggling multiple roles while hiring managers expect magic. This is your life raft, instant battle cards that make you look like a strategic genius.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Hiring Manager",
      subtitle: "Beautiful Delusionals",
      description:
        "You just want a job description that makes sense and candidates who actually fit. Stop wasting time on misaligned interviews. Get clear role definitions, realistic expectations, and a hiring plan that works.",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      title: "Agency and RPO",
      subtitle: "Beautiful Delusionals",
      description:
        "Move fast. Hire faster. Deliver quality at scale. Your clients expect deep market insights and strategic guidance. Stand out by delivering comprehensive battle cards that prove you understand the role better than anyone.",
      icon: <Building2 className="w-6 h-6" />,
    },
  ];

  return (
    <section
      id="built-for"
      className="bg-white dark:bg-slate-950 px-8 py-24 transition-colors duration-300 scroll-mt-20"
    >
      <div className="mb-12">
        <h2 className="text-center text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          Built for These
        </h2>
        <h3 className="text-center text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-300 mb-4">
          Beautiful Delusionals
        </h3>
        <p className="text-center text-lg text-slate-500 dark:text-slate-400 mb-8">
          (Who Think They Can Actually Hire Good People)
        </p>
      </div>
      <FeaturesSectionWithHoverEffects features={features} />
      <div className="text-center mt-12">
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
          Think You Qualify? Try It
        </p>
        <button
          onClick={scrollToHeroInput}
          className="group inline-flex items-center justify-center gap-3 px-5 py-4 rounded-2xl font-black text-md bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-100 shadow-sm shadow-slate-950/20 dark:shadow-white/10 transition-all hover:-translate-y-1 uppercase tracking-tight"
        >
          <span>Generate Battle Cards</span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1.5 transition-transform"
          />
        </button>
        {/* <Button
          size="lg"
          className="group px-8 py-6 rounded-2xl font-bold text-lg shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:-translate-y-0.5"
        >
          <span>Generate Battle Cards</span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button> */}
      </div>
    </section>
  );
};
