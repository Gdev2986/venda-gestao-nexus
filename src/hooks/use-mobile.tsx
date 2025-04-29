
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    // Check if window is available (to avoid SSR issues)
    if (typeof window !== "undefined") {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  useEffect(() => {
    // Check if window is available
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);
    
    // Initial check
    handleResize();
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
