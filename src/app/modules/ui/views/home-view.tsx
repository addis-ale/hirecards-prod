import { BuiltFor } from "../components/built-for";
import { HomeHeroSection } from "../components/home-hero-section";
import { HomeNavbar } from "../components/home-nav-bar";
import { HowItWorks } from "../components/how-it-works";
import { OutPutPlaceholder } from "../components/out-put-placeholder";

export const HomeView = () => {
  return (
    <div className="">
      <HomeNavbar />
      <HomeHeroSection />
      <OutPutPlaceholder />
      <HowItWorks />
      <BuiltFor />
    </div>
  );
};
