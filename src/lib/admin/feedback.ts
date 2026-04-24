export type AdminSaveStatus = "idle" | "saving" | "ok" | "error";

export function getAdminErrorMessage(error?: string | null): string {
  if (!error) {
    return "Save failed before your changes reached the repo. Try again.";
  }

  const normalized = error.trim().toLowerCase();

  if (normalized === "unauthorized") {
    return "Your admin session expired. Sign in again and retry.";
  }

  if (normalized === "github_token not set") {
    return "Admin saves are not configured in this environment because GITHUB_TOKEN is missing.";
  }

  if (normalized === "comment not found") {
    return "That comment no longer exists. Refresh the list and try again.";
  }

  if (normalized === "failed to update") {
    return "Couldn't apply that update right now. Try again.";
  }

  if (normalized === "failed to delete") {
    return "Couldn't delete that item right now. Try again.";
  }

  if (normalized === "failed to save") {
    return "Couldn't save those changes right now. Try again.";
  }

  if (normalized === "failed to load monitoring overview." || normalized === "failed to load monitoring overview") {
    return "Couldn't load the monitoring overview right now. Refresh and try again.";
  }

  if (normalized === "monitoring action failed." || normalized === "monitoring action failed") {
    return "Couldn't complete that monitoring action right now. Try again.";
  }

  if (normalized === "failed to load comments") {
    return "Couldn't load comments right now. Refresh and try again.";
  }

  return error;
}

export function getAdminSaveMessage({
  status,
  error,
  savingMessage = "Saving changes to the repo...",
  successMessage = "Saved to the repo.",
}: {
  status: AdminSaveStatus;
  error?: string | null;
  savingMessage?: string;
  successMessage?: string;
}): string | null {
  if (status === "saving") return savingMessage;
  if (status === "ok") return successMessage;
  if (status === "error") return getAdminErrorMessage(error);
  return null;
}
