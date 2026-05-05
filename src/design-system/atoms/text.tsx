"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      heading: "font-heading uppercase tracking-tight text-foreground",
      body: "font-body text-foreground/90",
      label: "font-mono text-[10px] tracking-[0.2em] text-accent uppercase",
      caption: "font-mono text-[9px] tracking-[0.15em] text-muted-foreground/70 uppercase",
    },
    size: {
      xs: "text-[9px]",
      sm: "text-[10px]",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
  },
  defaultVariants: {
    variant: "body",
    size: "md",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {
  as?: "span" | "p" | "div";
}

export function Text({
  className,
  variant,
  size,
  as: Component = "span",
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ variant, size, className }))}
      {...props}
    />
  );
}
