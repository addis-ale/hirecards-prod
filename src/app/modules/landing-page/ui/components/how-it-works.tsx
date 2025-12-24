"use client";

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
    </section>
  );
};
