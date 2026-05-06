"use client";

import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AdminConfirmAction({
  children,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: {
  children: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="border-white/[0.08] bg-[#0A0A0A] text-white shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-['Anton'] text-xl uppercase tracking-[0.08em] text-white">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-['Instrument_Sans'] text-sm leading-relaxed text-white/50">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/[0.08] bg-transparent font-['Instrument_Sans'] text-[10px] uppercase tracking-[0.14em] text-white/45 hover:bg-white/[0.04] hover:text-white">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              destructive
                ? "bg-red-400/15 font-['Instrument_Sans'] text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-400/25"
                : "bg-[#E2B93B] font-['Instrument_Sans'] text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A] hover:bg-white"
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
