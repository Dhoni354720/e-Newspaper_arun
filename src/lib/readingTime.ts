/**
 * Calculate estimated reading time in minutes for editorial content
 * Supports HTML stripping and accounts for Devanagari reading speeds (~160 wpm)
 */
export function calculateReadingTime(content: string, isDevanagari: boolean = true): number {
  if (!content) return 1;

  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').filter(Boolean).length;

  const wordsPerMinute = isDevanagari ? 160 : 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, minutes);
}
