import {
  LayoutDashboard,
  Briefcase,
  Code,
  TrendingUp,
  Map,
  DollarSign,
  BarChart3,
  UserCheck,
  MessageSquare,
  Send,
  Mic,
  ClipboardList,
  CalendarCheck,
  Target,
} from "lucide-react";

export interface Card {
  id: string;
  label: string;
  teaser: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  category: string;
  impact?: string;
}

export const cardCategories = [
  {
    id: "foundation",
    name: "Foundation",
    description: "Essential building blocks for your hiring strategy",
    gradient: "bg-gradient-to-r from-purple-600 to-indigo-600",
  },
  {
    id: "market-intelligence",
    name: "Market Intelligence",
    description: "Understand market dynamics and talent availability",
    gradient: "bg-gradient-to-r from-blue-600 to-cyan-600",
  },
  {
    id: "outreach-engagement",
    name: "Outreach & Engagement",
    description: "Connect with top talent effectively",
    gradient: "bg-gradient-to-r from-emerald-600 to-teal-600",
  },
  {
    id: "selection",
    name: "Selection",
    description: "Evaluate and select the best candidates",
    gradient: "bg-gradient-to-r from-amber-600 to-orange-600",
  },
];

export const allCards: Card[] = [
  {
    id: "reality",
    label: "Reality Card",
    teaser: "The Truth About Making This Hire",
    icon: LayoutDashboard,
    gradient: "bg-gradient-to-br from-purple-600 to-pink-600",
    category: "foundation",
    impact: "+1.2",
  },
  {
    id: "role",
    label: "Role Card",
    teaser: "Outcome-focused mission & product-led impact",
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-amber-600 to-orange-600",
    category: "foundation",
    impact: "+1.3",
  },
  {
    id: "skill",
    label: "Skills Card",
    teaser: "Skills That Predict Success",
    icon: Code,
    gradient: "bg-gradient-to-br from-blue-600 to-indigo-600",
    category: "foundation",
    impact: "+1.3",
  },
  {
    id: "market",
    label: "Market Card",
    teaser: "Addressable Talent Market",
    icon: TrendingUp,
    gradient: "bg-gradient-to-br from-emerald-600 to-teal-600",
    category: "market-intelligence",
    impact: "+1.1",
  },
  {
    id: "talentmap",
    label: "Talent Map Card",
    teaser: "Pinpointing where top talent is moving next",
    icon: Map,
    gradient: "bg-gradient-to-br from-violet-600 to-purple-600",
    category: "market-intelligence",
    impact: "+1.2",
  },
  {
    id: "pay",
    label: "Pay Card",
    teaser: "What The Market Pays",
    icon: DollarSign,
    gradient: "bg-gradient-to-br from-green-600 to-emerald-600",
    category: "market-intelligence",
    impact: "+0.9",
  },
  {
    id: "funnel",
    label: "Funnel Card",
    teaser: "How Much You Actually Need",
    icon: BarChart3,
    gradient: "bg-gradient-to-br from-cyan-600 to-blue-600",
    category: "market-intelligence",
    impact: "+0.8",
  },
  {
    id: "fit",
    label: "Fit Card",
    teaser: "Psychographic motivators for senior hires",
    icon: UserCheck,
    gradient: "bg-gradient-to-br from-pink-600 to-rose-600",
    category: "selection",
    impact: "+0.7",
  },
  {
    id: "message",
    label: "Message Card",
    teaser: "Specificity-driven outreach hooks & truth",
    icon: MessageSquare,
    gradient: "bg-gradient-to-br from-sky-600 to-cyan-600",
    category: "outreach-engagement",
    impact: "+0.6",
  },
  {
    id: "outreach",
    label: "Outreach Card",
    teaser: "Optimized 3-step high-reply sequence",
    icon: Send,
    gradient: "bg-gradient-to-br from-orange-600 to-red-600",
    category: "outreach-engagement",
    impact: "+0.8",
  },
  {
    id: "interview",
    label: "Interview Card",
    teaser: "Loop That Actually Works",
    icon: Mic,
    gradient: "bg-gradient-to-br from-rose-600 to-red-600",
    category: "selection",
    impact: "+0.9",
  },
  {
    id: "scorecard",
    label: "Scorecard Card",
    teaser: "Candidate assessment matrix",
    icon: ClipboardList,
    gradient: "bg-gradient-to-br from-teal-600 to-green-600",
    category: "selection",
    impact: "+0.6",
  },
  {
    id: "plan",
    label: "Plan Card",
    teaser: "Hiring timeline & milestones",
    icon: CalendarCheck,
    gradient: "bg-gradient-to-br from-indigo-600 to-violet-600",
    category: "foundation",
    impact: "+0.9",
  },
];

export function getCardsByCategory(categoryId: string): Card[] {
  return allCards.filter((card) => card.category === categoryId);
}

export function getCardById(cardId: string): Card | undefined {
  return allCards.find((card) => card.id === cardId);
}

