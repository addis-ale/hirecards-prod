"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Target,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Wrench,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import { EditableList, EditableText } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card, CardHeader } from "@/components/ui/card";

interface FitCardProps {
  data?: {
    persona?: string;
    motivatedBy?: string[];
    avoids?: string[];
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    candidateEvaluation?: string[];
    decisionMakingYes?: string[];
    decisionMakingNo?: string[];
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
}

export const EditableFitCard = ({
  data,
  onNavigateToCard,
  currentCardId,
}: FitCardProps = {}) => {
  const [persona, setPersona] = useState(data?.persona ?? "The Product-Minded Analytics Engineer");

  const [motivatedBy, setMotivatedBy] = useState(
    data?.motivatedBy ?? [
      "Ownership of modelling domains",
      "Shipping analytics that customers actually use",
      "Modelling craft & clean architecture",
      "Strong partnerships with PM & Engineering",
      "Working with a competent team",
    ]
  );

  const [avoids, setAvoids] = useState(
    data?.avoids ?? [
      "BI maintenance disguised as AE",
      "Undefined scope (\"you'll do a bit of everything…\")",
      "Slow decision-making loops",
      "Politics, unclear ownership",
      "Teams with weak modelling foundations",
      "Overpromising / underexplaining",
      "\"Just build dashboards\" requests",
    ]
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ||
      'Your strongest candidates aren\'t job hunting. You need to make the role sound energizing, not "stable."'
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      "Wants pure DS/ML work",
      "Wants minimal stakeholder interaction",
      "Wants only dashboards",
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts || [
      'Pitch the role as "modern stack, impact, ownership", every company says this',
      "Oversell AI elements",
      "Pretend data quality is perfect",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes || [
      'Show "the messy truth" early, AEs love honesty',
      'Position the role as product-building, not "reporting"',
    ]
  );

  const [candidateEvaluation, setCandidateEvaluation] = useState(
    data?.candidateEvaluation || [
      "Team competence",
      "Modelling standards",
      "Data quality",
      "PM alignment",
      "Product roadmap clarity",
      "Transparency about challenges",
    ]
  );

  const [decisionMakingYes, setDecisionMakingYes] = useState(
    data?.decisionMakingYes || [
      "They can shape modelling foundations",
      "They see real technical challenges",
      "They see high-quality peers",
      "The interview loop feels structured",
      "Comp is aligned early",
      "Product impact is clear",
    ]
  );

  const [decisionMakingNo, setDecisionMakingNo] = useState(
    data?.decisionMakingNo || [
      "They detect BI-heavy responsibilities",
      "Ownership is unclear",
      "Interviewers contradict each other",
      "The team cannot articulate a modelling philosophy",
      "They feel the role is actually mid-level disguised as senior",
    ]
  );

  // Update when data prop changes
  useEffect(() => {
    if (data?.persona) setPersona(data.persona);
    if (data?.motivatedBy) setMotivatedBy(data.motivatedBy);
    if (data?.avoids) setAvoids(data.avoids);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.redFlags) setRedFlags(data.redFlags);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixes) setFixes(data.fixes);
    if (data?.candidateEvaluation)
      setCandidateEvaluation(data.candidateEvaluation);
    if (data?.decisionMakingYes) setDecisionMakingYes(data.decisionMakingYes);
    if (data?.decisionMakingNo) setDecisionMakingNo(data.decisionMakingNo);
  }, [data]);

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Tailor outreach to persona",
      impact: "+0.3",
      tooltip:
        "Relevance is the #1 driver of replies; generic messages get ignored.",
      talentPoolImpact: "+20% response",
      riskReduction: "-12% sourcing waste",
    },
    {
      fix: "Highlight modelling ownership",
      impact: "+0.2",
      tooltip: "This is the strongest motivator for product-minded AEs.",
      talentPoolImpact: "+15% interest",
      riskReduction: "-10% dropout",
    },
    {
      fix: "Show messy truth early",
      impact: "+0.2",
      tooltip:
        "Honesty builds instant credibility and differentiates you from fintech competitors.",
      talentPoolImpact: "+10% credibility",
      riskReduction: "-8% expectation mismatch",
    },
  ]);

  useEffect(() => {
    const data = {
      persona,
      motivatedBy,
      avoids,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      candidateEvaluation,
      decisionMakingYes,
      decisionMakingNo,
      scoreImpactRows,
    };

    sessionStorage.setItem("editableFitCard", JSON.stringify(data));
  }, [
    persona,
    motivatedBy,
    avoids,
    brutalTruth,
    redFlags,
    donts,
    fixes,
    candidateEvaluation,
    decisionMakingYes,
    decisionMakingNo,
    scoreImpactRows,
  ]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableFitCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.persona) setPersona(data.persona);
        if (data.motivatedBy) setMotivatedBy(data.motivatedBy);
        if (data.avoids) setAvoids(data.avoids);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.candidateEvaluation)
          setCandidateEvaluation(data.candidateEvaluation);
        if (data.decisionMakingYes)
          setDecisionMakingYes(data.decisionMakingYes);
        if (data.decisionMakingNo) setDecisionMakingNo(data.decisionMakingNo);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sections = [
    {
      id: "persona",
      title: "Persona",
      subtitle: "Target candidate profile",
      Icon: Target,
      tone: "info" as const,
      content: (
        <div>
          <h4 className="text-base font-bold mb-2" style={{ color: "#102a63" }}>
            Persona:
          </h4>
          <EditableText
            value={persona}
            onChange={setPersona}
            className="text-base"
          />
        </div>
      ),
    },
    {
      id: "motivated-by",
      title: "Motivated By",
      subtitle: "What drives this persona",
      Icon: ThumbsUp,
      tone: "success" as const,
      content: (
        <EditableList
          items={motivatedBy}
          onChange={setMotivatedBy}
          itemClassName="text-[13px] leading-snug text-emerald-800"
          markerColor="text-emerald-600"
        />
      ),
    },
    {
      id: "avoids",
      title: "Avoids",
      subtitle: "What this persona avoids",
      Icon: ThumbsDown,
      tone: "danger" as const,
      content: (
        <EditableList
          items={avoids}
          onChange={setAvoids}
          itemClassName="text-[13px] leading-snug text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "decision-making",
      title: "Decision-Making Model",
      subtitle: "How they say yes or no",
      Icon: CheckCircle,
      tone: "info" as const,
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              They say YES when:
            </p>
            <EditableList
              items={decisionMakingYes}
              onChange={setDecisionMakingYes}
              itemClassName="text-[13px] leading-snug text-emerald-800"
              markerColor="text-emerald-600"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              They say NO when:
            </p>
            <EditableList
              items={decisionMakingNo}
              onChange={setDecisionMakingNo}
              itemClassName="text-[13px] leading-snug text-red-800"
              markerColor="text-red-600"
            />
          </div>
        </div>
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about this persona",
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
      id: "fixes",
      title: "Fix This Now",
      subtitle: "Actions to improve fit",
      Icon: Wrench,
      tone: "success" as const,
      content: (
        <EditableList
          items={fixes}
          onChange={setFixes}
          itemClassName="text-[13px] leading-snug text-emerald-800"
          markerColor="text-emerald-600"
        />
      ),
    },
    {
      id: "candidate-flip",
      title: "Candidate Flip Test",
      subtitle: "What candidates evaluate you on",
      Icon: UserCheck,
      tone: "warning" as const,
      content: (
        <div>
          <p className="text-sm mb-2 font-medium" style={{ color: "#102a63" }}>
            Candidates are evaluating YOU on:
          </p>
          <div className="flex flex-wrap gap-2">
            {candidateEvaluation.map((item, idx) => (
              <Pill key={idx} variant="warning">
                {item}
              </Pill>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "score-impact",
      title: "Fix Me Now",
      subtitle: "Actions to improve your hiring score",
      Icon: Target,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.7" cardId="fit" />,
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
              className={`w-full border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-t-4 ${isScoreImpact ? 'md:col-span-2' : ''}`}
              style={{
                borderTopColor: colors.accent,
                backgroundColor: colors.bg,
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
                    totalUplift="+0.7"
                    cardId="fit"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "fit"}
                  />
                </div>
              ) : (
                /* Show all content directly - no modals */
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-3" style={{ color: colors.accent }}>
                    {section.title}
                  </h3>
                  <div className="text-sm">
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
