"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Check if user is logged in as admin (presence of 'token' cookie)
    const isAdmin = document.cookie.split(";").some((c) => c.trim().startsWith("token="));
    if (isAdmin) return;

    // Ignore admin routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/sign-in")) {
      return;
    }

    // Prevent duplicate logs for the same route due to React 18 double-effects
    if (lastPathnameRef.current === pathname) return;
    lastPathnameRef.current = pathname;

    // Retrieve or initialize session ID cookie
    let sessionId = "";
    const match = document.cookie.match(/(^|;)\s*visitor_session_id\s*=\s*([^;]+)/);
    if (match) {
      sessionId = match[2];
    } else {
      sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      document.cookie = `visitor_session_id=${sessionId}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }

    const referrer = document.referrer || "Direct";

    // Log the page view
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        path: pathname,
        referrer: referrer,
      }),
    }).catch((err) => console.error("Pageview log failed:", err));
  }, [pathname]);

  useEffect(() => {
    const handleOutboundClick = (e: MouseEvent) => {
      const isAdmin = document.cookie.split(";").some((c) => c.trim().startsWith("token="));
      if (isAdmin) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Classify outbound links
      let platform = "";
      if (href.includes("instagram.com")) {
        platform = "Instagram";
      } else if (href.includes("youtube.com") || href.includes("youtu.be")) {
        platform = "YouTube";
      } else if (href.includes("pinterest.com") || href.includes("pin.it")) {
        platform = "Pinterest";
      }

      if (platform) {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "social_click",
            path: window.location.pathname,
            label: platform,
          }),
        }).catch((err) => console.error("Outbound click log failed:", err));
      }
    };

    window.addEventListener("click", handleOutboundClick);
    return () => window.removeEventListener("click", handleOutboundClick);
  }, []);

  return null;
}
