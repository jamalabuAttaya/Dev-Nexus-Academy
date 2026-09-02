"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { PlayIcon } from "./HomeIcons";

export default function HeroCodeDemo() {
  const { tr } = useLanguage();
  const [codeRan, setCodeRan] = useState(false);

  return (
    <div className="code-card">
      <div className="window-bar">
        <span />
        <span />
        <span />
        <small>lesson.jsx</small>
      </div>
      <pre dir="ltr">
        <code>
          <span className="pink">const</span>{" "}
          <span className="blue">Nexus</span> ={" "}
          <span className="pink">async</span> () =&gt; {"{"}
          {"\n"} <span className="pink">const</span> skill ={" "}
          <span className="pink">await</span> learn();{"\n"}{" "}
          <span className="pink">return</span> &lt;
          <span className="lime">Future</span>
          {"\n"} poweredBy=<span className="amber">{`"curiosity"`}</span>
          {"\n"} level={"{"}skill + <span className="blue">1</span>
          {"}"}
          {"\n"} /&gt;;{"\n"}
          {"}"};
        </code>
      </pre>
      <div
        className={`run-row ${codeRan ? "is-running" : ""}`}
        aria-live="polite"
      >
        <span className="success-dot" />{" "}
        {codeRan
          ? tr(
              "البيئة جاهزة — ابدأ التعلّم",
              "Environment ready — start learning",
            )
          : tr("الكود جاهز للتجربة", "Code ready to run")}
        <button
          type="button"
          aria-label={tr("تشغيل نموذج الكود", "Run code preview")}
          aria-pressed={codeRan}
          onClick={() => setCodeRan((value) => !value)}
        >
          <PlayIcon />
        </button>
      </div>
    </div>
  );
}
