"use client";

import React, { useState, useEffect } from "react";
import { Send, AlertTriangle, X, Wrench, Search, Clock } from "lucide-react";
import { Callout } from "@/components/ui/Callout";
import { EditableText, EditableList } from "@/components/EditableCard";

interface OutreachCardProps {
  data?: {
    introduction?: string;
    message1?: string;
    message2?: string;
    message3?: string;
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    hiddenBottleneck?: string;
    timelineToFailure1?: string;
    timelineToFailure2?: string;
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
}

export const EditableOutreachCard = ({
  data,
  onNavigateToCard,
  currentCardId,
}: OutreachCardProps = {}) => {
  const [introduction, setIntroduction] = useState(
    data?.introduction ||
      "Short, sharp messages built around what this persona actually cares about: product impact, ownership, modelling quality, and shipping."
  );

  const [message1, setMessage1] = useState(
    data?.message1 ||
      "1–2 lines referencing their modelling work + a clean hook about customer-facing analytics."
  );

  const [message2, setMessage2] = useState(
    data?.message2 ||
      "A line showing the unique value: shipping models that become live product features inside Mollie's merchant dashboard."
  );

  const [message3, setMessage3] = useState(
    data?.message3 ||
      '"Worth a quick sanity check?" → no pressure, no oversell.'
  );

  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ||
      'Analytics engineers get hammered with "modern stack + dbt + impact" pitches. If your outreach sounds like that, you disappear instantly. The only thing that cuts through is product ownership, not dashboards, not stack, not buzzwords.'
  );

  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      'Outreach leading with "We\'re hiring a Senior AE."',
      "Messages longer than 4 lines.",
      "No reference to their modelling domain.",
      'Generic adjectives ("fast-paced," "data-driven," "AI-powered").',
    ]
  );

  const [donts, setDonts] = useState(
    data?.donts || [
      "Describe the job ad in DM format.",
      "Open with culture fluff.",
      "Pitch AI without showing how it's used.",
      "Ask for a call before giving context.",
    ]
  );

  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Tie your opener to a specific repo, modelling decision, or dashboard they built.",
      "Lead with the real differentiator: your models go straight into customer-facing UX, not buried in BI.",
      "Mention the Insights product: a new, AI-assisted analytics suite with real revenue impact.",
      "Keep your CTA soft and optional.",
    ]
  );

  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    data?.hiddenBottleneck ||
      "If you can't clearly explain how this role shapes Mollie's merchant analytics experience in the first message, the candidate assumes it's another BI cleanup job, and ignores you."
  );

  const [timelineToFailure1, setTimelineToFailure1] = useState(
    data?.timelineToFailure1 ||
      "If messages aren't personalised in week 1 → expect reply rates under 15%."
  );

  const [timelineToFailure2, setTimelineToFailure2] = useState(
    data?.timelineToFailure2 ||
      'If you lead with "dbt + ownership + impact" like every fintech → expect under 10%.'
  );

  // Update when data prop changes
  useEffect(() => {
    if (data?.introduction) setIntroduction(data.introduction);
    if (data?.message1) setMessage1(data.message1);
    if (data?.message2) setMessage2(data.message2);
    if (data?.message3) setMessage3(data.message3);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.redFlags) setRedFlags(data.redFlags);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixes) setFixes(data.fixes);
    if (data?.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
    if (data?.timelineToFailure1)
      setTimelineToFailure1(data.timelineToFailure1);
    if (data?.timelineToFailure2)
      setTimelineToFailure2(data.timelineToFailure2);
  }, [data]);

  useEffect(() => {
    const data = {
      introduction,
      message1,
      message2,
      message3,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      hiddenBottleneck,
      timelineToFailure1,
      timelineToFailure2,
    };

    sessionStorage.setItem("editableOutreachCard", JSON.stringify(data));
  }, [
    introduction,
    message1,
    message2,
    message3,
    brutalTruth,
    redFlags,
    donts,
    fixes,
    hiddenBottleneck,
    timelineToFailure1,
    timelineToFailure2,
  ]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableOutreachCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.introduction) setIntroduction(data.introduction);
        if (data.message1) setMessage1(data.message1);
        if (data.message2) setMessage2(data.message2);
        if (data.message3) setMessage3(data.message3);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
        if (data.timelineToFailure1)
          setTimelineToFailure1(data.timelineToFailure1);
        if (data.timelineToFailure2)
          setTimelineToFailure2(data.timelineToFailure2);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <EditableText
          value={introduction}
          onChange={setIntroduction}
          className="text-sm leading-relaxed"
          style={{ color: "#102a63" }}
          multiline
        />
      </div>

      {/* 3-Step Sequence */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          3-Step Outreach Sequence
        </h3>
        <div className="space-y-3">
          {/* Message 1 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-2" style={{ color: "#278f8c" }}>
              Message 1. Relevance First
            </h4>
            <EditableText
              value={message1}
              onChange={setMessage1}
              className="text-sm text-gray-700"
              multiline
            />
          </div>

          {/* Message 2 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-2" style={{ color: "#278f8c" }}>
              Message 2. Scope & Product Impact
            </h4>
            <EditableText
              value={message2}
              onChange={setMessage2}
              className="text-sm text-gray-700"
              multiline
            />
          </div>

          {/* Message 3 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-2" style={{ color: "#278f8c" }}>
              Message 3. Soft Follow-Up
            </h4>
            <EditableText
              value={message3}
              onChange={setMessage3}
              className="text-sm text-gray-700"
              multiline
            />
          </div>
        </div>
      </div>

      {/* Brutal Truth */}
      <Callout tone="danger" title="Brutal Truth">
        <EditableText value={brutalTruth} onChange={setBrutalTruth} multiline />
      </Callout>

      {/* Red Flags */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-red-700">Red Flags</h3>
        <EditableList
          items={redFlags}
          onChange={setRedFlags}
          itemClassName="text-sm text-red-900"
          markerColor="text-red-600"
        />
      </div>

      {/* Don't Do This */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-orange-700">
          Don&apos;t Do This
        </h3>
        <EditableList
          items={donts}
          onChange={setDonts}
          itemClassName="text-sm text-orange-900"
          markerColor="text-orange-600"
        />
      </div>

      {/* Fix This Now */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-green-700">Fix This Now</h3>
        <EditableList
          items={fixes}
          onChange={setFixes}
          itemClassName="text-sm text-green-900"
          markerColor="text-green-600"
        />
      </div>

      {/* Hidden Bottleneck */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <Search className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-base mb-2 text-purple-900">
              Hidden Bottleneck
            </h3>
            <EditableText
              value={hiddenBottleneck}
              onChange={setHiddenBottleneck}
              className="text-sm text-purple-900"
              multiline
            />
          </div>
        </div>
      </div>

      {/* Timeline to Failure */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-base mb-2 text-yellow-900">
              Timeline to Failure
            </h3>
            <div className="space-y-2">
              <EditableText
                value={timelineToFailure1}
                onChange={setTimelineToFailure1}
                className="text-sm text-yellow-900"
                multiline
              />
              <EditableText
                value={timelineToFailure2}
                onChange={setTimelineToFailure2}
                className="text-sm text-yellow-900"
                multiline
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
