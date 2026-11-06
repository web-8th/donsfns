import { buildConfirmationHtml, buildEmailHtml } from '@/lib/email';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '');
  // email that is sent from
  const FROM_EMAIL = process.env.FROM_EMAIL || 'donsfences@web8th.com';
  // address that receives the email, which is don's inbox
  const TO_EMAIL = process.env.TO_EMAIL || 'doncookbc@yahoo.ca';
  const SMS_EMAIL = process.env.SMS_EMAIL || '';

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
