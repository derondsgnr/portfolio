"use client";

import React, { useState } from "react";
import { cn } from "@/components/ui/utils";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMzMzIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=";

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  style,
  fallbackSrc = ERROR_IMG_SRC,
  fallbackClassName,
  onError,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setDidError(true);
    onError?.(e);
  };

  if (didError) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center bg-white/[0.03] text-white/20",
          fallbackClassName ?? className
        )}
        style={style}
      >
        <img
          src={fallbackSrc}
          alt={alt ?? "Image unavailable"}
          data-original-url={src}
          className={cn("max-w-full max-h-full object-contain", className)}
          {...rest}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? ""}
      className={className}
      style={style}
      onError={handleError}
      {...rest}
    />
  );
}
