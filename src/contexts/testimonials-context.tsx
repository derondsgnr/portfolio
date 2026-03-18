"use client";

import { createContext, useContext } from "react";
import type { TestimonialItem } from "@/lib/content/testimonials";
import { DEFAULT_TESTIMONIALS } from "@/lib/content/defaults";

const TestimonialsContext = createContext<TestimonialItem[] | null>(null);

export function TestimonialsProvider({
  testimonials,
  children,
}: {
  testimonials: TestimonialItem[];
  children: React.ReactNode;
}) {
  return (
    <TestimonialsContext.Provider value={testimonials}>
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials(): TestimonialItem[] {
  const ctx = useContext(TestimonialsContext);
  return ctx ?? DEFAULT_TESTIMONIALS;
}
