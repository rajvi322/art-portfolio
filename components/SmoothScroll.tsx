"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if we are on a touch device, sometimes momentum scroll is better off on touch
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential ease out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // Optional: disable on touch devices to preserve native momentum scroll
      touchMultiplier: isTouch ? 0 : 2,
    });

    lenisRef.current = lenis;

    // Use ResizeObserver to automatically resize Lenis when document height changes
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    let rfId: number;
    function raf(time: number) {
      lenis.raf(time);
      rfId = requestAnimationFrame(raf);
    }

    rfId = requestAnimationFrame(raf);

    return () => {
      resizeObserver.disconnect();
      lenis.destroy();
      cancelAnimationFrame(rfId);
      lenisRef.current = null;
    };
  }, []);

  // Listen to path changes to scroll to top and force resize recalculation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      lenisRef.current.resize();
    }
  }, [pathname]);

  return <>{children}</>;
}

