"use client";

import { useEffect, useRef } from "react";

type AnimHandle = { destroy: () => void };

export function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  className = "",
  style,
}: {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimHandle | null>(null);

  useEffect(() => {
    if (!src || !containerRef.current) return;
    let cancelled = false;

    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      animRef.current?.destroy();
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        path: src,
      }) as AnimHandle;
    });

    return () => {
      cancelled = true;
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} />;
}
