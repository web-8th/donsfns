/**
 * Client-side cooldown between contact form submissions, stored in localStorage.
 * Stops accidental double sends from real visitors. It is NOT a defence against bots,
 * which post to the API directly; that's what the spam filter in lib/spam.ts is for.
 */
const RATE_LIMIT_KEY = 'contact_last_sent';
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

export function canSendEmail(): boolean {
  if (typeof window === 'undefined') return true;
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return true;
  return Date.now() - parseInt(last, 10) > COOLDOWN_MS;
}

export function getRemainingCooldown(): number {
  if (typeof window === 'undefined') return 0;
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return 0;
  const remaining = COOLDOWN_MS - (Date.now() - parseInt(last, 10));
  return Math.max(0, remaining);
}

export function markEmailSent(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
}
