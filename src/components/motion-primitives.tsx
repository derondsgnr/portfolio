import { motion, type Variants } from "motion/react";
import { type ReactNode, type ComponentProps } from "react";

// ─── Reveal on scroll ───────────────────────────────────────────
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger container ──────────────────────────────────────────
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger item ───────────────────────────────────────────────
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Text reveal (clip-path wipe) ──────────────────────────────
export function TextReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.9,
        ease: [0.77, 0, 0.175, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Horizontal line draw ───────────────────────────────────────
export function LineDraw({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 1.2,
        ease: [0.77, 0, 0.175, 1],
        delay,
      }}
      className={`h-px bg-white/10 origin-left ${className ?? ""}`}
    />
  );
}

// ─── Magnetic hover (for interactive elements) ──────────────────
export function MagneticWrap({
  children,
  className,
  ...props
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Parallax image wrapper ─────────────────────────────────────
export function ParallaxImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <motion.div className={`overflow-hidden ${className ?? ""}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}

// ─── Section transition wrapper ─────────────────────────────────
// Wraps each section for restrained, editorial enter transitions
type TransitionMode = "fade-up" | "wipe-up" | "scale" | "parallax" | "fade";

export function SectionTransition({
  children,
  className,
  mode = "fade-up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  mode?: TransitionMode;
  delay?: number;
}) {
  const variants: Record<TransitionMode, { initial: object; animate: object }> =
    {
      "fade-up": {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
      },
      "wipe-up": {
        initial: { clipPath: "inset(100% 0 0 0)" },
        animate: { clipPath: "inset(0% 0 0 0)" },
      },
      scale: {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
      },
      parallax: {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
      },
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      },
    };

  const v = variants[mode];

  return (
    <motion.div
      initial={v.initial as React.ComponentProps<typeof motion.div>["initial"]}
      whileInView={v.animate as React.ComponentProps<typeof motion.div>["whileInView"]}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: mode === "wipe-up" ? 1.2 : 1,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Horizontal wipe divider ────────────────────────────────────
export function WipeDivider({
  className,
  color = "rgba(255,255,255,0.06)",
  delay = 0,
  thickness = 1,
}: {
  className?: string;
  color?: string;
  delay?: number;
  thickness?: number;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 1.6,
        ease: [0.77, 0, 0.175, 1],
        delay,
      }}
      className={`origin-left ${className ?? ""}`}
      style={{ height: `${thickness}px`, background: color }}
    />
  );
}

// ─── Counter animate ────────────────────────────────────────────
export function CounterReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.span>
  );
}