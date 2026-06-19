"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useIsHidden } from "@/contexts/site-config-context";

type SafeLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Rendered instead of the link when the target page is hidden. Default: nothing. */
  fallback?: ReactNode;
};

/**
 * A `next/link` that disappears when its target is a hidden page. Use it for any
 * internal link to a nav-managed section (/work, /blog, /about, /craft, /now,
 * /#services) so hiding a page automatically removes every visible route to it.
 */
export function SafeLink({ href, fallback = null, children, ...rest }: SafeLinkProps) {
  const hidden = useIsHidden(href);
  if (hidden) return <>{fallback}</>;
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
