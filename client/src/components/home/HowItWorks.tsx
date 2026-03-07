import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { number: "01", title: "Paste a link", description: "Drop any URL from a supported platform." },
  { number: "02", title: "Choose format", description: "Pick resolution, codec, or audio-only." },
  { number: "03", title: "Download", description: "Get your file instantly. No signup required." },
];

const StepCard = ({ step, index }: { step: typeof steps[number]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-start gap-3 p-8 rounded-2xl"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        className="text-4xl font-bold"
        style={{ color: "var(--color-accent)", fontFamily: "var(--font-display)" }}
      >
        {step.number}
      </span>
      <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
        {step.title}
      </h3>
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        {step.description}
      </p>
    </motion.div>
  );
};

export const HowItWorks = () => (
  <section className="py-24 px-6">
    <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
      <h2 className="text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>
        How it works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} />
        ))}
      </div>
    </div>
  </section>
);
