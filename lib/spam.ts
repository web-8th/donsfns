import type { SpamCheckInput, SpamCheckResult } from '@/lib/types';

/** Humans need more than this to fill out the form. Bots submit almost instantly. */
export const MIN_FORM_ELAPSED_MS = 3000;

/**
 * Senders silently dropped before anything is sent or logged. Lowercase only.
 * Submissions from these get the normal success response, no notification email,
 * no auto-reply.
 */
export const BLOCKED_SENDERS: ReadonlySet<string> = new Set([
  'oleweber120@gmail.com', // "Viola Jackson" SEO / review spam
  'support@decentgears.com', // "David Lin" knockoff bags and watches spam
]);

export function isBlockedSender(email: unknown): boolean {
  return typeof email === 'string' && BLOCKED_SENDERS.has(email.trim().toLowerCase());
}

/** Bot traps for the contact form. Either one failing is an instant reject. */
export function checkSpam(input: SpamCheckInput): SpamCheckResult {
  if (input.website && input.website.trim() !== '') {
    return { isSpam: true, reason: 'honeypot filled' };
  }

  const elapsed = Number(input.formElapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FORM_ELAPSED_MS) {
    return {
      isSpam: true,
      reason: `submitted too fast (${input.formElapsedMs ?? 'missing'} ms)`,
    };
  }

  return { isSpam: false };
}
