"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminBackLink() {
  const pathname = usePathname();
  if (!pathname || pathname === "/admin") return null;

  return (
    <Link
      href="/admin"
      className="font-mono text-xs text-white/40 hover:text-white flex items-center gap-1"
    >
      ← Back
    </Link>
  );
}
