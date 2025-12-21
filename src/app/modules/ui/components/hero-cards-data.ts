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
    title: "Market Card",
    description: "Shows the size of the available talent pool and how competitive the market is for this role.",
    icon: BarChart3,
    color: "from-blue-500 to-indigo-600",
    metricValue: "3.2k",
    metricLabel: "Active Candidates"
  },
  {
    id: "2",
    title: "Skill Card",
    description: "Outlines the must-have skills, tools, and experience required to perform the role effectively.",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    metricValue: "5+",
    metricLabel: "Key Skills"
  },
  {
    id: "3",
    title: "Pay Card",
    description: "Compares candidate salary expectations with your budget based on real market data.",
    icon: DollarSign,
    color: "from-amber-500 to-orange-600",
    metricValue: "£85k",
    metricLabel: "Market Median"
  },
  {
    id: "4",
    title: "Reality Card",
    description: "Provides a feasibility score, current market conditions, and clear factors that help or hurt your chances of making this hire.",
    icon: AlertCircle,
    color: "from-purple-500 to-pink-600",
    metricValue: "72/100",
    metricLabel: "Feasibility Score"
  },
  {
    id: "5",
    title: "Outreach Card",
    description: "Includes ready-to-send email and DM templates to engage ideal candidates faster.",
    icon: Send,
    color: "from-sky-500 to-blue-600",
    metricValue: "45%",
    metricLabel: "Response Rate"
  },
  {
    id: "6",
    title: "Interview Card",
    description: "Recommends an interview structure and the key competencies to assess at each stage.",
    icon: CheckSquare,
    color: "from-rose-500 to-red-600",
    metricValue: "3",
    metricLabel: "Stages"
  }
];
