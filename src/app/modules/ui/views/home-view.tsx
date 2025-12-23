import Footer from "../components/footer";
import { HomeHeroSection } from "../components/home-hero-section";
import { HomeNavbar } from "../components/home-nav-bar";
import HowItWorks from "../components/how-it-works";
import { OutPutPlaceholder } from "../components/out-put-placeholder";
import { Testimonials } from "../components/testimonials";

export const HomeView = () => {
  return (
    <div className="">
      <HomeNavbar />
      <HomeHeroSection />
      <OutPutPlaceholder />
      <HowItWorks />
      <Testimonials className="w-full" />
      <Footer />
    </div>
  );
};
