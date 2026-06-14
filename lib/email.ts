export function buildEmailHtml({
  firstName,
  lastName,
  email,
  phone,
  service,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
}) {
  const optionalRow = (label: string, value?: string) =>
    value
      ? `
      <tr>
        <td style="color:#8a7f6e;padding:6px 0;width:120px;vertical-align:top;font-family:Georgia,serif;font-size:13px;">${label}</td>
        <td style="color:#3d3126;padding:6px 0;font-family:Georgia,serif;font-size:13px;">${value}</td>
      </tr>`
      : '';

  const optionalMessage = message
    ? `
    <div style="border-left:2px solid #d4c9b8;padding-left:1rem;margin-bottom:1.5rem;">
      <p style="font-size:12px;color:#8a7f6e;margin:0 0 4px;font-family:Georgia,serif;text-transform:uppercase;letter-spacing:0.08em;">Message</p>
      <p style="font-size:14px;color:#3d3126;margin:0;line-height:1.7;font-family:Georgia,serif;">${message}</p>
    </div>`
    : '';

  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#fdf9f4;border:1px solid #d4c9b8;border-radius:4px;overflow:hidden;">

      <div style="background:#3d3126;padding:2rem;text-align:center;">
        <p style="color:#f5ede3;font-size:24px;font-weight:400;margin:0;letter-spacing:0.05em;">You have a new inquiry</p>
        <p style="color:#c4b49e;font-size:13px;margin:6px 0 0;letter-spacing:0.04em;">Don's Fences &amp; Services</p>
      </div>

      <div style="padding:2rem;">
        <div style="background:#f5ede3;border:1px solid #d4c9b8;border-radius:4px;padding:1.25rem;margin-bottom:1.5rem;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#8a7f6e;padding:6px 0;width:120px;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;">Name</td>
              <td style="color:#3d3126;font-weight:500;padding:6px 0;font-size:14px;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="color:#8a7f6e;padding:6px 0;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;">Email</td>
              <td style="color:#3d3126;padding:6px 0;font-size:14px;">${email}</td>
            </tr>
            ${optionalRow('Phone', phone)}
            ${optionalRow('Service', service)}
          </table>
        </div>

        ${optionalMessage}

        <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Your Don's Fences & Services inquiry, ${firstName}`)}"
          style="display:block;text-align:center;background:#3d3126;color:#f5ede3;text-decoration:none;padding:14px;border-radius:4px;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">
          Reply to ${firstName}
        </a>

        <div style="margin-top:1.5rem;font-size:11px;color:#8a7f6e;text-align:center;">Sent from Don's Fences &amp; Services — donsfences.ca</div>
      </div>

    </div>
  `;
}

export function buildConfirmationHtml({ firstName }: { firstName: string }) {
  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#fdf9f4;border:1px solid #d4c9b8;border-radius:4px;overflow:hidden;">

      <div style="background:#3d3126;padding:2rem;text-align:center;">
        <p style="color:#f5ede3;font-size:24px;font-weight:400;margin:0;letter-spacing:0.05em;">Don's Fences &amp; Services</p>
        <p style="color:#c4b49e;font-size:13px;margin:6px 0 0;letter-spacing:0.04em;">Enderby, BC</p>
      </div>

      <div style="padding:2rem;">
        <p style="font-size:15px;color:#3d3126;margin:0 0 1rem;font-family:Georgia,serif;">Hi ${firstName},</p>
        <p style="font-size:14px;color:#3d3126;line-height:1.7;margin:0 0 1.5rem;font-family:Georgia,serif;">
          Thanks for reaching out. I've received your message and will get back to you shortly.
        </p>
        <p style="font-size:14px;color:#8a7f6e;line-height:1.7;margin:0;font-family:Georgia,serif;">
          — Don<br>
          <span style="font-size:12px;">Don's Fences &amp; Services · donsfences.ca</span>
        </p>
      </div>

    </div>
  `;
}
