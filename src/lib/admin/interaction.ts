import type { KeyboardEvent } from "react";

export function openOnKeyboard(
  event: KeyboardEvent<HTMLElement>,
  open: () => void
) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  open();
}
