"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener
    mediaQuery.addEventListener("change", listener);

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]); // Re-run if query changes

  return matches;
}
