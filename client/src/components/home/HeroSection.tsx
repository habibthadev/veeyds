import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const HeroSection = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/download?url=${encodeURIComponent(url.trim())}`);
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-text) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
        style={{
          width: "500px",
          height: "400px",
          background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        className="relative z-10 text-center w-full"
        style={{ maxWidth: "var(--content-width)" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="mb-6">
          Download anything.
          <br />
          <span style={{ color: "var(--color-accent)" }}>Instantly.</span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Paste a link from any supported platform. Pick your format. Download.
        </motion.p>
        <motion.p
          variants={itemVariants}
          className="text-sm mb-10"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          YouTube, Instagram, TikTok, Facebook, X, and many more.
        </motion.p>
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 w-full mx-auto p-1.5 rounded-2xl"
          style={{
            maxWidth: "540px",
            backgroundColor: "var(--color-surface)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex-1">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a video or audio URL..."
              type="url"
              style={{ border: "none", backgroundColor: "transparent" }}
            />
          </div>
          <Button type="submit" size="lg" disabled={!url.trim()}>
            Download
          </Button>
        </motion.form>
      </motion.div>
    </section>
  );
};
