const PLATFORMS = [
  "YouTube", "Instagram", "Facebook", "TikTok", "X / Twitter",
  "Snapchat", "Reddit", "Vimeo", "Twitch", "Pinterest",
  "Dailymotion", "SoundCloud", "LinkedIn", "Tumblr",
];

const PlatformCard = ({ name }: { name: string }) => (
  <div
    className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
    style={{
      backgroundColor: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      fontFamily: "var(--font-body)",
    }}
  >
    {name}
  </div>
);

export const PlatformGrid = () => (
  <section className="py-16 overflow-hidden">
    <div className="marquee-container relative">
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
      />
      <div className="marquee-track">
        {[...PLATFORMS, ...PLATFORMS].map((name, i) => (
          <PlatformCard key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
    <style>{`
      .marquee-container {
        overflow: hidden;
        width: 100%;
      }
      .marquee-track {
        display: flex;
        gap: 1rem;
        width: max-content;
        animation: marquee-scroll 30s linear infinite;
      }
      @keyframes marquee-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-track:hover {
        animation-play-state: paused;
      }
    `}</style>
  </section>
);
