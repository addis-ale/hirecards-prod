"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const faqData = [
  {
    question: "What exactly is a 'Battle Card'?",
    answer:
      "A Battle Card is an interactive, data-driven report for a specific job role. It compiles real-world salary benchmarks, candidate availability, required skill clusters, and a custom-tailored interview strategy so you can hire with precision instead of guesswork.",
  },
  {
    question: "Where does the market data come from?",
    answer:
      "We use real-world scraped data and market intelligence from various professional sources and job boards. This ensures your salary benchmarks and candidate supply numbers are based on what's actually happening in the market right now.",
  },
  {
    question: "How long does it take to generate a card?",
    answer:
      "Less than 5 minutes. Once you provide your role requirements or a LinkedIn JD link, our AI processes the market data and generates your comprehensive hiring strategy instantly.",
  },
  {
    question: "Can I share these cards with my hiring team?",
    answer:
      "Yes! Battle Cards are designed to be shared. You can get a unique link to your deck and share it with hiring managers, recruiters, or stakeholders to ensure everyone is aligned on the hiring plan.",
  },
  {
    question: "Is this for startups or larger enterprises?",
    answer:
      "Both. Startups use us to get strategic hiring insights without a massive talent team, while larger enterprises and agencies use us to move faster and provide deeper market intelligence to their stakeholders.",
  },
];

export const FAQs = () => {
  return (
    <section className="bg-white dark:bg-slate-950 px-8 py-24 transition-colors duration-300">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-block border border-slate-200 dark:border-slate-800 py-1 px-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-6">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Everything you need to know about Battle Cards and how we help you
            hire better.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl px-6 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden"
              >
                <AccordionTrigger className="text-slate-900 dark:text-white font-black text-lg py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
