import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Pet Realm <noreply@resend.com>",
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    // Log error for debugging but don't expose sensitive details
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Email service error:", error);
    }
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// NextAuth Magic Link Template (used by auth.ts)
export function generateMagicLinkTemplate(url: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in to Pet Realm</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background-color: #2563eb; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="color: white; font-weight: bold; font-size: 24px;">PR</span>
        </div>
        <h1 style="color: #1f2937; margin: 0;">Welcome back to Pet Realm!</h1>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #374151; margin-top: 0;">Sign in to your account</h2>
        <p>Click the button below to sign in to your Pet Realm account:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
            Sign In
          </a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${url}</p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p>Need help? Contact us at <a href="mailto:support@petrealm.com" style="color: #2563eb;">support@petrealm.com</a></p>
        <p>© 2025 Pet Realm. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

export function generateEmailVerificationTemplate(name: string, verificationUrl: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Pet Realm</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background-color: #2563eb; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="color: white; font-weight: bold; font-size: 24px;">PR</span>
        </div>
        <h1 style="color: #1f2937; margin: 0;">Welcome to Pet Realm!</h1>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #374151; margin-top: 0;">Verify Your Email Address</h2>
        <p>Hi ${name},</p>
        <p>Thanks for joining Pet Realm! To complete your registration and start shopping for your pets, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
            Verify Email Address
          </a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          This link will expire in 24 hours. If you didn't create an account with Pet Realm, you can safely ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p>Need help? Contact us at <a href="mailto:support@petrealm.com" style="color: #2563eb;">support@petrealm.com</a></p>
        <p>© 2025 Pet Realm. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetTemplate(name: string, resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Pet Realm</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background-color: #2563eb; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="color: white; font-weight: bold; font-size: 24px;">PR</span>
        </div>
        <h1 style="color: #1f2937; margin: 0;">Password Reset</h1>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #374151; margin-top: 0;">Reset Your Password</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password for your Pet Realm account. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
            Reset Password
          </a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email - your password will remain unchanged.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p>Need help? Contact us at <a href="mailto:support@petrealm.com" style="color: #2563eb;">support@petrealm.com</a></p>
        <p>© 2025 Pet Realm. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}
