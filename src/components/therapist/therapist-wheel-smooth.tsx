"use client";

import { useEffect } from "react";

/** Slightly slower wheel inside scroll containers — same idea as XRPL Control Room (0.4 there). */
const SCROLL_SPEED_FACTOR = 0.52;

function getScrollableElement(el: HTMLElement | null): HTMLElement | null {
  while (el && el !== document.body) {
    const { overflowY, overflowX, overflow } = getComputedStyle(el);
    const canScrollY = el.scrollHeight > el.clientHeight;
    const canScrollX = el.scrollWidth > el.clientWidth;
    const scrollableY =
      (overflowY === "auto" ||
        overflowY === "scroll" ||
        overflow === "auto" ||
        overflow === "scroll") &&
      canScrollY;
    const scrollableX =
      (overflowX === "auto" ||
        overflowX === "scroll" ||
        overflow === "auto" ||
        overflow === "scroll") &&
      canScrollX;
    if (scrollableY || scrollableX) return el;
    el = el.parentElement;
  }
  return null;
}

export function TherapistWheelSmooth() {
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const scrollable = getScrollableElement(e.target as HTMLElement);
      if (!scrollable) return;
      const deltaY = e.deltaY * SCROLL_SPEED_FACTOR;
      const deltaX = e.deltaX * SCROLL_SPEED_FACTOR;
      if (deltaY !== 0 || deltaX !== 0) {
        e.preventDefault();
        scrollable.scrollTop += deltaY;
        scrollable.scrollLeft += deltaX;
      }
    }
    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () =>
      document.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  return null;
}
