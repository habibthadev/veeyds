import { motion } from "framer-motion";
import { HeroSection } from "../components/home/HeroSection";
import { PlatformGrid } from "../components/home/PlatformGrid";
import { HowItWorks } from "../components/home/HowItWorks";
import { FeatureStrip } from "../components/home/FeatureStrip";

export const HomePage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    <HeroSection />
    <PlatformGrid />
    <HowItWorks />
    <FeatureStrip />
  </motion.div>
);
