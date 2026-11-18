export interface SpamCheckInput {
  /** Honeypot. Real users never see or fill this field. */
  website?: string;
  /** Milliseconds between the form rendering and the user submitting it. */
  formElapsedMs?: number;
}

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
}
