import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const NotFoundPage = () => (
  <motion.div
    className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
  >
    <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-4">
      404
    </p>
    <h1 className="font-display text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-3">
      Page not found
    </h1>
    <p className="text-[var(--color-muted)] max-w-sm mb-8 text-sm leading-relaxed">
      The page you are looking for does not exist or has been moved.
    </p>
    <Link
      to="/"
      className="px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-medium text-sm transition-opacity hover:opacity-90"
    >
      Back to home
    </Link>
  </motion.div>
);
