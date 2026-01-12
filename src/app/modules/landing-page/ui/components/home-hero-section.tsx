"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollMorphHero from "@/app/modules/landing-page/ui/components/scroll-morph-hero";
import { heroCards } from "./hero-cards-data";
import Loader1 from "./loader1";
import ConversationalChatbotModal from "@/components/ConversationalChatbotModal";
import MissingFieldsModal from "@/components/MissingFieldsModal";
// Import card components for dynamic rendering
import { EditableRoleCard } from "@/components/cards/EditableRoleCard";
import { EditableSkillCard } from "@/components/cards/EditableSkillCard";
import { EditableFitCard } from "@/components/cards/EditableFitCard";
import { EditableMessageCard } from "@/components/cards/EditableMessageCard";
import { EditableOutreachCard } from "@/components/cards/EditableOutreachCard";
import { EditableTalentMapCard } from "@/components/cards/EditableTalentMapCard";
import { EditableMarketCard } from "@/components/cards/EditableMarketCard";
import { EditablePayCard } from "@/components/cards/EditablePayCard";
import { EditableFunnelCard } from "@/components/cards/EditableFunnelCard";
import { EditableRealityCard } from "@/components/cards/EditableRealityCard";
import { EditableInterviewCard } from "@/components/cards/EditableInterviewCard";
import { EditableScorecardCard } from "@/components/cards/EditableScorecardCard";
import { EditablePlanCard } from "@/components/cards/EditablePlanCard";

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
  experience?: unknown[];
  education?: unknown[];
  certifications?: unknown[];
  projects?: unknown[];
}

export const HomeHeroSection = () => {
  const router = useRouter();
  const [roleDescription, setRoleDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiCompleted, setApiCompleted] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedJobData | null>(null);
  const [similarJobs, setSimilarJobs] = useState<ApifyJobData[]>([]);
  const [candidates, setCandidates] = useState<ApifyPeopleData[]>([]);
  const [linkedInJobsCount, setLinkedInJobsCount] = useState(0);
  const [indeedJobsCount, setIndeedJobsCount] = useState(0);
  const [glassdoorJobsCount, setGlassdoorJobsCount] = useState(0);
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
  
  const [jobAnalysisCards, setJobAnalysisCards] = useState<Record<string, unknown> | null>(null);
  const [peopleAnalysisCards, setPeopleAnalysisCards] = useState<Record<string, unknown> | null>(null);
  const [combinedAnalysisCards, setCombinedAnalysisCards] = useState<Record<string, unknown> | null>(null);
  const [derivedStrategyCards, setDerivedStrategyCards] = useState<Record<string, unknown> | null>(null);
  
  // Additional data sources state
  const [additionalDataSources, setAdditionalDataSources] = useState<Record<string, unknown> | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [extractedFields, setExtractedFields] = useState<Record<string, unknown> | null>(null);
  const [missingFieldsModalOpen, setMissingFieldsModalOpen] = useState(false);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  
  // Quick scrape state for real-time scraping (removed automatic scraping)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quickScrapeData, setQuickScrapeData] = useState<Record<string, unknown> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quickScrapeLoading, setQuickScrapeLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Removed automatic scraping on URL detection
  // Scraping now only happens when user clicks the submit button
  // This prevents double scraping (automatic + button click)

  const proceedToResults = () => {
    console.log("📊 Proceeding to results page");
    // Store data in sessionStorage for results page
    const formData = {
      scrapedData,
      similarJobs,
      candidates,
      linkedInJobsCount,
      indeedJobsCount,
      glassdoorJobsCount,
      platform,
      extractedFields,
      jobAnalysisCards, // Include AI-generated cards
      peopleAnalysisCards,
      combinedAnalysisCards,
      derivedStrategyCards,
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
      glassdoorJobsCount,
      platform,
      extractedFields,
      jobAnalysisCards, // Include AI-generated cards
      peopleAnalysisCards,
      combinedAnalysisCards,
      derivedStrategyCards,
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

  /**
   * Check if completed fields affect Apify scraping
   * Fields that affect Apify: roleTitle (job title), location, company
   */
  const doCompletedFieldsAffectApify = (
    originalFields: Record<string, unknown> | null,
    completedFields: Record<string, unknown>
  ): boolean => {
    // Fields that affect Apify scraping
    const apifyAffectingFields = ['roleTitle', 'location'];
    
    // Check if any completed field is different from original and affects Apify
    for (const field of apifyAffectingFields) {
      const originalValue = originalFields?.[field];
      const completedValue = completedFields[field];
      
      // If field was completed and is different from original, it affects Apify
      if (completedValue && completedValue !== originalValue) {
        console.log(`🔄 Field "${field}" changed: "${originalValue}" → "${completedValue}" - will redo Apify scraping`);
        return true;
      }
      
      // If field was missing and now provided, it affects Apify
      if (!originalValue && completedValue) {
        console.log(`🔄 Field "${field}" was missing, now provided: "${completedValue}" - will redo Apify scraping`);
        return true;
      }
    }
    
    // Company also affects salary data (optional but improves accuracy)
    const originalCompany = scrapedData?.company || originalFields?.company;
    const completedCompany = completedFields.company;
    if (completedCompany && completedCompany !== originalCompany) {
      console.log(`🔄 Company changed: "${originalCompany}" → "${completedCompany}" - will redo salary data`);
      return true;
    }
    
    console.log("✅ Completed fields don't affect Apify scraping - using existing data");
    return false;
  };

  const handleChatbotComplete = async (completedData: Record<string, unknown>) => {
    console.log("✅ Chatbot completed with data:", completedData);
    console.log("📊 Current extractedFields:", extractedFields);
    console.log("📊 Current scrapedData:", scrapedData);
    console.log("📊 Current roleDescription:", roleDescription);
    
    // If no initial scraping has been done yet, trigger it now with completed fields
    if (!scrapedData && roleDescription.trim()) {
      console.log("🚀 No initial scraping done yet - starting full scrape with completed fields");
      setChatbotModalOpen(false);
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
      
      try {
        const response = await fetch("/api/scrape-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: roleDescription.trim(),
            extractedFields: completedData, // Use completed fields
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to scrape job");
        }
        
        const result = await response.json();
        
        // Update all state with new data
        setScrapedData(result.data);
        setSimilarJobs(result.similarJobs || []);
        setCandidates(result.candidates || []);
        setLinkedInJobsCount(result.linkedInJobsCount || 0);
        setIndeedJobsCount(result.indeedJobsCount || 0);
        setGlassdoorJobsCount(result.glassdoorJobsCount || 0);
        setJobAnalysisCards(result.jobAnalysisCards || null);
        setPeopleAnalysisCards(result.peopleAnalysisCards || null);
        setCombinedAnalysisCards(result.combinedAnalysisCards || null);
        setDerivedStrategyCards(result.derivedStrategyCards || null);
        setExtractedFields(result.extractedFields || completedData);
        setAdditionalDataSources(result.dataSources || null);
        
        // Save to sessionStorage
        const formData = {
          scrapedData: result.data,
          similarJobs: result.similarJobs || [],
          candidates: result.candidates || [],
          linkedInJobsCount: result.linkedInJobsCount || 0,
          indeedJobsCount: result.indeedJobsCount || 0,
          glassdoorJobsCount: result.glassdoorJobsCount || 0,
          platform: result.platform,
          extractedFields: result.extractedFields || completedData,
          jobAnalysisCards: result.jobAnalysisCards,
          peopleAnalysisCards: result.peopleAnalysisCards,
          combinedAnalysisCards: result.combinedAnalysisCards,
          derivedStrategyCards: result.derivedStrategyCards,
        };
        sessionStorage.setItem("scrapedJobData", JSON.stringify(formData));
        
        // Hide loading and navigate to results
        setIsLoading(false);
        document.body.style.overflow = 'auto';
        router.push("/results");
        return; // Exit early
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to scrape job";
        console.error("❌ Error scraping job:", error);
        setError(errorMessage);
        setIsLoading(false);
        document.body.style.overflow = 'auto';
        return;
      }
    }
    
    // If initial scraping was already done, merge and check if we need to refresh
    // Merge completed data with extracted fields
    const mergedData = {
      ...extractedFields,
      ...completedData,
    };
    console.log("🔄 Merged data:", mergedData);
    
    // Check if completed fields affect Apify scraping
    const needsApifyRefresh = doCompletedFieldsAffectApify(extractedFields, completedData);
    console.log("🔄 Needs Apify refresh:", needsApifyRefresh);
    
    if (needsApifyRefresh) {
      // Fields affect Apify - need to redo scraping and card generation (2+ minutes)
      console.log("🔄 Completed fields affect Apify - redoing scraping and card generation");
      setChatbotModalOpen(false);
      // Keep loading screen visible for 2+ minutes
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
      
      try {
        // Call scrape-job API again with updated fields
        // Use the original job URL if available, or use the merged data
        const jobURL = scrapedData?.url || roleDescription;
        
        const response = await fetch("/api/scrape-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: jobURL,
            // Pass merged extracted fields to update the data
            extractedFields: mergedData,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to refresh job data");
        }
        
        const result = await response.json();
        
        // Update all state with new data
        setScrapedData(result.data);
        setSimilarJobs(result.similarJobs || []);
        setCandidates(result.candidates || []);
        setLinkedInJobsCount(result.linkedInJobsCount || 0);
        setIndeedJobsCount(result.indeedJobsCount || 0);
        setGlassdoorJobsCount(result.glassdoorJobsCount || 0);
        setJobAnalysisCards(result.jobAnalysisCards || null);
        setPeopleAnalysisCards(result.peopleAnalysisCards || null);
        setCombinedAnalysisCards(result.combinedAnalysisCards || null);
        setDerivedStrategyCards(result.derivedStrategyCards || null);
        setExtractedFields(result.extractedFields || mergedData);
        setAdditionalDataSources(result.dataSources || null);
        
        // Save to sessionStorage
        const formData = {
          scrapedData: result.data,
          similarJobs: result.similarJobs || [],
          candidates: result.candidates || [],
          linkedInJobsCount: result.linkedInJobsCount || 0,
          indeedJobsCount: result.indeedJobsCount || 0,
          glassdoorJobsCount: result.glassdoorJobsCount || 0,
          platform: result.platform,
          extractedFields: result.extractedFields || mergedData,
          jobAnalysisCards: result.jobAnalysisCards,
          peopleAnalysisCards: result.peopleAnalysisCards,
          combinedAnalysisCards: result.combinedAnalysisCards,
          derivedStrategyCards: result.derivedStrategyCards,
        };
        sessionStorage.setItem("scrapedJobData", JSON.stringify(formData));
        
        // Hide loading and navigate to results
        setIsLoading(false);
        document.body.style.overflow = 'auto';
        router.push("/results");
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to refresh job data";
        console.error("❌ Error refreshing job data:", error);
        setError(errorMessage);
        setIsLoading(false);
        document.body.style.overflow = 'auto';
      }
    } else {
      // Fields don't affect Apify - use existing data, just update extractedFields
      console.log("✅ Using existing scraped data and cards - no Apify refresh needed");
      setChatbotModalOpen(false);
      setIsLoading(true); // Show brief loading
      document.body.style.overflow = 'hidden';
      
      // Brief loading (500ms) then show results
      setTimeout(() => {
        setExtractedFields(mergedData);
        
        // Store merged data with existing cards
        const formData = {
          scrapedData,
          similarJobs,
          candidates,
          linkedInJobsCount,
          indeedJobsCount,
          glassdoorJobsCount,
          platform,
          extractedFields: mergedData,
          jobAnalysisCards, // Use existing cards
          peopleAnalysisCards,
          combinedAnalysisCards,
          derivedStrategyCards,
        };
        sessionStorage.setItem("scrapedJobData", JSON.stringify(formData));
        
        setIsLoading(false);
        document.body.style.overflow = 'auto';
        router.push("/results");
      }, 500);
    }
  };

  const handleSubmit = async () => {
    if (!roleDescription.trim()) return;
    
    setIsLoading(true);
    setApiCompleted(false); // Reset API completion state
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
      setGlassdoorJobsCount(result.glassdoorJobsCount || 0);
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
      
      // Save all card data to sessionStorage for dynamic card rendering
      try {
        const cardDataToStore = {
          jobAnalysisCards: result.jobAnalysisCards || null,
          peopleAnalysisCards: result.peopleAnalysisCards || null,
          combinedAnalysisCards: result.combinedAnalysisCards || null,
          derivedStrategyCards: result.derivedStrategyCards || null,
          extractedFields: result.extractedFields || null,
          scrapedData: result.data || null,
          similarJobs: result.similarJobs || [],
          candidates: result.candidates || [],
          dataSources: result.dataSources || null,
        };
        sessionStorage.setItem("scrapedJobData", JSON.stringify(cardDataToStore));
        console.log("✅ Saved card data to sessionStorage for dynamic rendering");
      } catch (error) {
        console.error("❌ Error saving card data to sessionStorage:", error);
      }
      
      // Mark API as completed
      setApiCompleted(true);
      
      // Process immediately when API completes - no artificial delay
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
        // Small delay to ensure state updates are processed
        setTimeout(() => {
          console.log("🚀 OPENING MISSING FIELDS MODAL NOW (on loading screen)");
          setMissingFieldsModalOpen(true);
          // Don't hide loading screen yet - it will be hidden when user makes a choice
        }, 100);
      } else {
        // No missing fields, hide loading and proceed to results immediately
        console.log("⏭️ NO MISSING FIELDS - Proceeding to results immediately");
        setIsLoading(false);
        document.body.style.overflow = 'auto';
        proceedToResults();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to scrape job";
      setError(errorMessage);
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
          {!missingFieldsModalOpen && !chatbotModalOpen && (
            <Loader1 
              isComplete={apiCompleted}
            />
          )}
          
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

      {/* Generated Cards Panel - Professional Dashboard */}
      {(jobAnalysisCards || peopleAnalysisCards || combinedAnalysisCards || derivedStrategyCards) && (
        <div className="fixed top-20 right-4 z-[10000] max-w-md">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-purple-500/50 overflow-hidden backdrop-blur-sm">
            <button
              onClick={() => {
                const allOpen = jobAnalysisCardsOpen && peopleAnalysisCardsOpen && combinedAnalysisCardsOpen && derivedStrategyCardsOpen;
                setJobAnalysisCardsOpen(!allOpen);
                setPeopleAnalysisCardsOpen(!allOpen);
                setCombinedAnalysisCardsOpen(!allOpen);
                setDerivedStrategyCardsOpen(!allOpen);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <span className="text-xl">🎴</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-white">
                    AI-Generated Cards
                  </span>
                  <span className="text-xs text-slate-400">
                    Battle Cards Analysis
                  </span>
                </div>
                <span className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-200 text-xs font-bold">
                  {[
                    jobAnalysisCards ? 5 : 0,
                    peopleAnalysisCards ? 1 : 0,
                    combinedAnalysisCards ? 4 : 0,
                    derivedStrategyCards ? 3 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </span>
              </div>
              {(jobAnalysisCardsOpen || peopleAnalysisCardsOpen || combinedAnalysisCardsOpen || derivedStrategyCardsOpen) ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {(jobAnalysisCardsOpen || peopleAnalysisCardsOpen || combinedAnalysisCardsOpen || derivedStrategyCardsOpen) && (
              <div className="p-4 max-h-[80vh] overflow-y-auto bg-slate-950/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-3">
                {/* Group 1: Job Analysis Cards */}
                {jobAnalysisCards && (
                  <div className="border border-green-500/40 rounded-xl overflow-hidden bg-slate-800/30">
                    <button
                      onClick={() => setJobAnalysisCardsOpen(!jobAnalysisCardsOpen)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-all duration-200 bg-green-950/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🟢</span>
                        <span className="text-xs font-bold text-white">
                          Job Analysis
                        </span>
                        <span className="px-2 py-0.5 bg-green-600/30 border border-green-500/50 rounded text-green-200 text-[10px] font-bold">
                          5 Cards
                        </span>
                      </div>
                      {jobAnalysisCardsOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {jobAnalysisCardsOpen && (
                      <div className="p-4 bg-slate-900/50 space-y-4">
                        {jobAnalysisCards.roleCard && (
                          <div className="border border-green-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-green-300 mb-2">Role Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableRoleCard data={jobAnalysisCards.roleCard} />
                            </div>
                          </div>
                        )}
                        {jobAnalysisCards.skillCard && (
                          <div className="border border-green-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-green-300 mb-2">Skill Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableSkillCard data={jobAnalysisCards.skillCard} />
                            </div>
                          </div>
                        )}
                        {jobAnalysisCards.fitCard && (
                          <div className="border border-green-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-green-300 mb-2">Fit Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableFitCard data={jobAnalysisCards.fitCard} />
                            </div>
                          </div>
                        )}
                        {jobAnalysisCards.messageCard && (
                          <div className="border border-green-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-green-300 mb-2">Message Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableMessageCard data={jobAnalysisCards.messageCard} />
                            </div>
                          </div>
                        )}
                        {jobAnalysisCards.outreachCard && (
                          <div className="border border-green-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-green-300 mb-2">Outreach Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableOutreachCard data={jobAnalysisCards.outreachCard} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Group 2: People Analysis Cards */}
                {peopleAnalysisCards && (
                  <div className="border border-blue-500/40 rounded-xl overflow-hidden bg-slate-800/30">
                    <button
                      onClick={() => setPeopleAnalysisCardsOpen(!peopleAnalysisCardsOpen)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-all duration-200 bg-blue-950/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🔵</span>
                        <span className="text-xs font-bold text-white">
                          People Analysis
                        </span>
                        <span className="px-2 py-0.5 bg-blue-600/30 border border-blue-500/50 rounded text-blue-200 text-[10px] font-bold">
                          1 Card
                        </span>
                      </div>
                      {peopleAnalysisCardsOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {peopleAnalysisCardsOpen && (
                      <div className="p-4 bg-slate-900/50">
                        {peopleAnalysisCards.talentMapCard && (
                          <div className="border border-blue-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-blue-300 mb-2">Talent Map Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableTalentMapCard data={peopleAnalysisCards.talentMapCard} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Group 3: Combined Analysis Cards */}
                {combinedAnalysisCards && (
                  <div className="border border-amber-500/40 rounded-xl overflow-hidden bg-slate-800/30">
                    <button
                      onClick={() => setCombinedAnalysisCardsOpen(!combinedAnalysisCardsOpen)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-all duration-200 bg-amber-950/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🟠</span>
                        <span className="text-xs font-bold text-white">
                          Combined Analysis
                        </span>
                        <span className="px-2 py-0.5 bg-amber-600/30 border border-amber-500/50 rounded text-amber-200 text-[10px] font-bold">
                          4 Cards
                        </span>
                      </div>
                      {combinedAnalysisCardsOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {combinedAnalysisCardsOpen && (
                      <div className="p-4 bg-slate-900/50 space-y-4">
                        {combinedAnalysisCards.marketCard && (
                          <div className="border border-amber-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-amber-300 mb-2">Market Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableMarketCard data={combinedAnalysisCards.marketCard} />
                            </div>
                          </div>
                        )}
                        {combinedAnalysisCards.payCard && (
                          <div className="border border-amber-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-amber-300 mb-2">Pay Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditablePayCard data={combinedAnalysisCards.payCard} />
                            </div>
                          </div>
                        )}
                        {combinedAnalysisCards.funnelCard && (
                          <div className="border border-amber-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-amber-300 mb-2">Funnel Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableFunnelCard data={combinedAnalysisCards.funnelCard} />
                            </div>
                          </div>
                        )}
                        {combinedAnalysisCards.realityCard && (
                          <div className="border border-amber-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-amber-300 mb-2">Reality Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableRealityCard data={combinedAnalysisCards.realityCard} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Group 4: Derived Strategy Cards */}
                {derivedStrategyCards && (
                  <div className="border border-purple-500/40 rounded-xl overflow-hidden bg-slate-800/30">
                    <button
                      onClick={() => setDerivedStrategyCardsOpen(!derivedStrategyCardsOpen)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-all duration-200 bg-purple-950/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🟣</span>
                        <span className="text-xs font-bold text-white">
                          Strategy Cards
                        </span>
                        <span className="px-2 py-0.5 bg-purple-600/30 border border-purple-500/50 rounded text-purple-200 text-[10px] font-bold">
                          3 Cards
                        </span>
                      </div>
                      {derivedStrategyCardsOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {derivedStrategyCardsOpen && (
                      <div className="p-4 bg-slate-900/50 space-y-4">
                        {derivedStrategyCards.interviewCard && (
                          <div className="border border-purple-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-purple-300 mb-2">Interview Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableInterviewCard data={derivedStrategyCards.interviewCard} />
                            </div>
                          </div>
                        )}
                        {derivedStrategyCards.scorecardCard && (
                          <div className="border border-purple-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-purple-300 mb-2">Scorecard Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditableScorecardCard data={derivedStrategyCards.scorecardCard} />
                            </div>
                          </div>
                        )}
                        {derivedStrategyCards.planCard && (
                          <div className="border border-purple-400/30 rounded-lg p-3 bg-slate-800/50">
                            <div className="text-xs font-bold text-purple-300 mb-2">Plan Card</div>
                            <div className="max-h-[60vh] overflow-y-auto">
                              <EditablePlanCard data={derivedStrategyCards.planCard} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Data Panel - Professional Dashboard */}
      {(similarJobs.length > 0 || candidates.length > 0) && (
        <div className="fixed right-4 z-[10000] max-w-md" style={{ 
          top: jobAnalysisCards ? 'calc(20px + 520px)' : '80px' 
        }}>
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-cyan-500/50 overflow-hidden backdrop-blur-sm">
            <button
              onClick={() => setApifyResultsOpen(!apifyResultsOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-white">
                    Market Data
                  </span>
                  <span className="text-xs text-slate-400">
                    Jobs & Candidates
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {similarJobs.length > 0 && (
                    <span className="px-2.5 py-1 bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-200 text-xs font-bold">
                      {similarJobs.length}
                    </span>
                  )}
                  {candidates.length > 0 && (
                    <span className="px-2.5 py-1 bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-200 text-xs font-bold">
                      {candidates.length}
                    </span>
                  )}
                </div>
              </div>
              {apifyResultsOpen ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {apifyResultsOpen && (
              <div className="p-4 max-h-[80vh] overflow-y-auto bg-slate-950/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-3">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {similarJobs.length > 0 && (
                    <div className="bg-cyan-600/10 rounded-lg p-3 border border-cyan-500/30">
                      <div className="text-cyan-300 text-xs font-medium mb-1">Similar Jobs</div>
                      <div className="text-cyan-100 font-bold text-xl">{similarJobs.length}</div>
                      <div className="text-cyan-400/70 text-[10px] mt-1">
                        {similarJobs.filter(j => j.platform === "linkedin" || !j.platform).length} LinkedIn • {similarJobs.filter(j => j.platform === "indeed").length} Indeed • {similarJobs.filter(j => j.platform === "glassdoor").length} Glassdoor
                      </div>
                    </div>
                  )}
                  {candidates.length > 0 && (
                    <div className="bg-purple-600/10 rounded-lg p-3 border border-purple-500/30">
                      <div className="text-purple-300 text-xs font-medium mb-1">Candidates</div>
                      <div className="text-purple-100 font-bold text-xl">{candidates.length}</div>
                      <div className="text-purple-400/70 text-[10px] mt-1">
                        {candidates.filter(c => c.platform === 'linkedin').length} LinkedIn • {candidates.filter(c => c.platform === 'github').length} GitHub
                      </div>
                    </div>
                  )}
                </div>

                {/* Similar Jobs Section */}
                {similarJobs.length > 0 && (
                  <div className="border border-cyan-500/40 rounded-xl overflow-hidden bg-slate-800/30">
                    <button
                      onClick={() => setApifyJobsOpen(!apifyJobsOpen)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-all duration-200 bg-cyan-950/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">💼</span>
                        <span className="text-xs font-bold text-white">
                          Similar Jobs
                        </span>
                        <span className="px-2 py-0.5 bg-cyan-600/30 border border-cyan-500/50 rounded text-cyan-200 text-[10px] font-bold">
                          {similarJobs.length}
                        </span>
                      </div>
                      {apifyJobsOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {apifyJobsOpen && (
                      <div className="p-4 bg-slate-900/50">
                        <div className="text-xs text-slate-400 mb-2 font-medium">Raw Data:</div>
                        <pre className="text-[10px] overflow-x-auto text-slate-300 max-h-[40vh] overflow-y-auto bg-slate-950/50 rounded-lg p-3 border border-slate-700/50">
                          {JSON.stringify(similarJobs, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Candidates Section */}
                {candidates.length > 0 && (
                  <div className="border border-purple-500/40 rounded-xl overflow-hidden bg-slate-800/30">
                    <button
                      onClick={() => setApifyCandidatesOpen(!apifyCandidatesOpen)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-all duration-200 bg-purple-950/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">👥</span>
                        <span className="text-xs font-bold text-white">
                          Candidate Profiles
                        </span>
                        <span className="px-2 py-0.5 bg-purple-600/30 border border-purple-500/50 rounded text-purple-200 text-[10px] font-bold">
                          {candidates.length}
                        </span>
                      </div>
                      {apifyCandidatesOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {apifyCandidatesOpen && (
                      <div className="p-4 bg-slate-900/50">
                        <div className="text-xs text-slate-400 mb-2 font-medium">Raw Data:</div>
                        <pre className="text-[10px] overflow-x-auto text-slate-300 max-h-[40vh] overflow-y-auto bg-slate-950/50 rounded-lg p-3 border border-slate-700/50">
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


      {/* Quick Scrape Panel - Professional Dashboard */}
      <div className="fixed top-20 left-4 z-[10000] max-w-md" style={{ marginTop: additionalDataSources ? '60px' : '0' }}>
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-blue-500/50 overflow-hidden backdrop-blur-sm">
            <button
              onClick={() => setQuickScrapeDebugOpen(!quickScrapeDebugOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-white">
                    Quick Scrape
                  </span>
                  <span className="text-xs text-slate-400">
                    10 Key Fields
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {quickScrapeData?.hasMissingFields && (
                    <span className="px-2.5 py-1 bg-amber-600/30 border border-amber-500/50 rounded-lg text-amber-200 text-[10px] font-bold">
                      {quickScrapeData.missingFields?.length || 0}
                    </span>
                  )}
                  {quickScrapeLoading && (
                    <span className="px-2.5 py-1 bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-200 text-[10px] font-bold animate-pulse">
                      ...
                    </span>
                  )}
                  {quickScrapeError && (
                    <span className="px-2.5 py-1 bg-red-600/30 border border-red-500/50 rounded-lg text-red-200 text-[10px] font-bold">
                      ⚠
                    </span>
                  )}
                </div>
              </div>
              {quickScrapeDebugOpen ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {quickScrapeDebugOpen && (
              <div className="p-4 max-h-[80vh] overflow-y-auto bg-slate-950/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="space-y-3">
                  {/* Show error if scraping failed */}
                  {quickScrapeError && (
                    <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                      <div className="text-red-300 font-bold text-sm mb-1 flex items-center gap-2">
                        <span>❌</span>
                        <span>Scraping Error</span>
                      </div>
                      <div className="text-red-200 text-xs">{quickScrapeError}</div>
                    </div>
                  )}

                  {/* Show loading state */}
                  {quickScrapeLoading && !quickScrapeData && (
                    <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-xl text-center">
                      <div className="text-blue-300 font-bold text-sm flex items-center justify-center gap-2">
                        <span className="animate-spin">🔄</span>
                        <span>Scraping in progress...</span>
                      </div>
                    </div>
                  )}

                  {/* 10 Required Fields - Only show if we have data */}
                  {quickScrapeData ? (
                    <>
                      <div className="pb-3 border-b border-slate-700/50 mb-4">
                        <div className="text-blue-300 font-bold text-sm mb-1">10 Required Fields</div>
                        <div className="text-slate-400 text-xs">
                          {10 - (quickScrapeData.missingFields?.length || 0)} of 10 complete
                        </div>
                      </div>

                      {/* Role Title */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">1. Role Title</div>
                        <div className={`text-sm font-semibold ${quickScrapeData.extractedFields?.roleTitle ? 'text-white' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.roleTitle || "❌ Missing"}
                        </div>
                      </div>

                      {/* Department */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">2. Department</div>
                        <div className={`text-sm font-semibold ${quickScrapeData.extractedFields?.department ? 'text-white' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.department || "❌ Missing"}
                        </div>
                      </div>

                      {/* Experience Level */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">3. Experience Level</div>
                        <div className={`text-sm font-semibold ${quickScrapeData.extractedFields?.experienceLevel ? 'text-white' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.experienceLevel || "❌ Missing"}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">4. Location</div>
                        <div className={`text-sm font-semibold ${quickScrapeData.extractedFields?.location ? 'text-white' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.location || "❌ Missing"}
                        </div>
                      </div>

                      {/* Work Model */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">5. Work Model</div>
                        <div className={`text-sm font-semibold ${quickScrapeData.extractedFields?.workModel ? 'text-white' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.workModel || "❌ Missing"}
                        </div>
                      </div>

                      {/* Critical Skills */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">6. Critical Skills</div>
                        {quickScrapeData.extractedFields?.criticalSkills && Array.isArray(quickScrapeData.extractedFields.criticalSkills) && quickScrapeData.extractedFields.criticalSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {quickScrapeData.extractedFields.criticalSkills.map((skill: string, idx: number) => (
                              <span key={idx} className="px-2.5 py-1 bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-200 text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-red-400 font-semibold">❌ Missing</div>
                        )}
                      </div>

                      {/* Salary Range */}
                      <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-lg p-3 border border-emerald-500/20">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">7. Salary Range</div>
                        {quickScrapeData.extractedFields?.minSalary && quickScrapeData.extractedFields?.maxSalary ? (
                          <div className="text-emerald-300 font-bold text-lg">
                            ${parseInt(quickScrapeData.extractedFields.minSalary).toLocaleString()} - ${parseInt(quickScrapeData.extractedFields.maxSalary).toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-red-400 font-semibold">❌ Missing</div>
                        )}
                      </div>

                      {/* Non-Negotiables */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">8. Non-Negotiables</div>
                        <div className={`text-sm ${quickScrapeData.extractedFields?.nonNegotiables ? 'text-white' : 'text-red-400 font-semibold'}`}>
                          {quickScrapeData.extractedFields?.nonNegotiables || "❌ Missing"}
                        </div>
                      </div>

                      {/* Flexible Requirements */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">9. Flexible Requirements</div>
                        <div className={`text-sm ${quickScrapeData.extractedFields?.flexible ? 'text-white' : 'text-red-400 font-semibold'}`}>
                          {quickScrapeData.extractedFields?.flexible || "❌ Missing"}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">10. Timeline</div>
                        <div className={`text-sm font-semibold ${quickScrapeData.extractedFields?.timeline ? 'text-white' : 'text-red-400'}`}>
                          {quickScrapeData.extractedFields?.timeline || "❌ Missing"}
                        </div>
                      </div>

                      {/* Missing Fields Summary */}
                      {quickScrapeData.missingFields && quickScrapeData.missingFields.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-slate-700/50">
                          <div className="bg-amber-600/10 rounded-lg p-4 border border-amber-500/30">
                            <div className="text-amber-300 font-bold text-sm mb-3 flex items-center gap-2">
                              <span>⚠️</span>
                              <span>Missing Fields ({quickScrapeData.missingFields.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {quickScrapeData.missingFields.map((field: string, idx: number) => (
                                <span key={idx} className="px-2.5 py-1 bg-amber-600/30 border border-amber-500/50 rounded-lg text-amber-200 text-xs font-medium">
                                  {field}
                                </span>
                              ))}
                            </div>
                          </div>
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

      {/* Data Dashboard - Professional Presentation */}
      {scrapedData && (
        <div className="fixed bottom-4 right-4 z-[100] max-w-md space-y-2">
          {/* Job Data Panel */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <button
              onClick={() => setDebugOpen(!debugOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-white">
                    Job Details
                  </span>
                  <span className="text-xs text-slate-400">
                    Extracted Information
                  </span>
                </div>
              </div>
              {debugOpen ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Collapsible Content */}
            {debugOpen && (
              <div className="p-5 max-h-[60vh] overflow-y-auto bg-slate-950/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="space-y-4">
                  {/* AI Enhanced Badge */}
                  {scrapedData.aiEnhanced && (
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-700/50">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 rounded-lg text-purple-200 text-xs font-bold flex items-center gap-1.5">
                        <span>✨</span>
                        <span>AI Enhanced</span>
                      </div>
                    </div>
                  )}

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Source */}
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Source</div>
                      <div className="text-white font-semibold text-sm">{scrapedData.source}</div>
                    </div>

                    {/* Platform */}
                    {platform && platform !== "unknown" && (
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Platform</div>
                        <div className="flex items-center gap-2">
                          {platform === "linkedin" && (
                            <span className="px-2.5 py-1 bg-blue-600/30 border border-blue-500/50 rounded-md text-blue-200 text-xs font-bold flex items-center gap-1">
                              <span>🔵</span>
                              <span>LinkedIn</span>
                            </span>
                          )}
                          {platform === "indeed" && (
                            <span className="px-2.5 py-1 bg-orange-600/30 border border-orange-500/50 rounded-md text-orange-200 text-xs font-bold flex items-center gap-1">
                              <span>🟠</span>
                              <span>Indeed</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Job Title</div>
                    <div className="text-white font-bold text-base leading-tight">{scrapedData.title}</div>
                  </div>

                  {/* Company & Location Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {scrapedData.company && (
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Company</div>
                        <div className="text-white font-semibold text-sm">{scrapedData.company}</div>
                      </div>
                    )}
                    {scrapedData.location && (
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Location</div>
                        <div className="text-white font-semibold text-sm flex items-center gap-1">
                          <span>📍</span>
                          <span>{scrapedData.location}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {scrapedData.department && (
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Department</div>
                        <div className="text-white font-semibold text-sm">{scrapedData.department}</div>
                      </div>
                    )}
                    {scrapedData.locationType && (
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Work Model</div>
                        <div className="text-white font-semibold text-sm">{scrapedData.locationType}</div>
                      </div>
                    )}
                    {scrapedData.employmentType && (
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Employment</div>
                        <div className="text-white font-semibold text-sm">{scrapedData.employmentType}</div>
                      </div>
                    )}
                    {scrapedData.experienceLevel && (
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Level</div>
                        <div className="text-white font-semibold text-sm">{scrapedData.experienceLevel}</div>
                      </div>
                    )}
                  </div>

                  {/* Salary */}
                  {scrapedData.salary && (
                    <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-lg p-4 border border-emerald-500/20">
                      <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Compensation</div>
                      <div className="text-emerald-300 font-bold text-lg">{scrapedData.salary}</div>
                    </div>
                  )}

                  {/* Skills */}
                  {scrapedData.skills && scrapedData.skills.length > 0 && (
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">
                        Required Skills ({scrapedData.skills.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {scrapedData.skills.slice(0, 10).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/40 rounded-lg text-blue-200 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {scrapedData.skills.length > 10 && (
                          <span className="px-3 py-1.5 text-slate-400 text-xs font-medium">
                            +{scrapedData.skills.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {scrapedData.requirements && scrapedData.requirements.length > 0 && (
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">
                        Requirements ({scrapedData.requirements.length})
                      </div>
                      <ul className="space-y-2">
                        {scrapedData.requirements.slice(0, 5).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-200 text-sm">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="flex-1">{req}</span>
                          </li>
                        ))}
                        {scrapedData.requirements.length > 5 && (
                          <li className="text-slate-400 text-xs italic">
                            +{scrapedData.requirements.length - 5} more requirements
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Responsibilities */}
                  {scrapedData.responsibilities && scrapedData.responsibilities.length > 0 && (
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">
                        Key Responsibilities ({scrapedData.responsibilities.length})
                      </div>
                      <ul className="space-y-2">
                        {scrapedData.responsibilities.slice(0, 5).map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-200 text-sm">
                            <span className="text-indigo-400 mt-1">•</span>
                            <span className="flex-1">{resp}</span>
                          </li>
                        ))}
                        {scrapedData.responsibilities.length > 5 && (
                          <li className="text-slate-400 text-xs italic">
                            +{scrapedData.responsibilities.length - 5} more responsibilities
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Benefits */}
                  {scrapedData.benefits && scrapedData.benefits.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-lg p-4 border border-emerald-500/20">
                      <div className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">
                        Benefits & Perks ({scrapedData.benefits.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {scrapedData.benefits.slice(0, 8).map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/40 rounded-lg text-emerald-200 text-xs font-medium"
                          >
                            {benefit}
                          </span>
                        ))}
                        {scrapedData.benefits.length > 8 && (
                          <span className="px-3 py-1.5 text-slate-400 text-xs">
                            +{scrapedData.benefits.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description Preview */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">
                      Job Description
                    </div>
                    <div className="text-slate-200 text-sm leading-relaxed line-clamp-6 max-h-32 overflow-hidden">
                      {scrapedData.description || scrapedData.rawText}
                    </div>
                    <div className="mt-2 text-slate-500 text-xs">
                      {scrapedData.rawText.length.toLocaleString()} characters
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Candidates Panel - LinkedIn People Profiles */}
          {candidates.length > 0 && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-800 rounded-xl shadow-2xl border border-purple-500/30 overflow-hidden backdrop-blur-sm">
              {/* Header */}
              <button
                onClick={() => setCandidatesOpen(!candidatesOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-white">
                      Candidate Profiles
                    </span>
                    <span className="text-xs text-slate-400">
                      LinkedIn + GitHub
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-200 text-xs font-bold">
                    {candidates.length}
                  </span>
                </div>
                {candidatesOpen ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Collapsible Content */}
              {candidatesOpen && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <div className="space-y-3">
                    {candidates.map((person) => (
                      <div
                        key={person.id}
                        className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-800/40 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg"
                      >
                        {/* Person Header */}
                        <div className="flex items-start gap-3 mb-3">
                          {person.avatar && (
                            <Image
                              src={person.avatar}
                              alt={`${person.firstName} ${person.lastName}`}
                              width={56}
                              height={56}
                              className="w-14 h-14 rounded-xl object-cover border-2 border-purple-500/30"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold text-sm">
                                {person.firstName} {person.lastName}
                              </h3>
                              {person.premium && (
                                <span className="text-yellow-400 text-sm">⭐</span>
                              )}
                              {person.openToWork && (
                                <span className="px-2 py-0.5 bg-green-600/30 border border-green-500/50 rounded-md text-green-200 text-[10px] font-bold">
                                  OPEN TO WORK
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 text-xs font-medium line-clamp-2 mb-2">
                              {person.headline}
                            </p>
                            {person.currentCompany && (
                              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                <span>🏢</span>
                                <span className="font-medium">{person.currentCompany.name}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Location & Stats Row */}
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700/50">
                          <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                            <span>📍</span>
                            <span>{person.location.linkedinText}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-400 text-xs">
                            {person.connections !== undefined && person.connections > 0 && (
                              <span className="flex items-center gap-1">
                                <span>🤝</span>
                                <span>{person.connections}+</span>
                              </span>
                            )}
                            {person.followers !== undefined && person.followers > 0 && (
                              <span className="flex items-center gap-1">
                                <span>👥</span>
                                <span>{person.followers}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Top Skills */}
                        {person.topSkills && (
                          <div className="mb-3">
                            <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">
                              Skills
                            </div>
                            <div className="text-slate-200 text-xs leading-relaxed line-clamp-2">
                              {person.topSkills}
                            </div>
                          </div>
                        )}

                        {/* Link */}
                        <a
                          href={person.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 rounded-lg text-purple-200 text-xs font-medium transition-all duration-200"
                        >
                          <span>View Profile</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="pt-4 mt-4 border-t border-slate-700/50">
                      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-3 border border-purple-500/30">
                        <div className="text-purple-200 text-xs font-bold text-center">
                          📊 {candidates.length} Total Candidates Found
                        </div>
                        <div className="text-slate-400 text-[10px] text-center mt-1">
                          {candidates.filter(c => c.platform === 'linkedin').length} LinkedIn • {candidates.filter(c => c.platform === 'github').length} GitHub
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Similar Jobs Panel - Combined LinkedIn + Indeed + Glassdoor */}
          {(linkedInJobsCount > 0 || indeedJobsCount > 0 || glassdoorJobsCount > 0) && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-800 rounded-xl shadow-2xl border border-cyan-500/30 overflow-hidden backdrop-blur-sm">
              {/* Header */}
              <button
                onClick={() => {
                  setLinkedInJobsOpen(!linkedInJobsOpen);
                  setIndeedJobsOpen(!indeedJobsOpen);
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-white">
                      Similar Jobs
                    </span>
                    <span className="text-xs text-slate-400">
                      Market Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {linkedInJobsCount > 0 && (
                      <span className="px-2.5 py-1 bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-200 text-xs font-bold">
                        {linkedInJobsCount}
                      </span>
                    )}
                    {indeedJobsCount > 0 && (
                      <span className="px-2.5 py-1 bg-orange-600/30 border border-orange-500/50 rounded-lg text-orange-200 text-xs font-bold">
                        {indeedJobsCount}
                      </span>
                    )}
                  </div>
                </div>
                {linkedInJobsOpen || indeedJobsOpen ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Collapsible Content */}
              {(linkedInJobsOpen || indeedJobsOpen) && (
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-950/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {linkedInJobsCount > 0 && (
                        <div className="bg-blue-600/10 rounded-lg p-3 border border-blue-500/30">
                          <div className="text-blue-300 text-xs font-medium mb-1">LinkedIn</div>
                          <div className="text-blue-100 font-bold text-lg">{linkedInJobsCount}</div>
                          <div className="text-blue-400/70 text-[10px]">Similar Jobs</div>
                        </div>
                      )}
                      {indeedJobsCount > 0 && (
                        <div className="bg-orange-600/10 rounded-lg p-3 border border-orange-500/30">
                          <div className="text-orange-300 text-xs font-medium mb-1">Indeed</div>
                          <div className="text-orange-100 font-bold text-lg">{indeedJobsCount}</div>
                          <div className="text-orange-400/70 text-[10px]">Similar Jobs</div>
                        </div>
                      )}
                      {glassdoorJobsCount > 0 && (
                        <div className="bg-green-600/10 rounded-lg p-3 border border-green-500/30">
                          <div className="text-green-300 text-xs font-medium mb-1">Glassdoor</div>
                          <div className="text-green-100 font-bold text-lg">{glassdoorJobsCount}</div>
                          <div className="text-green-400/70 text-[10px]">Similar Jobs</div>
                        </div>
                      )}
                    </div>

                    {/* Sample Jobs Preview */}
                    <div>
                      <div className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">
                        Sample Jobs ({Math.min(similarJobs.length, 5)} of {similarJobs.length})
                      </div>
                      <div className="space-y-2">
                        {similarJobs.slice(0, 5).map((job, idx) => (
                          <div
                            key={job.id || idx}
                            className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="text-white font-semibold text-sm mb-1 line-clamp-1">
                                  {job.title}
                                </div>
                                <div className="text-slate-300 text-xs">
                                  {job.company?.name || 'Company not specified'}
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                job.platform === 'linkedin' 
                                  ? 'bg-blue-600/30 border border-blue-500/50 text-blue-200'
                                  : job.platform === 'glassdoor'
                                  ? 'bg-green-600/30 border border-green-500/50 text-green-200'
                                  : 'bg-orange-600/30 border border-orange-500/50 text-orange-200'
                              }`}>
                                {job.platform === 'linkedin' ? 'LI' : job.platform === 'glassdoor' ? 'GD' : 'IN'}
                              </span>
                            </div>
                            {job.location?.linkedinText && (
                              <div className="text-slate-400 text-xs flex items-center gap-1">
                                <span>📍</span>
                                <span>{job.location.linkedinText}</span>
                              </div>
                            )}
                            {job.salary && (
                              <div className="text-emerald-300 text-xs font-medium mt-1">
                                💰 {typeof job.salary === 'string' ? job.salary : `$${job.salary.min?.toLocaleString()} - $${job.salary.max?.toLocaleString()}`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {similarJobs.length > 5 && (
                        <div className="text-center text-slate-400 text-xs mt-3">
                          +{similarJobs.length - 5} more jobs available
                        </div>
                      )}
                    </div>
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
                            <Image
                              src={job.company.logo}
                              alt={job.company.name}
                              width={40}
                              height={40}
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
                          {job.platform === "linkedin" ? "View on LinkedIn →" : job.platform === "glassdoor" ? "View on Glassdoor →" : "View on Indeed →"}
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
