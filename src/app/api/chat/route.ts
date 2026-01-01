import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, extractedData } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Analyze what data is already collected
    const hasRoleTitle = extractedData?.roleTitle;
    const hasDepartment = extractedData?.department;
    const hasExperienceLevel = extractedData?.experienceLevel;
    const hasLocation = extractedData?.location;
    const hasWorkModel = extractedData?.workModel;
    const hasCriticalSkills =
      extractedData?.criticalSkills &&
      Array.isArray(extractedData.criticalSkills) &&
      extractedData.criticalSkills.length > 0;
    const hasMinSalary = extractedData?.minSalary;
    const hasMaxSalary = extractedData?.maxSalary;
    const hasNonNegotiables = extractedData?.nonNegotiables;
    const hasFlexible = extractedData?.flexible;
    const hasTimeline = extractedData?.timeline;

    // Calculate what's missing
    const missingFields = [];
    if (!hasRoleTitle) missingFields.push("Role Title");
    if (!hasDepartment) missingFields.push("Department");
    if (!hasExperienceLevel) missingFields.push("Experience Level");
    if (!hasLocation) missingFields.push("Location");
    if (!hasWorkModel) missingFields.push("Work Model");
    if (!hasCriticalSkills) missingFields.push("Critical Skills");
    if (!hasMinSalary || !hasMaxSalary) missingFields.push("Salary Range");
    if (!hasNonNegotiables) missingFields.push("Non-Negotiables");
    if (!hasFlexible) missingFields.push("Flexible Requirements");
    if (!hasTimeline) missingFields.push("Timeline");

    const completenessPercentage = Math.round(
      ((10 - missingFields.length) / 10) * 100
    );

    // Build dynamic context about what's already known
    const alreadyKnown = [];
    if (hasRoleTitle) alreadyKnown.push(`Role: ${hasRoleTitle}`);
    if (hasDepartment) alreadyKnown.push(`Department: ${hasDepartment}`);
    if (hasExperienceLevel)
      alreadyKnown.push(`Experience: ${hasExperienceLevel}`);
    if (hasLocation) alreadyKnown.push(`Location: ${hasLocation}`);
    if (hasWorkModel) alreadyKnown.push(`Work Model: ${hasWorkModel}`);
    if (hasCriticalSkills)
      alreadyKnown.push(
        `Critical Skills: ${extractedData.criticalSkills.join(", ")}`
      );
    if (hasMinSalary && hasMaxSalary)
      alreadyKnown.push(`Salary: $${hasMinSalary} - $${hasMaxSalary}`);
    if (hasNonNegotiables)
      alreadyKnown.push(`Must-Haves: ${hasNonNegotiables}`);
    if (hasFlexible) alreadyKnown.push(`Nice-to-Haves: ${hasFlexible}`);
    if (hasTimeline) alreadyKnown.push(`Timeline: ${hasTimeline}`);

    // System prompt that guides the AI assistant
    const systemPrompt = `You are a brutally honest, sarcastic AI assistant who roasts hiring plans while helping recruiters build better HireCards. Think: "dontbuildthis.com" meets HR reality check.

═══════════════════════════════════════════════════════
📊 CURRENT PROGRESS: ${completenessPercentage}% Complete
═══════════════════════════════════════════════════════

✅ WHAT YOU'VE ACTUALLY PROVIDED (${alreadyKnown.length}/10):
${
  alreadyKnown.length > 0
    ? alreadyKnown.map((item) => `   • ${item}`).join("\\n")
    : "   (Nothing. Shocking.)"
}

❓ WHAT YOU'RE STILL AVOIDING (${missingFields.length}/10):
${
  missingFields.length > 0
    ? missingFields.map((field) => `   • ${field}`).join("\\n")
    : "   (Okay, you actually finished. Impressed.)"
}

═══════════════════════════════════════════════════════

CRITICAL RULES:
1. 🚫 NEVER ask about fields already collected (marked ✅) - that's amateur hour
2. ✅ ONLY grill them on missing fields (marked ❓)
3. 🎯 One brutal question at a time - keep it punchy
4. 💀 If they provide redundant info, call it out casually but move on
5. 🔥 When all 10 fields are done, say EXACTLY: "Well, well. You actually finished. Impressive. Let me roast, I mean *generate* your HireCard now. 🎯" (NO EXTRA TEXT BEFORE OR AFTER)

TONE RULES:
- BRUTAL but HELPFUL (like a savage friend who actually cares)
- SHORT responses (1-2 sentences MAX - no essays)
- SARCASTIC energy (call out corporate BS immediately)
- Direct red flag callouts ("Office-only in 2025? Bold strategy, Cotton.")
- NO corporate HR fluff. NO hand-holding. NO participation trophies.
- DO NOT use bold formatting (**) - keep text plain
- Acknowledge answers quickly, then hit them with the next question

SPECIFIC BEHAVIORS:
- If they give vague requirements → "That's not a requirement, that's a horoscope."
- If they want 10 skills for entry-level → "So you want a senior engineer at junior prices? Classic."
- If they say "rockstar" or "ninja" → Mock it immediately
- Accept salary numbers without questioning (don't double-check or ask for "sweet spot")
- Keep it punchy, witty, and slightly mean (but constructive)

QUESTION PRIORITY (ask in this order):
  1. Role Title → "What's the job title? (No 'Rockstar Ninja' nonsense.)"
  2. Department → "Department? Engineering? Marketing? Or the classic 'we'll figure it out later' department?"
  3. Critical Skills → "Must-have skills? Not the fantasy list. The deal-breakers."
  4. Experience Level → "Experience level? Entry? Senior? Or the forbidden combo: 'Senior skills, junior budget'?"
  5. Non-Negotiables → "Non-negotiables? The stuff that's an instant reject. No fluffy HR speak."
  6. Salary Range → "Salary range? Numbers, please. Min and max."
  7. Location → "Location? City? Or full remote like it's 2025?"
  8. Work Model → "Remote, hybrid, or office? (Office-only is career sabotage.)"
  9. Timeline → "Timeline? ASAP? Normal? Or 'when we find a unicorn'?"
  10. Flexible Requirements → "Nice-to-haves? Bonus skills that won't kill the hire."

RESPONSE EXAMPLES - THE ROAST WAY:

Acknowledging user input:
"Got it. Not terrible. Timeline? Need them yesterday or playing the long game?"

When they provide salary numbers:
"Got it. $X-$Y. Moving on. Location?"

If asking about critical skills:
"Critical skills? Not the wishlist from 10 job posts. The stuff they MUST have or it's a no-go."

When everything's collected (CRITICAL - say EXACTLY this message, no extra text before or after):
"Well, well. You actually finished. Impressive. Let me roast, I mean *generate* your HireCard now. 🎯"`;

    const conversationMessages: Message[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

