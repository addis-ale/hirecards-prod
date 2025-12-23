import { CheckIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

const Pricing1 = () => {
  // Pricing plan data
  const pricingPlans = [
    {
      title: "Solo Founder",
      popular: false,
      description:
        "Perfect for individual founders and early-stage startups building their first core team.",
      price: "£49",
      features: [
        "10 Battle Cards / mo",
        "Standard Market Data",
        "Salary Benchmarking",
        "Email Support",
        "Cancel anytime",
      ],
    },
    {
      title: "Scaling Team",
      popular: true,
      description:
        "Ideal for rapidly growing companies and active hiring managers with multiple open roles.",
      price: "£149",
      features: [
        "Unlimited Battle Cards",
        "Deep Market Intelligence",
        "Competitor Salary Clusters",
        "Priority AI Strategy",
        "Priority Support",
        "Cancel anytime",
      ],
    },
    {
      title: "Agency & RPO",
      popular: false,
      description:
        "Bespoke solutions for high-volume recruitment teams requiring deep strategic scale.",
      price: "Custom",
      features: [
        "White-label Reports",
        "Multi-user Team Access",
        "API Data Access",
        "Dedicated Account Manager",
        "Custom Training & Onboarding",
        "Cancel anytime",
      ],
    },
  ];

  return (
    <section id="pricing" className="w-full bg-white dark:bg-slate-950 transition-colors duration-300 scroll-mt-20">
      <div className="flex flex-col items-center justify-center gap-16 md:gap-20 w-[95%] max-w-7xl mx-auto py-24">
        <div className="flex flex-col items-center gap-6 w-full text-center">
        <div className="inline-block border border-slate-200 dark:border-slate-800 py-1 px-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Pricing
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none text-slate-900 dark:text-white">
          Stop Guessing. <br className="hidden md:block" /> Start Winning.
        </h2>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Choose the plan that fits your hiring velocity. No hidden fees, just pure data-driven hiring precision.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-stretch w-full max-w-6xl gap-0 lg:gap-0 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl dark:shadow-none">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 flex flex-col relative group transition-all duration-300",
              index !== 0 && "border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10",
              index === 1 ? "bg-slate-50 dark:bg-slate-900" : "bg-white dark:bg-slate-950"
            )}
          >
            {/* Project DNA: Background Glow for Popular Plan */}
            {index === 1 && (
              <>
                <div className="absolute inset-0 bg-primary/5 dark:bg-primary/5 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none opacity-40" />
              </>
            )}

            <div className="p-8 md:p-10 flex flex-col h-full gap-8 relative z-10">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-2xl tracking-tighter uppercase text-slate-900 dark:text-white">
                      {plan.title}
                    </span>
                    {plan.popular && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-primary text-primary-foreground rounded-full shadow-lg">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed min-h-[44px]">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="font-black text-4xl tracking-tighter text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        / month
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />

                <div className="flex flex-col gap-4 min-h-[200px]">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-primary dark:text-primary" strokeWidth={3} />
                      </div>
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-8">
                <button
                  className={cn(
                    "w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 transform group-hover:-translate-y-1 shadow-lg",
                    index === 1
                      ? "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30 dark:shadow-primary/10 dark:hover:shadow-primary/20"
                      : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-slate-900/10 dark:shadow-white/10"
                  )}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get started"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export { Pricing1 };

