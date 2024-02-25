"use client";
import Lenis from "@studio-freight/lenis/types";
import { useEffect } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return children;
}
