"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const plans = [
    {
      name: "Starter",
      icon: Sparkles,
      description: "Perfect for individuals and small projects",
      price: { monthly: 0, annual: 0 },
      features: [
        "5 hiring battle cards per month",
        "Basic templates",
        "Email support",
        "Export to PDF",
        "1 team member",
      ],
      popular: false,
      gradient: "from-emerald-500/20 to-teal-500/20",
      glowColor: "emerald",
    },
    {
      name: "Professional",
      icon: Zap,
      description: "Ideal for growing teams and recruiters",
      price: { monthly: 29, annual: 290 },
      features: [
        "Unlimited battle cards",
        "Premium templates & customization",
        "Priority support (24/7)",
        "Advanced analytics",
        "Up to 5 team members",
        "API access",
        "Custom branding",
      ],
      popular: true,
      gradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "green",
    },
    {
      name: "Enterprise",
      icon: Crown,
      description: "For large organizations with custom needs",
      price: { monthly: 99, annual: 990 },
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security & compliance",
        "White-label solution",
        "Training & onboarding",
      ],
      popular: false,
      gradient: "from-teal-500/20 to-cyan-500/20",
      glowColor: "teal",
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-teal-50/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-200/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 backdrop-blur-sm border border-emerald-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Simple, transparent pricing
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Start for free, upgrade as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative group transition-all duration-500 ${
                  plan.popular ? "md:-translate-y-4" : ""
                } ${isHovered ? "scale-105 z-20" : "scale-100"}`}
                style={{
                  transform: isHovered
                    ? "translateY(-8px) rotateX(2deg)"
                    : plan.popular
                    ? "translateY(-16px)"
                    : "none",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${
                    plan.gradient
                  } blur-xl transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card content */}
                <div
                  className={`relative h-full p-8 rounded-3xl border-2 transition-all duration-500 ${
                    plan.popular
                      ? "bg-white/95 backdrop-blur-xl border-emerald-300/50 shadow-2xl shadow-emerald-500/20"
                      : "bg-white/80 backdrop-blur-sm border-gray-200/50 hover:border-emerald-200/70 shadow-xl"
                  }`}
                  style={{
                    transform: isHovered ? "translateZ(20px)" : "translateZ(0)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                      plan.gradient
                    } flex items-center justify-center mb-6 shadow-lg transition-transform duration-500 ${
                      isHovered ? "rotate-12 scale-110" : "rotate-0 scale-100"
                    }`}
                  >
                    <Icon className={`w-7 h-7 text-${plan.glowColor}-600`} />
                  </div>

                  {/* Plan name and description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-500">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    {billingCycle === "annual" && plan.price.annual > 0 && (
                      <p className="text-sm text-emerald-600 mt-2">
                        ${(plan.price.annual / 12).toFixed(0)}/mo billed
                        annually
                      </p>
                    )}
                  </div>

                  {/* CTA button */}
                  <button
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 mb-8 ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                  >
                    {plan.price.monthly === 0 ? "Start Free" : "Get Started"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Features */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-2xl" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Need a custom solution?{" "}
            <a
              href="#"
              className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-4"
            >
              Contact our sales team
            </a>
          </p>
          <p className="text-sm text-gray-500">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
