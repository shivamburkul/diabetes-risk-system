import React from "react";

export default function Navbar({ theme, onToggleTheme, lang, onChangeLang, appName }) {
  return (
    <nav className="app-navbar">
      <div
        className="nav-brand"
        onClick={() => (window.location.href = "../../assessment-hub/index.html")}
      >
        <div className="brand-dot">🩸</div>
        Diabetes<em>IQ</em>
      </div>

      <span className="nav-sub">{appName}</span>

      <div className="nav-right">
        <div className="lang-grp">
          {["en", "hi", "mr"].map((l) => (
            <button
              key={l}
              className={`lang-b ${lang === l ? "active" : ""}`}
              onClick={() => onChangeLang(l)}
            >
              {l === "en" ? "EN" : l === "hi" ? "हि" : "मरा"}
            </button>
          ))}
        </div>

        <button className="theme-b" onClick={onToggleTheme}>
          <span className="t-sun">☀️</span>
          <span className="t-moon">🌙</span>
        </button>

        <button className="back-b" onClick={() => window.history.back()}>
          ← Hub
        </button>
      </div>
    </nav>
  );
}