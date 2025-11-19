// src/utils/format.js
// Summary of file: This module provides utility functions for formatting dates into readable strings.
export function formatFriendly(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
