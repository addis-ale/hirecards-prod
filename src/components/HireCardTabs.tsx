"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  Lock,
} from "lucide-react";
import { EditModeProvider } from "./EditModeContext";
import { OverviewCard } from "./cards/OverviewCard";
import { EditableRealityCard } from "./cards/EditableRealityCard";
import { ImprovementSignalsPanel } from "./ImprovementSignalsPanel";
import { EditableRoleCard } from "./cards/EditableRoleCard";
import { EditableSkillCard } from "./cards/EditableSkillCard";
import { EditableMarketCard } from "./cards/EditableMarketCard";
import { EditableTalentMapCard } from "./cards/EditableTalentMapCard";
import { EditablePayCard } from "./cards/EditablePayCard";
import { EditableFunnelCard } from "./cards/EditableFunnelCard";
import { EditableFitCard } from "./cards/EditableFitCard";
import { EditableMessageCard } from "./cards/EditableMessageCard";
import { EditableOutreachCard } from "./cards/EditableOutreachCard";
import { EditableInterviewCard } from "./cards/EditableInterviewCard";
import { EditableScorecardCard } from "./cards/EditableScorecardCard";
import { EditablePlanCard } from "./cards/EditablePlanCard";
import { useScoreChangeNotification } from "@/hooks/useScoreChangeNotification";

interface HireCardTabsProps {
  isSubscribed?: boolean;
  initialCardId?: string;
}

// Helper function to get card descriptions for tooltips
const getCardDescription = (id: string): string => {
  const descriptions: Record<string, string> = {
    reality:
      "Feasibility score, market conditions, what helps or hurts your case, and the truth about making this hire.",
    role: "What this person will actually do and what success looks like in the first 6–12 months.",
    skill:
      "The must-have abilities, tools, and experience needed to perform the role.",
    market:
      "How big the talent pool is and how competitive the market is for this profile.",
    talentmap:
      "Where the strongest candidates come from, companies, locations, and common backgrounds.",
    pay: "What candidates expect to earn in this market and how your budget compares.",
    funnel:
      "The volume of outreach and interviews you'll need to fill the role.",
    fit: "What motivates this persona, what they care about, and what usually makes them say yes or no.",
    message: "How to pitch the role in a way that actually gets replies.",
    outreach:
      "Ready-to-send email and DM templates for reaching ideal candidates.",
    interview:
      "The recommended interview process and competencies to assess at each stage.",
    scorecard:
      "A simple evaluation framework to keep the team aligned and reduce bias.",
    plan: "Your next steps, the checklist, SLAs, and actions to kick off and run the hiring process well.",
  };
  return descriptions[id] || "Card details";
};

export const HireCardTabs: React.FC<HireCardTabsProps> = ({
  isSubscribed = false,
  initialCardId,
}) => {
  // Track score changes globally for all cards
  useScoreChangeNotification();

  const router = useRouter();
  const pathname = usePathname();
  
  const [activeTab, setActiveTab] = useState(initialCardId || "reality");
  // Update active tab when initialCardId changes
  React.useEffect(() => {
    if (initialCardId) {
      setActiveTab(initialCardId);
    }
  }, [initialCardId]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [showImprovementPanel, setShowImprovementPanel] = useState(false);
  const [realityScore, setRealityScore] = useState(5.5);
  const [acceptedImprovementsBoost, setAcceptedImprovementsBoost] = useState(0);
  const lastRealityScoreRef = useRef<number>(5.5);

  // Dynamic data for cards
  const [payCardData, setPayCardData] = useState<any>(null);
  const [marketCardData, setMarketCardData] = useState<any>(null);
  const [roleCardData, setRoleCardData] = useState<any>(null);
  const [skillCardData, setSkillCardData] = useState<any>(null);
  const [talentMapCardData, setTalentMapCardData] = useState<any>(null);
  const [realityCardData, setRealityCardData] = useState<any>(null);
  const [funnelCardData, setFunnelCardData] = useState<any>(null);
  const [fitCardData, setFitCardData] = useState<any>(null);
  const [messageCardData, setMessageCardData] = useState<any>(null);
  const [outreachCardData, setOutreachCardData] = useState<any>(null);
  const [interviewCardData, setInterviewCardData] = useState<any>(null);
  const [scorecardCardData, setScorecardCardData] = useState<any>(null);
  const [planCardData, setPlanCardData] = useState<any>(null);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);

  // Separate state for Reality Card (used by improvement panel)
  const [realityCardDataForPanel, setRealityCardDataForPanel] =
    useState<any>(null);

  // Skip loading enriched data - use static cards only
  React.useEffect(() => {
    console.log("🚀 ============================================");
    console.log("🚀 HIRECARD TABS: USING STATIC CARDS");
    console.log("🚀 ============================================");
    console.log("✅ All cards will use their default static data");
  }, []);

  const tabs = [
    { id: "reality", label: "Reality Card", Icon: Target },
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

  // Load reality card data for improvement panel
  React.useEffect(() => {
    const saved = sessionStorage.getItem("editableRealityCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setRealityCardData(data);
      } catch (e) {
        console.error("Failed to load reality card data:", e);
      }
    }
  }, [activeTab, isEditMode]);

  const handleRealityScoreChange = useCallback((score: number) => {
    // Only update if score actually changed
    if (lastRealityScoreRef.current !== score) {
      lastRealityScoreRef.current = score;
      setRealityScore(score);
      // Update reality card data when score changes
      const saved = sessionStorage.getItem("editableRealityCard");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setRealityCardData(data);
        } catch (e) {
          console.error("Failed to update reality card data:", e);
        }
      }
    }
  }, []);

  const handleNavigateToCard = (cardId: string) => {
    setActiveTab(cardId);
    // If we're on the card detail page, update the URL
    if (pathname?.startsWith("/cards/")) {
      router.push(`/cards/${cardId}`);
    }
  };

  const renderCardContent = () => {
    const commonProps = {
      onNavigateToCard: handleNavigateToCard,
      currentCardId: activeTab,
    };

    switch (activeTab) {
      case "reality":
        return (
          <EditableRealityCard
            data={realityCardData}
            onScoreChange={handleRealityScoreChange}
            acceptedImprovementsBoost={acceptedImprovementsBoost}
            {...commonProps}
          />
        );
      case "role":
        console.log(
          "📋 Rendering EditableRoleCard with data:",
          roleCardData ? "YES" : "NO"
        );
        return <EditableRoleCard data={roleCardData} {...commonProps} />;
      case "skill":
        return <EditableSkillCard data={skillCardData} {...commonProps} />;
      case "market":
        console.log(
          "📊 Rendering EditableMarketCard with data:",
          marketCardData ? "YES" : "NO"
        );
        return <EditableMarketCard data={marketCardData} {...commonProps} />;
      case "talentmap":
        return (
          <EditableTalentMapCard data={talentMapCardData} {...commonProps} />
        );
      case "pay":
        console.log(
          "💳 Rendering EditablePayCard with data:",
          payCardData ? "YES" : "NO"
        );
        return <EditablePayCard data={payCardData} {...commonProps} />;
      case "funnel":
        return <EditableFunnelCard data={funnelCardData} {...commonProps} />;
      case "fit":
        return <EditableFitCard data={fitCardData} {...commonProps} />;
      case "message":
        return <EditableMessageCard data={messageCardData} {...commonProps} />;
      case "outreach":
        return (
          <EditableOutreachCard data={outreachCardData} {...commonProps} />
        );
      case "interview":
        return (
          <EditableInterviewCard data={interviewCardData} {...commonProps} />
        );
      case "scorecard":
        return (
          <EditableScorecardCard data={scorecardCardData} {...commonProps} />
        );
      case "plan":
        return <EditablePlanCard data={planCardData} {...commonProps} />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              This card is under construction
            </p>
            <p className="text-sm text-gray-400">
              More detailed content coming soon...
            </p>
          </div>
        );
    }
  };

  const handleToggleEdit = () => {
    if (isEditMode) {
      // Saving - trigger save to sessionStorage (already automatic in each card)
      setIsEditMode(false);
    } else {
      // Enter edit mode
      setIsEditMode(true);
    }
  };

  return (
    <div className="w-full">
      {/* Main Content Area - Full Width */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 md:p-5 min-h-[600px]">
          <EditModeProvider isEditMode={isEditMode}>
            {renderCardContent()}
          </EditModeProvider>
        </div>
      </div>

      {/* Floating Message Icon - Bottom Right Corner */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowImprovementPanel(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl"
        title="Get improvement suggestions"
      >
        <MessageSquare className="w-6 h-6" />
        {/* Notification badge if there are suggestions */}
        {realityCardData && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
            !
          </span>
        )}
      </motion.button>

      {/* Improvement Signals Panel */}
      <ImprovementSignalsPanel
        isOpen={showImprovementPanel}
        onClose={() => setShowImprovementPanel(false)}
        currentScore={realityScore}
        cardData={realityCardData}
        onApplySuggestion={(signalId, targetTab, scoreIncrease) => {
          // Track accepted improvement and its score increase
          if (scoreIncrease) {
            setAcceptedImprovementsBoost((prev) => prev + scoreIncrease);
          }
          console.log(
            "Applying suggestion:",
            signalId,
            "score boost:",
            scoreIncrease
          );
        }}
        onNavigateToTab={(tabId) => {
          setActiveTab(tabId);
          setShowImprovementPanel(false);
        }}
      />
    </div>
  );
};
