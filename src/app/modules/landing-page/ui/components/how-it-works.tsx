"use client";

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

const steps = [
  {
    number: "01",
    title: "SHARE YOUR REQUIREMENTS",
    description:
      "Tell us about your role requirements, ideal candidate profile, and hiring needs. The more details, the better your battle cards.",
  },
  {
    number: "02",
    title: "GENERATED FROM REAL DATA",
    description:
      "Comprehensive battle cards generated from real-world scraped data, complete with key competencies, interview questions, and evaluation criteria tailored to your role.",
  },
  {
    number: "03",
    title: "SHARE & START HIRING",
    description:
      "Get your deck instantly. Share with your hiring team. Run structured interviews that help you identify the best candidates.",
  },
];

interface EditorialStepCardProps {
  number: string;
  description: string;
}

const EditorialStepCard = ({ number, description }: EditorialStepCardProps) => {
  return (
    <div className="flex flex-col group">
      {/* Large index number and Quote style description */}
      <div className="flex items-start gap-6">
        <span
          className="text-[80px] md:text-[100px] font-light leading-none text-slate-900/10 dark:text-white/10 select-none transition-all duration-500 group-hover:text-primary/20"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {number}
        </span>
        <div className="flex-1 pt-4 md:pt-6 text-left">
          <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-slate-900 dark:text-slate-100 tracking-tight transition-all duration-300 group-hover:text-slate-900 dark:group-hover:text-white">
            {description}
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-white dark:bg-slate-950 px-8 py-24 transition-colors duration-300 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <div className="inline-block border border-slate-200 dark:border-slate-800 py-1 px-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-6">
          Process
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
          How We Fix Your Chaos
        </h2>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          From mess to masterpiece faster than your average hiring round. Three
          actually simple steps to hiring precision.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-12">
          {steps.map((step, index) => (
            <EditorialStepCard key={index} {...step} />
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-4">
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
      </div>
    </section>
  );
};
