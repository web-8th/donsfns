import { buildConfirmationHtml, buildEmailHtml } from '@/lib/email';
import { checkSpam, isBlockedSender } from '@/lib/spam';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '');
  const FROM_EMAIL = process.env.FROM_EMAIL || '';
  const TO_EMAIL = process.env.TO_EMAIL || '';

  const body = await req.json();
  const {
    firstName,
    lastName,
    email,
    phone,
    service,
    preferredDate,
    message,
    turnstileToken,
    website,
    formElapsedMs,
  } = body;

  // Blocked senders get a normal success response and nothing else: no emails,
  // no spam notification, no log line.
  if (isBlockedSender(email)) {
    return Response.json({ success: true }, { status: 200 });
  }

  if (!/^\d{10}$/.test(phone ?? '')) {
    return Response.json(
      { success: false, error: 'Invalid phone number' },
      { status: 400 }
    );
  }

  // Runs before Turnstile and before any email goes out. Spam gets the same
  // success response a real customer would, so senders can't tell they were filtered.
  const spam = checkSpam({ website, formElapsedMs });
  if (spam.isSpam) {
    console.warn('Contact form submission dropped as spam:', {
      reason: spam.reason,
      email,
      name: `${firstName} ${lastName}`,
      message: String(message ?? '').slice(0, 300),
    });

    // Vercel Hobby only keeps logs for an hour, so also email a copy of each drop.
    // Plain text only: bot-supplied content never gets rendered as HTML.
    const SPAM_NOTIFY_EMAIL = process.env.SPAM_NOTIFY_EMAIL;
    if (SPAM_NOTIFY_EMAIL) {
      try {
        await resend.emails.send({
          from: `Don's Fences Spam Filter <${FROM_EMAIL}>`,
          to: SPAM_NOTIFY_EMAIL,
          subject: `[Spam dropped] ${spam.reason}`,
          text: [
            `Reason: ${spam.reason}`,
            `Name: ${firstName} ${lastName}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Service: ${service}`,
            `Preferred date: ${preferredDate}`,
            `Honeypot (website): ${website || '(empty)'}`,
            `Elapsed: ${formElapsedMs ?? 'missing'} ms`,
            '',
            'Message:',
            String(message ?? '').slice(0, 2000),
          ].join('\n'),
        });
      } catch (error) {
        // Never let the notification break the fake success response.
        console.error('Failed to send spam notification:', error);
      }
    }

    return Response.json({ success: true }, { status: 200 });
  }

  const verifyRes = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.CLOUDFLARE_SECRET_KEY || '',
        response: turnstileToken || '',
        remoteip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
      }),
    }
  ).catch(() => null);
  const verification = verifyRes ? await verifyRes.json().catch(() => null) : null;

  if (!verification?.success) {
    return Response.json(
      { success: false, error: 'Verification failed' },
      { status: 403 }
    );
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: `Don's Fences & Services <${FROM_EMAIL}>`,
        to: TO_EMAIL,
        replyTo: email,
        subject: `New inquiry from ${firstName} ${lastName} — ${service}`,
        html: buildEmailHtml({
          firstName,
          lastName,
          email,
          phone,
          service,
          preferredDate,
          message,
        }),
      }),
      resend.emails.send({
        from: `Don's Fences & Services <${FROM_EMAIL}>`,
        to: email,
        subject: `We got your message — Don's Fences & Services`,
        html: buildConfirmationHtml({ firstName }),
      }),
    ]);
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }

  return Response.json({ success: true }, { status: 200 });
}
