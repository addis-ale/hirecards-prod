"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronUp, Bug, AlertCircle, X, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollMorphHero from "@/app/modules/landing-page/ui/components/scroll-morph-hero";
import { heroCards } from "./hero-cards-data";
import Loader1 from "./loader1";
import ConversationalChatbotModal from "@/components/ConversationalChatbotModal";
import MissingFieldsModal from "@/components/MissingFieldsModal";

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

interface ApifyJobData {
  id: string;
  title: string;
  linkedinUrl: string;
  company: {
    name: string;
    logo?: string;
    employeeCount?: number;
  };
  location: {
    linkedinText: string;
    parsed?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  salary?: {
    text: string;
    min?: number;
    max?: number;
    currency?: string;
  };
  employmentType?: string;
  workplaceType?: string;
  applicants?: number;
  views?: number;
  benefits?: string[];
  descriptionText?: string;
}

interface ApifyPeopleData {
  id: string;
  publicIdentifier: string;
  linkedinUrl: string;
  firstName: string;
  lastName: string;
  headline: string;
  location: {
    linkedinText: string;
    countryCode?: string;
    parsed?: {
      text?: string;
      city?: string;
      state?: string;
      country?: string;
      countryCode?: string;
    };
  };
  avatar?: string;
  about?: string;
  topSkills?: string;
  connections?: number;
  followers?: number;
  premium?: boolean;
  openToWork?: boolean;
  currentCompany?: {
    name: string;
    company_id?: string;
    industry?: string;
    link?: string;
  };
  experience?: any[];
  education?: any[];
  certifications?: any[];
  projects?: any[];
}

export const HomeHeroSection = () => {
  const router = useRouter();
  const [roleDescription, setRoleDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedJobData | null>(null);
  const [similarJobs, setSimilarJobs] = useState<ApifyJobData[]>([]);
  const [candidates, setCandidates] = useState<ApifyPeopleData[]>([]);
  const [linkedInJobsCount, setLinkedInJobsCount] = useState(0);
  const [indeedJobsCount, setIndeedJobsCount] = useState(0);
  const [platform, setPlatform] = useState<string>("unknown");
  const [debugOpen, setDebugOpen] = useState(false);
  const [linkedInJobsOpen, setLinkedInJobsOpen] = useState(false);
  const [indeedJobsOpen, setIndeedJobsOpen] = useState(false);
  const [candidatesOpen, setCandidatesOpen] = useState(false);
  
  // AI-Generated Card Groups
  const [jobAnalysisCardsOpen, setJobAnalysisCardsOpen] = useState(false);
  const [peopleAnalysisCardsOpen, setPeopleAnalysisCardsOpen] = useState(false);
  const [combinedAnalysisCardsOpen, setCombinedAnalysisCardsOpen] = useState(false);
  const [derivedStrategyCardsOpen, setDerivedStrategyCardsOpen] = useState(false);
  const [apifyResultsOpen, setApifyResultsOpen] = useState(false);
  const [apifyJobsOpen, setApifyJobsOpen] = useState(false);
  const [apifyCandidatesOpen, setApifyCandidatesOpen] = useState(false);
  
  const [jobAnalysisCards, setJobAnalysisCards] = useState<any>(null);
  const [peopleAnalysisCards, setPeopleAnalysisCards] = useState<any>(null);
  const [combinedAnalysisCards, setCombinedAnalysisCards] = useState<any>(null);
  const [derivedStrategyCards, setDerivedStrategyCards] = useState<any>(null);
  
  // Additional data sources state
  const [additionalDataSources, setAdditionalDataSources] = useState<any>(null);
  const [dataSourcesOpen, setDataSourcesOpen] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [extractedFields, setExtractedFields] = useState<any>(null);
  const [missingFieldsModalOpen, setMissingFieldsModalOpen] = useState(false);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  
  // Quick scrape state for real-time scraping
  const [quickScrapeData, setQuickScrapeData] = useState<any>(null);
  const [quickScrapeLoading, setQuickScrapeLoading] = useState(false);
  const [quickScrapeError, setQuickScrapeError] = useState<string | null>(null);
  const [quickScrapeDebugOpen, setQuickScrapeDebugOpen] = useState(false);

  // Debug: Log when modal state changes
  useEffect(() => {
    if (missingFieldsModalOpen) {
      console.log("Missing fields modal opened:", {
        missingFieldsCount: missingFields.length,
        missingFields: missingFields
      });
    }
  }, [missingFieldsModalOpen, missingFields]);

  // Real-time scraping when URL is pasted
  useEffect(() => {
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    const isURL = urlPattern.test(roleDescription.trim());
    
    if (isURL && roleDescription.trim().length > 10) {
      // Debounce the scraping
      const timer = setTimeout(async () => {
        setQuickScrapeLoading(true);
        setQuickScrapeError(null);
        
        try {
          const response = await fetch("/api/quick-scrape", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: roleDescription.trim() }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to scrape URL");
          }

          setQuickScrapeData(result);
          setQuickScrapeDebugOpen(true);
          console.log("✅ Quick scrape successful:", result);
          console.log("📊 Extracted Fields:", result.extractedFields);
          console.log("❌ Missing Fields:", result.missingFields);
        } catch (err: any) {
          setQuickScrapeError(err.message);
          console.error("Quick scrape error:", err);
        } finally {
          setQuickScrapeLoading(false);
        }
      }, 1500); // Wait 1.5 seconds after user stops typing

      return () => clearTimeout(timer);
    } else {
      // Clear data if not a URL
      if (quickScrapeData) {
        setQuickScrapeData(null);
      }
      // Keep panel open but collapsed
    }
  }, [roleDescription]);

  const proceedToResults = () => {
    console.log("📊 Proceeding to results page");
    // Store data in sessionStorage for results page
    const formData = {
      scrapedData,
      similarJobs,
      candidates,
      linkedInJobsCount,
      indeedJobsCount,
      platform,
      extractedFields,
    };
    sessionStorage.setItem("scrapedJobData", JSON.stringify(formData));
    router.push("/results");
  };

  const handleGetCardsAnyway = () => {
    console.log("🎯 User clicked 'Get My Cards Anyway'");
    // Store data first
    const formData = {
      scrapedData,
      similarJobs,
      candidates,
      linkedInJobsCount,
      indeedJobsCount,
      platform,
      extractedFields,
    };
    sessionStorage.setItem("scrapedJobData", JSON.stringify(formData));
    // Use window.location for immediate navigation without React re-renders
    window.location.href = "/results";
  };

  const handleCompleteFields = () => {
    console.log("✏️ User clicked 'Complete Missing Fields'");
    setMissingFieldsModalOpen(false);
    // Keep loading screen visible, just show chatbot instead
    setChatbotModalOpen(true);
  };

  const handleBackToLanding = () => {
    console.log("🏠 User clicked 'Back to Landing Page'");
    // Reset all state
    setMissingFieldsModalOpen(false);
    setIsLoading(false);
    setChatbotModalOpen(false);
    setRoleDescription("");
    setScrapedData(null);
    setSimilarJobs([]);
    setCandidates([]);
    setMissingFields([]);
    setExtractedFields(null);
    setError(null);
    setWarnings([]);
    document.body.style.overflow = 'auto';
    // Navigate to landing page
    router.push("/");
  };

  const handleChatbotComplete = (completedData: any) => {
    console.log("✅ Chatbot completed with data:", completedData);
    // Hide loading screen and chatbot
    setChatbotModalOpen(false);
    setIsLoading(false);
    document.body.style.overflow = 'auto';
    
    // Merge completed data with extracted fields
    const mergedData = {
      ...extractedFields,
      ...completedData,
    };
    setExtractedFields(mergedData);
    
    // Store merged data
    const formData = {
      scrapedData,
      similarJobs,
      candidates,
      linkedInJobsCount,
      indeedJobsCount,
      platform,
      extractedFields: mergedData,
    };
    sessionStorage.setItem("scrapedJobData", JSON.stringify(formData));
    router.push("/results");
  };

  const handleSubmit = async () => {
    if (!roleDescription.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // Prevent scrolling when loading
    document.body.style.overflow = 'hidden';
    
    try {
      // Scraping enabled - using real API
      const SKIP_SCRAPING = false; // Set to true to bypass scraping for testing
      
      let result;
      
      if (SKIP_SCRAPING) {
        // Mock data for testing
        console.log("🧪 TESTING MODE: Using mock data (skipping scraping)");
        result = {
          data: {
            title: "Senior React Developer",
            description: "We are looking for a Senior React Developer...",
            company: "Tech Corp",
            location: "San Francisco, CA",
            locationType: "Remote",
            employmentType: "Full-time",
            experienceLevel: "Senior",
            salary: "$120,000 - $150,000",
            rawText: roleDescription.trim(),
            source: "mock",
            aiEnhanced: false,
          },
          similarJobs: [],
          candidates: [],
          linkedInJobsCount: 0,
          indeedJobsCount: 0,
          platform: "unknown",
          warnings: [],
          jobAnalysisCards: null,
          peopleAnalysisCards: null,
          combinedAnalysisCards: null,
          derivedStrategyCards: null,
          extractedFields: {
            title: "Senior React Developer",
            company: "Tech Corp",
            location: "San Francisco, CA",
          },
          missingFields: ["Salary Range", "Benefits", "Required Skills", "Experience Level"],
          hasMissingFields: true,
        };
      } else {
        // Real scraping
      const response = await fetch("/api/scrape-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: roleDescription.trim() }),
      });

        result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process job input");
        }
      }

      setScrapedData(result.data);
      setSimilarJobs(result.similarJobs || []);
      setCandidates(result.candidates || []);
      setLinkedInJobsCount(result.linkedInJobsCount || 0);
      setIndeedJobsCount(result.indeedJobsCount || 0);
      setPlatform(result.platform || "unknown");
      setWarnings(result.warnings || []);
      
      // Set AI-generated card groups
      setJobAnalysisCards(result.jobAnalysisCards || null);
      setPeopleAnalysisCards(result.peopleAnalysisCards || null);
      setCombinedAnalysisCards(result.combinedAnalysisCards || null);
      setDerivedStrategyCards(result.derivedStrategyCards || null);
      setExtractedFields(result.extractedFields || null);
      setMissingFields(result.missingFields || []);
      
      // Set additional data sources (Glassdoor, Levels.fyi, Crunchbase, GitHub)
      setAdditionalDataSources(result.dataSources || null);
      
      // For testing: Show modal immediately (skip 45 second wait)
      const startTime = Date.now();
      const minLoadTime = SKIP_SCRAPING ? 500 : 45000; // 0.5 seconds for testing, 45 seconds for real
      
      const checkAndShowModal = () => {
        // Show missing fields modal if there are missing fields
        // Check both hasMissingFields flag and actual missingFields array
        const missingFieldsArray = result.missingFields || [];
        const hasMissing = result.hasMissingFields === true || 
                          (Array.isArray(missingFieldsArray) && missingFieldsArray.length > 0);
        
        console.log("=== MODAL CHECK DEBUG ===");
        console.log("hasMissingFields flag:", result.hasMissingFields);
        console.log("missingFields array:", missingFieldsArray);
        console.log("missingFields length:", missingFieldsArray.length);
        console.log("hasMissing:", hasMissing);
        console.log("extractedFields:", result.extractedFields);
        console.log("========================");
        
        // Update state with the actual missing fields array
        setMissingFields(missingFieldsArray);
        
        if (hasMissing && missingFieldsArray.length > 0) {
          // Keep loading screen visible and show modal on top
          console.log("✅ SHOULD OPEN MODAL - Missing", missingFieldsArray.length, "fields");
          setTimeout(() => {
            console.log("🚀 OPENING MISSING FIELDS MODAL NOW (on loading screen)");
            setMissingFieldsModalOpen(true);
            // Don't hide loading screen yet - it will be hidden when user makes a choice
          }, 100);
        } else {
          // No missing fields, hide loading and proceed to results
          console.log("⏭️ NO MISSING FIELDS - Proceeding to results");
          setIsLoading(false);
          document.body.style.overflow = 'auto';
          proceedToResults();
        }
      };
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
      
      setTimeout(checkAndShowModal, remainingTime);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      document.body.style.overflow = 'auto';
      console.error("Error scraping job:", err);
    }
  };

  return (
    <section id="hero-input" className="relative h-screen flex flex-col overflow-x-hidden bg-linear-to-b from-white via-gray-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-950 p-4">
          {/* Show loader only when neither modal is open */}
          {!missingFieldsModalOpen && !chatbotModalOpen && <Loader1 />}
          
          {/* Show Missing Fields Modal on loading screen when ready */}
          <MissingFieldsModal
            open={missingFieldsModalOpen}
            onOpenChange={setMissingFieldsModalOpen}
            missingFields={missingFields}
            onGetCardsAnyway={handleGetCardsAnyway}
            onCompleteFields={handleCompleteFields}
            onBackToLanding={handleBackToLanding}
          />
          
          {/* Show Chatbot on loading screen */}
          {chatbotModalOpen && (
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in-0 zoom-in-95 duration-300 min-h-[500px] max-h-[85vh] flex flex-col">
                <ConversationalChatbotModal
                  open={chatbotModalOpen}
                  onOpenChange={setChatbotModalOpen}
                  initialData={extractedFields || {}}
                  onComplete={handleChatbotComplete}
                  inline={true}
                  onBackToLanding={handleBackToLanding}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {!isLoading && (
        <div id="hero-input-section" className="absolute bottom-0 left-0 right-0 z-50 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              {/* Label above input */}

              <div className="relative group">
                {/* Simplified glow effect - removed blur for performance */}
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-[22px] opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

                <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-2xl">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-inner">
                    <div className="relative">
                    <textarea
                        id="role-description-input"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="Paste a LinkedIn JD link or describe the role (e.g., 'Senior React Dev for a Fintech startup in London')..."
                      className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none focus:border-0 resize-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 min-h-[80px] font-medium"
                      style={{ outline: "none", boxShadow: "none" }}
                    />
                      {quickScrapeLoading && (
                        <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-blue-500">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Scraping...</span>
                        </div>
                      )}
                      {quickScrapeData && !quickScrapeLoading && (
                        <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-green-500">
                          <span>✅ Scraped</span>
                        </div>
                      )}
                    </div>

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

      {/* Generated Cards Debug Panel - Shows all AI-generated cards */}
      {(jobAnalysisCards || peopleAnalysisCards || combinedAnalysisCards || derivedStrategyCards) && (
        <div className="fixed top-20 right-4 z-[10000] max-w-md">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-purple-500 overflow-hidden">
            <button
              onClick={() => {
                const allOpen = jobAnalysisCardsOpen && peopleAnalysisCardsOpen && combinedAnalysisCardsOpen && derivedStrategyCardsOpen;
                setJobAnalysisCardsOpen(!allOpen);
                setPeopleAnalysisCardsOpen(!allOpen);
                setCombinedAnalysisCardsOpen(!allOpen);
                setDerivedStrategyCardsOpen(!allOpen);
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors bg-purple-950/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎴</span>
                <span className="text-sm font-semibold text-white">
                  Generated Cards
                </span>
                <span className="px-2 py-0.5 bg-purple-600/20 border border-purple-500/40 rounded text-purple-300 text-[10px] font-bold">
                  {[
                    jobAnalysisCards ? 5 : 0,
                    peopleAnalysisCards ? 1 : 0,
                    combinedAnalysisCards ? 4 : 0,
                    derivedStrategyCards ? 3 : 0,
                  ].reduce((a, b) => a + b, 0)} CARDS
                </span>
              </div>
              {(jobAnalysisCardsOpen || peopleAnalysisCardsOpen || combinedAnalysisCardsOpen || derivedStrategyCardsOpen) ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {(jobAnalysisCardsOpen || peopleAnalysisCardsOpen || combinedAnalysisCardsOpen || derivedStrategyCardsOpen) && (
              <div className="p-4 max-h-[80vh] overflow-y-auto bg-slate-950 dark:bg-slate-900 space-y-3">
                {/* Group 1: Job Analysis Cards */}
                {jobAnalysisCards && (
                  <div className="border border-green-500/40 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setJobAnalysisCardsOpen(!jobAnalysisCardsOpen)}
                      className="w-full flex items-center justify-between p-2 hover:bg-slate-800 transition-colors bg-green-950/20"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🟢</span>
                        <span className="text-xs font-semibold text-white">
                          Job Analysis (5 cards)
                        </span>
                      </div>
                      {jobAnalysisCardsOpen ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    {jobAnalysisCardsOpen && (
                      <div className="p-3 bg-slate-900">
                        <pre className="text-[9px] overflow-x-auto text-slate-300 max-h-[40vh] overflow-y-auto">
                          {JSON.stringify(jobAnalysisCards, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Group 2: People Analysis Cards */}
                {peopleAnalysisCards && (
                  <div className="border border-blue-500/40 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setPeopleAnalysisCardsOpen(!peopleAnalysisCardsOpen)}
                      className="w-full flex items-center justify-between p-2 hover:bg-slate-800 transition-colors bg-blue-950/20"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🔵</span>
                        <span className="text-xs font-semibold text-white">
                          People Analysis (1 card)
                        </span>
                      </div>
                      {peopleAnalysisCardsOpen ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    {peopleAnalysisCardsOpen && (
                      <div className="p-3 bg-slate-900">
                        <pre className="text-[9px] overflow-x-auto text-slate-300 max-h-[40vh] overflow-y-auto">
                          {JSON.stringify(peopleAnalysisCards, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Group 3: Combined Analysis Cards */}
                {combinedAnalysisCards && (
                  <div className="border border-amber-500/40 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setCombinedAnalysisCardsOpen(!combinedAnalysisCardsOpen)}
                      className="w-full flex items-center justify-between p-2 hover:bg-slate-800 transition-colors bg-amber-950/20"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🟠</span>
                        <span className="text-xs font-semibold text-white">
                          Combined Analysis (4 cards)
                        </span>
                      </div>
                      {combinedAnalysisCardsOpen ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    {combinedAnalysisCardsOpen && (
                      <div className="p-3 bg-slate-900">
                        <pre className="text-[9px] overflow-x-auto text-slate-300 max-h-[40vh] overflow-y-auto">
                          {JSON.stringify(combinedAnalysisCards, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Group 4: Derived Strategy Cards */}
                {derivedStrategyCards && (
                  <div className="border border-purple-500/40 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setDerivedStrategyCardsOpen(!derivedStrategyCardsOpen)}
                      className="w-full flex items-center justify-between p-2 hover:bg-slate-800 transition-colors bg-purple-950/20"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🟣</span>
                        <span className="text-xs font-semibold text-white">
                          Derived Strategy (3 cards)
                        </span>
                      </div>
                      {derivedStrategyCardsOpen ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    {derivedStrategyCardsOpen && (
                      <div className="p-3 bg-slate-900">
                        <pre className="text-[9px] overflow-x-auto text-slate-300 max-h-[40vh] overflow-y-auto">
                          {JSON.stringify(derivedStrategyCards, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apify Results Debug Panel - Shows similar jobs and candidates */}
      {(similarJobs.length > 0 || candidates.length > 0) && (
        <div className="fixed right-4 z-[10000] max-w-md" style={{ 
          top: jobAnalysisCards ? 'calc(20px + 520px)' : '80px' 
        }}>
          <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-cyan-500 overflow-hidden">
            <button
              onClick={() => setApifyResultsOpen(!apifyResultsOpen)}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors bg-cyan-950/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔷</span>
                <span className="text-sm font-semibold text-white">
                  Apify Results
                </span>
                {similarJobs.length > 0 && (
                  <span className="px-2 py-0.5 bg-cyan-600/20 border border-cyan-500/40 rounded text-cyan-300 text-[10px] font-bold">
                    {similarJobs.length} JOBS
                  </span>
                )}
                {candidates.length > 0 && (
                  <span className="px-2 py-0.5 bg-cyan-600/20 border border-cyan-500/40 rounded text-cyan-300 text-[10px] font-bold">
                    {candidates.length} CANDIDATES
                  </span>
                )}
              </div>
              {apifyResultsOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {apifyResultsOpen && (
              <div className="p-4 max-h-[80vh] overflow-y-auto bg-slate-950 dark:bg-slate-900 space-y-3">
                {/* Similar Jobs Section */}
                {similarJobs.length > 0 && (
                  <div className="border border-cyan-500/40 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setApifyJobsOpen(!apifyJobsOpen)}
                      className="w-full flex items-center justify-between p-2 hover:bg-slate-800 transition-colors bg-cyan-950/20"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">💼</span>
                        <span className="text-xs font-semibold text-white">
                          Similar Jobs ({similarJobs.length})
                        </span>
                        <span className="px-2 py-0.5 bg-cyan-600/20 border border-cyan-500/40 rounded text-cyan-300 text-[9px] font-bold">
                          LI: {similarJobs.filter(j => j.platform === "linkedin" || !j.platform).length} | IN: {similarJobs.filter(j => j.platform === "indeed").length}
                        </span>
                      </div>
                      {apifyJobsOpen ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    {apifyJobsOpen && (
                      <div className="p-3 bg-slate-900">
                        <pre className="text-[9px] overflow-x-auto text-slate-300 max-h-[40vh] overflow-y-auto">
                          {JSON.stringify(similarJobs, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Candidates Section */}
                {candidates.length > 0 && (
                  <div className="border border-cyan-500/40 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setApifyCandidatesOpen(!apifyCandidatesOpen)}
                      className="w-full flex items-center justify-between p-2 hover:bg-slate-800 transition-colors bg-cyan-950/20"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">👥</span>
                        <span className="text-xs font-semibold text-white">
                          Candidates ({candidates.length})
                        </span>
                      </div>
                      {apifyCandidatesOpen ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    {apifyCandidatesOpen && (
                      <div className="p-3 bg-slate-900">
                        <pre className="text-[9px] overflow-x-auto text-slate-300 max-h-[40vh] overflow-y-auto">
                          {JSON.stringify(candidates, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Data Sources Debug Panel - Glassdoor, Levels.fyi, Crunchbase, GitHub */}
      {additionalDataSources && (
        <div className="fixed left-4 z-[10000] max-w-md" style={{ 
          top: '80px' 
        }}>
          <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-emerald-500 overflow-hidden">
            <button
              onClick={() => setDataSourcesOpen(!dataSourcesOpen)}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors bg-emerald-950/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span className="text-sm font-semibold text-white">
                  Data Sources
                </span>
                {additionalDataSources.glassdoorSalaries?.length > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-500/40 rounded text-emerald-300 text-[10px] font-bold">
                    GD
                  </span>
                )}
                {additionalDataSources.levelsFyiSalaries?.length > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-500/40 rounded text-emerald-300 text-[10px] font-bold">
                    LVL
                  </span>
                )}
                {additionalDataSources.companyData && (
                  <span className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-500/40 rounded text-emerald-300 text-[10px] font-bold">
                    CB
                  </span>
                )}
                {additionalDataSources.githubTalent?.length > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-500/40 rounded text-emerald-300 text-[10px] font-bold">
                    GH
                  </span>
                )}
              </div>
              {dataSourcesOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {dataSourcesOpen && (
              <div className="p-4 max-h-[80vh] overflow-y-auto bg-slate-950 dark:bg-slate-900 space-y-3">
                {/* Glassdoor Salaries */}
                {additionalDataSources.glassdoorSalaries?.length > 0 && (
                  <div className="border border-emerald-500/40 rounded-lg overflow-hidden">
                    <div className="p-2 bg-emerald-950/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">💰</span>
                        <span className="text-xs font-semibold text-white">
                          Glassdoor Salaries ({additionalDataSources.glassdoorSalaries.length})
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900">
                      {additionalDataSources.glassdoorSalaries.map((salary: any, idx: number) => (
                        <div key={idx} className="text-[10px] text-slate-300 mb-2">
                          <div className="text-emerald-400 font-semibold">{salary.jobTitle}</div>
                          <div>Range: ${salary.baseSalary?.min?.toLocaleString()} - ${salary.baseSalary?.max?.toLocaleString()}</div>
                          <div>Median: ${salary.baseSalary?.median?.toLocaleString()}</div>
                          <div className="text-slate-500">Source: {salary.source}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Levels.fyi Salaries */}
                {additionalDataSources.levelsFyiSalaries?.length > 0 && (
                  <div className="border border-blue-500/40 rounded-lg overflow-hidden">
                    <div className="p-2 bg-blue-950/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">📈</span>
                        <span className="text-xs font-semibold text-white">
                          Levels.fyi ({additionalDataSources.levelsFyiSalaries.length} companies)
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900">
                      {additionalDataSources.levelsFyiSalaries.map((salary: any, idx: number) => (
                        <div key={idx} className="text-[10px] text-slate-300 mb-2">
                          <div className="text-blue-400 font-semibold">{salary.company}</div>
                          <div>Total Comp: ${salary.totalCompensation?.toLocaleString()}</div>
                          <div>Base: ${salary.baseSalary?.toLocaleString()} | Stock: ${salary.stockGrant?.toLocaleString()}</div>
                          <div className="text-slate-500">Source: {salary.source}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crunchbase Company Data */}
                {additionalDataSources.companyData && (
                  <div className="border border-purple-500/40 rounded-lg overflow-hidden">
                    <div className="p-2 bg-purple-950/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🏢</span>
                        <span className="text-xs font-semibold text-white">
                          Crunchbase: {additionalDataSources.companyData.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900 text-[10px] text-slate-300">
                      <div>Employees: {additionalDataSources.companyData.employeeCount}</div>
                      <div>Funding: ${(additionalDataSources.companyData.funding?.totalRaised / 1000000).toFixed(1)}M</div>
                      <div>Last Round: {additionalDataSources.companyData.funding?.lastRound}</div>
                      <div>Industry: {additionalDataSources.companyData.industry?.join(", ")}</div>
                      <div className="text-slate-500">Source: {additionalDataSources.companyData.source}</div>
                    </div>
                  </div>
                )}

                {/* GitHub Talent */}
                {additionalDataSources.githubTalent?.length > 0 && (
                  <div className="border border-orange-500/40 rounded-lg overflow-hidden">
                    <div className="p-2 bg-orange-950/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">👨‍💻</span>
                        <span className="text-xs font-semibold text-white">
                          GitHub Talent ({additionalDataSources.githubTalent.length})
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900">
                      {additionalDataSources.githubTalent.slice(0, 5).map((dev: any, idx: number) => (
                        <div key={idx} className="text-[10px] text-slate-300 mb-2">
                          <div className="text-orange-400 font-semibold">{dev.name} (@{dev.username})</div>
                          <div>Followers: {dev.followers} | Repos: {dev.publicRepos}</div>
                          <div className="text-slate-500">{dev.location || "Location unknown"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Industry Benchmarks */}
                {additionalDataSources.benchmarks && (
                  <div className="border border-amber-500/40 rounded-lg overflow-hidden">
                    <div className="p-2 bg-amber-950/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">📉</span>
                        <span className="text-xs font-semibold text-white">
                          Industry Benchmarks
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900 text-[10px] text-slate-300">
                      <div>Applicants/Hire: {additionalDataSources.benchmarks.funnelMetrics?.applicantsPerHire}</div>
                      <div>Phone Screen Pass: {(additionalDataSources.benchmarks.funnelMetrics?.phoneScreenPassRate * 100).toFixed(0)}%</div>
                      <div>Onsite Pass: {(additionalDataSources.benchmarks.funnelMetrics?.onsitePassRate * 100).toFixed(0)}%</div>
                      <div>Time to Hire: {additionalDataSources.benchmarks.funnelMetrics?.averageTimeToHire} days</div>
                      <div className="text-slate-500">Source: {additionalDataSources.benchmarks.source}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Scrape Debug Panel - Shows 10 extracted fields */}
      <div className="fixed top-20 left-4 z-[10000] max-w-md" style={{ marginTop: additionalDataSources ? '60px' : '0' }}>
          <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-blue-500 overflow-hidden">
            <button
              onClick={() => setQuickScrapeDebugOpen(!quickScrapeDebugOpen)}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors bg-blue-950/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔵</span>
                <span className="text-sm font-semibold text-white">
                  Quick Scrape: 10 Fields
                </span>
                {quickScrapeData?.hasMissingFields && (
                  <span className="px-2 py-0.5 bg-amber-600/20 border border-amber-500/40 rounded text-amber-300 text-[10px] font-bold">
                    {quickScrapeData.missingFields?.length || 0} MISSING
                  </span>
                )}
                {quickScrapeLoading && (
                  <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/40 rounded text-blue-300 text-[10px] font-bold">
                    SCRAPING...
                  </span>
                )}
                {quickScrapeError && (
                  <span className="px-2 py-0.5 bg-red-600/20 border border-red-500/40 rounded text-red-300 text-[10px] font-bold">
                    ERROR
                  </span>
                )}
              </div>
              {quickScrapeDebugOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {quickScrapeDebugOpen && (
              <div className="p-4 max-h-[80vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                <div className="space-y-3 text-xs font-mono">
                  {/* Show error if scraping failed */}
                  {quickScrapeError && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded">
                      <div className="text-red-400 font-semibold mb-1">❌ Scraping Error:</div>
                      <div className="text-red-300 text-xs">{quickScrapeError}</div>
                    </div>
                  )}

                  {/* Show loading state */}
                  {quickScrapeLoading && !quickScrapeData && (
                    <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded text-center">
                      <div className="text-blue-400 font-semibold">🔄 Scraping in progress...</div>
                    </div>
                  )}

                  {/* 10 Required Fields - Only show if we have data */}
                  {quickScrapeData ? (
                    <>
                      <div className="pb-2 border-b border-slate-700">
                        <div className="text-blue-400 font-semibold mb-2">10 Required Fields:</div>
                      </div>

                      {/* Role Title */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">1. Role Title:</div>
                        <div className={`text-slate-300 ${quickScrapeData.extractedFields?.roleTitle ? '' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.roleTitle || "❌ Missing"}
                        </div>
                      </div>

                      {/* Department */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">2. Department:</div>
                        <div className={`text-slate-300 ${quickScrapeData.extractedFields?.department ? '' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.department || "❌ Missing"}
                        </div>
                      </div>

                      {/* Experience Level */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">3. Experience Level:</div>
                        <div className={`text-slate-300 ${quickScrapeData.extractedFields?.experienceLevel ? '' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.experienceLevel || "❌ Missing"}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">4. Location:</div>
                        <div className={`text-slate-300 ${quickScrapeData.extractedFields?.location ? '' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.location || "❌ Missing"}
                        </div>
                      </div>

                      {/* Work Model */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">5. Work Model:</div>
                        <div className={`text-slate-300 ${quickScrapeData.extractedFields?.workModel ? '' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.workModel || "❌ Missing"}
                        </div>
                      </div>

                      {/* Critical Skills */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">6. Critical Skills:</div>
                        {quickScrapeData.extractedFields?.criticalSkills && Array.isArray(quickScrapeData.extractedFields.criticalSkills) && quickScrapeData.extractedFields.criticalSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {quickScrapeData.extractedFields.criticalSkills.map((skill: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/40 rounded text-blue-300 text-[10px]">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-red-400">❌ Missing</div>
                        )}
                      </div>

                      {/* Salary Range */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">7. Salary Range:</div>
                        {quickScrapeData.extractedFields?.minSalary && quickScrapeData.extractedFields?.maxSalary ? (
                          <div className="text-slate-300">
                            ${parseInt(quickScrapeData.extractedFields.minSalary).toLocaleString()} - ${parseInt(quickScrapeData.extractedFields.maxSalary).toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-red-400">❌ Missing</div>
                        )}
                      </div>

                      {/* Non-Negotiables */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">8. Non-Negotiables:</div>
                        <div className={`text-slate-300 ${quickScrapeData.extractedFields?.nonNegotiables ? '' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.nonNegotiables || "❌ Missing"}
                        </div>
                      </div>

                      {/* Flexible Requirements */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">9. Flexible Requirements:</div>
                        <div className={`text-slate-300 ${quickScrapeData.extractedFields?.flexible ? '' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.flexible || "❌ Missing"}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <div className="text-green-400 font-semibold mb-1">10. Timeline:</div>
                        <div className={`text-slate-300 ${quickScrapeData.extractedFields?.timeline ? '' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.timeline || "❌ Missing"}
                        </div>
                      </div>

                      {/* Missing Fields Summary */}
                      {quickScrapeData.missingFields && quickScrapeData.missingFields.length > 0 && (
                        <div className="pt-3 border-t border-slate-700">
                          <div className="text-amber-400 font-semibold mb-2">
                            Missing Fields ({quickScrapeData.missingFields.length}):
                          </div>
                          <ul className="list-disc list-inside text-amber-300 space-y-1">
                            {quickScrapeData.missingFields.map((field: string, idx: number) => (
                              <li key={idx}>{field}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Show message if no data yet */
                    !quickScrapeLoading && !quickScrapeError && (
                      <div className="text-slate-400 text-center py-4">
                        <div className="mb-2">📋 Paste a job URL in the input field</div>
                        <div className="text-[10px] text-slate-500">
                          The panel will automatically scrape and show the 10 required fields
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Debug Panels - Collapsible and Absolutely Positioned */}
      {scrapedData && (
        <div className="fixed bottom-4 right-4 z-[100] max-w-md space-y-2">
          {/* Debug: Scraped Data Panel */}
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

                  {/* Platform Detected */}
                  {platform && platform !== "unknown" && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">Platform Detected:</div>
                      <div className="flex items-center gap-2">
                        {platform === "linkedin" && (
                          <span className="px-2 py-1 bg-blue-600/20 border border-blue-500/40 rounded text-blue-300 text-[10px] font-bold">
                            🔵 LINKEDIN
                          </span>
                        )}
                        {platform === "indeed" && (
                          <span className="px-2 py-1 bg-orange-600/20 border border-orange-500/40 rounded text-orange-300 text-[10px] font-bold">
                            🟠 INDEED
                          </span>
                        )}
                      </div>
                    </div>
                  )}

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

          {/* Candidates Panel - LinkedIn People Profiles */}
          {candidates.length > 0 && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setCandidatesOpen(!candidatesOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">
                    Candidates
                  </span>
                  <span className="px-2 py-0.5 bg-purple-600/20 border border-purple-500/40 rounded text-purple-300 text-[10px] font-bold">
                    {candidates.length} PEOPLE
                  </span>
                </div>
                {candidatesOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Collapsible Content */}
              {candidatesOpen && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                  <div className="space-y-4 text-xs">
                    {candidates.map((person, index) => (
                      <div
                        key={person.id}
                        className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        {/* Person Header */}
                        <div className="flex items-start gap-3 mb-2">
                          {person.avatar && (
                            <img
                              src={person.avatar}
                              alt={`${person.firstName} ${person.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-sm mb-1">
                              {person.firstName} {person.lastName}
                              {person.premium && (
                                <span className="ml-1 text-yellow-400 text-xs">⭐</span>
                              )}
                              {person.openToWork && (
                                <span className="ml-1 px-1.5 py-0.5 bg-green-600/20 border border-green-500/40 rounded text-green-300 text-[9px]">
                                  OPEN TO WORK
                                </span>
                              )}
                            </h3>
                            <p className="text-slate-400 text-xs line-clamp-2">
                              {person.headline}
                            </p>
                          </div>
                        </div>

                        {/* Current Company */}
                        {person.currentCompany && (
                          <div className="text-slate-300 text-xs mb-2">
                            <span className="text-slate-500">Company:</span> {person.currentCompany.name}
                          </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-2 text-slate-300 mb-2">
                          <span className="text-[10px]">📍</span>
                          <span className="text-xs">
                            {person.location.linkedinText}
                          </span>
                        </div>

                        {/* Top Skills */}
                        {person.topSkills && (
                          <div className="mb-2">
                            <div className="text-slate-500 text-[10px] mb-1">
                              Skills:
                            </div>
                            <div className="text-slate-300 text-xs">
                              {person.topSkills}
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-slate-400 text-[10px] mb-2">
                          {person.connections !== undefined && (
                            <span>🤝 {person.connections}+ connections</span>
                          )}
                          {person.followers !== undefined && (
                            <span>👥 {person.followers} followers</span>
                          )}
                        </div>

                        {/* Link */}
                        <a
                          href={person.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-purple-400 hover:text-purple-300 text-xs underline"
                        >
                          View Profile on LinkedIn →
                        </a>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="pt-3 border-t border-slate-700">
                      <div className="text-slate-400 text-xs text-center">
                        Found {candidates.length} candidates on LinkedIn
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LinkedIn Jobs Panel */}
          {linkedInJobsCount > 0 && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-blue-500/40 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setLinkedInJobsOpen(!linkedInJobsOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    🔵 LinkedIn Jobs
                  </span>
                  <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/40 rounded text-blue-300 text-[10px] font-bold">
                    {linkedInJobsCount} JOBS
                  </span>
                </div>
                {linkedInJobsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Collapsible Content */}
              {linkedInJobsOpen && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                  {/* Raw JSON Display */}
                  <div className="mb-4">
                    <div className="text-blue-400 font-semibold text-xs mb-2">
                      Raw LinkedIn Jobs Array:
                    </div>
                    <pre className="bg-slate-900 border border-slate-700 rounded p-3 text-[10px] overflow-x-auto text-slate-300 max-h-[50vh] overflow-y-auto">
                      {JSON.stringify(
                        similarJobs.filter(job => job.platform === "linkedin"),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Indeed Jobs Panel */}
          {indeedJobsCount > 0 && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-orange-500/40 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setIndeedJobsOpen(!indeedJobsOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    🟠 Indeed Jobs
                  </span>
                  <span className="px-2 py-0.5 bg-orange-600/20 border border-orange-500/40 rounded text-orange-300 text-[10px] font-bold">
                    {indeedJobsCount} JOBS
                  </span>
                </div>
                {indeedJobsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Collapsible Content */}
              {indeedJobsOpen && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                  {/* Raw JSON Display */}
                  <div className="mb-4">
                    <div className="text-orange-400 font-semibold text-xs mb-2">
                      Raw Indeed Jobs Array:
                    </div>
                    <pre className="bg-slate-900 border border-slate-700 rounded p-3 text-[10px] overflow-x-auto text-slate-300 max-h-[50vh] overflow-y-auto">
                      {JSON.stringify(
                        similarJobs.filter(job => job.platform === "indeed"),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================= */}
          {/* AI-GENERATED CARD GROUPS */}
          {/* ========================================= */}

          {/* Group 1: Job Analysis Cards (5 cards) */}
          {jobAnalysisCards && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-green-500/40 overflow-hidden">
              <button
                onClick={() => setJobAnalysisCardsOpen(!jobAnalysisCardsOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟢</span>
                  <span className="text-sm font-semibold text-white">
                    Job Analysis Cards (AI)
                  </span>
                  <span className="px-2 py-0.5 bg-green-600/20 border border-green-500/40 rounded text-green-300 text-[10px] font-bold">
                    5 CARDS
                  </span>
                </div>
                {jobAnalysisCardsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {jobAnalysisCardsOpen && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                  <div className="text-green-400 font-semibold text-xs mb-2">
                    Role, Skill, Message, Outreach, Fit Cards:
                  </div>
                  <pre className="bg-slate-900 border border-slate-700 rounded p-3 text-[10px] overflow-x-auto text-slate-300 max-h-[50vh] overflow-y-auto">
                    {JSON.stringify(jobAnalysisCards, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Group 2: People Analysis Cards (1 card) */}
          {peopleAnalysisCards && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-blue-500/40 overflow-hidden">
              <button
                onClick={() => setPeopleAnalysisCardsOpen(!peopleAnalysisCardsOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔵</span>
                  <span className="text-sm font-semibold text-white">
                    People Analysis Cards (AI)
                  </span>
                  <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/40 rounded text-blue-300 text-[10px] font-bold">
                    1 CARD
                  </span>
                </div>
                {peopleAnalysisCardsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {peopleAnalysisCardsOpen && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                  <div className="text-blue-400 font-semibold text-xs mb-2">
                    Talent Map Card:
                  </div>
                  <pre className="bg-slate-900 border border-slate-700 rounded p-3 text-[10px] overflow-x-auto text-slate-300 max-h-[50vh] overflow-y-auto">
                    {JSON.stringify(peopleAnalysisCards, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Group 3: Combined Analysis Cards (4 cards) */}
          {combinedAnalysisCards && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-amber-500/40 overflow-hidden">
              <button
                onClick={() => setCombinedAnalysisCardsOpen(!combinedAnalysisCardsOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟠</span>
                  <span className="text-sm font-semibold text-white">
                    Combined Analysis Cards (AI)
                  </span>
                  <span className="px-2 py-0.5 bg-amber-600/20 border border-amber-500/40 rounded text-amber-300 text-[10px] font-bold">
                    4 CARDS
                  </span>
                </div>
                {combinedAnalysisCardsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {combinedAnalysisCardsOpen && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                  <div className="text-amber-400 font-semibold text-xs mb-2">
                    Market, Pay, Funnel, Reality Cards:
                  </div>
                  <pre className="bg-slate-900 border border-slate-700 rounded p-3 text-[10px] overflow-x-auto text-slate-300 max-h-[50vh] overflow-y-auto">
                    {JSON.stringify(combinedAnalysisCards, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Group 4: Derived Strategy Cards (3 cards) */}
          {derivedStrategyCards && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-purple-500/40 overflow-hidden">
              <button
                onClick={() => setDerivedStrategyCardsOpen(!derivedStrategyCardsOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟣</span>
                  <span className="text-sm font-semibold text-white">
                    Derived Strategy Cards (AI)
                  </span>
                  <span className="px-2 py-0.5 bg-purple-600/20 border border-purple-500/40 rounded text-purple-300 text-[10px] font-bold">
                    3 CARDS
                  </span>
                </div>
                {derivedStrategyCardsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {derivedStrategyCardsOpen && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                  <div className="text-purple-400 font-semibold text-xs mb-2">
                    Interview, Scorecard, Plan Cards:
                  </div>
                  <pre className="bg-slate-900 border border-slate-700 rounded p-3 text-[10px] overflow-x-auto text-slate-300 max-h-[50vh] overflow-y-auto">
                    {JSON.stringify(derivedStrategyCards, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* OLD Combined View - REMOVED */}
          {false && similarJobs.length > 0 && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => {}}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    Old View
                  </span>
                </div>
              </button>

              {/* Collapsible Content */}
              {false && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950 dark:bg-slate-900">
                  <div className="space-y-4 text-xs">
                    {similarJobs.map((job, index) => (
                      <div
                        key={`${job.platform || 'unknown'}-${job.id}-${index}`}
                        className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        {/* Job Header */}
                        <div className="flex items-start gap-3 mb-2">
                          {job.company.logo && (
                            <img
                              src={job.company.logo}
                              alt={job.company.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-sm mb-1 truncate">
                              {job.title}
                            </h3>
                            <p className="text-slate-400 text-xs">
                              {job.company.name}
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-slate-300 mb-2">
                          <span className="text-[10px]">📍</span>
                          <span className="text-xs">
                            {job.location.linkedinText || `${job.location.city || ''}${job.location.state ? ', ' + job.location.state : ''}${job.location.country ? ', ' + job.location.country : ''}`}
                          </span>
                        </div>

                        {/* Job Details */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {job.workplaceType && (
                            <span className="px-2 py-0.5 bg-purple-600/20 border border-purple-500/40 rounded text-purple-300 text-[10px]">
                              {job.workplaceType}
                            </span>
                          )}
                          {job.employmentType && (
                            <span className="px-2 py-0.5 bg-green-600/20 border border-green-500/40 rounded text-green-300 text-[10px]">
                              {typeof job.employmentType === 'string' ? job.employmentType.replace(/_/g, "-") : job.employmentType}
                            </span>
                          )}
                        </div>

                        {/* Salary */}
                        {job.salary && (
                          <div className="text-green-400 font-semibold text-xs mb-2">
                            💰 {typeof job.salary === 'string' ? job.salary : (job.salary.text || job.salary.salaryText || `${job.salary.salaryMin || ''} - ${job.salary.salaryMax || ''}`)}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-slate-400 text-[10px] mb-2">
                          {job.applicants !== undefined && (
                            <span>👥 {job.applicants} applicants</span>
                          )}
                          {job.views !== undefined && (
                            <span>👁️ {job.views} views</span>
                          )}
                        </div>

                        {/* Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                          <div className="mb-2">
                            <div className="text-slate-500 text-[10px] mb-1">
                              Benefits:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {job.benefits.slice(0, 3).map((benefit, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300 text-[9px]"
                                >
                                  {benefit}
                                </span>
                              ))}
                              {job.benefits.length > 3 && (
                                <span className="text-slate-500 text-[9px]">
                                  +{job.benefits.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Platform Badge */}
                        <div className="mb-2">
                          {job.platform === "linkedin" && (
                            <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/40 rounded text-blue-300 text-[9px] font-bold">
                              LINKEDIN
                            </span>
                          )}
                          {job.platform === "indeed" && (
                            <span className="px-2 py-0.5 bg-orange-600/20 border border-orange-500/40 rounded text-orange-300 text-[9px] font-bold">
                              INDEED
                            </span>
                          )}
                        </div>

                        {/* Link */}
                        <a
                          href={job.linkedinUrl || job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-blue-400 hover:text-blue-300 text-xs underline"
                        >
                          {job.platform === "linkedin" ? "View on LinkedIn →" : "View on Indeed →"}
                        </a>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="pt-3 border-t border-slate-700">
                      <div className="text-slate-400 text-xs text-center space-y-1">
                        <div className="font-semibold text-white">
                          Found {similarJobs.length} similar jobs total
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          {linkedInJobsCount > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="px-1.5 py-0.5 bg-blue-600/20 border border-blue-500/40 rounded text-blue-300 text-[9px] font-bold">
                                LINKEDIN
                              </span>
                              <span>{linkedInJobsCount}</span>
                            </div>
                          )}
                          {indeedJobsCount > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="px-1.5 py-0.5 bg-orange-600/20 border border-orange-500/40 rounded text-orange-300 text-[9px] font-bold">
                                INDEED
                              </span>
                              <span>{indeedJobsCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Warnings Display */}
      {warnings.length > 0 && (
        <div className="fixed top-4 right-4 z-[100] max-w-md">
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 shadow-2xl">
            <div className="flex items-start gap-2">
              <div className="text-yellow-400 font-semibold text-sm">⚠️ Warning:</div>
              <div className="text-yellow-200 text-xs flex-1">
                {warnings.map((warning, idx) => (
                  <div key={idx}>{warning}</div>
                ))}
              </div>
              <button
                onClick={() => setWarnings([])}
                className="text-yellow-400 hover:text-yellow-300 text-xl leading-none"
              >
                ×
              </button>
            </div>
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
