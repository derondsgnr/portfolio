"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./navbar";
import { BookingProvider } from "./v2/booking-context";
import { BookingDrawer } from "./v2/booking-drawer";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCaseStudy = /^\/work\/[^/]+$/.test(pathname ?? "");

  return (
    <BookingProvider>
      <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
        {!isCaseStudy && <Navbar />}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname ?? "root"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <BookingDrawer />
      </div>
    </BookingProvider>
  );
}
