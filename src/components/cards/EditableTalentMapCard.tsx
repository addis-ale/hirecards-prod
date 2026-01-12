"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Target,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { EditableList, EditableText } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card } from "@/components/ui/card";

interface TalentMapCardProps {
  data?: {
    primaryFeeders?: string[];
    secondaryFeeders?: string[];
    avoidList?: string[];
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    hiddenBottleneck?: string;
    talentFlowMap?: Array<{ flow: string; path: string; note: string }>;
    personaInsights?: Array<{
      type: string;
      motivated: string;
      needs: string;
      hates: string;
    }>;
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  onOpenSuggestions?: () => void;
}

export const EditableTalentMapCard = ({
  data,
  onNavigateToCard,
  currentCardId,
  onOpenSuggestions,
}: TalentMapCardProps = {}) => {
  console.log("🗺️ EditableTalentMapCard rendered with data:", data ? "YES" : "NO");
  if (data) {
    console.log("🗺️ Data.primaryFeeders:", data.primaryFeeders);
    console.log("🗺️ Data.primaryFeeders length:", data.primaryFeeders?.length);
  }
  
  const [primaryFeeders, setPrimaryFeeders] = useState(
    data?.primaryFeeders ?? [
      "Adyen",
      "bunq",
      "Booking.com",
      "bol",
      "Klarna",
      "Revolut",
      "PayPal",
      "mid-sized scale-ups",
    ]
  );

  const [secondaryFeeders, setSecondaryFeeders] = useState(
    data?.secondaryFeeders ?? [
      "Modern data consultancies",
      "ING / Rabobank specialist modelling pods",
      "Data platform engineers",
    ]
  );

  const [avoidList, setAvoidList] = useState(
    data?.avoidList ?? [
      "Legacy BI teams (ETL-heavy, dashboard-focused)",
      "Excel-heavy analytics functions",
      "Reporting analysts with no semantic layer experience",
      '"Analytics Engineers" who only built dashboards',
    ]
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ||
      "Everyone is chasing the same top 10 companies. You won't win them on comp. You must win them on scope and shipping velocity."
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      'Candidates who "maintained dashboards" rather than built modelling ecosystems',
      "Builders of internal-only tools who never shipped product-facing analytics",
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts || [
      "Target early-stage startups, modelling maturity tends to be low",
      "Target banking analytics teams without validating modelling experience",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Prioritize candidates frustrated by data chaos or slow product cycles",
      "Target people who own domains, not maintain pipelines",
    ]
  );

  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    data?.hiddenBottleneck ||
      "You're not just fighting for attention, you're fighting for credibility."
  );

  const [talentFlowMap, setTalentFlowMap] = useState(
    data?.talentFlowMap || [
      {
        flow: "Fintech Flow",
        path: "Adyen → bunq → Mollie → bunq → Revolut",
        note: "(Fintechs trade the same AE persona; they move fast.)",
      },
      {
        flow: "Scale-Up Flow",
        path: "Booking → bol → mid-sized SaaS → fintech",
        note: "(AEs seek more ownership + product impact.)",
      },
      {
        flow: "Consultancy Flow",
        path: "Consultancies → fintech & SaaS (entry to mid-level AEs)",
        note: "(Solid fundamentals, validate depth.)",
      },
    ]
  );

  const [personaInsights, setPersonaInsights] = useState(
    data?.personaInsights || [
      {
        type: "Fintech AEs",
        motivated: "ownership, pace, clear product impact",
        needs: "modelling challenges, clean architecture",
        hates: "slow loops, vague JD, BI tasks",
      },
      {
        type: "Scale-Up AEs",
        motivated: "system design, problem-solving, shaping standards",
        needs: "engineering collaboration, autonomy",
        hates: "legacy systems with no investment",
      },
      {
        type: "Consultancy AEs",
        motivated: "solving interesting problems",
        needs: "stability + ownership they never get in consulting",
        hates: "unclear product vision",
      },
    ]
  );

  // Update when data prop changes
  useEffect(() => {
    if (data?.primaryFeeders) setPrimaryFeeders(data.primaryFeeders);
    if (data?.secondaryFeeders) setSecondaryFeeders(data.secondaryFeeders);
    if (data?.avoidList) setAvoidList(data.avoidList);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.redFlags) setRedFlags(data.redFlags);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixes) setFixes(data.fixes);
    if (data?.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
    if (data?.talentFlowMap) setTalentFlowMap(data.talentFlowMap);
    if (data?.personaInsights) setPersonaInsights(data.personaInsights);
  }, [data]);

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Target frustration-driven candidates",
      impact: "+0.2",
      tooltip:
        "These candidates actively seek better modelling ownership and convert faster.",
      talentPoolImpact: "+12% reply rate",
      riskReduction: "-10% negotiation drag",
    },
    {
      fix: "Prioritise domain owners",
      impact: "+0.2",
      tooltip:
        "True AEs own modelling domains; removes dashboard-only profiles.",
      talentPoolImpact: "+10% stronger pipeline",
      riskReduction: "-15% late-stage failure",
    },
    {
      fix: "Use frustration-based messaging",
      impact: "+0.2",
      tooltip:
        'Speaking to real pain points outperforms generic "modern stack" claims.',
      talentPoolImpact: "+18% reply uplift",
      riskReduction: "-5% ghosting",
    },
  ]);

  useEffect(() => {
    const data = {
      primaryFeeders,
      secondaryFeeders,
      avoidList,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      hiddenBottleneck,
      talentFlowMap,
      personaInsights,
      scoreImpactRows,
    };

    sessionStorage.setItem("editableTalentMapCard", JSON.stringify(data));
  }, [
    primaryFeeders,
    secondaryFeeders,
    avoidList,
    brutalTruth,
    redFlags,
    donts,
    fixes,
    hiddenBottleneck,
    talentFlowMap,
    personaInsights,
    scoreImpactRows,
  ]);

  // Update when data prop changes - PRIORITY: data prop overrides everything
  useEffect(() => {
    console.log("🗺️ ============================================");
    console.log("🗺️ UPDATING TALENT MAP CARD FROM DYNAMIC DATA");
    console.log("🗺️ ============================================");
    console.log("🗺️ Data received:", data);
    console.log("🗺️ Data type:", typeof data);
    console.log("🗺️ Data is object?", typeof data === 'object');
    console.log("🗺️ Data keys:", data ? Object.keys(data) : 'null');
    console.log("🗺️ Data stringified:", JSON.stringify(data, null, 2));
    
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      console.log("🗺️ ✅ Data is valid, updating state...");
      if (data.primaryFeeders !== undefined && Array.isArray(data.primaryFeeders) && data.primaryFeeders.length > 0) {
        console.log("🗺️ Updating primaryFeeders from data:", data.primaryFeeders.length, "items");
        setPrimaryFeeders(data.primaryFeeders);
      }
      if (data.secondaryFeeders !== undefined && Array.isArray(data.secondaryFeeders) && data.secondaryFeeders.length > 0) {
        console.log("🗺️ Updating secondaryFeeders from data:", data.secondaryFeeders.length, "items");
        setSecondaryFeeders(data.secondaryFeeders);
      }
      if (data.avoidList !== undefined && Array.isArray(data.avoidList) && data.avoidList.length > 0) {
        console.log("🗺️ Updating avoidList from data:", data.avoidList.length, "items");
        setAvoidList(data.avoidList);
      }
      if (data.brutalTruth !== undefined && data.brutalTruth !== null) {
        console.log("🗺️ Updating brutalTruth from data:", data.brutalTruth);
        setBrutalTruth(data.brutalTruth);
      }
      if (data.redFlags !== undefined && Array.isArray(data.redFlags) && data.redFlags.length > 0) {
        console.log("🗺️ Updating redFlags from data:", data.redFlags.length, "items");
        setRedFlags(data.redFlags);
      }
      if (data.donts !== undefined && Array.isArray(data.donts) && data.donts.length > 0) {
        console.log("🗺️ Updating donts from data:", data.donts.length, "items");
        setDonts(data.donts);
      }
      if (data.fixes !== undefined && Array.isArray(data.fixes) && data.fixes.length > 0) {
        console.log("🗺️ Updating fixes from data:", data.fixes.length, "items");
        setFixes(data.fixes);
      }
      if (data.hiddenBottleneck !== undefined && data.hiddenBottleneck !== null) {
        console.log("🗺️ Updating hiddenBottleneck from data:", data.hiddenBottleneck);
        setHiddenBottleneck(data.hiddenBottleneck);
      }
      if (data.talentFlowMap !== undefined && Array.isArray(data.talentFlowMap) && data.talentFlowMap.length > 0) {
        console.log("🗺️ Updating talentFlowMap from data:", data.talentFlowMap.length, "items");
        setTalentFlowMap(data.talentFlowMap);
      }
      if (data.personaInsights !== undefined && Array.isArray(data.personaInsights) && data.personaInsights.length > 0) {
        console.log("🗺️ Updating personaInsights from data:", data.personaInsights.length, "items");
        setPersonaInsights(data.personaInsights);
      }
    }
  }, [data]);

  // Fallback: Load from sessionStorage if data prop is not available
  useEffect(() => {
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      // Data prop is available, skip sessionStorage
      return;
    }
    
    const saved = sessionStorage.getItem("editableTalentMapCard");
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        if (savedData.primaryFeeders) setPrimaryFeeders(savedData.primaryFeeders);
        if (savedData.secondaryFeeders) setSecondaryFeeders(savedData.secondaryFeeders);
        if (savedData.avoidList) setAvoidList(savedData.avoidList);
        if (savedData.brutalTruth) setBrutalTruth(savedData.brutalTruth);
        if (savedData.redFlags) setRedFlags(savedData.redFlags);
        if (savedData.donts) setDonts(savedData.donts);
        if (savedData.fixes) setFixes(savedData.fixes);
        if (savedData.hiddenBottleneck) setHiddenBottleneck(savedData.hiddenBottleneck);
        if (savedData.talentFlowMap) setTalentFlowMap(savedData.talentFlowMap);
        if (savedData.personaInsights) setPersonaInsights(savedData.personaInsights);
        if (savedData.scoreImpactRows && Array.isArray(savedData.scoreImpactRows) && savedData.scoreImpactRows.length > 0) {
          setScoreImpactRows(savedData.scoreImpactRows);
        }
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, [data]);

  const sections = [
    {
      id: "primary-feeders",
      title: "Primary Feeder Companies",
      subtitle: "Top companies to source from",
      Icon: Target,
      tone: "success" as const,
      content: (
        <div className="flex flex-wrap gap-2">
          {primaryFeeders.map((company, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
            >
              {company}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "secondary-feeders",
      title: "Secondary Feeder Companies",
      subtitle: "Additional companies to consider",
      Icon: Target,
      tone: "info" as const,
      content: (
        <div className="flex flex-wrap gap-2">
          {secondaryFeeders.map((company, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              {company}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "avoid",
      title: "Avoid",
      subtitle: "Companies and profiles to avoid",
      Icon: XCircle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={avoidList}
          onChange={setAvoidList}
          itemClassName="text-[13px] leading-snug text-gray-700"
          markerColor="text-gray-600"
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about talent sourcing",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText value={brutalTruth} onChange={setBrutalTruth} multiline />
      ),
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs in candidate profiles",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={redFlags}
          onChange={setRedFlags}
          itemClassName="text-[13px] leading-snug text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "donts",
      title: "Don't Do This",
      subtitle: "Common mistakes to avoid",
      Icon: XCircle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={donts}
          onChange={setDonts}
          itemClassName="text-[13px] leading-snug text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "talent-flow",
      title: "Talent Flow Map",
      subtitle: "Who hires from whom",
      Icon: ArrowRight,
      tone: "info" as const,
      content: (
        <div className="space-y-3">
          {talentFlowMap.map((item, idx) => (
            <div
              key={idx}
              className="border border-blue-200 rounded-lg p-3 bg-white"
            >
              <p className="text-xs font-bold text-blue-900 mb-1">
                {item.flow}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>{item.path}</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 mt-1 italic">{item.note}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "persona-insights",
      title: "Persona Insights",
      subtitle: "Understanding different candidate types",
      Icon: Users,
      tone: "purple" as const,
      content: (
        <div className="space-y-3">
          {personaInsights.map((item, idx) => (
            <div
              key={idx}
              className="border border-purple-200 rounded-lg p-3 bg-white"
            >
              <p className="text-xs font-bold text-purple-900 mb-2">
                {item.type}
              </p>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="font-semibold text-emerald-700">
                    Motivated by:
                  </span>{" "}
                  {item.motivated}
                </p>
                <p>
                  <span className="font-semibold text-blue-700">Needs:</span>{" "}
                  {item.needs}
                </p>
                <p>
                  <span className="font-semibold text-red-700">Hates:</span>{" "}
                  {item.hates}
                </p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "hidden-bottleneck",
      title: "Hidden Bottleneck",
      subtitle: "The hidden factor affecting your hiring",
      Icon: AlertTriangle,
      tone: "warning" as const,
      content: (
        <EditableText
          value={hiddenBottleneck}
          onChange={setHiddenBottleneck}
          multiline
        />
      ),
    },
    {
      id: "score-impact",
      title: "Fix Me Now",
      subtitle: "Actions to improve your hiring score",
      Icon: Target,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.6" cardId="talent-map" />,
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
                    totalUplift="+0.6"
                    cardId="talent-map"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "talent-map"}
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
