"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableKeyValue, EditableList, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card, CardHeader } from "@/components/ui/card";

interface PayCardProps {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  onOpenSuggestions?: () => void;
  data?: {
    marketCompensation?: Array<{ label: string; value: string }>;
    recommendedRange?: string;
    location?: string;
    currency?: string;
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    hiddenBottleneck?: string;
    timelineToFailure?: string;
  };
}

export const EditablePayCard: React.FC<PayCardProps> = ({ data, onNavigateToCard, currentCardId, onOpenSuggestions }) => {
  console.log("💳 ============================================");
  console.log("💳 EDITABLE PAY CARD RENDER");
  console.log("💳 ============================================");
  console.log("💳 Received data prop:", data ? "YES" : "NO");
  if (data) {
    console.log("💳 Data content:", JSON.stringify(data, null, 2));
  }

  // Initialize from data or use defaults
  const [marketComp, setMarketComp] = useState(
    data?.marketCompensation || [
      { label: "Base", value: "€85k–€100k" },
      { label: "Total comp", value: "€95k–€115k" },
      { label: "Published range", value: "€6,100–€7,900/month" },
    ]
  );

  const [recommendedRange, setRecommendedRange] = useState(
    data?.recommendedRange || "€90k–€105k for top-tier senior"
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth || "If you offer €80k, you will not hire a senior. You will hire someone who thinks they're senior."
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags ?? [
      "Candidate wants +20% above top band",
      "Internal equity blocks competitiveness",
      "Comp approval takes >5 days",
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts || [
      "Hide comp until final stage",
      "Use equity as compensation if it's not meaningful",
      "Expect senior technical talent at mid-level pay",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Align comp band before launching the search",
      "Offer clarity upfront",
      "Highlight ownership + product impact as value drivers",
    ]
  );

  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    data?.hiddenBottleneck ?? "US remote companies are paying +20–40% for the same profile. You won't see them — but they're in your inbox competing with you."
  );

  const [timelineToFailure, setTimelineToFailure] = useState(
    data?.timelineToFailure || "If comp approval takes >5 days → expect candidate rejection."
  );

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Align comp before sourcing",
      impact: "+0.4",
      tooltip: "Why it matters: Prevents end-of-process rejection.",
      talentPoolImpact: "+25% reply rate",
      riskReduction: "-25% offer failure"
    },
    {
      fix: "Share range early",
      impact: "+0.2",
      tooltip: "Why it matters: Seniors reject vague offers immediately.",
      talentPoolImpact: "+12% more qualified",
      riskReduction: "-10% ghosting"
    },
    {
      fix: "Offer flexibility",
      impact: "+0.2",
      tooltip: "Why it matters: Gives room to close top candidates.",
      talentPoolImpact: "+10% close-rate boost",
      riskReduction: "-8% negotiation stalls"
    }
  ]);

  // Update when data prop changes
  useEffect(() => {
    console.log("💳 useEffect triggered - data changed");
    if (data?.marketCompensation) {
      console.log("💳 Updating marketComp from data:", data.marketCompensation);
      setMarketComp(data.marketCompensation);
    }
    if (data?.recommendedRange) {
      console.log("💳 Updating recommendedRange from data:", data.recommendedRange);
      setRecommendedRange(data.recommendedRange);
    }
    if (data?.brutalTruth) {
      console.log("💳 Updating brutalTruth from data:", data.brutalTruth);
      setBrutalTruth(data.brutalTruth);
    }
    if (data?.redFlags) {
      console.log("💳 Updating redFlags from data:", data.redFlags.length, "items");
      setRedFlags(data.redFlags);
    }
    if (data?.donts) {
      console.log("💳 Updating donts from data:", data.donts.length, "items");
      setDonts(data.donts);
    }
    if (data?.fixes) {
      console.log("💳 Updating fixes from data:", data.fixes.length, "items");
      setFixes(data.fixes);
    }
    if (data?.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
    if (data?.timelineToFailure) setTimelineToFailure(data.timelineToFailure);
  }, [data]);

  // Save to sessionStorage
  useEffect(() => {
    const data = {
      marketComp,
      recommendedRange,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      hiddenBottleneck,
      timelineToFailure,
      scoreImpactRows
    };

    sessionStorage.setItem("editablePayCard", JSON.stringify(data));
  }, [marketComp, recommendedRange, brutalTruth, redFlags, donts, fixes, hiddenBottleneck, timelineToFailure, scoreImpactRows]);

  // Load from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("editablePayCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.marketComp) setMarketComp(data.marketComp);
        if (data.recommendedRange) setRecommendedRange(data.recommendedRange);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
        if (data.timelineToFailure) setTimelineToFailure(data.timelineToFailure);
        if (data.scoreImpactRows && Array.isArray(data.scoreImpactRows) && data.scoreImpactRows.length > 0) {
          setScoreImpactRows(data.scoreImpactRows);
        }
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sections = [
    {
      id: "market-comp",
      title: "Market Compensation",
      subtitle: `Compensation benchmarks (${data?.location || "Amsterdam"})`,
      Icon: TrendingUp,
      tone: "success" as const,
      content: (
        <EditableKeyValue
          data={marketComp}
          onChange={setMarketComp}
        />
      ),
    },
    {
      id: "recommended-range",
      title: "Recommended Hire Range",
      subtitle: "Optimal compensation range for this role",
      Icon: DollarSign,
      tone: "info" as const,
      content: (
        <EditableText
          value={recommendedRange}
          onChange={setRecommendedRange}
          className="text-lg font-bold"
          placeholder="Enter recommended range..."
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about compensation",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={brutalTruth}
          onChange={setBrutalTruth}
          multiline
          placeholder="What's the hard truth about compensation?"
        />
      ),
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs in compensation negotiations",
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
      subtitle: "Common compensation mistakes",
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
      id: "hidden-bottleneck",
      title: "Hidden Bottleneck",
      subtitle: "The hidden factor affecting compensation",
      Icon: AlertTriangle,
      tone: "warning" as const,
      content: (
        <EditableText
          value={hiddenBottleneck}
          onChange={setHiddenBottleneck}
          multiline
          placeholder="What hidden factor affects compensation?"
        />
      ),
    },
    {
      id: "timeline-failure",
      title: "Timeline to Failure",
      subtitle: "Critical timeline issues to watch",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={timelineToFailure}
          onChange={setTimelineToFailure}
          multiline
          placeholder="What timeline issue should we be aware of?"
        />
      ),
    },
    {
      id: "score-impact",
      title: "Fix Me Now",
      subtitle: "Actions to improve your hiring score",
      Icon: TrendingUp,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.8" cardId="pay" />,
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
          const Icon = section.Icon;

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
                    totalUplift="+0.8"
                    cardId="pay"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "pay"}
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
