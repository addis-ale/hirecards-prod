"use client";

import { FileText, Sparkles, Download } from "lucide-react";
import { motion } from "framer-motion";
// import { useChatbot } from "./ChatbotProvider";

const steps = [
  {
    icon: FileText,
    title: "Share Requirements",
    description:
      "Tell us about your role requirements, ideal candidate profile, and hiring needs. The more details, the better your battle cards.",
    gradient: "from-emerald-400 via-green-400 to-teal-400",
    iconBg: "from-emerald-300 to-green-300",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "AI Generation",
    description:
      "Comprehensive battle cards generated from real-world scraped data, complete with key competencies, interview questions, and evaluation criteria.",
    gradient: "from-green-400 via-emerald-400 to-cyan-400",
    iconBg: "from-green-300 to-emerald-300",
    number: "02",
  },
  {
    icon: Download,
    title: "Share & Hire",
    description:
      "Get your deck instantly. Share with your hiring team. Run structured interviews that help you identify the best candidates.",
    gradient: "from-teal-400 via-cyan-400 to-emerald-400",
    iconBg: "from-teal-300 to-cyan-300",
    number: "03",
  },
];

export default function HowItWorks() {
  //   const { openChatbot } = useChatbot();

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: "#F0F9F4" }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              How It <span className="text-emerald-600">Works</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              From chaos to clarity in three simple steps
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  className="group relative"
                >
                  {/* Glass card with 3D perspective */}
                  <div className="relative h-[420px] [perspective:1000px]">
                    <div className="relative h-full rounded-[40px] bg-gradient-to-br from-zinc-900/90 to-black shadow-2xl transition-all duration-700 ease-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,0,0,0.4)_0px_30px_60px_-15px] group-hover:[transform:rotateX(5deg)_rotateY(5deg)_scale(1.02)]">
                      {/* Inner glass layer */}
                      <div className="absolute inset-3 rounded-[35px] border border-white/20 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-xl [transform-style:preserve-3d] [transform:translate3d(0,0,20px)]">
                        {/* Gradient overlay */}
                        <div
                          className={`absolute inset-0 rounded-[35px] bg-gradient-to-br ${step.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                        ></div>
                      </div>

                      {/* Content layer */}
                      <div className="absolute inset-0 p-8 flex flex-col [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]">
                        {/* Number badge */}
                        <div className="absolute top-8 right-8">
                          <div className="text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors duration-500">
                            {step.number}
                          </div>
                        </div>

                        {/* Icon with floating effect */}
                        <motion.div
                          className="relative mb-6"
                          animate={{
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: index * 0.3,
                          }}
                        >
                          <div
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-500 [transform:translate3d(0,0,30px)]`}
                          >
                            <Icon
                              className="w-10 h-10 text-white"
                              strokeWidth={2}
                            />
                          </div>
                          {/* Icon glow */}
                          <div
                            className={`absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.iconBg} blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
                          ></div>
                        </motion.div>

                        {/* Text content */}
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed text-base">
                            {step.description}
                          </p>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute bottom-0 right-0 overflow-hidden rounded-br-[40px] pointer-events-none">
                          {[
                            { size: "120px", opacity: "0.05" },
                            { size: "90px", opacity: "0.08" },
                            { size: "60px", opacity: "0.12" },
                          ].map((circle, i) => (
                            <div
                              key={i}
                              className="absolute bottom-0 right-0 rounded-full bg-white transition-all duration-700 group-hover:scale-110"
                              style={{
                                width: circle.size,
                                height: circle.size,
                                opacity: circle.opacity,
                                transform: `translate(30%, 30%) translate3d(0, 0, ${
                                  (i + 1) * 15
                                }px)`,
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 group-hover:animate-shine"></div>
                      </div>
                    </div>
                  </div>

                  {/* Step connector line (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-[100px] left-[calc(100%+24px)] w-12 lg:w-24 h-0.5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-white/30 to-white/10 relative overflow-hidden"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.3 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                            delay: index * 0.5,
                          }}
                        ></motion.div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-20"
          >
            <button
              //   onClick={() => openChatbot()}
              className="btn-primary text-lg px-10 py-4 shadow-2xl hover:shadow-3xl transition-shadow"
            >
              Get Started Now
            </button>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
        .animate-shine {
          animation: shine 2s ease-in-out;
        }
      `}</style>
    </section>
  );
}
