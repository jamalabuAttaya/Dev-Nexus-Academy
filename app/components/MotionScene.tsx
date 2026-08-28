import type { CSSProperties } from "react";

type MotionVariant = "home" | "courses" | "books" | "articles" | "roadmaps";

const sceneCopy: Record<MotionVariant, string[]> = {
  home: [
    "const future = await learn();",
    "npm run dream",
    "01001001",
    "{ build: true }",
  ],
  courses: ["compile()", "</skill>", "git push future", "while (learn)"],
  books: ["read()", "knowledge++", "{ open: true }", "∞ pages"],
  articles: ["new Idea()", "publish();", "#technology", "cursor: learn"],
  roadmaps: ["START", "NODE_04", "NEXT →", "100%"],
};

export default function MotionScene({ variant }: { variant: MotionVariant }) {
  return (
    <div className={`motion-scene motion-${variant}`} aria-hidden="true">
      <div className="motion-orbit orbit-one">
        <i />
        <i />
        <i />
      </div>
      <div className="motion-orbit orbit-two">
        <i />
        <i />
      </div>
      <div className="motion-core">
        <span>DN</span>
        <b />
      </div>
      <div className="motion-stream">
        {sceneCopy[variant].map((line, index) => (
          <code key={line} style={{ "--motion-index": index } as CSSProperties}>
            {line}
          </code>
        ))}
      </div>
      <div className="motion-particles">
        {Array.from({ length: 12 }).map((_, index) => (
          <i
            key={index}
            style={{ "--particle-index": index } as CSSProperties}
          />
        ))}
      </div>
      <div className="motion-scan" />
    </div>
  );
}
