import { BuiltFor } from "../components/built-for";
import { FAQs } from "../components/faqs";
import { Footer } from "../components/footer";
import { HomeHeroSection } from "../components/home-hero-section";
import { HomeNavbar } from "../components/home-nav-bar";
import { HowItWorks } from "../components/how-it-works";
import { OutPutPlaceholder } from "../components/out-put-placeholder";
import { Pricing } from "../components/pricing";
import { Testimonials } from "../components/testimonials";

export const HomeView = () => {
  return (
    <div>
      <HomeNavbar />
      <HomeHeroSection />
      <OutPutPlaceholder />
      <HowItWorks />
      <BuiltFor />
      <Testimonials />
      <Pricing />
      <FAQs />
      <Footer />
    </div>
  );
};
