import { Link } from "react-router-dom";

export const Footer = () => (
  <footer
    className="px-6 py-8 mt-auto"
    style={{ borderTop: "1px solid var(--color-border)" }}
  >
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mx-auto"
      style={{ maxWidth: "var(--max-width)" }}
    >
      <span
        className="text-sm font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        veeyds
      </span>
      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        Created by{" "}
        <a
          href="https://habibthadev.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors"
          style={{ color: "var(--color-accent)" }}
        >
          Habib Adebayo
        </a>
      </p>
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Home
        </Link>
        <Link
          to="/download"
          className="text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Download
        </Link>
      </div>
    </div>
  </footer>
);
