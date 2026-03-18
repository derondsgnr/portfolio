"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-body uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground hover:bg-white",
        secondary: "border border-accent/40 text-accent hover:bg-accent/10",
        outline: "border border-white/20 text-white/80 hover:border-white/40 hover:text-white",
        ghost: "text-foreground/70 hover:text-foreground hover:bg-white/[0.04]",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "text-[10px] px-4 py-2 tracking-[0.2em]",
        md: "text-[11px] px-6 py-3 tracking-[0.15em]",
        lg: "text-[12px] px-8 py-4 tracking-[0.2em]",
        icon: "size-10 p-0 [&_svg]:size-4",
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
