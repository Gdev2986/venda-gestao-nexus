
import TransparentHeader from "./components/TransparentHeader";
import ImmersiveHero from "./components/ImmersiveHero";
import HowItWorks from "./components/HowItWorks";
import AnimatedBenefitsNew from "./components/AnimatedBenefitsNew";
import SimpleTestimonial from "./components/SimpleTestimonial";
import FinalCall from "./components/FinalCall";
import ModernFooter from "./components/ModernFooter";
import "./index.css";

const Index = () => {
  return (
    <div className="landing-theme min-h-screen bg-black overflow-x-hidden">
      <TransparentHeader />
      <ImmersiveHero />
      <HowItWorks />
      <AnimatedBenefitsNew />
      <SimpleTestimonial />
      <FinalCall />
      <ModernFooter />
    </div>
  );
};

export default Index;
