"use client";

import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import { Rocket, Users, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <section className="bg-white px-8 py-24">
      <div className="mb-12">
        <h2 className="text-center text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">
          Built for These
        </h2>
        <h3 className="text-center text-2xl md:text-3xl font-bold text-slate-700 mb-4">
          Beautiful Delusionals
        </h3>
        <p className="text-center text-lg text-slate-500 mb-8">
          (Who Think They Can Actually Hire Good People)
        </p>
      </div>
      <FeaturesSectionWithHoverEffects features={features} />
      <div className="text-center mt-12">
        <p className="text-lg font-semibold text-slate-900 mb-6">
          Think You Qualify? Try It
        </p>
        <Button
          size="lg"
          className="group px-8 py-6 rounded-2xl font-bold text-lg shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] bg-slate-900 text-white hover:bg-slate-800 transition-all hover:-translate-y-0.5"
        >
          <span>Generate Battle Cards</span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
};
