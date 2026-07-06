import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const faqs = [
  {
    q: "What platforms does Veeyds support?",
    a: "Veeyds supports 14+ platforms: YouTube, Instagram, Facebook, TikTok, X/Twitter, Snapchat, Reddit, Vimeo, Twitch, Pinterest, Dailymotion, SoundCloud, LinkedIn, and Tumblr.",
  },
  {
    q: "Is Veeyds free to use?",
    a: "Yes. Veeyds is completely free. No login required, no hidden fees, no ads. Just paste a URL and download.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account or signup is needed. Veeyds is a no-login media downloader. Paste your link and download instantly.",
  },
  {
    q: "How do I download a YouTube video?",
    a: "Copy the YouTube video URL, paste it into the input field on Veeyds, select your preferred format and quality, then click Download. Supports HD, 4K, and audio-only extraction.",
  },
  {
    q: "How do I download an Instagram video or Reel?",
    a: "Copy the Instagram video or Reel URL, paste it into Veeyds, choose your format, and download. Works with Instagram posts, Reels, and stories.",
  },
  {
    q: "Can I download TikTok videos without a watermark?",
    a: "Yes. Veeyds downloads TikTok videos in their original quality. Paste the TikTok URL and select your preferred format.",
  },
  {
    q: "What formats are available?",
    a: "Veeyds offers multiple formats including MP4, WebM, and audio-only MP3. You can choose resolution from standard definition up to 4K depending on the source.",
  },
  {
    q: "Can I extract audio from videos?",
    a: "Yes. Veeyds can extract audio from any supported video platform. Select the audio-only format to download MP3 or other audio formats.",
  },
];

export const FaqSection = () => (
  <section className="py-24 px-6">
    <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
      <h2 className="text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>
        Frequently Asked Questions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {faqs.map((faq, i) => (
          <FaqCard key={i} question={faq.q} answer={faq.a} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const FaqCard = ({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="p-6 rounded-2xl"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
        {question}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {answer}
      </p>
    </motion.div>
  );
};
