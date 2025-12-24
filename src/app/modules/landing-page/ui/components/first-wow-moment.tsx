"use client";

import { motion } from "framer-motion";
import { LandingPreviewTabs } from "./LandingPreviewTabs";
import { ArrowRight, Play } from "lucide-react";

export const FirstWowMoment = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decorative Elements - Removed Green/Teal blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-slate-500 rounded-full mix-blend-multiply filter blur-[96px] opacity-10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-slate-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 dark:opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm mb-6"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-slate-950 dark:text-slate-400 uppercase">
              Interactive Preview
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-slate-950 dark:text-white mb-6 uppercase"
          >
            Stop guessing. <br className="hidden md:block" />
            Start hiring with precision.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed"
          >
            See a live example below, a clear, data-driven view of your best
            hiring options, including cost, timing, and risk tradeoffs.
          </motion.p>
        </div>

        {/* Interactive Preview Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Demo Indicator Badge */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-slate-950 text-white text-[10px] font-black px-4 py-2 rounded-t-xl shadow-lg flex items-center gap-2 tracking-widest uppercase">
              <Play size={10} className="fill-current" />
              Live Preview Mode
            </div>
          </div>

          {/* Main Card Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-[#102a63]/10 dark:shadow-black/40 border border-slate-200/60 dark:border-white/10 overflow-hidden min-h-[700px] md:min-h-[850px] flex flex-col transition-colors duration-300">
            {/* App Chrome (Browser Header Simulation) */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              </div>
              <div className="ml-4 px-3 py-1 bg-white dark:bg-slate-950 rounded text-[10px] text-slate-400 font-mono border border-slate-200 dark:border-white/5 flex-1 max-w-xs">
                app.hirecards.ai/analysis/preview
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-10">
              <LandingPreviewTabs />
            </div>
          </div>

          {/* Decorative visual depth below card */}
          <div className="absolute -bottom-4 left-4 right-4 h-full bg-slate-500 opacity-5 rounded-3xl -z-10 transform scale-[0.98] translate-y-2"></div>
        </motion.div>

        {/* Footer CTAs */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-100 shadow-xl shadow-slate-950/20 dark:shadow-white/10 transition-all hover:-translate-y-1 uppercase tracking-tight"
          >
            <span>Create Your HireCard Now</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1.5 transition-transform"
            />
          </motion.button>
        </div>
      </div>
    </section>
  );
};
