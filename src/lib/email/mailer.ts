import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class EmailDeliveryError extends Error {}

export async function sendResetPasswordEmail(
  toEmail: string,
  resetUrl: string,
  tenantName?: string,
) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Reset your password${tenantName ? ` — ${tenantName}` : ''}</h2>
      <p>We received a request to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Reset Password</a></p>
      <p>Or copy this link: <br/>${resetUrl}</p>
      <p style="color:#666;font-size:12px;">If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: 'Reset your HRMS password',
      html,
    });
  } catch (err) {
    console.error('Failed to send reset password email:', err);
    throw new EmailDeliveryError('Could not send reset password email');
  }
}
