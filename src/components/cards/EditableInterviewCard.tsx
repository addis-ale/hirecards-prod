"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertTriangle,
  Wrench,
  XCircle,
  Target,
  MessageSquare,
} from "lucide-react";
import { EditableList, EditableText } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card } from "@/components/ui/card";

interface InterviewCardProps {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  data?: {
    optimalLoop?: string[];
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    signalQuestions?: string[];
  };
}

export const EditableInterviewCard: React.FC<InterviewCardProps> = ({
  data,
  onNavigateToCard,
  currentCardId,
  onOpenSuggestions,
}) => {
  // Initialize from data or use defaults
  const [optimalLoop, setOptimalLoop] = useState(
    data?.optimalLoop ?? [
      "Recruiter Screen (30 min)",
      "Modelling + SQL Deep Dive (60–90 min)",
      "Product Collaboration Interview (45–60 min)",
      "Values & Ownership Conversation (30–45 min)",
    ]
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ||
      "If the interviewers aren't trained, you're not evaluating candidates, you're filtering them at random."
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      'Interviewers "wing it"',
      "Vague questions",
      '"Tell me about a time..." with no follow-ups',
      "No scorecard → chaos",
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts || [
      "Add extra rounds",
      "Leave feedback to the end of the week",
      "Use take-homes >3h",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Standardize questions",
      "Train panel in probing, bias avoidance",
      "24-hour feedback SLA",
    ]
  );

  const [signalQuestions, setSignalQuestions] = useState(
    data?.signalQuestions || [
      "Walk me through a modelling problem you owned end-to-end.",
      "How do you test and validate your models?",
      "Tell me about a metric you defined and how you ensured its correctness.",
      "What type of work do you not want to do?",
      "How do you work with PM/Engineering?",
    ]
  );

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Standardise questions across interviewers",
      impact: "+0.3",
      tooltip: "Prevents random evaluation and improves fairness.",
      talentPoolImpact: "+15% signal quality",
      riskReduction: "-18% bias & inconsistency"
    },
    {
      fix: "Remove unnecessary rounds",
      impact: "+0.2",
      tooltip: "Seniors abandon long loops — fintech competitors move faster.",
      talentPoolImpact: "+20% offer acceptance",
      riskReduction: "-15% funnel dropout"
    },
    {
      fix: "Train interviewers (probing, bias avoidance)",
      impact: "+0.2",
      tooltip: "Bad interviews lose top candidates faster than bad sourcing.",
      talentPoolImpact: "+10% conversion",
      riskReduction: "-12% false negatives"
    },
    {
      fix: "Enforce 24h feedback SLA",
      impact: "+0.2",
      tooltip: "Fast feedback signals seriousness and keeps seniors engaged.",
      talentPoolImpact: "+12% acceptance",
      riskReduction: "-10% churn / ghosting"
    }
  ]);

  // Update when data changes
  useEffect(() => {
    if (data?.optimalLoop) setOptimalLoop(data.optimalLoop);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.redFlags) setRedFlags(data.redFlags);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixes) setFixes(data.fixes);
    if (data?.signalQuestions) setSignalQuestions(data.signalQuestions);
  }, [data]);

  useEffect(() => {
    const data = {
      optimalLoop,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      signalQuestions,
      scoreImpactRows,
    };

    sessionStorage.setItem("editableInterviewCard", JSON.stringify(data));
  }, [
    optimalLoop,
    brutalTruth,
    redFlags,
    donts,
    fixes,
    signalQuestions,
    scoreImpactRows,
  ]);

  // Load from data prop first, then sessionStorage as fallback
  useEffect(() => {
    // Prioritize data prop if provided
    if (data) {
      if (data.optimalLoop) setOptimalLoop(data.optimalLoop);
      if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
      if (data.redFlags) setRedFlags(data.redFlags);
      if (data.donts) setDonts(data.donts);
      if (data.fixes) setFixes(data.fixes);
      if (data.signalQuestions) setSignalQuestions(data.signalQuestions);
      if (data.scoreImpactRows && Array.isArray(data.scoreImpactRows) && data.scoreImpactRows.length > 0) {
        setScoreImpactRows(data.scoreImpactRows);
      }
      return; // Don't load from sessionStorage if data prop is provided
    }
    
    // Fallback to sessionStorage
    const saved = sessionStorage.getItem("editableInterviewCard");
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        if (savedData.optimalLoop) setOptimalLoop(savedData.optimalLoop);
        if (savedData.brutalTruth) setBrutalTruth(savedData.brutalTruth);
        if (savedData.redFlags) setRedFlags(savedData.redFlags);
        if (savedData.donts) setDonts(savedData.donts);
        if (savedData.fixes) setFixes(savedData.fixes);
        if (savedData.signalQuestions) setSignalQuestions(savedData.signalQuestions);
        if (savedData.scoreImpactRows && Array.isArray(savedData.scoreImpactRows) && savedData.scoreImpactRows.length > 0) {
          setScoreImpactRows(savedData.scoreImpactRows);
        }
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, [data]);

  const optimalLoopContent = (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5" />
          <div className="flex-1">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#102a63" }}
            >
              Recommended Interview Loop (3–4 Steps Max)
            </h4>
            <ol className="list-decimal pl-5 space-y-2 marker:text-emerald-700 marker:font-semibold">
              {optimalLoop.map((step, idx) => (
                <li
                  key={idx}
                  className="text-[13px] leading-snug text-emerald-800"
                >
                  <EditableText
                    value={step}
                    onChange={(value) => {
                      const newLoop = [...optimalLoop];
                      newLoop[idx] = value;
                      setOptimalLoop(newLoop);
                    }}
                    className="inline"
                  />
                </li>
              ))}
            </ol>
            <p className="text-xs text-gray-600 mt-3 italic">
              Do not add more rounds. Every extra step increases senior dropout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const signalQuestionsContent = (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
        <h4
          className="text-sm font-semibold mb-3"
          style={{ color: "#102a63" }}
        >
          1️⃣ RECRUITER SCREEN — &quot;Filter Out the Wrong Personas Fast&quot;
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          Ask these 5 signal questions:
        </p>
        <EditableList
          items={signalQuestions}
          onChange={setSignalQuestions}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-blue-600"
        />
      </div>
    </div>
  );

  const sections = [
    {
      id: "optimal-loop",
      title: "Optimal Interview Loop",
      subtitle: "The recommended 3-4 step interview process",
      Icon: CheckCircle,
      tone: "success" as const,
      content: optimalLoopContent,
    },
    {
      id: "signal-questions",
      title: "Signal Questions",
      subtitle: "Key questions to ask during the recruiter screen",
      Icon: MessageSquare,
      tone: "info" as const,
      content: signalQuestionsContent,
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs of poor interview practices",
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
      subtitle: "Common interview mistakes to avoid",
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
      subtitle: "Actionable improvements for your interview process",
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
      subtitle: "The harsh reality about interview processes",
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
      subtitle: "Actions you can take to improve your interview score",
      Icon: Target,
      tone: "success" as const,
      content: (
        <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.9" cardId="interview" />
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
                    totalUplift="+0.9"
                    cardId="interview"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "interview"}
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
