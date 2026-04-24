export function getLoginErrorMessage(error?: string | null): string {
  if (!error) {
    return "Admin access is unavailable right now. Try again in a moment.";
  }

  if (error === "config") {
    return "Admin login is not configured because ADMIN_SECRET is missing in this environment.";
  }

  return error;
}

export function getContactErrorMessage(error?: string | null): string {
  if (!error) {
    return "Couldn't send your message right now. Please try again.";
  }

  return error;
}

export function getCommentLoadErrorMessage(error?: string | null): string {
  if (!error) {
    return "Comments are unavailable right now. Please try again later.";
  }

  return error;
}

export function getCommentSubmitErrorMessage(error?: string | null): string {
  if (!error) {
    return "Couldn't post your comment right now. Please try again.";
  }

  return error;
}
