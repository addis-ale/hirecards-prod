"use client";

import { TestimonialsColumn } from "@/app/modules/landing-page/ui/components/testimonials-columns";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Battle Cards transformed our hiring process. We went from guessing salary ranges to having real market data in minutes. Our offer acceptance rate increased by 35%.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Chen",
    role: "VP of Talent",
  },
  {
    text: "Finally, a tool that gives us actual market insights instead of generic job boards. The battle cards help us craft compelling offers and reduce time-to-hire significantly.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Marcus Rodriguez",
    role: "Head of Recruiting",
  },
  {
    text: "As a startup founder, I can't afford expensive talent teams. Battle Cards gives me the strategic insights I need to compete with bigger companies. Game changer.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Priya Patel",
    role: "Founder & CEO",
  },
  {
    text: "The interview questions and evaluation criteria in each battle card are gold. Our hiring managers finally have a clear framework, and candidates appreciate the structure.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "David Kim",
    role: "Hiring Manager",
  },
  {
    text: "We use Battle Cards for every role now. The salary benchmarks alone have saved us thousands in overpaying. Plus, the candidate supply data helps us set realistic timelines.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Emily Johnson",
    role: "Talent Acquisition Lead",
  },
  {
    text: "Our RPO clients love the battle cards. It shows we understand the market better than anyone. We've closed more deals since using this tool.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "James Wilson",
    role: "RPO Director",
  },
  {
    text: "I was skeptical at first, but the data is spot-on. We've reduced our time-to-fill by 40% and improved candidate quality. Worth every penny.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Alex Thompson",
    role: "People Operations",
  },
  {
    text: "The battle cards help us align hiring managers and recruiters. Everyone has the same information, which eliminates back-and-forth and speeds up decisions.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Rachel Martinez",
    role: "Talent Partner",
  },
  {
    text: "We've tried everything - expensive consultants, multiple tools, spreadsheets. Nothing compares to Battle Cards. It's fast, accurate, and actually useful.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    name: "Michael Brown",
    role: "Chief People Officer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="bg-white dark:bg-slate-950 px-8 py-24 relative transition-colors duration-300 scroll-mt-20"
    >
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[600px] mx-auto mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="border border-slate-200 dark:border-slate-800 py-1 px-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Testimonials
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 text-center">
            What our users say
          </h2>
          <p className="text-center text-lg text-slate-600 dark:text-slate-400">
            See what hiring teams have to say about Battle Cards
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] dark:mask-[linear-gradient(to_bottom,transparent,white_25%,white_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
