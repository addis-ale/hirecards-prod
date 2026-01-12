"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Target,
} from "lucide-react";
import {
  EditableList,
  EditableKeyValue,
  EditableText,
} from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card } from "@/components/ui/card";

interface FunnelCardProps {
  data?: {
    funnelStages?: Array<{ label: string; value: string }>;
    benchmarks?: Array<{ label: string; value: string }>;
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    hiddenBottleneck?: string;
    funnelHealthComparison?: Array<{ type: string; outcome: string }>;
    bottomLine?: string;
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  onOpenSuggestions?: () => void;
}

export const EditableFunnelCard = ({
  data,
  onNavigateToCard,
  currentCardId,
  onOpenSuggestions,
}: FunnelCardProps = {}) => {
  const [funnelStages, setFunnelStages] = useState(
    data?.funnelStages ?? [
      { label: "Outbound messages", value: "120–150" },
      { label: "Positive replies", value: "20–25" },
      { label: "Recruiter screens", value: "10–12" },
      { label: "Technical rounds", value: "7–8" },
      { label: "Finalists", value: "2–3" },
      { label: "Hire", value: "1" },
    ]
  );

  const [benchmarks, setBenchmarks] = useState(
    data?.benchmarks ?? [
      { label: "Reply rate", value: "20–30%" },
      { label: "Screen → Tech", value: "60–70%" },
      { label: "Tech pass", value: "40–60%" },
      { label: "Offer acceptance", value: "70–85%" },
    ]
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ??
      "Senior AEs rarely apply — the funnel is outbound-led. They are highly selective and vet you harder than you vet them. They drop out instantly if they sense: BI flavour, vague JD, slow loop, unclear comp, low bar in interview process. The funnel is hard by design — but predictable if you manage it well."
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags ?? [
      "Time gaps >72h",
      "Slow calendar coordination",
      "Take-homes >2 hours",
      "Comp misalignment happens too late",
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts ?? [
      "Rely only on LinkedIn outbound",
      "Overqualify early",
      "Add take-home assignments for seniors",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes ?? [
      "Warm candidates every 48–72 hours",
      "Kill long take-homes",
      "Use calendar blocking for interviewers",
      "Review pipeline every week with HM",
    ]
  );

  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    data?.hiddenBottleneck ??
      "Slow process = conversion death. Most funnel leaks happen between stages, not at sourcing."
  );

  const [bottomLine, setBottomLine] = useState(
    data?.bottomLine ??
      "Your funnel isn't a sourcing problem — It's a speed, clarity, and consistency problem. Fix the flow → conversion jumps. Fix conversion → time-to-hire drops. Fix time-to-hire → you win against fintech competitors."
  );

  const [funnelHealthComparison, setFunnelHealthComparison] = useState(
    data?.funnelHealthComparison || [
      {
        type: "Healthy (48–72 hr flow, clear comp, strong message)",
        outcome: "Hire in 25–35 days",
      },
      {
        type: "Typical (slow communication, vague JD)",
        outcome: "Hire in 50–70 days",
      },
      {
        type: "Broken (4–5 rounds, unprepared interviewers)",
        outcome: "Restart at week 6",
      },
    ]
  );

  // Update when data prop changes
  useEffect(() => {
    if (data?.funnelStages) setFunnelStages(data.funnelStages);
    if (data?.benchmarks) setBenchmarks(data.benchmarks);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.redFlags) setRedFlags(data.redFlags);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixes) setFixes(data.fixes);
    if (data?.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
    if (data?.bottomLine) setBottomLine(data.bottomLine);
    if (data?.funnelHealthComparison)
      setFunnelHealthComparison(data.funnelHealthComparison);
  }, [data]);

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Warm candidates every 48–72h",
      impact: "+0.2",
      tooltip: "Seniors vanish if they think they're not a priority.",
      talentPoolImpact: "+12% retention",
      riskReduction: "-10% ghosting",
    },
    {
      fix: "Remove long take-homes (>2h)",
      impact: "+0.2",
      tooltip: "Seniors don't do unpaid labour; they drop instantly.",
      talentPoolImpact: "+10% conversion",
      riskReduction: "-15% stage abandonment",
    },
    {
      fix: "Block interviewer calendars ahead of time",
      impact: "+0.2",
      tooltip: "Eliminates week-long delays and funnel decay.",
      talentPoolImpact: "+15% pipeline speed",
      riskReduction: "-12% delay risk",
    },
    {
      fix: "Pre-align comp & share early",
      impact: "+0.2",
      tooltip: "Prevents late-stage rejection or negotiation collapse.",
      talentPoolImpact: "+10% offer success",
      riskReduction: "-10% offer collapse",
    },
  ]);

  useEffect(() => {
    const data = {
      funnelStages,
      benchmarks,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      hiddenBottleneck,
      bottomLine,
      funnelHealthComparison,
      scoreImpactRows,
    };

    sessionStorage.setItem("editableFunnelCard", JSON.stringify(data));
  }, [
    funnelStages,
    benchmarks,
    brutalTruth,
    redFlags,
    donts,
    fixes,
    hiddenBottleneck,
    bottomLine,
    funnelHealthComparison,
    scoreImpactRows,
  ]);

  // Load from sessionStorage ONLY if no data prop is provided (fallback)
  useEffect(() => {
    if (data === undefined || data === null) {
      const saved = sessionStorage.getItem("editableFunnelCard");
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          // Only load if the saved data has valid values (not empty arrays/zeros)
          if (savedData.funnelStages && Array.isArray(savedData.funnelStages) && savedData.funnelStages.length > 0) {
            // Check if values are not all zeros/empty/invalid
            const hasValidValues = savedData.funnelStages.some((stage: Record<string, unknown>) => 
              stage.value && 
              stage.value !== "0" && 
              stage.value !== "0–0" && 
              !stage.value.match(/^0+[–-]0+$/) &&
              stage.value !== "8–8" // Invalid default
            );
            if (hasValidValues) {
              setFunnelStages(savedData.funnelStages);
            } else {
              // Clear invalid data from sessionStorage
              sessionStorage.removeItem("editableFunnelCard");
            }
          }
          if (savedData.benchmarks && Array.isArray(savedData.benchmarks) && savedData.benchmarks.length > 0) {
            setBenchmarks(savedData.benchmarks);
          }
          if (savedData.brutalTruth) setBrutalTruth(savedData.brutalTruth);
          if (savedData.redFlags && Array.isArray(savedData.redFlags) && savedData.redFlags.length > 0) {
            setRedFlags(savedData.redFlags);
          }
          if (savedData.donts && Array.isArray(savedData.donts) && savedData.donts.length > 0) {
            setDonts(savedData.donts);
          }
          if (savedData.fixes && Array.isArray(savedData.fixes) && savedData.fixes.length > 0) {
            setFixes(savedData.fixes);
          }
          if (savedData.hiddenBottleneck) setHiddenBottleneck(savedData.hiddenBottleneck);
          if (savedData.bottomLine) setBottomLine(savedData.bottomLine);
          if (savedData.funnelHealthComparison && Array.isArray(savedData.funnelHealthComparison) && savedData.funnelHealthComparison.length > 0) {
            setFunnelHealthComparison(savedData.funnelHealthComparison);
          }
          if (savedData.scoreImpactRows && Array.isArray(savedData.scoreImpactRows) && savedData.scoreImpactRows.length > 0) {
            setScoreImpactRows(savedData.scoreImpactRows);
          }
        } catch (e) {
          console.error("Failed to load saved data:", e);
          // Clear corrupted data
          sessionStorage.removeItem("editableFunnelCard");
        }
      }
    }
  }, [data]);

  const sections = [
    {
      id: "expected-funnel",
      title: "Expected Funnel",
      subtitle: "Volume needed at each stage",
      Icon: BarChart3,
      tone: "info" as const,
      content: (
        <EditableKeyValue data={funnelStages} onChange={setFunnelStages} />
      ),
    },
    {
      id: "benchmarks",
      title: "Benchmarks",
      subtitle: "Industry standard metrics",
      Icon: TrendingUp,
      tone: "success" as const,
      content: <EditableKeyValue data={benchmarks} onChange={setBenchmarks} />,
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about your funnel",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText value={brutalTruth} onChange={setBrutalTruth} multiline />
      ),
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs in your funnel",
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
      subtitle: "Common funnel mistakes",
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
      id: "funnel-health",
      title: "Funnel Health Comparison",
      subtitle: "Healthy vs broken funnel outcomes",
      Icon: BarChart3,
      tone: "info" as const,
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-100 border-b-2 border-blue-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-blue-900">
                  Funnel Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900">
                  Outcome
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {funnelHealthComparison.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.type}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "hidden-bottleneck",
      title: "Hidden Bottleneck",
      subtitle: "The hidden factor affecting your funnel",
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
      id: "bottom-line",
      title: "Bottom Line",
      subtitle: "The key takeaways and recommendations",
      Icon: Target,
      tone: "info" as const,
      content: (
        <EditableText
          value={bottomLine}
          onChange={setBottomLine}
          className="text-sm text-gray-800"
          multiline
        />
      ),
    },
    {
      id: "score-impact",
      title: "Fix Me Now",
      subtitle: "Actions to improve your hiring score",
      Icon: TrendingUp,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.8" cardId="funnel" />,
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
                    <h3 className={`text-sm font-bold ${colors.accent ? `text-[${colors.accent}]` : 'text-emerald-700 dark:text-emerald-400'}`} style={{ color: colors.accent }}>
                      {section.title}
                    </h3>
                  </div>
                  <FixMeNowBoxes
                    rows={scoreImpactRows}
                    totalUplift="+0.8"
                    cardId="funnel"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "funnel"}
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
