/**
 * Strips known bad strings from API-fetched content before rendering.
 * "Stop Claude" is a stray debug artifact that may appear in product data.
 * "Master Cheif" corrects a known DB typo at display time;
 * the middleware handles the slug-level 301 redirect.
 */

export function sanitizeText(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/Stop Claude/gi, "")
    .replace(/Master Cheif/g, "Master Chief")
    .trim();
}
