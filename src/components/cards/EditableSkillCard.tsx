"use client";

import React, { useState, useEffect } from "react";
import {
  Code,
  AlertTriangle,
  Hammer,
  Brain,
  Users,
  Target,
  BookOpen,
} from "lucide-react";
import { EditableList, EditableText } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card } from "@/components/ui/card";

interface SkillCardProps {
  data?: {
    technicalSkills?: string[];
    productSkills?: string[];
    behaviouralSkills?: string[];
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    upskillableSkills?: string[];
    mustHaveSkills?: string[];
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  onOpenSuggestions?: () => void;
}

export const EditableSkillCard = ({
  data,
  onNavigateToCard,
  currentCardId,
  onOpenSuggestions,
}: SkillCardProps = {}) => {
  // Initialize from data prop, fallback to static example data
  const [technicalSkills, setTechnicalSkills] = useState(
    data?.technicalSkills ?? [
      "Advanced SQL + testing discipline",
      "Strong dbt (macros, tests, structure, ref patterns)",
      "Dimensional modelling & semantic layer design",
      "Pipeline design + data reliability engineering",
      "BI familiarity (Looker ideal)",
    ]
  );

  const [productSkills, setProductSkills] = useState(
    data?.productSkills ?? [
      "Translate messy business logic → clean models",
      "Define metrics with Product",
      "Reason through tradeoffs",
      "Influence analytics UX",
    ]
  );

  const [behaviouralSkills, setBehaviouralSkills] = useState(
    data?.behaviouralSkills ?? [
      "Ownership mindset",
      "Writes clear reasoning",
      "Thrives in ambiguity",
      "Protects modelling quality",
    ]
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ?? 'Most "analytics engineers" are BI developers. Find system designers.'
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags ?? [
      "Only built dashboards",
      "Avoids documentation",
      "Weak testing discipline",
      "No ownership vocabulary",
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts ?? [
      "Hire BI devs mislabelled as AEs",
      "Skip modelling exercises",
      "Over-index on domain experience",
      "Confuse \"good with dashboards\" = \"strong AE\"",
    ]
  );

  const [upskillableSkills, setUpskillableSkills] = useState(
    data?.upskillableSkills ?? [
      "Looker",
      "Metric layers",
      "Domain-specific metrics",
      "Airflow DAG writing",
    ]
  );

  const [mustHaveSkills, setMustHaveSkills] = useState(
    data?.mustHaveSkills ?? [
      "Modelling fundamentals",
      "dbt proficiency",
      "SQL testing discipline",
      "Ownership mindset",
    ]
  );

  // Update when data prop changes - PRIORITY: data prop overrides everything
  useEffect(() => {
    if (data) {
      console.log("🔧 ============================================");
      console.log("🔧 UPDATING SKILL CARD FROM DYNAMIC DATA");
      console.log("🔧 ============================================");
      console.log("🔧 Data received:", JSON.stringify(data, null, 2));
      
      if (data.technicalSkills !== undefined && Array.isArray(data.technicalSkills)) {
        console.log("🔧 Updating technicalSkills from data:", data.technicalSkills.length, "items");
        setTechnicalSkills(data.technicalSkills);
      }
      if (data.productSkills !== undefined && Array.isArray(data.productSkills)) {
        console.log("🔧 Updating productSkills from data:", data.productSkills.length, "items");
        setProductSkills(data.productSkills);
      }
      if (data.behaviouralSkills !== undefined && Array.isArray(data.behaviouralSkills)) {
        console.log("🔧 Updating behaviouralSkills from data:", data.behaviouralSkills.length, "items");
        setBehaviouralSkills(data.behaviouralSkills);
      }
      if (data.mustHaveSkills !== undefined && Array.isArray(data.mustHaveSkills)) {
        console.log("🔧 Updating mustHaveSkills from data:", data.mustHaveSkills.length, "items");
        setMustHaveSkills(data.mustHaveSkills);
      }
      if (data.upskillableSkills !== undefined && Array.isArray(data.upskillableSkills)) {
        console.log("🔧 Updating upskillableSkills from data:", data.upskillableSkills.length, "items");
        setUpskillableSkills(data.upskillableSkills);
      }
      if (data.redFlags !== undefined && Array.isArray(data.redFlags)) {
        console.log("🔧 Updating redFlags from data:", data.redFlags.length, "items");
        setRedFlags(data.redFlags);
      }
      if (data.donts !== undefined && Array.isArray(data.donts)) {
        console.log("🔧 Updating donts from data:", data.donts.length, "items");
        setDonts(data.donts);
      }
      if (data.brutalTruth !== undefined) {
        console.log("🔧 Updating brutalTruth from data");
        setBrutalTruth(data.brutalTruth);
      }
      // Generate scoreImpactRows from donts/redFlags if not provided
      if (!data.scoreImpactRows) {
        const fixes = data.donts || data.redFlags || [];
        if (fixes.length > 0) {
          const impacts = ["+0.3", "+0.2", "+0.2", "+0.1", "+0.1"];
          const talentImpacts = ["+25% pool expansion", "+15% persona match", "+12% signal quality", "+10% more candidates", "+18% engagement"];
          const riskReductions = ["-15% false negatives", "-10% interview waste", "-15% bad hires", "-5% HM conflict", "-12% dropout"];
          const generatedScoreImpactRows: ScoreImpactRow[] = fixes.slice(0, 5).map((fix: string, index: number) => ({
            fix: fix,
            impact: impacts[index] || "+0.1",
            tooltip: `Why it matters: ${fix}`,
            talentPoolImpact: talentImpacts[index] || "+10% improvement",
            riskReduction: riskReductions[index] || "-10% risk",
          }));
          setScoreImpactRows(generatedScoreImpactRows);
        }
      } else if (data.scoreImpactRows && Array.isArray(data.scoreImpactRows) && data.scoreImpactRows.length > 0) {
        console.log("🔧 Updating scoreImpactRows from data:", data.scoreImpactRows.length, "items");
        setScoreImpactRows(data.scoreImpactRows);
      }
    }
  }, [data]);

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Remove non-essential skills",
      impact: "+0.3",
      tooltip: "Why it matters: Removes blockers without lowering quality.",
      talentPoolImpact: "+25% pool expansion",
      riskReduction: "-15% false negatives",
    },
    {
      fix: "Prioritise top 5 must-haves",
      impact: "+0.2",
      tooltip: "Why it matters: AEs choose clarity.",
      talentPoolImpact: "+15% persona match",
      riskReduction: "-10% interview waste",
    },
    {
      fix: "Clarify upskillable skills",
      impact: "+0.1",
      tooltip: "Why it matters: Prevents needless rejections.",
      talentPoolImpact: "+10% more candidates",
      riskReduction: "-5% HM conflict",
    },
    {
      fix: "Add modelling evaluation",
      impact: "+0.2",
      tooltip:
        "Why it matters: Filters accurately without over-indexing CV buzzwords.",
      talentPoolImpact: "+12% signal quality",
      riskReduction: "-15% bad hires",
    },
  ]);

  // Save to sessionStorage
  useEffect(() => {
    const data = {
      technicalSkills,
      productSkills,
      behaviouralSkills,
      brutalTruth,
      redFlags,
      donts,
      upskillableSkills,
      mustHaveSkills,
      scoreImpactRows,
    };

    sessionStorage.setItem("editableSkillCard", JSON.stringify(data));
  }, [
    technicalSkills,
    productSkills,
    behaviouralSkills,
    brutalTruth,
    redFlags,
    donts,
    upskillableSkills,
    mustHaveSkills,
    scoreImpactRows,
  ]);

  // Load from sessionStorage ONLY if no data prop is provided (fallback)
  useEffect(() => {
    // Only load from sessionStorage if we don't have dynamic data
    if (!data) {
      const saved = sessionStorage.getItem("editableSkillCard");
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          if (savedData.technicalSkills !== undefined) setTechnicalSkills(savedData.technicalSkills);
          if (savedData.productSkills !== undefined) setProductSkills(savedData.productSkills);
          if (savedData.behaviouralSkills !== undefined)
            setBehaviouralSkills(savedData.behaviouralSkills);
          if (savedData.brutalTruth !== undefined) setBrutalTruth(savedData.brutalTruth);
          if (savedData.redFlags !== undefined) setRedFlags(savedData.redFlags);
          if (savedData.donts !== undefined) setDonts(savedData.donts);
          if (savedData.upskillableSkills !== undefined)
            setUpskillableSkills(savedData.upskillableSkills);
          if (savedData.mustHaveSkills !== undefined) setMustHaveSkills(savedData.mustHaveSkills);
          if (savedData.scoreImpactRows && Array.isArray(savedData.scoreImpactRows) && savedData.scoreImpactRows.length > 0) {
            setScoreImpactRows(savedData.scoreImpactRows);
          }
        } catch (e) {
          console.error("Failed to load saved data:", e);
        }
      }
    }
  }, [data]);

  const sections = [
    {
      id: "technical-skills",
      title: "Core Technical Skills",
      subtitle: "Essential technical abilities and tools",
      Icon: Code,
      tone: "info" as const,
      content: (
        <EditableList
          items={technicalSkills}
          onChange={setTechnicalSkills}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-blue-600"
        />
      ),
    },
    {
      id: "product-skills",
      title: "Product Skills",
      subtitle: "Product-focused abilities and mindset",
      Icon: Brain,
      tone: "purple" as const,
      content: (
        <EditableList
          items={productSkills}
          onChange={setProductSkills}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-purple-600"
        />
      ),
    },
    {
      id: "behavioural-skills",
      title: "Behavioural Skills",
      subtitle: "Soft skills and work approach",
      Icon: Users,
      tone: "success" as const,
      content: (
        <EditableList
          items={behaviouralSkills}
          onChange={setBehaviouralSkills}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-green-600"
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about skills for this role",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={brutalTruth}
          onChange={setBrutalTruth}
          multiline
          placeholder="What's the hard truth about skills for this role?"
        />
      ),
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs in skill requirements",
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
      Icon: Hammer,
      tone: "warning" as const,
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
      id: "upskillability",
      title: "Upskillability Guide",
      subtitle: "What can be trained vs must-have skills",
      Icon: BookOpen,
      tone: "info" as const,
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-emerald-700 mb-2">
              Can be trained quickly (shouldn&apos;t block seniors):
            </p>
            <EditableList
              items={upskillableSkills}
              onChange={setUpskillableSkills}
              itemClassName="text-[13px] leading-snug text-emerald-800"
              markerColor="text-emerald-600"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-red-700 mb-2">
              Cannot be trained fast enough (must-have at entry):
            </p>
            <EditableList
              items={mustHaveSkills}
              onChange={setMustHaveSkills}
              itemClassName="text-[13px] leading-snug text-red-800"
              markerColor="text-red-600"
            />
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
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.8" cardId="skill" />,
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
                    totalUplift="+0.8"
                    cardId="skill"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "skill"}
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
