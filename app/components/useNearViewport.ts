"use client";

import { useEffect, useRef, useState } from "react";

export default function useNearViewport<T extends HTMLElement>(
  rootMargin = "240px 0px",
) {
  const targetRef = useRef<T>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (isNear || !targetRef.current) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setIsNear(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setIsNear(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [isNear, rootMargin]);

  return { targetRef, isNear };
}
