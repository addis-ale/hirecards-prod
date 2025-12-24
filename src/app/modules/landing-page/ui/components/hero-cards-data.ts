import { 
  BarChart3, 
  AlertCircle, 
  Layers, 
  DollarSign, 
  Send, 
  CheckSquare 
} from "lucide-react";

export const heroCards = [
  {
    id: "1",
    title: "Reality Card",
    subtitle: "The Truth About Making This Hire",
    icon: AlertCircle,
    color: "from-purple-500 to-pink-600",
    metricValue: "5.5/10",
    metricLabel: "Feasibility Score",
    insights: [
      { label: "Max with fixes", value: "6.5/10" },
      { label: "Restart risk", value: "Week 5-7" },
    ],
    keyInsights: [
      "You're competing for seniors who are fully employed, well-paid, and selective",
      "If scope, messaging, and speed aren't sharp → entering the race with untied shoelaces",
      "Timeline to failure: alignment not fixed by Day 7 → expect stall/reset at week 5-7"
    ],
    brutalTruth: "Most searches don't fail because 'the market is hard.' They fail because internal alignment is harder. You won't know it's happening until candidates quietly stop responding.",
    helps: ["Product-facing analytics (rare)", "Stack seniors want (dbt, Snowflake)", "Clear domain ownership"],
    hurts: ["Amsterdam-only requirement", "4+ step interview loop", "Comp below €90k"],
    redFlag: "If team doesn't agree on 'good' in week one → restart guaranteed"
  },
  {
    id: "2",
    title: "Market Card",
    subtitle: "Addressable Talent Market",
    icon: BarChart3,
    color: "from-blue-500 to-indigo-600",
    metricValue: "250-400",
    metricLabel: "Amsterdam Fits",
    insights: [
      { label: "EU Remote-flex", value: "3,000+" },
      { label: "True fit rate", value: "10-15%" },
    ],
    keyInsights: [
      "Senior AEs are already employed, selective about scope, motivated by ownership",
      "They don't apply — they respond when the role is specific, honest, and product-oriented",
      "dbt demand outpaces supply; few roles offer true product-facing analytics"
    ],
    brutalTruth: "You're competing directly with Adyen, bunq, Booking, Klarna, Revolut. They move fast (7-12 day loops), pay competitively, and offer strong data environments. If your process is slow or vague → they win by default.",
    helps: ["Allow EU relocation (+35%)", "Hybrid vs Amsterdam-only (+20%)", "3-step interview loop (+18%)"],
    hurts: ["Slow process (fintech wins)", "Vague JD (kills half market)", "Late comp clarity"],
    redFlag: "A vague JD eliminates half your market before you even start"
  },
  {
    id: "3",
    title: "Skill Card",
    subtitle: "Skills That Predict Success",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    metricValue: "+25%",
    metricLabel: "Pool Expansion",
    insights: [
      { label: "Core skills", value: "5" },
      { label: "Upskillable", value: "4" },
    ],
    keyInsights: [
      "Adding unnecessary skills shrinks your addressable talent pool",
      "Looker, metric layers, Airflow DAG writing → can be trained quickly",
      "Modelling fundamentals, dbt proficiency, ownership mindset → must-have at entry"
    ],
    brutalTruth: "Adding Python 'just because' → score -0.2. Removing 'Fintech experience mandatory' → score +0.2. Don't confuse 'good with dashboards' = 'strong AE'. Most BI devs mislabeled as AEs lack modelling fundamentals and will fail.",
    helps: ["Advanced SQL + testing", "Strong dbt (macros, tests)", "Dimensional modelling"],
    hurts: ["Only built dashboards", "Avoids documentation", "Weak testing discipline"],
    redFlag: "Skip modelling exercises → guaranteed bad hire"
  },
  {
    id: "4",
    title: "Pay Card",
    subtitle: "What The Market Pays",
    icon: DollarSign,
    color: "from-amber-500 to-orange-600",
    metricValue: "€85k-€100k",
    metricLabel: "Base Range",
    insights: [
      { label: "Total comp", value: "€95-115k" },
      { label: "Hiring band", value: "€90-105k" },
    ],
    keyInsights: [
      "Published range: €6,100–€7,900/month → Recommended hiring band: €90k–€105k",
      "US remote companies are paying +20-40% for the same profile",
      "If comp approval takes >5 days, you've already lost momentum"
    ],
    brutalTruth: "If you offer €80k → you will not hire a senior. You will hire someone who thinks they are senior. Hidden market force: US remote companies are in their inbox competing with you — but you won't see them.",
    helps: ["Align comp before sourcing (+25%)", "Share range early (+12%)", "Offer flexibility (+10%)"],
    hurts: ["Candidate wants +20% above band", "Internal equity blocks comp", "Approval takes >5 days"],
    redFlag: "Comp not aligned by screen → expect late-stage collapse"
  },
  {
    id: "5",
    title: "Funnel Card",
    subtitle: "How Much You Actually Need",
    icon: Send,
    color: "from-sky-500 to-blue-600",
    metricValue: "120-150",
    metricLabel: "Outbound Messages",
    insights: [
      { label: "Replies", value: "20-25" },
      { label: "Finalists", value: "2-3" },
    ],
    keyInsights: [
      "This isn't inefficiency — it's the normal ratio for this persona",
      "Senior AEs rarely apply — the funnel is outbound-led",
      "They drop out instantly if they sense BI flavour, vague JD, slow loop, or unclear comp"
    ],
    brutalTruth: "A broken funnel feels like 'bad candidates' — but it's usually bad flow. Healthy funnel: hire in 25-35 days. Typical funnel: 50-70 days. Broken funnel (4-5 rounds, unprepared interviewers): restart at week 6.",
    helps: ["Warm every 48-72h (+12%)", "Remove long take-homes (+10%)", "Pre-block calendars (+15%)"],
    hurts: ["Time gaps >72h", "Take-homes >2 hours", "Week-long calendar pauses"],
    redFlag: "Most funnel leaks happen between stages, not at sourcing"
  },
  {
    id: "6",
    title: "Interview Card",
    subtitle: "Loop That Actually Works",
    icon: CheckSquare,
    color: "from-rose-500 to-red-600",
    metricValue: "3-4",
    metricLabel: "Steps Max",
    insights: [
      { label: "Feedback SLA", value: "24h" },
      { label: "Tech pass rate", value: "40-60%" },
    ],
    keyInsights: [
      "Recommended: Recruiter Screen (30m) → Modelling Deep Dive (60-90m) → Product Collab (45-60m) → Values (30-45m)",
      "This persona evaluates your team just as much as you evaluate them",
      "They assume silence = misalignment and drop offers instantly if mismatched"
    ],
    brutalTruth: "Don't let interviewers 'wing it'. Don't ask vague questions like 'Tell me about yourself'. Don't add extra rounds 'to be sure'. Every one of these increases dropout. A great interview loop tests ownership, clarity, modelling craft, and product reasoning — not trick questions.",
    helps: ["Standardise questions (+15%)", "Remove unnecessary rounds (+20%)", "Train interviewers (+10%)"],
    hurts: ["Interviewers 'wing it'", "Vague questions", "Extra rounds 'to be sure'"],
    redFlag: "Bad interviews lose top candidates faster than bad sourcing"
  }
];
