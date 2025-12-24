"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Briefcase, 
  Code, 
  TrendingUp, 
  Map, 
  DollarSign, 
  Target, 
  BarChart3, 
  UserCheck, 
  MessageSquare, 
  Send, 
  Mic, 
  ClipboardList, 
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldCheck,
  Zap,
  Clock,
  Search,
  Users,
  MapPin,
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Feature } from "@/components/ui/feature-section-with-hover-effects";

// --- Main Components ---

export const LandingPreviewTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const isAtTop = scrollTop <= 1;
    if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) return;
    e.stopPropagation();
  };

  const tabs = [
    { id: "overview", label: "Reality Card", Icon: LayoutDashboard },
    { id: "role", label: "Role Card", Icon: Briefcase },
    { id: "skill", label: "Skills Card", Icon: Code },
    { id: "market", label: "Market Card", Icon: TrendingUp },
    { id: "talentmap", label: "Talent Map Card", Icon: Map },
    { id: "pay", label: "Pay Card", Icon: DollarSign },
    { id: "funnel", label: "Funnel Card", Icon: BarChart3 },
    { id: "fit", label: "Fit Card", Icon: UserCheck },
    { id: "message", label: "Message Card", Icon: MessageSquare },
    { id: "outreach", label: "Outreach Card", Icon: Send },
    { id: "interview", label: "Interview Card", Icon: Mic },
    { id: "scorecard", label: "Scorecard Card", Icon: ClipboardList },
    { id: "plan", label: "Plan Card", Icon: CalendarCheck },
  ];

  const renderContent = () => {
    let features: { title: string, description: string, icon: React.ReactNode }[] = [];

    switch (activeTab) {
      case "overview":
        features = [
          { title: "Feasibility", description: "5.5 / 10. Possible — but only if alignment and comp tighten immediately.", icon: <ShieldCheck className="text-blue-500" size={24} /> },
          { title: "Market Status", description: "TIGHT. Seniors are fully employed and selective. Expect untied shoelaces if slow.", icon: <TrendingUp className="text-blue-500" size={24} /> },
          { title: "Restart Risk", description: "75%. If team doesn't align on Day 7, expect a stall/reset in Week 5-7.", icon: <Clock className="text-red-500" size={24} /> },
          { title: "Product Focus", description: "HELP. Product-facing analytics is rare and instantly attractive to seniors.", icon: <Zap className="text-blue-500" size={24} /> },
          { title: "Stack Quality", description: "HELP. Stack seniors actually want: dbt, Snowflake, Looker.", icon: <Code className="text-blue-500" size={24} /> },
          { title: "Comp Barrier", description: "HURT. Compensation ceilings below €90k will cause high rejection rates.", icon: <DollarSign className="text-red-500" size={24} /> },
        ];
        break;
      case "role":
        features = [
          { title: "Mission", description: "PRODUCT-BUILDING. Own the modelling layer, not internal BI maintenance.", icon: <Target className="text-[#102a63]" size={24} /> },
          { title: "Live Impact", description: "Insights become live features used by thousands of Mollie merchants daily.", icon: <Zap className="text-blue-500" size={24} /> },
          { title: "Reliability", description: "Outcome: Deliver stable, well-tested dbt models that replace legacy pipelines.", icon: <ShieldCheck className="text-blue-500" size={24} /> },
          { title: "Standards", description: "Raise modelling standards across the entire engineering organization.", icon: <TrendingUp className="text-blue-500" size={24} /> },
          { title: "Partnership", description: "Work tightly with PM & Engineering squads on short iteration loops.", icon: <Users className="text-[#102a63]" size={24} /> },
          { title: "Engagement", description: "Seniors select roles based on outcomes, not tasks. Outcome-focused JD is key.", icon: <Users className="text-blue-500" size={24} /> },
        ];
        break;
      case "skill":
        features = [
          { title: "Modelling", description: "MUST-HAVE. Dimensional modelling & semantic layer design are non-negotiable.", icon: <Code className="text-blue-500" size={24} /> },
          { title: "dbt Mastery", description: "MUST-HAVE. Macros, tests, structure, and ref patterns discipline required.", icon: <Zap className="text-blue-500" size={24} /> },
          { title: "SQL Expert", description: "MUST-HAVE. Advanced SQL fluency with engineering-grade testing discipline.", icon: <ClipboardList className="text-[#102a63]" size={24} /> },
          { title: "Python", description: "SKIP. Adding Python 'just because' shrinks your addressable pool by 20%.", icon: <TrendingDown className="text-red-500" size={24} /> },
          { title: "Trainable", description: "UPSKILL. Looker and Airflow can be trained quickly; don't block seniors.", icon: <Info className="text-amber-500" size={24} /> },
          { title: "Mindset", description: "OWNERSHIP. Must protect modelling quality and thrive in structured ambiguity.", icon: <UserCheck className="text-blue-500" size={24} /> },
        ];
        break;
      case "market":
        features = [
          { title: "Local Fits", description: "250–400 strong fits in Amsterdam. High competition for this specific persona.", icon: <Map className="text-blue-500" size={24} /> },
          { title: "EU Supply", description: "1,500+ EU relocation-ready candidates. Instant +35% pool expansion lever.", icon: <TrendingUp className="text-blue-500" size={24} /> },
          { title: "Remote Flex", description: "3,000+ candidates in broader EU. Expands supply but increases US competition.", icon: <Users className="text-[#102a63]" size={24} /> },
          { title: "Adyen Loop", icon: <Clock className="text-red-500" size={24} />, description: "Competitors move in 7-12 days. Your speed is your biggest closing lever." },
          { title: "Vague JD", icon: <AlertCircle className="text-amber-500" size={24} />, description: "A generic JD eliminates half the market before you even start sourcing." },
          { title: "Expansion", description: "Allow EU relocation (+35%) and hybrid flex (+20%) to expand feasible pool.", icon: <Zap className="text-blue-500" size={24} /> },
        ];
        break;
      case "talentmap":
        features = [
          { title: "Fintech Core", description: "Adyen, bunq, Revolut, Klarna. They trade the same AE persona; move fast.", icon: <TrendingUp className="text-blue-500" size={24} /> },
          { title: "Scale-Ups", description: "Booking.com, bol. AEs here seek more ownership and product-led impact.", icon: <TrendingUp className="text-blue-500" size={24} /> },
          { title: "Consultancy", description: "Modern data consultancies produce fits with strong dbt fundamentals.", icon: <Briefcase className="text-[#102a63]" size={24} /> },
          { title: "High-Risk", description: "Legacy BI teams or Excel-heavy functions. Usually lack modelling ownership.", icon: <AlertCircle className="text-red-500" size={24} /> },
          { title: "EU Hubs", description: "London, Berlin, and Amsterdam are the primary hotspots for this persona.", icon: <MapPin className="text-blue-500" size={24} /> },
          { title: "Movement", description: "Scale-up AEs typically move towards Fintech for higher ownership stakes.", icon: <Zap className="text-blue-500" size={24} /> },
        ];
        break;
      case "pay":
        features = [
          { title: "Base Range", description: "€85k–€100k market average. Published ranges: €6,100–€7,900/month.", icon: <DollarSign className="text-blue-500" size={24} /> },
          { title: "Total Comp", description: "€95k–€115k including performance bonuses and equity structures.", icon: <TrendingUp className="text-blue-500" size={24} /> },
          { title: "Hiring Band", description: "Recommended: €90k–€105k. Anything lower will only attract junior profiles.", icon: <Target className="text-[#102a63]" size={24} /> },
          { title: "Remote Gap", description: "US remote companies paying +40% premium. They are your hidden competition.", icon: <TrendingDown className="text-red-500" size={24} /> },
          { title: "Equity", description: "Stock options or RSUs are standard for senior scale-up/fintech packages.", icon: <ShieldCheck className="text-blue-500" size={24} /> },
          { title: "Negotiation", description: "Expect to negotiate on base vs equity split for top-tier candidates.", icon: <Users className="text-blue-500" size={24} /> },
        ];
        break;
      case "funnel":
        features = [
          { title: "Outreach", description: "120–150 outbound messages required to land one high-quality senior hire.", icon: <Send className="text-blue-500" size={24} /> },
          { title: "Screening", description: "10–12 recruiter screens. Filter for ownership vs BI grunt work immediately.", icon: <Search className="text-[#102a63]" size={24} /> },
          { title: "Technical", description: "7–8 technical rounds. Expect 40–60% pass rate if modelling bar is high.", icon: <BarChart3 className="text-blue-500" size={24} /> },
          { title: "Conversion", description: "70–85% offer acceptance if process speed is under 14 days total.", icon: <CheckCircle2 className="text-blue-500" size={24} /> },
          { title: "Dropout", description: "Time gaps > 72h cause seniors to assume you're disorganized and move on.", icon: <Clock className="text-red-500" size={24} /> },
          { title: "Leakage", description: "Most funnel leaks happen between stages due to slow calendar coordination.", icon: <TrendingDown className="text-amber-500" size={24} /> },
        ];
        break;
      case "fit":
        features = [
          { title: "Motivator #1", description: "DOMAIN OWNERSHIP. They want to own a system, not service ad-hoc requests.", icon: <Target className="text-[#102a63]" size={24} /> },
          { title: "Motivator #2", description: "PRODUCT IMPACT. Shipping analytics that real customers actually use daily.", icon: <Zap className="text-blue-500" size={24} /> },
          { title: "Hates", description: "BI MAINTENANCE. Vague scope, slow loops, and politics are instant turn-offs.", icon: <XCircle className="text-red-500" size={24} /> },
          { title: "Decision", description: "They say YES to challenges, peers, and early comp alignment. Speed is a signal.", icon: <CheckCircle2 className="text-blue-500" size={24} /> },
          { title: "Psychographic", description: "Introverted-analytical, prefers clarity over noise. Notices patterns fast.", icon: <Users className="text-blue-500" size={24} /> },
          { title: "Team Evaluation", description: "They evaluate your team's modelling maturity within minutes of talk.", icon: <Search className="text-blue-500" size={24} /> },
        ];
        break;
      case "message":
        features = [
          { title: "Standout", description: "Specificity beats history. Name the product, the models, and the mess.", icon: <MessageSquare className="text-blue-500" size={24} /> },
          { title: "Hook", description: "Lead with modelling ownership, not modern stack keywords or company story.", icon: <Zap className="text-blue-500" size={24} /> },
          { title: "Truth", description: "Name the mess: legacy pipelines and metric drift. Honesty builds credibility.", icon: <Info className="text-[#102a63]" size={24} /> },
          { title: "CTA", description: "Use soft, optional CTAs. Low pressure makes selective seniors more likely to engage.", icon: <Send className="text-blue-500" size={24} /> },
          { title: "Concrete", description: "Reference product impact in terms like 'Your models power merchant insights'.", icon: <Target className="text-blue-500" size={24} /> },
          { title: "Sequence", description: "Use a 3-step outreach sequence: Relevance, Scope, and Soft follow-up.", icon: <Users className="text-blue-500" size={24} /> },
        ];
        break;
      case "outreach":
        features = [
          { title: "Msg 1 Hook", description: "Reference their specific project. Link their work to Mollie's Insights mission.", icon: <Search className="text-blue-500" size={24} /> },
          { title: "Msg 2 Scope", description: "Go deeper on stack (Snowflake/dbt) and specific revenue modelling ownership.", icon: <Code className="text-blue-500" size={24} /> },
          { title: "Msg 3 Soft", description: "Optional 5-min sanity check. Keep the door open without pressure.", icon: <MessageSquare className="text-[#102a63]" size={24} /> },
          { title: "Success Rate", description: "Targeting 20–30% positive reply rate with this high-specificity sequence.", icon: <CheckCircle2 className="text-blue-500" size={24} /> },
          { title: "Personalize", description: "Reference their repo, talk, or project, not just their job title.", icon: <Users className="text-blue-500" size={24} /> },
          { title: "Timing", description: "Follow up within 4-5 days if no reply to keep the momentum alive.", icon: <Clock className="text-red-500" size={24} /> },
        ];
        break;
      case "interview":
        features = [
          { title: "Step 1", description: "30m Recruiter Screen. Filter out BI/Dashboard-only personas fast.", icon: <Users className="text-[#102a63]" size={24} /> },
          { title: "Step 2", description: "90m Modelling Deep Dive. Design a revenue model; think aloud as you go.", icon: <Code className="text-blue-500" size={24} /> },
          { title: "Step 3", description: "60m Product Collab. Define metrics for new features; handle PM constraints.", icon: <LayoutDashboard className="text-blue-500" size={24} /> },
          { title: "Step 4", description: "45m Values & Ownership. Validate autonomy and modelling standards philosophy.", icon: <ShieldCheck className="text-blue-500" size={24} /> },
          { title: "Bar", description: "Ensure interviewers don't wing it. Standardized scoring reduces bias.", icon: <ClipboardList className="text-blue-500" size={24} /> },
          { title: "SLA", description: "Fast feedback signals seriousness and keeps seniors engaged in the loop.", icon: <Clock className="text-blue-500" size={24} /> },
        ];
        break;
      case "scorecard":
        features = [
          { title: "Modelling", description: "Clean structures, clear reasoning, deep understanding of tradeoffs.", icon: <Code className="text-blue-500" size={24} /> },
          { title: "Reliability", description: "Tests, validation, and proactive prevention of metric drift across teams.", icon: <ShieldCheck className="text-blue-500" size={24} /> },
          { title: "Product", description: "Translates ambiguous business problems into clean metrics and models.", icon: <Target className="text-[#102a63]" size={24} /> },
          { title: "Ownership", description: "Runs domains, improves systems, and owns outcomes, not just tasks.", icon: <UserCheck className="text-blue-500" size={24} /> },
          { title: "Collaboration", description: "Works smoothly with PM/Engineering squads on short iteration loops.", icon: <Users className="text-blue-500" size={24} /> },
          { title: "Communication", description: "Concise, structured, and explains modelling tradeoffs with clarity.", icon: <MessageSquare className="text-blue-500" size={24} /> },
        ];
        break;
      case "plan":
        features = [
          { title: "Day 1-7", description: "Align RoleCard, approve comp band, and build initial outbound list of 80.", icon: <CalendarCheck className="text-[#102a63]" size={24} /> },
          { title: "Launch", description: "Rewrite JD into outcomes and start two outbound waves plus referral pass.", icon: <Zap className="text-blue-500" size={24} /> },
          { title: "Weekly", description: "Identify leaks early. Track time-to-align. Update messaging if replies drop.", icon: <TrendingUp className="text-blue-500" size={24} /> },
          { title: "SLA", description: "Enforce 24h feedback SLA. Speed is your biggest competitive edge in this market.", icon: <Clock className="text-red-500" size={24} /> },
          { title: "Calibration", description: "Adjust expectations before the funnel fills with mismatched candidates.", icon: <Target className="text-blue-500" size={24} /> },
          { title: "Feedback", description: "Clear interview bottlenecks within 24 hours to prevent senior dropout.", icon: <Search className="text-blue-500" size={24} /> },
        ];
        break;
      default:
        features = [
          { title: "Detailed Analysis", description: "Card content for " + activeTab + " is coming from your HIRECARDS data.", icon: <Info className="text-slate-400" size={24} /> },
          { title: "Verified Data", description: "All hiring signals are verified based on current market reality.", icon: <ShieldCheck className="text-blue-500" size={24} /> },
          { title: "Hiring Score", description: "Final feasibility assessment based on market conditions and speed.", icon: <Zap className="text-blue-500" size={24} /> },
          { title: "Risk Mitigation", description: "Strategies to prevent hiring stalls and process restarts.", icon: <ShieldCheck className="text-[#102a63]" size={24} /> },
          { title: "Talent Flow", description: "Analysis of where your ideal candidates are currently working.", icon: <MapPin className="text-blue-500" size={24} /> },
          { title: "Closing Lever", description: "The specific motivators that will get a 'yes' from top-tier talent.", icon: <UserCheck className="text-blue-500" size={24} /> },
        ];
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-3 relative z-10 py-0 w-full border-t border-slate-100 dark:border-white/5 rounded-b-[32px] overflow-hidden h-full">
        {features.map((feature, index) => (
          <Feature 
            key={feature.title} 
            {...feature} 
            index={index} 
            totalFeatures={features.length}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-[600px] md:h-[750px]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-56 flex flex-col gap-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {tabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
          >
            <motion.button
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl text-[11px] font-black transition-all duration-200 flex items-center gap-3 uppercase tracking-[0.1em]",
                activeTab === tab.id 
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20" 
                  : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              )}
            >
              <tab.Icon size={14} className={activeTab === tab.id ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-[32px] border border-slate-100 dark:border-white/5 relative overflow-hidden h-full">
        {/* DNA Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none opacity-50" />
        
        <AnimatePresence mode="wait">
          <motion.div
            ref={scrollContainerRef}
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onWheel={handleWheel}
            className="relative z-10 h-full overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          display: none;
        }
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

const XCircle = ({ className, size }: { className?: string, size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);
