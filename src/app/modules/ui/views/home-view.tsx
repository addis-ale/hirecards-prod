import { HomeHeroSection } from "../components/home-hero-section";
import { HomeNavbar } from "../components/home-nav-bar";
import { OutPutPlaceholder } from "../components/out-put-placeholder";

export const HomeView = () => {
  return (
    <div className="">
      <HomeNavbar />
      <HomeHeroSection />
      <OutPutPlaceholder />
    </div>
  );
};
