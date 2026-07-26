// Shared shape for the "anonymous visitor submits text" concept behind both
// comments and recipe requests — kept in one place so the two API routes
// (and the client components that mirror their types) can't drift apart.

export const ANONYMOUS_NAME = "Anonymous Cook";

/** Trims a submitted display name, falling back to the site's anonymous persona. */
export function sanitizeDisplayName(name: unknown, maxLength = 60): string {
  return typeof name === "string" && name.trim()
    ? name.trim().slice(0, maxLength)
    : ANONYMOUS_NAME;
}

/** Stamps a new submission with its id and creation time. */
export function stampSubmission(): { id: string; createdAt: string } {
  return { id: crypto.randomUUID(), createdAt: new Date().toISOString() };
}

export interface Comment {
  id: string;
  slug: string;
  name: string;
  body: string;
  createdAt: string;
}
