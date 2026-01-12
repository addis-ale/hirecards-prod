"use client";

import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Zap, Target, AlertTriangle } from "lucide-react";
import { EditableText, EditableList } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card } from "@/components/ui/card";

interface MarketCardProps {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  data?: {
    talentAvailability?: {
      total: number;
      qualified: number;
      currentlyEmployed: number;
      openToWork: number;
    };
    supplyDemand?: {
      openJobs: number;
      availableCandidates: number;
      ratio: string;
      marketTightness: string;
    };
    insights?: string[];
    redFlags?: string[];
    opportunities?: string[];
    geographic?: {
      primaryLocations: string[];
      remoteAvailability: number;
    };
    primaryLocation?: string; // Location from original job data
    talentSupply?: {
      midLevel?: string; // e.g., "High", "Medium", "Low"
      senior?: string;
      productMinded?: string;
    };
  };
}

export const EditableMarketCard: React.FC<MarketCardProps> = ({
  data,
  onNavigateToCard,
  currentCardId,
  onOpenSuggestions,
}) => {
  console.log("📊 ============================================");
  console.log("📊 EDITABLE MARKET CARD RENDER");
  console.log("📊 ============================================");
  console.log("📊 Received data prop:", data ? "YES" : "NO");
  if (data) {
    console.log("📊 Data content:", JSON.stringify(data, null, 2));
  }

  // Get primary location from data or use default
  const primaryLocation =
    data?.primaryLocation ||
    data?.geographic?.primaryLocations?.[0] ||
    "Amsterdam";

  // Initialize from data or use defaults
  const [primaryLocationCount, setPrimaryLocationCount] = useState(
    data?.talentAvailability?.total
      ? `${data.talentAvailability.total}`
      : "250–400"
  );

  const [euRelocationCount, setEuRelocationCount] = useState(
    data?.supplyDemand?.availableCandidates
      ? `~${Math.round(data.supplyDemand.availableCandidates * 0.3)}+`
      : "1,500+"
  );

  const [remoteFlexCount, setRemoteFlexCount] = useState(
    data?.supplyDemand?.availableCandidates
      ? `~${Math.round(data.supplyDemand.availableCandidates * 0.6)}+`
      : "3,000+"
  );

  // Talent Supply levels - dynamic based on scraped data
  const [talentSupplyMidLevel, setTalentSupplyMidLevel] = useState(
    data?.talentSupply?.midLevel || "High"
  );

  const [talentSupplySenior, setTalentSupplySenior] = useState(
    data?.talentSupply?.senior || "Low"
  );

  const [talentSupplyProductMinded, setTalentSupplyProductMinded] = useState(
    data?.talentSupply?.productMinded || "Very low"
  );

  const [marketConditions, setMarketConditions] = useState(
    data?.redFlags && data.redFlags.length > 0
      ? data.redFlags
      : data?.insights && data.insights.length > 0
      ? data.insights
      : ["Top talent is employed", "High competition", "Outbound required"]
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.insights && data.insights.length > 0
      ? data.insights[0]
      : "Senior AEs are: already employed, selective about scope and team quality, motivated by ownership & modelling craft, uninterested in BI-maintenance roles, sensitive to comp clarity and process speed. They don't apply — they respond when the role is specific, honest, and product-oriented."
  );

  const [marketExpansionLevers, setMarketExpansionLevers] = useState([
    {
      lever: "Allow EU relocation",
      why: "Removes biggest constraint",
      poolImpact: "+35%",
    },
    {
      lever: `Hybrid vs ${primaryLocation}-only`,
      why: "Expands to broader EU",
      poolImpact: "+20%",
    },
    {
      lever: "Outcome-focused JD",
      why: "Filters the right persona",
      poolImpact: "+10%",
    },
    {
      lever: "Modelling-specific messaging",
      why: "Seniors respond to clarity",
      poolImpact: "+20% replies",
    },
    {
      lever: "3-step interview loop",
      why: "Matches fintech speed",
      poolImpact: "+12–18% conversion",
    },
  ]);

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Allow EU relocation",
      impact: "+0.4",
      tooltip: "Biggest lever; instantly expands supply",
      talentPoolImpact: "+35%",
      riskReduction: "-20%",
    },
    {
      fix: "Simplify interview loop",
      impact: "+0.2",
      tooltip: "Seniors drop out if loops drag",
      talentPoolImpact: "+15%",
      riskReduction: "-10%",
    },
    {
      fix: "Tighten JD to outcomes",
      impact: "+0.1",
      tooltip: "Removes BI noise & attracts AEs",
      talentPoolImpact: "+10%",
      riskReduction: "-5%",
    },
    {
      fix: "Improve messaging clarity",
      impact: "+0.2",
      tooltip: "Specificity increases replies",
      talentPoolImpact: "+20%",
      riskReduction: "-10%",
    },
  ]);

  // Update when data prop changes - PRIORITY: data prop overrides everything
  useEffect(() => {
    console.log("📊 ============================================");
    console.log("📊 UPDATING MARKET CARD FROM DYNAMIC DATA");
    console.log("📊 ============================================");
    console.log("📊 Data received:", JSON.stringify(data, null, 2));
    
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      if (data.talentAvailability?.total !== undefined && data.talentAvailability.total > 0) {
        console.log("📊 Updating primaryLocationCount from data:", data.talentAvailability.total);
        setPrimaryLocationCount(`${data.talentAvailability.total}`);
      }
      if (data.supplyDemand?.availableCandidates !== undefined && data.supplyDemand.availableCandidates > 0) {
        console.log("📊 Updating counts from availableCandidates:", data.supplyDemand.availableCandidates);
        setEuRelocationCount(`~${Math.round(data.supplyDemand.availableCandidates * 0.3)}+`);
        setRemoteFlexCount(`~${Math.round(data.supplyDemand.availableCandidates * 0.6)}+`);
      }
      if (data.redFlags !== undefined && Array.isArray(data.redFlags) && data.redFlags.length > 0) {
        console.log("📊 Updating marketConditions from data:", data.redFlags.length, "items");
        setMarketConditions(data.redFlags);
      }
      if (data.insights !== undefined && Array.isArray(data.insights) && data.insights.length > 0) {
        console.log("📊 Updating brutalTruth from insights:", data.insights[0]);
        setBrutalTruth(data.insights[0]);
      }
      if (data.talentSupply?.midLevel !== undefined) {
        setTalentSupplyMidLevel(data.talentSupply.midLevel);
      }
      if (data.talentSupply?.senior !== undefined) {
        setTalentSupplySenior(data.talentSupply.senior);
      }
      if (data.talentSupply?.productMinded !== undefined) {
        setTalentSupplyProductMinded(data.talentSupply.productMinded);
      }
    }
  }, [data]);

  useEffect(() => {
    const data = {
      primaryLocationCount,
      euRelocationCount,
      remoteFlexCount,
      marketConditions,
      brutalTruth,
      marketExpansionLevers,
      scoreImpactRows,
    };

    sessionStorage.setItem("editableMarketCard", JSON.stringify(data));
  }, [
    primaryLocationCount,
    euRelocationCount,
    remoteFlexCount,
    marketConditions,
    brutalTruth,
    marketExpansionLevers,
    scoreImpactRows,
  ]);

  // Fallback: Load from sessionStorage if data prop is not available
  useEffect(() => {
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      // Data prop is available, skip sessionStorage
      return;
    }
    
    const saved = sessionStorage.getItem("editableMarketCard");
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        if (savedData.primaryLocationCount)
          setPrimaryLocationCount(savedData.primaryLocationCount);
        if (savedData.euRelocationCount)
          setEuRelocationCount(savedData.euRelocationCount);
        if (savedData.remoteFlexCount) setRemoteFlexCount(savedData.remoteFlexCount);
        if (savedData.marketConditions) setMarketConditions(savedData.marketConditions);
        if (savedData.brutalTruth) setBrutalTruth(savedData.brutalTruth);
        if (savedData.marketExpansionLevers)
          setMarketExpansionLevers(savedData.marketExpansionLevers);
        if (savedData.scoreImpactRows && Array.isArray(savedData.scoreImpactRows) && savedData.scoreImpactRows.length > 0) {
          setScoreImpactRows(savedData.scoreImpactRows);
        }
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, [data]);

  const talentPoolContent = (
    <div className="space-y-6">
      {/* Talent Pool Estimate */}
      <div>
        <h4 className="font-semibold text-sm mb-3 text-gray-700">
          Talent Pool Estimate
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
            <EditableText
              value={primaryLocationCount}
              onChange={setPrimaryLocationCount}
              className="text-3xl font-bold mb-1"
              style={{ color: "#278f8c" }}
            />
            <p className="text-sm font-medium text-gray-600">
              {primaryLocation}
            </p>
            <p className="text-xs text-gray-500 mt-1">Strong fits</p>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
            <EditableText
              value={euRelocationCount}
              onChange={setEuRelocationCount}
              className="text-3xl font-bold mb-1"
              style={{ color: "#278f8c" }}
            />
            <p className="text-sm font-medium text-gray-600">EU Relocation</p>
            <p className="text-xs text-gray-500 mt-1">Willing to relocate</p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <EditableText
              value={remoteFlexCount}
              onChange={setRemoteFlexCount}
              className="text-3xl font-bold mb-1"
              style={{ color: "#278f8c" }}
            />
            <p className="text-sm font-medium text-gray-600">Remote-flex EU</p>
            <p className="text-xs text-gray-500 mt-1">Full remote</p>
          </div>
        </div>
      </div>

      {/* Talent Supply */}
      <div>
        <h4 className="font-semibold text-sm mb-3 text-gray-700">
          Talent Supply
        </h4>
        <div className="space-y-3">
          <div
            className={`flex items-center gap-3 p-2 border rounded-lg ${
              talentSupplyMidLevel.toLowerCase().includes("high") ||
              talentSupplyMidLevel.toLowerCase().includes("very high")
                ? "bg-green-50 border-green-200"
                : talentSupplyMidLevel.toLowerCase().includes("low") ||
                  talentSupplyMidLevel.toLowerCase().includes("very low")
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                talentSupplyMidLevel.toLowerCase().includes("high") ||
                talentSupplyMidLevel.toLowerCase().includes("very high")
                  ? "bg-green-500"
                  : talentSupplyMidLevel.toLowerCase().includes("low") ||
                    talentSupplyMidLevel.toLowerCase().includes("very low")
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>
                {talentSupplyMidLevel} for mid-level
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 p-2 border rounded-lg ${
              talentSupplySenior.toLowerCase().includes("high") ||
              talentSupplySenior.toLowerCase().includes("very high")
                ? "bg-green-50 border-green-200"
                : talentSupplySenior.toLowerCase().includes("low") ||
                  talentSupplySenior.toLowerCase().includes("very low")
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                talentSupplySenior.toLowerCase().includes("high") ||
                talentSupplySenior.toLowerCase().includes("very high")
                  ? "bg-green-500"
                  : talentSupplySenior.toLowerCase().includes("low") ||
                    talentSupplySenior.toLowerCase().includes("very low")
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>
                {talentSupplySenior} for senior
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 p-2 border rounded-lg ${
              talentSupplyProductMinded.toLowerCase().includes("high") ||
              talentSupplyProductMinded.toLowerCase().includes("very high")
                ? "bg-green-50 border-green-200"
                : talentSupplyProductMinded.toLowerCase().includes("low") ||
                  talentSupplyProductMinded.toLowerCase().includes("very low")
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                talentSupplyProductMinded.toLowerCase().includes("high") ||
                talentSupplyProductMinded.toLowerCase().includes("very high")
                  ? "bg-green-500"
                  : talentSupplyProductMinded.toLowerCase().includes("low") ||
                    talentSupplyProductMinded.toLowerCase().includes("very low")
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>
                {talentSupplyProductMinded} for product-minded
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const marketExpansionContent = (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-purple-100 border-b-2 border-purple-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-purple-900">
              Lever
            </th>
            <th className="px-4 py-3 text-left font-semibold text-purple-900">
              Why it matters
            </th>
            <th className="px-4 py-3 text-center font-semibold text-purple-900">
              Pool Impact
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-100">
          {marketExpansionLevers.map((item, idx) => (
            <tr key={idx} className="hover:bg-purple-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">
                {item.lever}
              </td>
              <td className="px-4 py-3 text-gray-700">{item.why}</td>
              <td className="px-4 py-3 text-center text-purple-800 font-medium">
                {item.poolImpact}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const sections = [
    {
      id: "talent-pool",
      title: "Talent Pool Overview",
      subtitle: "How big the talent pool is across different location options",
      Icon: Users,
      tone: "info" as const,
      content: talentPoolContent,
    },
    {
      id: "expansion-levers",
      title: "Market Expansion Levers",
      subtitle: "What actually moves the needle to expand your talent pool",
      Icon: Zap,
      tone: "purple" as const,
      content: marketExpansionContent,
    },
    {
      id: "market-conditions",
      title: "Market Conditions",
      subtitle: "Competition, supply, and market dynamics you're up against",
      Icon: TrendingUp,
      tone: "warning" as const,
      content: (
        <EditableList
          items={marketConditions}
          onChange={setMarketConditions}
          itemClassName="text-sm"
          markerColor="text-blue-500"
        />
      ),
    },
    {
      id: "bottom-line",
      title: "Bottom Line",
      subtitle: "The key takeaway from this market analysis",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={brutalTruth}
          onChange={setBrutalTruth}
          className="text-sm font-medium text-red-900"
          multiline
        />
      ),
    },
    {
      id: "score-impact",
      title: "Fix Me Now",
      subtitle: "Actions you can take to improve your hiring score",
      Icon: Target,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.9" cardId="market" />,
    },
  ];

  return (
    <>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-0">
        {[...sections].sort((a, b) => {
          // Ensure score-impact is always last
          if (a.id === "score-impact") return 1;
          if (b.id === "score-impact") return -1;
          return 0;
        }).map((section) => {

          const toneColors: Record<string, { accent: string; bg: string }> = {
            info: { accent: "#2563eb", bg: "rgba(37,99,235,0.1)" },
            warning: { accent: "#d97706", bg: "rgba(217,119,6,0.1)" },
            purple: { accent: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
            success: { accent: "#16a34a", bg: "rgba(22,163,74,0.1)" },
            danger: { accent: "#dc2626", bg: "rgba(220,38,38,0.1)" },
          };

          const colors = toneColors[section.tone] || toneColors.info;

          const isScoreImpact = section.id === "score-impact";

          return (
            <Card
              key={section.id}
              className={`w-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-t-4 ${isScoreImpact ? 'md:col-span-2' : ''}`}
              style={{
                borderTopColor: colors.accent,
                backgroundColor: 'transparent',
              }}
            >
              {/* Special handling for score-impact: show boxes inline */}
              {isScoreImpact ? (
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-bold ${colors.accent ? `text-[${colors.accent}]` : 'text-emerald-700'}`} style={{ color: colors.accent }}>
                      {section.title}
                    </h3>
                  </div>
                  <FixMeNowBoxes
                    rows={scoreImpactRows}
                    totalUplift="+0.9"
                    cardId="market"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "market"}
                    onOpenSuggestions={onOpenSuggestions}
                  />
                </div>
              ) : (
                /* Show all content directly - no modals */
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-3 text-slate-900 dark:text-white" style={{ color: colors.accent }}>
                    {section.title}
                  </h3>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {section.content}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
};
