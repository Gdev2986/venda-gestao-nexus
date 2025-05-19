
import { useState } from "react";

export interface DialogState<T = any> {
  isOpen: boolean;
  data?: T;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openWith: (data: T) => void;
}

export function useDialog<T = any>(initialState = false): DialogState<T> {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  const [data, setData] = useState<T | undefined>(undefined);
  
  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setData(undefined);
  };
  const toggle = () => setIsOpen(!isOpen);
  const openWith = (newData: T) => {
    setData(newData);
    setIsOpen(true);
  };
  
  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setIsOpen,
    openWith
  };
}
