"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Target, Trophy, AlertTriangle, FlagTriangleRight, FileText, XCircle, Lightbulb } from "lucide-react";
import { EditableText, EditableList } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card } from "@/components/ui/card";
import { SectionModal } from "@/components/ui/SectionModal";

interface RoleCardProps {
  data?: {
    roleSummary?: string;
    outcomes?: string[];
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    brutalTruth?: string;
    whatGreatLooksLike?: string[];
    roleMission?: string;
    whatYoullWorkWith?: string[];
    whatYouWontDo?: string[];
    jdBefore?: string;
    jdAfter?: string;
    fullJdSnippet?: string;
    commonFailureModes?: string[];
    scoreImpactRows?: ScoreImpactRow[];
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  onOpenSuggestions?: () => void;
}

export const EditableRoleCard: React.FC<RoleCardProps> = ({ data, onNavigateToCard, currentCardId, onOpenSuggestions }) => {
  console.log("📋 ============================================");
  console.log("📋 EDITABLE ROLE CARD RENDER");
  console.log("📋 ============================================");
  console.log("📋 Received data prop:", data ? "YES" : "NO");
  if (data) {
    console.log("📋 Data content:", JSON.stringify(data, null, 2));
  }

  const [roleSummary, setRoleSummary] = useState(
    data?.roleSummary ?? "Analytics engineering at Mollie is not BI maintenance — it is product-building. Your work becomes a live, customer-facing feature, not an internal dashboard."
  );

  const [outcomes, setOutcomes] = useState(
    data?.outcomes ?? [
      "Deliver reliable, well-tested dbt models",
      "Replace fragile legacy pipelines",
      "Define meaningful metrics with Product",
      "Improve modelling consistency across teams",
      "Raise modelling standards across the org",
    ]
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      "Generic job description",
      "Buzzwords over outcomes",
      "No clear ownership",
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts || [
      "Copy competitor JDs",
      "Hide data complexity",
      "List 20+ responsibilities",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Show real challenges upfront",
      "Focus on outcomes not tasks",
      "Align stakeholders early",
    ]
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth || "Be honest about the data debt. Seniors will discover it anyway."
  );

  const [roleMission, setRoleMission] = useState(
    data?.roleMission ?? "You own the modelling layer behind merchant analytics. You design stable, production-grade dbt models that shape the Insights product and directly influence thousands of merchants every day."
  );

  const [whatGreatLooksLike, setWhatGreatLooksLike] = useState(
    data?.whatGreatLooksLike || [
      "Thinks in systems, not dashboards",
      "Writes clean, maintainable, tested models",
      "Communicates modelling choices clearly",
      "Works tightly with PM & Engineering",
      "Handles ambiguity through structure",
      "Defines modelling patterns others adopt"
    ]
  );

  const [whatYoullWorkWith, setWhatYoullWorkWith] = useState([
    "dbt, Snowflake, Looker, Git, Airflow",
    "Cross-functional squads",
    "Short iteration loops"
  ]);

  const [whatYouWontDo, setWhatYouWontDo] = useState([
    "Dashboard maintenance",
    "Ad-hoc requests",
    "Glue-code pipelines",
    "\"Do-everything\" data roles"
  ]);

  const [jdBefore, setJdBefore] = useState(
    "Responsible for building dashboards, maintaining pipelines, and supporting analytics requests."
  );

  const [jdAfter, setJdAfter] = useState(
    "Own the modelling layer powering Mollie's merchant-facing analytics. Design stable, well-tested dbt models, replace fragile pipelines, define core metrics, and shape the analytics experience used by thousands of merchants."
  );

  const [fullJdSnippet, setFullJdSnippet] = useState(
    "Senior Analytics Engineer — Mollie\n\nWe're hiring a Senior Analytics Engineer to own the modelling layer behind Mollie's merchant-facing analytics. This isn't BI or dashboard maintenance — it's product-focused analytics engineering where the models you build become part of the customer experience.\n\nYou'll design reliable, well-tested dbt models, replace fragile pipelines, define key business metrics, and partner with Product & Engineering to ship analytics features used by thousands of merchants.\n\nWhat we're looking for:\n• Strong dbt and SQL ability\n• Excellent modelling fundamentals\n• Data quality & testing discipline\n• Ability to translate messy business logic into clean models\n• Clear communication and ownership mindset\n\nWhat this role is not:\nBI reporting, ad-hoc requests, dashboarding, or \"do everything\" data work.\n\nWhy this role matters:\nYour modelling decisions directly shape merchant insights, influence product strategy, and establish modelling standards across Mollie."
  );

  const [commonFailureModes, setCommonFailureModes] = useState([
    "JD too generic → wrong applicants",
    "Undefined ownership → seniors lose interest",
    "No modelling examples → unclear expectations",
    "Data debt hidden → interviews collapse"
  ]);

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Rewrite JD into outcomes",
      impact: "+0.3",
      tooltip: "Why it matters: Seniors select roles based on outcomes, not tasks.",
      talentPoolImpact: "+20% persona relevance",
      riskReduction: "-15% misalignment"
    },
    {
      fix: "Add ownership clarity",
      impact: "+0.2",
      tooltip: "Why it matters: Removes ambiguity — biggest conversion killer.",
      talentPoolImpact: "+18% engagement",
      riskReduction: "-10% rejection risk"
    },
    {
      fix: "Remove BI/support tasks",
      impact: "+0.1",
      tooltip: "Why it matters: Immediately filters out non-AE profiles.",
      talentPoolImpact: "+10% accuracy",
      riskReduction: "-5% interview waste"
    },
    {
      fix: "Highlight product impact",
      impact: "+0.2",
      tooltip: "Why it matters: Strongest motivator for this persona.",
      talentPoolImpact: "+22% reply rate",
      riskReduction: "-12% dropout"
    },
    {
      fix: "Define success clearly",
      impact: "+0.2",
      tooltip: "Why it matters: Enables alignment & cleaner interviews.",
      talentPoolImpact: "+15% conversion",
      riskReduction: "-20% restart risk"
    }
  ]);

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    const data = {
      roleSummary,
      outcomes,
      redFlags,
      donts,
      fixes,
      brutalTruth,
      roleMission,
      whatGreatLooksLike,
      whatYoullWorkWith,
      whatYouWontDo,
      jdBefore,
      jdAfter,
      fullJdSnippet,
      commonFailureModes,
      scoreImpactRows
    };

    sessionStorage.setItem("editableRoleCard", JSON.stringify(data));
  }, [roleSummary, outcomes, redFlags, donts, fixes, brutalTruth, roleMission, whatGreatLooksLike, whatYoullWorkWith, whatYouWontDo, jdBefore, jdAfter, fullJdSnippet, commonFailureModes, scoreImpactRows]);

  // Update when data prop changes - PRIORITY: data prop overrides everything
  useEffect(() => {
    // Check if data exists and has actual content (not just empty object)
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      console.log("📋 ============================================");
      console.log("📋 UPDATING ROLE CARD FROM DYNAMIC DATA");
      console.log("📋 ============================================");
      console.log("📋 Data received:", JSON.stringify(data, null, 2));
      
      if (data.roleSummary !== undefined && data.roleSummary !== null) {
        console.log("📋 Updating roleSummary from data:", data.roleSummary);
        setRoleSummary(data.roleSummary);
      }
      if (data.roleMission !== undefined && data.roleMission !== null) {
        console.log("📋 Updating roleMission from data:", data.roleMission);
        setRoleMission(data.roleMission);
      }
      if (data.outcomes !== undefined && Array.isArray(data.outcomes) && data.outcomes.length > 0) {
        console.log("📋 Updating outcomes from data:", data.outcomes.length, "items");
        setOutcomes(data.outcomes);
      }
      if (data.whatGreatLooksLike !== undefined && Array.isArray(data.whatGreatLooksLike) && data.whatGreatLooksLike.length > 0) {
        console.log("📋 Updating whatGreatLooksLike from data:", data.whatGreatLooksLike.length, "items");
        setWhatGreatLooksLike(data.whatGreatLooksLike);
      }
      if (data.whatYoullWorkWith !== undefined && Array.isArray(data.whatYoullWorkWith) && data.whatYoullWorkWith.length > 0) {
        console.log("📋 Updating whatYoullWorkWith from data:", data.whatYoullWorkWith.length, "items");
        setWhatYoullWorkWith(data.whatYoullWorkWith);
      }
      if (data.whatYouWontDo !== undefined && Array.isArray(data.whatYouWontDo) && data.whatYouWontDo.length > 0) {
        console.log("📋 Updating whatYouWontDo from data:", data.whatYouWontDo.length, "items");
        setWhatYouWontDo(data.whatYouWontDo);
      }
      if (data.redFlags !== undefined && Array.isArray(data.redFlags) && data.redFlags.length > 0) {
        console.log("📋 Updating redFlags from data:", data.redFlags.length, "items");
        setRedFlags(data.redFlags);
      }
      if (data.donts !== undefined && Array.isArray(data.donts) && data.donts.length > 0) {
        console.log("📋 Updating donts from data:", data.donts.length, "items");
        setDonts(data.donts);
      }
      if (data.fixes !== undefined && Array.isArray(data.fixes) && data.fixes.length > 0) {
        console.log("📋 Updating fixes from data:", data.fixes.length, "items");
        setFixes(data.fixes);
        // Generate scoreImpactRows from fixes if not provided
        if (!data.scoreImpactRows && data.fixes.length > 0) {
          const generatedScoreImpactRows: ScoreImpactRow[] = data.fixes.slice(0, 5).map((fix: string, index: number) => {
            const impacts = ["+0.3", "+0.2", "+0.2", "+0.1", "+0.1"];
            const talentImpacts = ["+20% persona relevance", "+18% engagement", "+15% conversion", "+10% accuracy", "+12% signal quality"];
            const riskReductions = ["-15% misalignment", "-10% rejection risk", "-20% restart risk", "-5% interview waste", "-15% bad hires"];
            return {
              fix: fix,
              impact: impacts[index] || "+0.1",
              tooltip: `Why it matters: ${fix}`,
              talentPoolImpact: talentImpacts[index] || "+10% improvement",
              riskReduction: riskReductions[index] || "-10% risk",
            };
          });
          setScoreImpactRows(generatedScoreImpactRows);
        }
      }
      if (data.jdBefore !== undefined && data.jdBefore !== null) {
        console.log("📋 Updating jdBefore from data");
        setJdBefore(data.jdBefore);
      }
      if (data.jdAfter !== undefined && data.jdAfter !== null) {
        console.log("📋 Updating jdAfter from data");
        setJdAfter(data.jdAfter);
      }
      if (data.fullJdSnippet !== undefined && data.fullJdSnippet !== null) {
        console.log("📋 Updating fullJdSnippet from data");
        setFullJdSnippet(data.fullJdSnippet);
      }
      if (data.commonFailureModes !== undefined && Array.isArray(data.commonFailureModes) && data.commonFailureModes.length > 0) {
        console.log("📋 Updating commonFailureModes from data:", data.commonFailureModes.length, "items");
        setCommonFailureModes(data.commonFailureModes);
      }
      if (data.scoreImpactRows !== undefined && Array.isArray(data.scoreImpactRows) && data.scoreImpactRows.length > 0) {
        console.log("📋 Updating scoreImpactRows from data:", data.scoreImpactRows.length, "items");
        setScoreImpactRows(data.scoreImpactRows);
      }
      if (data.brutalTruth !== undefined && data.brutalTruth !== null) {
        console.log("📋 Updating brutalTruth from data:", data.brutalTruth);
        setBrutalTruth(data.brutalTruth);
      }
    } else if (!data) {
      console.log("📋 No data prop provided, will use sessionStorage or defaults");
    }
  }, [data]);

  // Load from sessionStorage ONLY if data prop is not provided (fallback)
  useEffect(() => {
    // Only load from sessionStorage if we don't have dynamic data
    if (!data) {
      const saved = sessionStorage.getItem("editableRoleCard");
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          console.log("📋 Loading from sessionStorage (no dynamic data available)");
          if (savedData.roleSummary) setRoleSummary(savedData.roleSummary);
          if (savedData.outcomes) setOutcomes(savedData.outcomes);
          if (savedData.redFlags) setRedFlags(savedData.redFlags);
          if (savedData.donts) setDonts(savedData.donts);
          if (savedData.fixes) setFixes(savedData.fixes);
          if (savedData.brutalTruth) setBrutalTruth(savedData.brutalTruth);
          if (savedData.roleMission) setRoleMission(savedData.roleMission);
          if (savedData.whatGreatLooksLike) setWhatGreatLooksLike(savedData.whatGreatLooksLike);
          if (savedData.whatYoullWorkWith) setWhatYoullWorkWith(savedData.whatYoullWorkWith);
          if (savedData.whatYouWontDo) setWhatYouWontDo(savedData.whatYouWontDo);
          if (savedData.jdBefore) setJdBefore(savedData.jdBefore);
          if (savedData.jdAfter) setJdAfter(savedData.jdAfter);
          if (savedData.fullJdSnippet) setFullJdSnippet(savedData.fullJdSnippet);
          if (savedData.commonFailureModes) setCommonFailureModes(savedData.commonFailureModes);
          if (savedData.scoreImpactRows && Array.isArray(savedData.scoreImpactRows) && savedData.scoreImpactRows.length > 0) {
            setScoreImpactRows(savedData.scoreImpactRows);
          }
        } catch (e) {
          console.error("Failed to load saved data:", e);
        }
      }
    }
  }, [data]);

  const [openModal, setOpenModal] = useState<string | null>(null);

  const sections = [
    {
      id: "role-mission",
      title: "Role Mission",
      subtitle: "What this person will actually do and what success looks like",
      Icon: Target,
      tone: "info" as const,
      content: (
        <EditableText
          value={roleMission}
          onChange={setRoleMission}
          className="text-[13px] leading-relaxed"
          multiline
          placeholder="Describe the role mission..."
        />
      ),
    },
    {
      id: "outcomes",
      title: "Top Outcomes",
      subtitle: "Key results expected in the first 6–12 months",
      Icon: Trophy,
      tone: "success" as const,
      content: (
        <EditableList
          items={outcomes}
          onChange={setOutcomes}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-emerald-700"
        />
      ),
    },
    {
      id: "what-great-looks-like",
      title: "What Great Looks Like",
      subtitle: "Characteristics of exceptional performance",
      Icon: Lightbulb,
      tone: "success" as const,
      content: (
        <EditableList
          items={whatGreatLooksLike}
          onChange={setWhatGreatLooksLike}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-emerald-700"
        />
      ),
    },
    {
      id: "work-with",
      title: "What You'll Work With",
      subtitle: "Tools, technologies, and environment",
      Icon: Briefcase,
      tone: "info" as const,
      content: (
        <EditableList
          items={whatYoullWorkWith}
          onChange={setWhatYoullWorkWith}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-blue-600"
        />
      ),
    },
    {
      id: "wont-do",
      title: "What You Won't Do",
      subtitle: "What this role is explicitly not",
      Icon: XCircle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={whatYouWontDo}
          onChange={setWhatYouWontDo}
          itemClassName="text-[13px] leading-snug text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "jd-rewrite",
      title: "JD Rewrite",
      subtitle: "Before and after job description comparison",
      Icon: FileText,
      tone: "warning" as const,
      content: (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-red-700 mb-1">❌ BEFORE (Guaranteed to attract the wrong crowd)</p>
            <EditableText
              value={jdBefore}
              onChange={setJdBefore}
              className="text-[13px] leading-relaxed text-red-800"
              multiline
            />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 mb-1">✔ AFTER (Market-fitting, persona-aligned)</p>
            <EditableText
              value={jdAfter}
              onChange={setJdAfter}
              className="text-[13px] leading-relaxed text-emerald-800"
              multiline
            />
          </div>
        </div>
      ),
    },
    {
      id: "full-jd",
      title: "Full JD Snippet",
      subtitle: "Complete job description ready to copy",
      Icon: FileText,
      tone: "info" as const,
      content: (
        <div className="max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <EditableText
            value={fullJdSnippet}
            onChange={setFullJdSnippet}
            className="text-[13px] leading-relaxed whitespace-pre-line font-mono bg-white p-3 rounded border border-gray-200 block"
            multiline
          />
        </div>
      ),
    },
    {
      id: "failure-modes",
      title: "Common Failure Modes",
      subtitle: "How role definitions typically fail",
      Icon: AlertTriangle,
      tone: "warning" as const,
      content: (
        <EditableList
          items={commonFailureModes}
          onChange={setCommonFailureModes}
          itemClassName="text-[13px] leading-snug text-orange-800"
          markerColor="text-orange-600"
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about this role",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={brutalTruth}
          onChange={setBrutalTruth}
          multiline
          placeholder="What's the hard truth about this role?"
        />
      ),
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs in role definitions",
      Icon: FlagTriangleRight,
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
      Icon: AlertTriangle,
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
      id: "score-impact",
      title: "Fix Me Now",
      subtitle: "Actions to improve your hiring score",
      Icon: Target,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+1.0" cardId="role" />,
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
          const isFullJd = section.id === "full-jd";

          return (
            <Card
              key={section.id}
              className={`w-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-t-4 ${isScoreImpact ? 'md:col-span-2' : ''} ${isFullJd ? 'cursor-pointer' : ''}`}
              style={{
                borderTopColor: colors.accent,
                backgroundColor: 'transparent',
              }}
              onClick={isFullJd ? () => setOpenModal(section.id) : undefined}
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
                    totalUplift="+1.0"
                    cardId="role"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "role"}
                    onOpenSuggestions={onOpenSuggestions}
                  />
                </div>
              ) : isFullJd ? (
                /* Show preview for Full JD with "See More" button */
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-3 text-slate-900 dark:text-white" style={{ color: colors.accent }}>
                    {section.title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 mb-3">
                    {fullJdSnippet}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenModal(section.id);
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    See More
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
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

      {/* Modal for Full JD Snippet */}
      {sections
        .filter((section) => section.id === "full-jd")
        .map((section) => {
          const Icon = section.Icon;
          return (
            <SectionModal
              key={section.id}
              isOpen={openModal === section.id}
              onClose={() => setOpenModal(null)}
              title={section.title}
              subtitle={section.subtitle}
              Icon={Icon}
              tone={section.tone}
              allowEdit={true}
            >
              {section.content}
            </SectionModal>
          );
        })}
    </>
  );
};
