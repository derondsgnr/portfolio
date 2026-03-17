"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-foreground hover:bg-white",
        secondary:
          "border border-accent/40 text-accent hover:bg-accent/10",
        ghost: "text-foreground/70 hover:text-foreground",
      },
      size: {
        sm: "text-[10px] px-4 py-2 tracking-[0.2em]",
        md: "text-[11px] px-6 py-3 tracking-[0.15em]",
        lg: "text-[12px] px-8 py-4 tracking-[0.2em]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
