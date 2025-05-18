
import { useState, useEffect } from "react";
import { useIsMobile } from "./use-mobile";

export const useSidebar = () => {
  // Use localStorage to persist sidebar state
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar-state");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const isMobile = useIsMobile();

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar-state", JSON.stringify(isOpen));
    }
  }, [isOpen, isMobile]);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return {
    isOpen,
    toggle,
    close,
    open
  };
};
