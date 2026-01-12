"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Target,
  AlertTriangle,
  Wrench,
  XCircle,
  ListChecks,
} from "lucide-react";
import { EditableList, EditableText } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card } from "@/components/ui/card";

interface ScorecardCardProps {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  onOpenSuggestions?: () => void;
  data?: {
    competencies?: string[];
    rating1?: string;
    rating2?: string;
    rating3?: string;
    rating4?: string;
    brutalTruth?: string;
    donts?: string[];
    fixes?: string[];
    evaluationMapping?: Array<{ stage: string; competencies: string }>;
    scoreImpactRows?: Array<{ label: string; impact: number; currentValue?: string; suggestedValue?: string }>;
  };
}

export const EditableScorecardCard: React.FC<ScorecardCardProps> = ({
  data,
  onNavigateToCard,
  currentCardId,
  onOpenSuggestions,
}) => {
  // Initialize from data or use defaults
  const [competencies, setCompetencies] = useState(
    data?.competencies ?? [
      "Modelling Quality",
      "Data Reliability Discipline",
      "Product Thinking",
      "Collaboration",
      "Communication",
      "Ownership",
    ]
  );

  const [rating1, setRating1] = useState(
    data?.rating1 || "slows the team"
  );

  const [rating2, setRating2] = useState(
    data?.rating2 || "needs coaching"
  );

  const [rating3, setRating3] = useState(
    data?.rating3 || "independent senior"
  );

  const [rating4, setRating4] = useState(data?.rating4 || "raises the bar");

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth || "Weak scorecards lead to emotional hiring."
  );

  const [donts, setDonts] = useState(
    data?.donts || [
      "Use vague competencies",
      "Let interviewers decide their own criteria",
      "Give everyone 3's",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes || [
      'Use behavioural anchors tied to outcomes',
      'Include "negative examples" for clarity',
      "Force a documented vote per interviewer",
    ]
  );

  const [evaluationMapping, setEvaluationMapping] = useState(
    data?.evaluationMapping || [
      {
        stage: "Stage 1 — Recruiter Screen",
        competencies: "Communication, Ownership",
      },
      {
        stage: "Stage 2 — Technical Deep Dive",
        competencies: "Modelling, Reliability",
      },
      {
        stage: "Stage 3 — Product Collaboration",
        competencies: "Product Thinking, Collaboration",
      },
      {
        stage: "Stage 4 — Values & Ownership",
        competencies: "Ownership, Communication (advanced)",
      },
    ]
  );

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Add simple behavioural anchors",
      impact: "+0.2",
      tooltip: "Helps interviewers calibrate consistently.",
      talentPoolImpact: "+10% signal quality",
      riskReduction: "-12% misalignment"
    },
    {
      fix: "Standardise feedback format",
      impact: "+0.2",
      tooltip: "Speeds up decisions and reduces vague scoring.",
      talentPoolImpact: "+8% faster flow",
      riskReduction: "-10% churn"
    },
    {
      fix: "Weekly calibration (15 min)",
      impact: "+0.2",
      tooltip: "Keeps everyone aligned on what \"good\" is.",
      talentPoolImpact: "+12% accuracy",
      riskReduction: "-15% disagreement"
    }
  ]);

  // Update when data changes
  useEffect(() => {
    if (data?.competencies) setCompetencies(data.competencies);
    if (data?.rating1) setRating1(data.rating1);
    if (data?.rating2) setRating2(data.rating2);
    if (data?.rating3) setRating3(data.rating3);
    if (data?.rating4) setRating4(data.rating4);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixes) setFixes(data.fixes);
    if (data?.evaluationMapping) setEvaluationMapping(data.evaluationMapping);
  }, [data]);

  useEffect(() => {
    const data = {
      competencies,
      rating1,
      rating2,
      rating3,
      rating4,
      brutalTruth,
      donts,
      fixes,
      evaluationMapping,
      scoreImpactRows,
    };

    sessionStorage.setItem("editableScorecardCard", JSON.stringify(data));
  }, [
    competencies,
    rating1,
    rating2,
    rating3,
    rating4,
    brutalTruth,
    donts,
    fixes,
    evaluationMapping,
    scoreImpactRows,
  ]);

  // Load from data prop first, then sessionStorage as fallback
  useEffect(() => {
    // Prioritize data prop if provided
    if (data) {
      if (data.competencies) setCompetencies(data.competencies);
      if (data.rating1) setRating1(data.rating1);
      if (data.rating2) setRating2(data.rating2);
      if (data.rating3) setRating3(data.rating3);
      if (data.rating4) setRating4(data.rating4);
      if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
      if (data.donts) setDonts(data.donts);
      if (data.fixes) setFixes(data.fixes);
      if (data.evaluationMapping) setEvaluationMapping(data.evaluationMapping);
      if (data.scoreImpactRows && Array.isArray(data.scoreImpactRows) && data.scoreImpactRows.length > 0) {
        setScoreImpactRows(data.scoreImpactRows.map(row => ({
          fix: (row as { label?: string; fix?: string }).fix || (row as { label?: string }).label || "",
          impact: typeof row.impact === "string" ? row.impact : String(row.impact || ""),
          tooltip: (row as { tooltip?: string }).tooltip,
          talentPoolImpact: (row as { talentPoolImpact?: string }).talentPoolImpact,
          riskReduction: (row as { riskReduction?: string }).riskReduction,
        })));
      }
      return; // Don't load from sessionStorage if data prop is provided
    }
    
    // Fallback to sessionStorage
    const saved = sessionStorage.getItem("editableScorecardCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.competencies) setCompetencies(data.competencies);
        if (data.rating1) setRating1(data.rating1);
        if (data.rating2) setRating2(data.rating2);
        if (data.rating3) setRating3(data.rating3);
        if (data.rating4) setRating4(data.rating4);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.evaluationMapping) setEvaluationMapping(data.evaluationMapping);
        if (data.scoreImpactRows && Array.isArray(data.scoreImpactRows) && data.scoreImpactRows.length > 0) {
          setScoreImpactRows(data.scoreImpactRows);
        }
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, [data]);

  const competenciesContent = (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-blue-700 mt-0.5" />
          <div className="flex-1">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#102a63" }}
            >
              Competencies
            </h4>
            <EditableList
              items={competencies}
              onChange={setCompetencies}
              itemClassName="text-sm"
              markerColor="text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const ratingAnchorContent = (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
        <div className="flex items-start gap-3">
          <ClipboardList className="w-5 h-5 text-emerald-700 mt-0.5" />
          <div className="flex-1">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#102a63" }}
            >
              Rating Anchor
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-[13px] leading-relaxed text-emerald-800">
                  ={" "}
                  <EditableText
                    value={rating1}
                    onChange={setRating1}
                    className="inline"
                  />
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-[13px] leading-relaxed text-emerald-800">
                  ={" "}
                  <EditableText
                    value={rating2}
                    onChange={setRating2}
                    className="inline"
                  />
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-[13px] leading-relaxed text-emerald-800">
                  ={" "}
                  <EditableText
                    value={rating3}
                    onChange={setRating3}
                    className="inline"
                  />
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <span className="text-[13px] leading-relaxed text-emerald-800">
                  ={" "}
                  <EditableText
                    value={rating4}
                    onChange={setRating4}
                    className="inline"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const evaluationMappingContent = (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
        <h4
          className="text-sm font-semibold mb-3"
          style={{ color: "#102a63" }}
        >
          Who Evaluates What (Mapped to Interview Loop)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-100 border-b-2 border-blue-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-blue-900">
                  Stage
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900">
                  Competencies
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {evaluationMapping.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.stage}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.competencies}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600 mt-3 italic">
          No one evaluates everything — each stage has a purpose.
        </p>
      </div>
    </div>
  );

  const sections = [
    {
      id: "competencies",
      title: "Competencies",
      subtitle: "Key skills and attributes to evaluate",
      Icon: Target,
      tone: "info" as const,
      content: competenciesContent,
    },
    {
      id: "rating-anchor",
      title: "Rating Anchor",
      subtitle: "The 1-4 scale for consistent evaluation",
      Icon: ClipboardList,
      tone: "success" as const,
      content: ratingAnchorContent,
    },
    {
      id: "evaluation-mapping",
      title: "Evaluation Mapping",
      subtitle: "Who evaluates what at each interview stage",
      Icon: ListChecks,
      tone: "info" as const,
      content: evaluationMappingContent,
    },
    {
      id: "fixes",
      title: "Fixes",
      subtitle: "Actionable improvements for your scorecard",
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
      id: "donts",
      title: "Don't Do This",
      subtitle: "Common scorecard mistakes to avoid",
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
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The harsh reality about scorecards",
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
      subtitle: "Actions you can take to improve your scorecard score",
      Icon: Target,
      tone: "success" as const,
      content: (
        <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.6" cardId="scorecard" />
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
                    cardId="scorecard"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "scorecard"}
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
