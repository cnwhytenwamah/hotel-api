
import { Resend } from "resend";
import { env } from "../../../config/env";

const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

export class EmailService {
  async sendVerificationEmail(
    email: string,
    firstName: string,
    token: string
  ): Promise<void> {
    const verificationUrl =
      `${env.APP_URL}/verify-email?token=${encodeURIComponent(token)}`;

    await this.send({
      to: email,
      subject: "Verify your hotel account",
      html: `
        <h2>Hello ${this.escapeHtml(firstName)},</h2>
        <p>Please verify your email address by clicking the link below.</p>
        <p><a href="${verificationUrl}">Verify email address</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    token: string
  ): Promise<void> {
    const resetUrl =
      `${env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

    await this.send({
      to: email,
      subject: "Reset your hotel account password",
      html: `
        <h2>Hello ${this.escapeHtml(firstName)},</h2>
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link expires in 30 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });
  }

  private async send(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    if (!resend) {
      if (env.NODE_ENV === "development") {
        console.warn(
          `[EMAIL NOT SENT] Configure RESEND_API_KEY to send emails. Recipient: ${input.to}`
        );
        return;
      }

      throw new Error("Email service is not configured.");
    }

    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });
  }
}

export const emailService = new EmailService();
