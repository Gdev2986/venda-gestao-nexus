
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}

export const useIsMobile = () => {
  return useMediaQuery("(max-width: 768px)");
};

// New function to get the current breakpoint
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("");
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 375) return setBreakpoint("xs");
      if (width < 426) return setBreakpoint("sm");
      if (width < 768) return setBreakpoint("md");
      if (width < 1024) return setBreakpoint("lg");
      if (width < 1440) return setBreakpoint("xl");
      return setBreakpoint("2xl");
    };
    
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);
  
  return breakpoint;
}

export default useIsMobile;
