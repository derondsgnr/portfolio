"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type BookingTab = "book" | "message";

interface BookingContextValue {
  isOpen: boolean;
  activeTab: BookingTab;
  open: (tab?: BookingTab) => void;
  close: () => void;
  setTab: (tab: BookingTab) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BookingTab>("book");

  const open = useCallback((tab: BookingTab = "book") => {
    setActiveTab(tab);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <BookingContext.Provider value={{ isOpen, activeTab, open, close, setTab: setActiveTab }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
