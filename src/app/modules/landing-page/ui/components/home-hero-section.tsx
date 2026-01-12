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

// ExtractedData type from ConversationalChatbotModal
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
import MissingFieldsModal from "@/components/MissingFieldsModal";

interface ExtractedFields {
  roleTitle?: string | null;
  department?: string | null;
  experienceLevel?: string | null;
  location?: string | null;
  workModel?: string | null;
  criticalSkills?: string[] | null;
  minSalary?: string | null;
  maxSalary?: string | null;
  nonNegotiables?: string | null;
  flexible?: string | null;
  timeline?: string | null;
}

// Card group interfaces for proper typing
interface JobAnalysisCards {
  roleCard?: Record<string, unknown> | null;
  skillCard?: Record<string, unknown> | null;
  fitCard?: Record<string, unknown> | null;
  messageCard?: Record<string, unknown> | null;
  outreachCard?: Record<string, unknown> | null;
}

interface PeopleAnalysisCards {
  talentMapCard?: Record<string, unknown> | null;
}

interface CombinedAnalysisCards {
  marketCard?: Record<string, unknown> | null;
  payCard?: Record<string, unknown> | null;
  funnelCard?: Record<string, unknown> | null;
  realityCard?: Record<string, unknown> | null;
}

interface DerivedStrategyCards {
  interviewCard?: Record<string, unknown> | null;
  scorecardCard?: Record<string, unknown> | null;
  planCard?: Record<string, unknown> | null;
}

interface QuickScrapeData {
  extractedFields?: ExtractedFields;
  missingFields?: string[];
  hasMissingFields?: boolean;
  [key: string]: unknown;
}

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
  url?: string;
  platform?: string;
  company: {
    name: string;
    logo?: string;
    employeeCount?: number;
  };
  location: {
    linkedinText: string;
    city?: string;
    state?: string;
    country?: string;
    parsed?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  salary?: string | {
    text: string;
    min?: number;
    max?: number;
    currency?: string;
    salaryText?: string;
    salaryMin?: string;
    salaryMax?: string;
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
  platform?: string;
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
  const [linkedInJobsOpen, setLinkedInJobsOpen] = useState(false);
  const [indeedJobsOpen, setIndeedJobsOpen] = useState(false);
  const [candidatesOpen, setCandidatesOpen] = useState(false);
  
  // AI-Generated Card Groups
  const [jobAnalysisCards, setJobAnalysisCards] = useState<JobAnalysisCards | null>(null);
  const [peopleAnalysisCards, setPeopleAnalysisCards] = useState<PeopleAnalysisCards | null>(null);
  const [combinedAnalysisCards, setCombinedAnalysisCards] = useState<CombinedAnalysisCards | null>(null);
  const [derivedStrategyCards, setDerivedStrategyCards] = useState<DerivedStrategyCards | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null);
  const [missingFieldsModalOpen, setMissingFieldsModalOpen] = useState(false);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  
  // Quick scrape state for real-time scraping (removed automatic scraping)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quickScrapeData, setQuickScrapeData] = useState<QuickScrapeData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quickScrapeLoading, setQuickScrapeLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quickScrapeError, setQuickScrapeError] = useState<string | null>(null);

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
    originalFields: ExtractedData | ExtractedFields | null,
    completedFields: Partial<ExtractedData>
  ): boolean => {
    // Check roleTitle
    const originalRoleTitle = originalFields?.roleTitle;
    const completedRoleTitle = completedFields.roleTitle;
    if (completedRoleTitle && completedRoleTitle !== originalRoleTitle) {
      console.log(`🔄 Field "roleTitle" changed: "${originalRoleTitle}" → "${completedRoleTitle}" - will redo Apify scraping`);
      return true;
    }
    if (!originalRoleTitle && completedRoleTitle) {
      console.log(`🔄 Field "roleTitle" was missing, now provided: "${completedRoleTitle}" - will redo Apify scraping`);
      return true;
    }
    
    // Check location
    const originalLocation = originalFields?.location;
    const completedLocation = completedFields.location;
    if (completedLocation && completedLocation !== originalLocation) {
      console.log(`🔄 Field "location" changed: "${originalLocation}" → "${completedLocation}" - will redo Apify scraping`);
      return true;
    }
    if (!originalLocation && completedLocation) {
      console.log(`🔄 Field "location" was missing, now provided: "${completedLocation}" - will redo Apify scraping`);
      return true;
    }
    
    console.log("✅ Completed fields don't affect Apify scraping - using existing data");
    return false;
  };

  const handleChatbotComplete = async (completedData: ExtractedData) => {
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
        const jobURL = (scrapedData && typeof scrapedData === "object" && "url" in scrapedData ? String(scrapedData.url || "") : "") || roleDescription;
        
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
      {/* Candidates Panel - LinkedIn People Profiles */}
      {candidates.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[100] max-w-md space-y-2">
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
        </div>
      )}

      {/* Similar Jobs Panel - Combined LinkedIn + Indeed + Glassdoor */}
      {(linkedInJobsCount > 0 || indeedJobsCount > 0 || glassdoorJobsCount > 0) && (
        <div className="fixed bottom-4 right-4 z-[100] max-w-md space-y-2">
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
                            {job.location.linkedinText || `${job.location.parsed?.city || job.location.city || ''}${job.location.parsed?.state || job.location.state ? ', ' + (job.location.parsed?.state || job.location.state) : ''}${job.location.parsed?.country || job.location.country ? ', ' + (job.location.parsed?.country || job.location.country) : ''}`}
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
                            💰 {typeof job.salary === 'string' ? job.salary : (job.salary?.text || (job.salary as { salaryText?: string; salaryMin?: string; salaryMax?: string })?.salaryText || `${(job.salary as { salaryMin?: string; salaryMax?: string })?.salaryMin || ''} - ${(job.salary as { salaryMin?: string; salaryMax?: string })?.salaryMax || ''}`)}
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
