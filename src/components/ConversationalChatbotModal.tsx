"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Bot, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ExtractedData {
  roleTitle: string | null;
  department: string | null;
  experienceLevel: string | null;
  location: string | null;
  workModel: string | null;
  criticalSkills: string[] | null;
  minSalary: string | null;
  maxSalary: string | null;
  nonNegotiables: string | null;
  flexible: string | null;
  timeline: string | null;
}

interface ConversationalChatbotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ExtractedData>;
  onComplete?: (data: ExtractedData) => void;
}

export default function ConversationalChatbotModal({
  open,
  onOpenChange,
  initialData = {},
  onComplete,
}: ConversationalChatbotModalProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    roleTitle: initialData.roleTitle || null,
    department: initialData.department || null,
    experienceLevel: initialData.experienceLevel || null,
    location: initialData.location || null,
    workModel: initialData.workModel || null,
    criticalSkills: initialData.criticalSkills || null,
    minSalary: initialData.minSalary || null,
    maxSalary: initialData.maxSalary || null,
    nonNegotiables: initialData.nonNegotiables || null,
    flexible: initialData.flexible || null,
    timeline: initialData.timeline || null,
  });
  const [completeness, setCompleteness] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationMessages = useRef<Array<{ role: string; content: string }>>(
    []
  );
  const greetingAdded = useRef(false);

  // Helper function to count filled fields
  const countFilledFields = (data: ExtractedData): number => {
    let count = 0;
    if (data.roleTitle) count++;
    if (data.department) count++;
    if (data.experienceLevel) count++;
    if (data.location) count++;
    if (data.workModel) count++;
    if (data.criticalSkills && data.criticalSkills.length > 0) count++;
    if (data.nonNegotiables) count++;
    if (data.flexible) count++;
    if (data.timeline) count++;
    if (data.minSalary && data.maxSalary) count++;
    return count;
  };

  const TOTAL_FIELDS = 10;

  // Reset when modal opens/closes
  useEffect(() => {
    if (open && !greetingAdded.current) {
      const greeting: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Hey. Let's build a HireCard. What job are you trying to fill?",
        timestamp: new Date(),
      };
      setMessages([greeting]);
      conversationMessages.current = [
        { role: "assistant", content: greeting.content },
      ];
      greetingAdded.current = true;
    } else if (!open) {
      // Reset when modal closes
      setMessages([]);
      conversationMessages.current = [];
      greetingAdded.current = false;
      setCurrentInput("");
      setError(null);
    }
  }, [open]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Update completeness percentage
  useEffect(() => {
    const filled = countFilledFields(extractedData);
    setCompleteness(Math.round((filled / TOTAL_FIELDS) * 100));
  }, [extractedData]);

  // Handle completion when all fields are filled
  const handleComplete = useCallback(async () => {
    if (onComplete) {
      onComplete(extractedData);
    } else {
      const formData = {
        roleTitle: extractedData.roleTitle || "",
        department: extractedData.department || "",
        experienceLevel: extractedData.experienceLevel || "",
        location: extractedData.location || "",
        workModel: extractedData.workModel || "",
        criticalSkills: extractedData.criticalSkills || [],
        minSalary: extractedData.minSalary || "",
        maxSalary: extractedData.maxSalary || "",
        nonNegotiables: extractedData.nonNegotiables || "",
        flexible: extractedData.flexible || "",
        timeline: extractedData.timeline || "",
      };

      sessionStorage.setItem("formData", JSON.stringify(formData));
      router.push("/results");
    }
    onOpenChange(false);
  }, [extractedData, router, onComplete, onOpenChange]);

  // Check if completion message detected
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.role === "assistant" &&
      lastMessage.content.includes("generate your HireCard now")
    ) {
      setTimeout(() => {
        handleComplete();
      }, 1000);
    }
  }, [messages, handleComplete]);

  const handleSend = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    conversationMessages.current.push({
      role: "user",
      content: userMessage.content,
    });

    setCurrentInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Extract data from user message
      const extractResponse = await fetch("/api/intelligent-extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          currentData: extractedData,
        }),
      });

      const extractResult = await extractResponse.json();

      if (extractResult.success && extractResult.hasNewData) {
        // Merge extracted data
        setExtractedData((prev) => ({
          ...prev,
          ...extractResult.extracted,
        }));
      }

      // Step 2: Get AI response
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages.current,
          extractedData: {
            ...extractedData,
            ...(extractResult.extracted || {}),
          },
        }),
      });

      const chatResult = await chatResponse.json();

      if (!chatResult.success) {
        throw new Error(chatResult.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: chatResult.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      conversationMessages.current.push({
        role: "assistant",
        content: assistantMessage.content,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle>Complete Missing Fields</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Progress Bar */}
          <div className="p-4 bg-card border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Progress: {completeness}%
              </span>
              <span className="text-xs text-muted-foreground">
                {countFilledFields(extractedData)}/{TOTAL_FIELDS} fields
              </span>
            </div>
            <div className="w-full bg-muted rounded-md h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-md transition-all duration-300"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-md p-3 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.role === "assistant" && (
                    <Bot className="w-4 h-4 inline-block mr-2" />
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-md p-3">
                  <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3">
                  <AlertCircle className="w-4 h-4 inline-block mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-card border-t border-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !currentInput.trim()}
                size="default"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Send</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

