const FEATURES = [
  "No login required",
  "Multiple formats",
  "HD support",
  "Fast extraction",
  "Audio extraction",
  "Batch downloads",
  "Free forever",
  "No ads",
];

export const FeatureStrip = () => (
  <section
    className="py-6 overflow-hidden"
    style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
  >
    <div className="feature-marquee-container relative">
      <div
        className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
      />
      <div className="feature-marquee-track">
        {[...FEATURES, ...FEATURES].map((feature, i) => (
          <span
            key={`${feature}-${i}`}
            className="flex-shrink-0 text-sm font-medium whitespace-nowrap"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
    <style>{`
      .feature-marquee-container {
        overflow: hidden;
        width: 100%;
      }
      .feature-marquee-track {
        display: flex;
        gap: 2.5rem;
        width: max-content;
        animation: feature-scroll 20s linear infinite;
      }
      @keyframes feature-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </section>
);
