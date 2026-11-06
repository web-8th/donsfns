import { buildConfirmationHtml, buildEmailHtml } from '@/lib/email';
import { Resend } from 'resend';

const SMS_SUBJECT = 'New quote';
// One SMS segment is 160 GSM-7 chars. Some gateways prepend the subject, so reserve it.
const SMS_MAX = 160 - (SMS_SUBJECT.length + 3);

// Plain ASCII only: a single non-GSM char (accent, curly quote) drops the limit to 70.
const toAscii = (s: string) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\x20-\x7e]/g, '')
    .trim();

function buildSmsText(p: {
  firstName: string;
  lastName: string;
  service: string;
  contact: string;
}) {
  const name = toAscii(`${p.firstName} ${p.lastName}`);
  const build = (n: string) =>
    `${n} - ${toAscii(p.service)}. Call ${toAscii(p.contact)}. Details in email. Do not reply here.`;

  const full = build(name);
  if (full.length <= SMS_MAX) return full;

  // Silently trim only the name to fit
  const trimmedName = name.slice(0, Math.max(0, name.length - (full.length - SMS_MAX)));
  return build(trimmedName.trim()).slice(0, SMS_MAX);
}

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '');
  const FROM_EMAIL = process.env.FROM_EMAIL || '';
  const TO_EMAIL = process.env.TO_EMAIL || '';
  const SMS_EMAIL = process.env.SMS_EMAIL;

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
  } = body;

  if (!/^\d{10}$/.test(phone ?? '')) {
    return Response.json(
      { success: false, error: 'Invalid phone number' },
      { status: 400 }
    );
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

  if (SMS_EMAIL) {
    try {
      // Resend returns { data, error } instead of throwing on API failures
      const { data, error } = await resend.emails.send({
        from: `Don's Fences <${FROM_EMAIL}>`,
        to: SMS_EMAIL,
        subject: 'New quote',
        text: buildSmsText({ firstName, lastName, service, contact: phone || email }),
      });
      if (error) console.error('SMS gateway send rejected:', error);
      else console.log('SMS gateway email queued:', data?.id);
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
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
