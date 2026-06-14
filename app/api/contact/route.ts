import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

import { buildConfirmationHtml, buildEmailHtml } from '@/lib/email';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  service: z.string().min(1),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const { firstName, lastName, email, phone, service, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const from = process.env.FROM_EMAIL ?? 'noreply@donsfences.ca';
  const to = process.env.CONTACT_EMAIL ?? '';

  await resend.emails.send({
    from,
    to: [to],
    subject: `New inquiry from ${firstName} ${lastName} — ${service}`,
    html: buildEmailHtml({ firstName, lastName, email, phone, service, message }),
  });

  await resend.emails.send({
    from,
    to: [email],
    subject: `Got your message — Don's Fences & Services`,
    html: buildConfirmationHtml({ firstName }),
  });

  return NextResponse.json({ success: true });
}
