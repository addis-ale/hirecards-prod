"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollMorphHero from "@/app/modules/landing-page/ui/components/scroll-morph-hero";
import { heroCards } from "./hero-cards-data";
import Loader1 from "./loader1";

interface ScrapedJobData {
  title: string;
  description: string;
  location?: string;
  locationType?: string;
  company?: string;
  salary?: string;
  experienceLevel?: string;
  employmentType?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  department?: string;
  rawText: string;
  source: string;
  aiEnhanced?: boolean;
}

export const HomeHeroSection = () => {
  const [roleDescription, setRoleDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedJobData | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!roleDescription.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // Prevent scrolling when loading
    document.body.style.overflow = 'hidden';
    
    try {
      const response = await fetch("/api/scrape-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: roleDescription.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process job input");
      }

      setScrapedData(result.data);
      
      // Show loader for 45 seconds
      setTimeout(() => {
        setIsLoading(false);
        // Restore scrolling
        document.body.style.overflow = 'auto';
        // Here you can add logic to show results or navigate to another page
      }, 45000); // 45 seconds
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      document.body.style.overflow = 'auto';
      console.error("Error scraping job:", err);
    }
  };

  return (
    <section className="relative h-screen flex flex-col overflow-x-hidden bg-linear-to-b from-white via-gray-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-slate-100/20 dark:bg-slate-800/10 rounded-full blur-[100px]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Scroll Morph Hero with Cards */}
      <div className="relative z-10 h-full pt-32">
        <ScrollMorphHero
          cards={heroCards}
          title="Know the Market Before You Hire"
          description="Transform any job description into interactive 'Battle Cards'. Get instant clarity on salary benchmarks, candidate supply, and interview strategy in 5 minutes."
        />
      </div>

      {/* Input Section Overlay or Loader */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-950">
          <Loader1 />
        </div>
      )}
      {!isLoading && (
        <div className="absolute bottom-0 left-0 right-0 z-50 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              {/* Label above input */}

              <div className="relative group">
                {/* Simplified glow effect - removed blur for performance */}
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-[22px] opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

                <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-2xl">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-inner">
                    <textarea
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="Paste a LinkedIn JD link or describe the role (e.g., 'Senior React Dev for a Fintech startup in London')..."
                      className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none focus:border-0 resize-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 min-h-[80px] font-medium"
                      style={{ outline: "none", boxShadow: "none" }}
                    />

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-0 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        onClick={handleSubmit}
                        className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-6 rounded-2xl font-bold text-base text-primary-foreground shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] bg-primary hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                        disabled={!roleDescription.trim()}
                      >
                        <span>Generate Battle Cards</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Panel - Collapsible and Absolutely Positioned */}
      {scrapedData && (
        <div className="fixed bottom-4 right-4 z-[100] max-w-md">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setDebugOpen(!debugOpen)}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white">
                  Debug: Scraped Data
                </span>
              </div>
              {debugOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Collapsible Content */}
            {debugOpen && (
              <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                <div className="space-y-3 text-xs font-mono">
                  {/* AI Enhanced Badge */}
                  {scrapedData.aiEnhanced && (
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                      <div className="px-2 py-1 bg-purple-600/20 border border-purple-500/40 rounded text-purple-300 text-[10px] font-bold">
                        ✨ AI ENHANCED
                      </div>
                    </div>
                  )}

                  {/* Source */}
                  <div>
                    <div className="text-green-400 font-semibold mb-1">Source:</div>
                    <div className="text-slate-300">{scrapedData.source}</div>
                  </div>

                  {/* Title */}
                  <div>
                    <div className="text-green-400 font-semibold mb-1">Title:</div>
                    <div className="text-slate-300">{scrapedData.title}</div>
                  </div>

                  {/* Company */}
                  {scrapedData.company && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">Company:</div>
                      <div className="text-slate-300">{scrapedData.company}</div>
                    </div>
                  )}

                  {/* Department */}
                  {scrapedData.department && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">Department:</div>
                      <div className="text-slate-300">{scrapedData.department}</div>
                    </div>
                  )}

                  {/* Location */}
                  {scrapedData.location && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">Location:</div>
                      <div className="text-slate-300">{scrapedData.location}</div>
                    </div>
                  )}

                  {/* Location Type */}
                  {scrapedData.locationType && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">Location Type:</div>
                      <div className="text-slate-300">{scrapedData.locationType}</div>
                    </div>
                  )}

                  {/* Employment Type */}
                  {scrapedData.employmentType && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">Employment Type:</div>
                      <div className="text-slate-300">{scrapedData.employmentType}</div>
                    </div>
                  )}

                  {/* Experience Level */}
                  {scrapedData.experienceLevel && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">Experience Level:</div>
                      <div className="text-slate-300">{scrapedData.experienceLevel}</div>
                    </div>
                  )}

                  {/* Salary */}
                  {scrapedData.salary && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">Salary:</div>
                      <div className="text-slate-300">{scrapedData.salary}</div>
                    </div>
                  )}

                  {/* Skills */}
                  {scrapedData.skills && scrapedData.skills.length > 0 && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">
                        Skills ({scrapedData.skills.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {scrapedData.skills.slice(0, 8).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/40 rounded text-blue-300 text-[10px]"
                          >
                            {skill}
                          </span>
                        ))}
                        {scrapedData.skills.length > 8 && (
                          <span className="text-slate-500 text-[10px]">
                            +{scrapedData.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {scrapedData.requirements && scrapedData.requirements.length > 0 && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">
                        Requirements ({scrapedData.requirements.length}):
                      </div>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {scrapedData.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="truncate">
                            {req}
                          </li>
                        ))}
                        {scrapedData.requirements.length > 3 && (
                          <li className="text-slate-500">
                            +{scrapedData.requirements.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Responsibilities */}
                  {scrapedData.responsibilities && scrapedData.responsibilities.length > 0 && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">
                        Responsibilities ({scrapedData.responsibilities.length}):
                      </div>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {scrapedData.responsibilities.slice(0, 3).map((resp, idx) => (
                          <li key={idx} className="truncate">
                            {resp}
                          </li>
                        ))}
                        {scrapedData.responsibilities.length > 3 && (
                          <li className="text-slate-500">
                            +{scrapedData.responsibilities.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Benefits */}
                  {scrapedData.benefits && scrapedData.benefits.length > 0 && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">
                        Benefits ({scrapedData.benefits.length}):
                      </div>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {scrapedData.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="truncate">
                            {benefit}
                          </li>
                        ))}
                        {scrapedData.benefits.length > 3 && (
                          <li className="text-slate-500">
                            +{scrapedData.benefits.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Description Preview */}
                  <div>
                    <div className="text-green-400 font-semibold mb-1">
                      Description Preview:
                    </div>
                    <div className="text-slate-300 line-clamp-4 text-[10px] leading-relaxed">
                      {scrapedData.description || scrapedData.rawText}
                    </div>
                  </div>

                  {/* Raw Text Length */}
                  <div>
                    <div className="text-green-400 font-semibold mb-1">
                      Raw Text Length:
                    </div>
                    <div className="text-slate-300">
                      {scrapedData.rawText.length} characters
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setScrapedData(null)}
                    className="w-full mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 z-[100] max-w-md">
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 shadow-2xl">
            <div className="flex items-start gap-2">
              <div className="text-red-400 font-semibold text-sm">Error:</div>
              <div className="text-red-200 text-xs flex-1">{error}</div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature pills - simplified for performance */}
    </section>
  );
};
