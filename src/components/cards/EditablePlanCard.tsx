"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Wrench,
  XCircle,
  Zap,
  Target,
} from "lucide-react";
import { EditableList, EditableText } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card, CardHeader } from "@/components/ui/card";

interface PlanCardProps {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  data?: {
    first7Days?: string[];
    weeklyRhythm?: string[];
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    fastestPath?: string[];
  };
}

export const EditablePlanCard: React.FC<PlanCardProps> = ({
  data,
  onNavigateToCard,
  currentCardId,
  onOpenSuggestions,
}) => {
  // Initialize from data or use defaults
  const [first7Days, setFirst7Days] = useState(
    data?.first7Days ?? [
      "Finalise RoleCard",
      "Align on outcomes, ownership, and expectations.",
      "Align scorecard",
      "Confirm the 6 competencies + rating anchors.",
      "Approve comp",
      "No sourcing until the band is locked.",
      "Build outbound list",
      "50–80 qualified profiles to target in Week 1.",
      "Pre-book interview slots",
      "Remove the #1 cause of process delays.",
      "Rewrite JD",
      "Outcome-based, persona-aligned, no BI clutter.",
      "Launch sourcing",
      "Start with two outbound waves + referral pass.",
    ]
  );

  const [weeklyRhythm, setWeeklyRhythm] = useState(
    data?.weeklyRhythm ?? [
      "Pipeline review",
      "Identify leaks early (reply rates, test pass rates, drops).",
      "Remove blockers",
      "Clear interview bottlenecks within 24 hours.",
      "Recalibrate expectations",
      "Update HM if market reality ≠ initial assumptions.",
      "Update messaging",
      "Adjust outreach if replies drop or persona mismatch appears.",
      "Track time-to-align",
      "Slow alignment = slow hiring.",
    ]
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ||
      "Hiring delays come from internal blockers, not market scarcity."
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      "Hiring manager unavailable",
      "TA chasing stakeholders",
      "Comp approval delays",
      "Slow feedback loops",
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts || [
      "Start sourcing before alignment",
      "Launch job without scorecard",
      "Build funnel without messaging",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Enforce 24-hour feedback",
      "Use shared hiring dashboard",
      "Pre-book interview slots",
    ]
  );

  const [fastestPath, setFastestPath] = useState(
    data?.fastestPath || [
      "Broaden geo → EU-friendly remote/relocation",
      "Raise comp slightly or pre-align offer flexibility",
      "Simplify interview loop to 3 steps",
      "Use strong product-oriented messaging",
      "Run 2 outbound waves per week",
      "Calibrate early → avoid sourcing the wrong persona",
      "Keep stakeholders aligned weekly",
    ]
  );

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Enforce 24h feedback",
      impact: "+0.3",
      tooltip: "Speed is your biggest competitive edge in this market.",
      talentPoolImpact: "+20% acceptance",
      riskReduction: "-20% dropout"
    },
    {
      fix: "Pre-block calendars",
      impact: "+0.2",
      tooltip: "Prevents long gaps between rounds that seniors won't tolerate.",
      talentPoolImpact: "+15% faster loops",
      riskReduction: "-12% stall"
    },
    {
      fix: "2 outbound waves weekly",
      impact: "+0.2",
      tooltip: "Senior roles require consistent outbound volume to avoid pipeline starvation.",
      talentPoolImpact: "+25% pipeline",
      riskReduction: "-10% starvation"
    },
    {
      fix: "Early calibration",
      impact: "+0.2",
      tooltip: "Adjust expectations before the funnel fills with mismatched candidates.",
      talentPoolImpact: "+10% match quality",
      riskReduction: "-15% restart"
    }
  ]);

  // Update when data changes
  useEffect(() => {
    if (data?.first7Days) setFirst7Days(data.first7Days);
    if (data?.weeklyRhythm) setWeeklyRhythm(data.weeklyRhythm);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.redFlags) setRedFlags(data.redFlags);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixes) setFixes(data.fixes);
    if (data?.fastestPath) setFastestPath(data.fastestPath);
  }, [data]);

  useEffect(() => {
    const data = {
      first7Days,
      weeklyRhythm,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      fastestPath,
      scoreImpactRows,
    };

    sessionStorage.setItem("editablePlanCard", JSON.stringify(data));
  }, [
    first7Days,
    weeklyRhythm,
    brutalTruth,
    redFlags,
    donts,
    fixes,
    fastestPath,
    scoreImpactRows,
  ]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editablePlanCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.first7Days) setFirst7Days(data.first7Days);
        if (data.weeklyRhythm) setWeeklyRhythm(data.weeklyRhythm);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.fastestPath) setFastestPath(data.fastestPath);
        if (data.scoreImpactRows && Array.isArray(data.scoreImpactRows) && data.scoreImpactRows.length > 0) {
          setScoreImpactRows(data.scoreImpactRows);
        }
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const first7DaysContent = (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-700 mt-0.5" />
          <div className="flex-1">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#102a63" }}
            >
              First 7 Days
            </h4>
            <EditableList
              items={first7Days}
              onChange={setFirst7Days}
              itemClassName="text-sm"
              markerColor="text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const weeklyRhythmContent = (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5" />
          <div className="flex-1">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#102a63" }}
            >
              Weekly Rhythm
            </h4>
            <EditableList
              items={weeklyRhythm}
              onChange={setWeeklyRhythm}
              itemClassName="text-sm text-emerald-800"
              markerColor="text-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const fastestPathContent = (
    <div className="space-y-6">
      <div
        className="rounded-xl border-2 p-5 bg-gradient-to-br from-amber-50 to-white"
        style={{ borderColor: "#f59e0b" }}
      >
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-base font-bold mb-3 text-amber-900">
              Bonus: Fastest Path to Hire (for this role)
            </h4>
            <EditableList
              items={fastestPath}
              onChange={setFastestPath}
              itemClassName="text-sm text-amber-900"
              markerColor="text-amber-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    {
      id: "first-7-days",
      title: "First 7 Days",
      subtitle: "Critical actions to complete in the first week",
      Icon: Calendar,
      tone: "info" as const,
      content: first7DaysContent,
    },
    {
      id: "weekly-rhythm",
      title: "Weekly Rhythm",
      subtitle: "Ongoing activities to maintain momentum",
      Icon: TrendingUp,
      tone: "success" as const,
      content: weeklyRhythmContent,
    },
    {
      id: "fastest-path",
      title: "Fastest Path to Hire",
      subtitle: "Optimized actions to accelerate hiring",
      Icon: Zap,
      tone: "warning" as const,
      content: fastestPathContent,
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs that indicate process problems",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={redFlags}
          onChange={setRedFlags}
          itemClassName="text-sm"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "donts",
      title: "Don't Do This",
      subtitle: "Common planning mistakes to avoid",
      Icon: XCircle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={donts}
          onChange={setDonts}
          itemClassName="text-sm"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "fixes",
      title: "Fixes",
      subtitle: "Actionable improvements for your hiring plan",
      Icon: Wrench,
      tone: "success" as const,
      content: (
        <EditableList
          items={fixes}
          onChange={setFixes}
          itemClassName="text-sm"
          markerColor="text-emerald-600"
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The harsh reality about hiring plans",
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
      subtitle: "Actions you can take to improve your plan score",
      Icon: Target,
      tone: "success" as const,
      content: (
        <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.9" cardId="plan" />
      ),
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
                    totalUplift="+0.9"
                    cardId="plan"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "plan"}
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
