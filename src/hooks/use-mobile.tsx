
import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
};

/**
 * Custom hook that returns the current breakpoint based on the screen width
 * Breakpoints: xs (<640px), sm (>=640px), md (>=768px), lg (>=1024px), xl (>=1280px), 2xl (>=1536px)
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("xs");

  useEffect(() => {
    const getBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) return "xs";
      if (width < 768) return "sm";
      if (width < 1024) return "md";
      if (width < 1280) return "lg";
      if (width < 1536) return "xl";
      return "2xl";
    };

    // Initial check
    setBreakpoint(getBreakpoint());

    // Add event listener
    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };
    
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};

export default useIsMobile;
