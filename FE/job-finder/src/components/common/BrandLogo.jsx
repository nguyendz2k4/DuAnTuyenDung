import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/router";

const BrandLogo = ({ size = "medium", light = false }) => {
  const isLarge = size === "large";
  const isSmall = size === "small";

  const logoHeight = isLarge ? "32px" : isSmall ? "20px" : "26px";
  const fontSize = isLarge ? "24px" : isSmall ? "16px" : "20px";

  return (
    <Link to={ROUTES.USER.HOME} style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
      {/* Dynamic artistic SVG icon representing job connection */}
      <svg
        width="auto"
        height={logoHeight}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transition: "transform 0.3s ease" }}
        className="brand-logo-svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#6366F1" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Connection node icon - stylized T and J connection */}
        <rect x="4" y="6" width="24" height="20" rx="6" stroke="url(#logoGrad)" strokeWidth="3" fill="none" />
        <path d="M10 13 H22" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 13 V21 C16 23 14.5 24 13 24" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="13" r="3" fill="url(#logoGrad)" />
      </svg>

      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: fontSize,
          letterSpacing: "-0.5px",
          color: light ? "#FFFFFF" : "#0F172A",
          display: "flex",
          alignItems: "center"
        }}
      >
        Top
        <span
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginLeft: "2px"
          }}
        >
          Job
        </span>
      </span>
    </Link>
  );
};

export default BrandLogo;
