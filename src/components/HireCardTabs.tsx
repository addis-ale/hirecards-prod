"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
} from "lucide-react";
import { EditModeProvider } from "./EditModeContext";
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


export const HireCardTabs: React.FC<HireCardTabsProps> = ({
  initialCardId,
}) => {
  // Track score changes globally for all cards
  useScoreChangeNotification();

  const router = useRouter();
  const pathname = usePathname();
  
  // All cards are now dynamic - show all 13 cards
  const allCardIds = React.useMemo(() => ["reality", "role", "skill", "fit", "message", "outreach", "talentmap", "market", "pay", "funnel", "interview", "scorecard", "plan"], []);
  
  // Default to first card if initialCardId is not in the list
  const defaultTab = allCardIds.includes(initialCardId || "") 
    ? initialCardId 
    : allCardIds[0]; // Default to "reality"
  
  const [activeTab, setActiveTab] = useState(defaultTab || "reality");
  
  // Update active tab when initialCardId changes (only if it's in our card list)
  React.useEffect(() => {
    if (initialCardId && allCardIds.includes(initialCardId)) {
      setActiveTab(initialCardId);
    } else if (!allCardIds.includes(activeTab)) {
      // If current tab is not in our list, switch to default
      setActiveTab(allCardIds[0]);
    }
  }, [initialCardId, activeTab, allCardIds]);

  const [isEditMode] = useState(false);
  const [showImprovementPanel, setShowImprovementPanel] = useState(false);
  const [realityScore, setRealityScore] = useState(5.5);
  const [acceptedImprovementsBoost, setAcceptedImprovementsBoost] = useState(0);
  const lastRealityScoreRef = useRef<number>(5.5);

  // Dynamic data for cards
  const [payCardData, setPayCardData] = useState<Record<string, unknown> | null>(null);
  const [marketCardData, setMarketCardData] = useState<Record<string, unknown> | null>(null);
  const [roleCardData, setRoleCardData] = useState<Record<string, unknown> | null>(null);
  const [skillCardData, setSkillCardData] = useState<Record<string, unknown> | null>(null);
  const [talentMapCardData, setTalentMapCardData] = useState<Record<string, unknown> | null>(null);
  const [realityCardData, setRealityCardData] = useState<Record<string, unknown> | null>(null);
  const [funnelCardData, setFunnelCardData] = useState<Record<string, unknown> | null>(null);
  const [fitCardData, setFitCardData] = useState<Record<string, unknown> | null>(null);
  const [messageCardData, setMessageCardData] = useState<Record<string, unknown> | null>(null);
  const [outreachCardData, setOutreachCardData] = useState<Record<string, unknown> | null>(null);
  const [interviewCardData, setInterviewCardData] = useState<Record<string, unknown> | null>(null);
  const [scorecardCardData, setScorecardCardData] = useState<Record<string, unknown> | null>(null);
  const [planCardData, setPlanCardData] = useState<Record<string, unknown> | null>(null);

  // Load dynamic card data from sessionStorage
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem("scrapedJobData");
      if (stored) {
        const data = JSON.parse(stored);
        const jobAnalysisCards = data.jobAnalysisCards;
        
        if (jobAnalysisCards) {
          console.log("📊 Loading dynamic card data from sessionStorage");
          
          // Set role card data
          if (jobAnalysisCards.roleCard) {
            console.log("📋 Setting roleCardData:", JSON.stringify(jobAnalysisCards.roleCard, null, 2));
            setRoleCardData(jobAnalysisCards.roleCard);
            console.log("✅ Role Card data loaded and state updated");
          } else {
            console.log("⚠️ No roleCard found in jobAnalysisCards");
          }
          
          // Set skill card data
          if (jobAnalysisCards.skillCard) {
            console.log("🔧 Setting skillCardData:", JSON.stringify(jobAnalysisCards.skillCard, null, 2));
            setSkillCardData(jobAnalysisCards.skillCard);
            console.log("✅ Skill Card data loaded and state updated");
          } else {
            console.log("⚠️ No skillCard found in jobAnalysisCards");
          }
          
          // Set other job analysis cards
          if (jobAnalysisCards.fitCard) {
            setFitCardData(jobAnalysisCards.fitCard);
          }
          
          if (jobAnalysisCards.messageCard) {
            setMessageCardData(jobAnalysisCards.messageCard);
          }
          
          if (jobAnalysisCards.outreachCard) {
            setOutreachCardData(jobAnalysisCards.outreachCard);
          }
          
          // Set people analysis cards
          if (data.peopleAnalysisCards?.talentMapCard) {
            console.log("🗺️ Setting talentMapCardData:", JSON.stringify(data.peopleAnalysisCards.talentMapCard, null, 2));
            setTalentMapCardData(data.peopleAnalysisCards.talentMapCard);
            console.log("✅ Talent Map Card data loaded and state updated");
          } else {
            console.log("⚠️ No talentMapCard found in peopleAnalysisCards");
            console.log("   peopleAnalysisCards:", data.peopleAnalysisCards);
          }
          
          // Set combined analysis cards
          if (data.combinedAnalysisCards) {
            if (data.combinedAnalysisCards.marketCard) {
              setMarketCardData(data.combinedAnalysisCards.marketCard);
            }
            if (data.combinedAnalysisCards.payCard) {
              setPayCardData(data.combinedAnalysisCards.payCard);
            }
            if (data.combinedAnalysisCards.funnelCard) {
              setFunnelCardData(data.combinedAnalysisCards.funnelCard);
            }
            if (data.combinedAnalysisCards.realityCard) {
              setRealityCardData(data.combinedAnalysisCards.realityCard);
            }
          }
          
          // Set derived strategy cards
          if (data.derivedStrategyCards) {
            if (data.derivedStrategyCards.interviewCard) {
              setInterviewCardData(data.derivedStrategyCards.interviewCard);
            }
            if (data.derivedStrategyCards.scorecardCard) {
              setScorecardCardData(data.derivedStrategyCards.scorecardCard);
            }
            if (data.derivedStrategyCards.planCard) {
              setPlanCardData(data.derivedStrategyCards.planCard);
            }
          }
        } else {
          console.log("⚠️ No jobAnalysisCards found in sessionStorage, using static data");
        }
      } else {
        console.log("⚠️ No scrapedJobData in sessionStorage, using static data");
      }
    } catch (error) {
      console.error("❌ Error loading card data from sessionStorage:", error);
    }
  }, []);


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
      onOpenSuggestions: () => setShowImprovementPanel(true),
    };

    switch (activeTab) {
      case "reality":
        return (
          <EditableRealityCard
            data={realityCardData || undefined}
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
        if (roleCardData) {
          console.log("📋 Role Card Data:", JSON.stringify(roleCardData, null, 2));
        }
        // Use key to force re-render when data changes from null to actual data
        return <EditableRoleCard key={roleCardData ? `role-dynamic-${typeof roleCardData.roleSummary === 'string' ? roleCardData.roleSummary.slice(0, 20) : 'role'}` : 'role-static'} data={roleCardData || undefined} {...commonProps} />;
      case "skill":
        console.log(
          "🔧 Rendering EditableSkillCard with data:",
          skillCardData ? "YES" : "NO"
        );
        if (skillCardData) {
          console.log("🔧 Skill Card Data:", JSON.stringify(skillCardData, null, 2));
        }
        return <EditableSkillCard key={skillCardData ? `skill-${JSON.stringify(skillCardData).slice(0, 50)}` : 'skill-static'} data={skillCardData || undefined} {...commonProps} />;
      case "market":
        console.log(
          "📊 Rendering EditableMarketCard with data:",
          marketCardData ? "YES" : "NO"
        );
        return <EditableMarketCard data={marketCardData || undefined} {...commonProps} />;
      case "talentmap":
        return (
          <EditableTalentMapCard data={talentMapCardData || undefined} {...commonProps} />
        );
      case "pay":
        console.log(
          "💳 Rendering EditablePayCard with data:",
          payCardData ? "YES" : "NO"
        );
        return <EditablePayCard data={payCardData || undefined} {...commonProps} />;
      case "funnel":
        return <EditableFunnelCard data={funnelCardData || undefined} {...commonProps} />;
      case "fit":
        return <EditableFitCard data={fitCardData || undefined} {...commonProps} />;
      case "message":
        return <EditableMessageCard data={messageCardData || undefined} {...commonProps} />;
      case "outreach":
        return (
          <EditableOutreachCard data={outreachCardData || undefined} {...commonProps} />
        );
      case "interview":
        return (
          <EditableInterviewCard data={interviewCardData || undefined} {...commonProps} />
        );
      case "scorecard":
        return (
          <EditableScorecardCard data={scorecardCardData || undefined} {...commonProps} />
        );
      case "plan":
        return <EditablePlanCard data={planCardData || undefined} {...commonProps} />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 font-bold mb-4 text-lg">
              This card is under construction
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 font-bold">
              More detailed content coming soon...
            </p>
          </div>
        );
    }
  };


  return (
    <div className="w-full">
      {/* Main Content Area - Full Width */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden transition-colors duration-300">
        <div className="p-4 md:p-6 lg:p-8 min-h-[600px]">
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
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-full shadow-2xl flex items-center justify-center transition-all hover:shadow-2xl border-2 border-slate-200 dark:border-slate-700"
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
        cardData={realityCardData || {}}
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
