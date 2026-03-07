import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => (
  <motion.header
    className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
    style={{
      backgroundColor: "var(--color-header-bg)",
      WebkitBackdropFilter: "blur(16px)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-sm)",
    }}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
  >
    <nav className="flex items-center justify-between mx-auto" style={{ maxWidth: "var(--max-width)" }}>
      <Link
        to="/"
        className="text-xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        veeyds
      </Link>
      <div className="flex items-center gap-4">
        <Link
          to="/download"
          className="text-sm font-medium transition-opacity hover:opacity-70"
        >
          Download
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  </motion.header>
);
