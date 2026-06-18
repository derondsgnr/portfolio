"use client";

import { Component, type ReactNode } from "react";

/* Wraps an interactive widget (globe/deck/console) so a render or commit error
   inside it can never crash the whole About page — it falls back quietly. */
export class WidgetBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // Swallowed by design — a broken bauble shouldn't break the page.
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
