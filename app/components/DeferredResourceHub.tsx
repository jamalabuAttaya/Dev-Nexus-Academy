"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import useNearViewport from "./useNearViewport";

const ResourceHub = dynamic(() => import("./ResourceHub"), {
  ssr: false,
});

function ResourceHubPreview() {
  const { tr } = useLanguage();

  return (
    <section
      className="resource-section section deferred-resource-preview"
      id="library"
    >
      <div className="shell">
        <div className="resource-topline">
          <div>
            <div className="eyebrow dark">
              <span />{" "}
              {tr(
                "مكتبة متجددة من أفضل المصادر",
                "A growing library from trusted sources",
              )}
            </div>
            <h2>
              {tr("كل ما تحتاجه لتتعلّم", "Everything you need to learn")}
              <br />
              <em>{tr("في مكان واحد.", "in one place.")}</em>
            </h2>
          </div>
          <div className="api-status">
            <i /> {tr("تُحمّل عند الطلب", "Loaded on demand")}
          </div>
        </div>

        <div className="deferred-resource-links">
          <Link href="/books">
            <b>▤</b>
            <span>{tr("كتب مجانية", "Free books")}</span>
          </Link>
          <Link href="/courses">
            <b>▶</b>
            <span>{tr("كورسات", "Courses")}</span>
          </Link>
          <Link href="/articles">
            <b>✦</b>
            <span>{tr("مقالات", "Articles")}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function DeferredResourceHub() {
  const { targetRef, isNear } = useNearViewport<HTMLDivElement>("200px 0px");

  return (
    <div className="deferred-home-block" ref={targetRef}>
      {isNear ? <ResourceHub /> : <ResourceHubPreview />}
    </div>
  );
}
