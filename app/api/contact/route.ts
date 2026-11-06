import { buildConfirmationHtml, buildEmailHtml } from '@/lib/email';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '');
  const FROM_EMAIL = process.env.FROM_EMAIL || 'donsfences@web8th.com';
  const TO_EMAIL = process.env.TO_EMAIL || 'doncookbc@yahoo.ca';
  const SMS_EMAIL = process.env.SMS_EMAIL || '';

  const body = await req.json();
  const { firstName, lastName, email, phone, service, preferredDate, message } = body;

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
