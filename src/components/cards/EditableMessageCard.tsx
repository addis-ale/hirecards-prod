"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  AlertTriangle,
  Wrench,
  XCircle,
  Eye,
  FileText,
  TerminalSquare,
  AlignLeft,
  Zap,
} from "lucide-react";
import { EditableText, EditableList } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { FixMeNowBoxes } from "@/components/ui/FixMeNowBoxes";
import { Card } from "@/components/ui/card";
import { SectionModal } from "@/components/ui/SectionModal";

interface MessageCardProps {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  onOpenSuggestions?: () => void;
  data?: {
    corePitch?: string;
    brutalTruth?: string;
    donts?: string[];
    fixThisNow?: string;
    hiddenBottleneck?: string;
    templates?: string[];
    scrollStoppers?: string[];
  };
}

export const EditableMessageCard: React.FC<MessageCardProps> = ({
  data,
  onNavigateToCard,
  currentCardId,
  onOpenSuggestions,
}) => {
  // Initialize from data or use defaults
  const [corePitch, setCorePitch] = useState(
    data?.corePitch ??
      "You own the modelling layer behind merchant analytics, not dashboards. Your dbt models become live features in Mollie's Insights product, visible to thousands of merchants. You fix metric chaos, replace fragile pipelines, and set modelling standards, instead of maintaining legacy BI."
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ??
      'Senior Analytics Engineers get spammed with: "We use a modern stack, you will have impact, we are data driven." They ignore it because every company says the same thing. The only way to stand out is to be extremely specific about: what they will own, which problems they will solve, how close they are to the product. Everything else is background noise.'
  );

  const [donts, setDonts] = useState(
    data?.donts ?? [
      "\"Fast paced environment\"",
      "\"Passionate about data\"",
      "\"We are a leading fintech\"",
      "A full company history in the first message",
      "Vague promises about AI without concrete use cases",
    ]
  );

  const [fixThisNow, setFixThisNow] = useState(
    data?.fixThisNow ||
      "The data models become product features, not support work."
  );

  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    data?.hiddenBottleneck ||
      "Your messaging is often too polite and too vague. Senior talent responds to direct, specific value, not generalities."
  );

  const [template1, setTemplate1] = useState(
    "Saw your work on {specific modelling project, repo, or company}.\n\nWe are hiring a Senior Analytics Engineer to own the modelling layer behind Mollie's merchant analytics, the models you build show up directly in our merchant Insights product, not in internal dashboards.\n\nThe problems are very real: legacy pipelines, metric drift, and a semantic layer that needs a proper owner.\n\nWorth a quick look to see if this is closer to what you actually want to be doing?"
  );

  const [template2, setTemplate2] = useState(
    "Quick extra context:\n\n• Stack: dbt, Snowflake, Looker\n• Scope: own the models behind our merchant revenue and profitability views\n• Impact: your models determine what thousands of merchants see in their dashboards every day\n\nYou would work directly with Product and Engineering on the Insights product, not sit in a BI queue.\n\nIf that sounds closer to your ideal setup, happy to share more."
  );

  const [template3, setTemplate3] = useState(
    "No pressure at all, but given your background, this feels unusually close to what you are already good at.\n\nIf you ever want a five minute sanity check on whether this is a step up from your current setup, I am happy to walk you through it."
  );

  const [scrollStoppers, setScrollStoppers] = useState(
    data?.scrollStoppers || [
      "Your models will show up in front of thousands of merchants, not hidden in internal BI.",
      "We need someone to own the modelling layer and fix metric drift across Mollie, not build another layer of dashboards.",
      "If you enjoy designing dbt projects more than building yet another report, this is probably your lane.",
    ]
  );

  const [openModal, setOpenModal] = useState<string | null>(null);

  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Lead with product impact, not stack",
      impact: "+0.2",
      tooltip: "Candidates care what their models power, not just which tools.",
      talentPoolImpact: "+15% reply rate",
      riskReduction: "-8% \"not relevant\" drops"
    },
    {
      fix: "Personalise with concrete signals",
      impact: "+0.2",
      tooltip: "Reference their repo, talk, or project, not just their title.",
      talentPoolImpact: "+12% positive replies",
      riskReduction: "-10% ghosting"
    },
    {
      fix: "Name the real problems honestly",
      impact: "+0.1",
      tooltip: "\"Metric drift, legacy pipelines\" beats \"interesting challenges.\"",
      talentPoolImpact: "+8% candidate interest",
      riskReduction: "-6% late stage mismatch"
    },
    {
      fix: "Use soft, optional CTAs",
      impact: "+0.1",
      tooltip: "Low pressure makes seniors more likely to engage.",
      talentPoolImpact: "+6% response rate",
      riskReduction: "-5% \"hard no\" replies"
    }
  ]);

  // Update when data changes
  useEffect(() => {
    if (data?.corePitch) setCorePitch(data.corePitch);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixThisNow) setFixThisNow(data.fixThisNow);
    if (data?.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
    if (data?.scrollStoppers) setScrollStoppers(data.scrollStoppers);
  }, [data]);

  useEffect(() => {
    const data = {
      corePitch,
      brutalTruth,
      donts,
      fixThisNow,
      hiddenBottleneck,
      template1,
      template2,
      template3,
      scrollStoppers,
      scoreImpactRows,
    };

    sessionStorage.setItem("editableMessageCard", JSON.stringify(data));
  }, [
    corePitch,
    brutalTruth,
    donts,
    fixThisNow,
    hiddenBottleneck,
    template1,
    template2,
    template3,
    scrollStoppers,
    scoreImpactRows,
  ]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableMessageCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.corePitch) setCorePitch(data.corePitch);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.donts) setDonts(data.donts);
        if (data.fixThisNow) setFixThisNow(data.fixThisNow);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
        if (data.template1) setTemplate1(data.template1);
        if (data.template2) setTemplate2(data.template2);
        if (data.template3) setTemplate3(data.template3);
        if (data.scrollStoppers) setScrollStoppers(data.scrollStoppers);
        if (data.scoreImpactRows && Array.isArray(data.scoreImpactRows) && data.scoreImpactRows.length > 0) {
          setScoreImpactRows(data.scoreImpactRows);
        }
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, []);

  const corePitchContent = (
    <div className="space-y-6">
      <div
        className="rounded-xl border-2 p-5 bg-gradient-to-br from-blue-50 to-white"
        style={{ borderColor: "#278f8c" }}
      >
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 mt-0.5" style={{ color: "#278f8c" }} />
          <div className="flex-1">
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: "#102a63" }}
            >
              Core Pitch
            </h4>
            <EditableText
              value={corePitch}
              onChange={setCorePitch}
              className="text-[13px] leading-relaxed italic font-medium"
              style={{ color: "#278f8c" }}
              multiline
            />
          </div>
        </div>
      </div>
    </div>
  );

  const messageTemplatesContent = (
    <div className="space-y-4">
      {/* Template 1 */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="flex items-start gap-3 mb-2">
          <Eye className="w-4 h-4 text-slate-600 mt-0.5" />
          <h4 className="text-[14px] font-semibold text-slate-800">
            Message 1 – Relevance and hook
          </h4>
        </div>
        <EditableText
          value={template1}
          onChange={setTemplate1}
          className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700"
          multiline
        />
      </div>

      {/* Template 2 */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="flex items-start gap-3 mb-2">
          <TerminalSquare className="w-4 h-4 text-slate-600 mt-0.5" />
          <h4 className="text-[14px] font-semibold text-slate-800">
            Message 2 – Scope and product impact
          </h4>
        </div>
        <EditableText
          value={template2}
          onChange={setTemplate2}
          className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700"
          multiline
        />
      </div>

      {/* Template 3 */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="flex items-start gap-3 mb-2">
          <FileText className="w-4 h-4 text-slate-600 mt-0.5" />
          <h4 className="text-[14px] font-semibold text-slate-800">
            Message 3 – Soft follow up
          </h4>
        </div>
        <EditableText
          value={template3}
          onChange={setTemplate3}
          className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700"
          multiline
        />
      </div>
    </div>
  );

  // Preview content for the templates section
  const messageTemplatesPreview = (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Complete message sequence with three editable templates for effective outreach.
      </p>
      <div className="text-xs text-gray-500 italic">
        Click to view and edit all three message templates...
      </div>
    </div>
  );

  const scrollStoppersContent = (
    <div className="rounded-xl border border-purple-200 p-4 bg-gradient-to-br from-purple-50 to-white">
      <h4
        className="text-sm font-semibold mb-3"
        style={{ color: "#102a63" }}
      >
        Short &quot;Scroll Stopper&quot; Variants
      </h4>
      <EditableList
        items={scrollStoppers}
        onChange={setScrollStoppers}
        itemClassName="text-[13px] leading-snug italic text-purple-800"
        markerColor="text-purple-600"
      />
    </div>
  );

  const sections = [
    {
      id: "core-pitch",
      title: "Core Pitch",
      subtitle: "The essential message that differentiates your role",
      Icon: Target,
      tone: "info" as const,
      content: corePitchContent,
    },
    {
      id: "donts",
      title: "Don't Do This",
      subtitle: "Common messaging mistakes that turn candidates away",
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
      id: "fix-this",
      title: "Fix This Now",
      subtitle: "Lead with one undeniable differentiator",
      Icon: Wrench,
      tone: "success" as const,
      content: (
        <div className="space-y-3">
          <p className="text-[13px] font-medium text-emerald-800">
            Lead with one undeniable differentiator:
          </p>
          <div className="pl-4 border-l-4 border-emerald-500 py-2">
            <EditableText
              value={fixThisNow}
              onChange={setFixThisNow}
              className="text-[13px] italic font-medium text-emerald-800"
              multiline
            />
          </div>
        </div>
      ),
    },
    {
      id: "scroll-stoppers",
      title: "Scroll Stoppers",
      subtitle: "Short variants that grab attention immediately",
      Icon: Zap,
      tone: "purple" as const,
      content: scrollStoppersContent,
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The harsh reality about your messaging",
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
      id: "hidden-bottleneck",
      title: "Hidden Bottleneck",
      subtitle: "What's really holding back your messaging",
      Icon: AlertTriangle,
      tone: "warning" as const,
      content: (
        <EditableText
          value={hiddenBottleneck}
          onChange={setHiddenBottleneck}
          className="text-sm font-medium text-orange-900"
          multiline
        />
      ),
    },
    {
      id: "templates",
      title: "Three Step Outreach",
      subtitle: "Complete message sequence for effective outreach",
      Icon: AlignLeft,
      tone: "info" as const,
      content: messageTemplatesContent,
    },
    {
      id: "score-impact",
      title: "Fix Me Now",
      subtitle: "Actions you can take to improve your messaging score",
      Icon: Target,
      tone: "success" as const,
      content: (
        <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.6" cardId="message" />
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
          const isTemplates = section.id === "templates";

          return (
            <Card
              key={section.id}
              className={`w-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${isTemplates ? 'cursor-pointer' : ''} border-t-4 ${isScoreImpact ? 'md:col-span-2' : ''}`}
              style={{
                borderTopColor: colors.accent,
                backgroundColor: 'transparent',
              }}
              onClick={isTemplates ? () => setOpenModal(section.id) : undefined}
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
                    cardId="message"
                    onNavigateToCard={onNavigateToCard}
                    currentCardId={currentCardId || "message"}
                    onOpenSuggestions={onOpenSuggestions}
                  />
                </div>
              ) : isTemplates ? (
                /* Show preview for templates section with "see more" */
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-3" style={{ color: colors.accent }}>
                    {section.title}
                  </h3>
                  <div className="text-sm">
                    {messageTemplatesPreview}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenModal(section.id);
                    }}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                  >
                    See more →
                  </button>
                </div>
              ) : (
                /* Show all other content directly - no modals */
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

      {/* Modals */}
      {sections
        .filter((section) => section.id === "templates")
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
