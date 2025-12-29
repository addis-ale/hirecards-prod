"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Target, Trophy, AlertTriangle, Wrench, FlagTriangleRight, FileText, XCircle, Info, CheckCircle, Lightbulb } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import { EditableText, EditableList } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card, CardHeader } from "@/components/ui/card";
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
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
}

export const EditableRoleCard: React.FC<RoleCardProps> = ({ data, onNavigateToCard, currentCardId }) => {
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

  const [whatGreatLooksLike, setWhatGreatLooksLike] = useState([
    "Thinks in systems, not dashboards",
    "Writes clean, maintainable, tested models",
    "Communicates modelling choices clearly",
    "Works tightly with PM & Engineering",
    "Handles ambiguity through structure",
    "Defines modelling patterns others adopt"
  ]);

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

  // Update when data prop changes
  useEffect(() => {
    console.log("📋 useEffect triggered - data changed");
    if (data?.roleSummary) {
      console.log("📋 Updating roleSummary from data");
      setRoleSummary(data.roleSummary);
    }
    if (data?.outcomes) {
      console.log("📋 Updating outcomes from data:", data.outcomes.length, "items");
      setOutcomes(data.outcomes);
    }
    if (data?.redFlags) {
      console.log("📋 Updating redFlags from data:", data.redFlags.length, "items");
      setRedFlags(data.redFlags);
    }
    if (data?.donts) {
      console.log("📋 Updating donts from data:", data.donts.length, "items");
      setDonts(data.donts);
    }
    if (data?.fixes) {
      console.log("📋 Updating fixes from data:", data.fixes.length, "items");
      setFixes(data.fixes);
    }
    if (data?.brutalTruth) {
      console.log("📋 Updating brutalTruth from data");
      setBrutalTruth(data.brutalTruth);
    }
  }, [data]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("editableRoleCard");
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
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
        if (savedData.scoreImpactRows) setScoreImpactRows(savedData.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          const isFullJd = section.id === "full-jd";

          return (
            <Card
              key={section.id}
              className={`w-full border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-t-4 ${isScoreImpact ? 'md:col-span-2' : ''} ${isFullJd ? 'cursor-pointer' : ''}`}
              style={{
                borderTopColor: colors.accent,
                backgroundColor: colors.bg,
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
                  />
                </div>
              ) : isFullJd ? (
                /* Show preview for Full JD with "See More" button */
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-3" style={{ color: colors.accent }}>
                    {section.title}
                  </h3>
                  <div className="text-sm text-gray-600 line-clamp-4 mb-3">
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
