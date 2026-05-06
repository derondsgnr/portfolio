"use client";

import { useEffect } from "react";

function isTextEditingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

export function useAdminEditorShortcuts({
  onSave,
  onCancel,
  saveEnabled = true,
  cancelEnabled = true,
}: {
  onSave?: () => void;
  onCancel?: () => void;
  saveEnabled?: boolean;
  cancelEnabled?: boolean;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        if (!onSave || !saveEnabled) return;
        event.preventDefault();
        onSave();
        return;
      }

      if (event.key === "Escape" && onCancel && cancelEnabled && !isTextEditingTarget(event.target)) {
        event.preventDefault();
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cancelEnabled, onCancel, onSave, saveEnabled]);
}
