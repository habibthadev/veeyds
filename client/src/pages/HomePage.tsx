import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { HeroSection } from "../components/home/HeroSection";
import { PlatformGrid } from "../components/home/PlatformGrid";
import { HowItWorks } from "../components/home/HowItWorks";
import { FeatureStrip } from "../components/home/FeatureStrip";
import { FaqSection } from "../components/home/FaqSection";

export const HomePage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    <Helmet>
      <title>Veeyds - Free Video & Audio Downloader for 14+ Platforms</title>
      <meta name="description" content="Download videos and audio from YouTube, Instagram, TikTok, Facebook, X/Twitter, Snapchat, Reddit, Vimeo, Twitch, Pinterest, Dailymotion, SoundCloud, LinkedIn, and Tumblr. No login. No ads. Free forever." />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What platforms does Veeyds support?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Veeyds supports 14+ platforms: YouTube, Instagram, Facebook, TikTok, X/Twitter, Snapchat, Reddit, Vimeo, Twitch, Pinterest, Dailymotion, SoundCloud, LinkedIn, and Tumblr."
              }
            },
            {
              "@type": "Question",
              "name": "Is Veeyds free to use?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Veeyds is completely free. No login required, no hidden fees, no ads. Just paste a URL and download."
              }
            },
            {
              "@type": "Question",
              "name": "How do I download a YouTube video?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Copy the YouTube video URL, paste it into the input field on Veeyds, select your preferred format and quality, then click Download. Supports HD, 4K, and audio-only extraction."
              }
            },
            {
              "@type": "Question",
              "name": "Can I download TikTok videos without a watermark?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Veeyds downloads TikTok videos in their original quality. Paste the TikTok URL and select your preferred format."
              }
            },
            {
              "@type": "Question",
              "name": "Can I extract audio from videos?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Veeyds can extract audio from any supported video platform. Select the audio-only format to download MP3 or other audio formats."
              }
            }
          ]
        })}
      </script>
    </Helmet>
    <HeroSection />
    <PlatformGrid />
    <HowItWorks />
    <FeatureStrip />
    <FaqSection />
  </motion.div>
);
