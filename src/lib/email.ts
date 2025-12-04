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
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffefb;">
      <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(123, 179, 217, 0.15); border: 1px solid #e6f2fb;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7bb3d9 0%, #5a93c2 100%); padding: 50px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Pet Realm</h1>
          <p style="color: rgba(255, 255, 255, 0.95); margin: 12px 0 0 0; font-size: 16px;">Your journey to pet care excellence starts here</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2d3748; margin-top: 0; font-size: 22px;">Hi ${name}!</h2>
          <p style="color: #4a5568; font-size: 16px; margin: 20px 0;">Thank you for joining Pet Realm, the Maldives' premier online marketplace for all your pet needs! We're excited to have you as part of our community.</p>
          
          <p style="color: #4a5568; font-size: 16px; margin: 20px 0;">To get started and unlock access to our wide range of pet products and services, please verify your email address by clicking the button below:</p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #7bb3d9 0%, #5a93c2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(123, 179, 217, 0.4);">
              Verify My Email Address
            </a>
          </div>
          
          <!-- Important Notice Box -->
          <div style="background-color: #fff7f1; border-left: 4px solid #f4a76f; padding: 16px; border-radius: 12px; margin: 30px 0;">
            <p style="margin: 0; color: #8f4e22; font-size: 14px; font-weight: 600;">Important: Use the direct link</p>
            <p style="margin: 8px 0 0 0; color: #b56d35; font-size: 14px;">
              If your email provider (like Gmail) shows a "Safe Link" redirect or tracking URL, please copy the original verification link below and paste it directly into your browser to avoid any issues.
            </p>
          </div>
          
          <!-- Link Section -->
          <div style="background-color: #f3f8fc; padding: 20px; border-radius: 12px; border: 1px solid #cee4f6; margin: 20px 0;">
            <p style="color: #4a5568; font-size: 13px; margin: 0 0 10px 0; font-weight: 600;">Or copy this verification link:</p>
            <p style="word-break: break-all; color: #4374a0; font-size: 13px; margin: 0; font-family: 'Courier New', monospace; background-color: white; padding: 12px; border-radius: 8px; border: 1px solid #cee4f6;">${verificationUrl}</p>
          </div>
          
          <!-- Footer Notes -->
          <div style="margin-top: 35px; padding-top: 25px; border-top: 2px solid #e6f2fb;">
            <p style="color: #718096; font-size: 14px; margin: 0 0 12px 0;">
              <strong>This verification link expires in 24 hours.</strong>
            </p>
            <p style="color: #718096; font-size: 14px; margin: 0;">
              If you didn't create a Pet Realm account, you can safely ignore this email. No further action is required.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f3f8fc; padding: 30px; text-align: center; border-top: 1px solid #cee4f6;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
            Need help? We're here for you! 
            <a href="mailto:support@petrealm.com" style="color: #7bb3d9; text-decoration: none; font-weight: 500;">support@petrealm.com</a>
          </p>
          <p style="color: #718096; font-size: 13px; margin: 15px 0 0 0;">
            © 2025 Pet Realm. All rights reserved.
          </p>
          <p style="color: #a0aec0; font-size: 12px; margin: 5px 0 0 0;">
            Maldives' Premier Pet Care Marketplace
          </p>
        </div>
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
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffefb;">
      <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(123, 179, 217, 0.15); border: 1px solid #e6f2fb;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7bb3d9 0%, #5a93c2 100%); padding: 50px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Pet Realm</h1>
          <p style="color: rgba(255, 255, 255, 0.95); margin: 12px 0 0 0; font-size: 16px;">Reset your password securely</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2d3748; margin-top: 0; font-size: 22px;">Hi ${name}!</h2>
          <p style="color: #4a5568; font-size: 16px; margin: 20px 0;">We received a request to reset your password for your Pet Realm account. No worries - it happens to the best of us!</p>
          
          <p style="color: #4a5568; font-size: 16px; margin: 20px 0;">Click the button below to create a new password and regain access to your account:</p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #7bb3d9 0%, #5a93c2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(123, 179, 217, 0.4);">
              Reset My Password
            </a>
          </div>
          
          <!-- Important Notice Box -->
          <div style="background-color: #fff7f1; border-left: 4px solid #f4a76f; padding: 16px; border-radius: 12px; margin: 30px 0;">
            <p style="margin: 0; color: #8f4e22; font-size: 14px; font-weight: 600;">Important: Use the direct link</p>
            <p style="margin: 8px 0 0 0; color: #b56d35; font-size: 14px;">
              If your email provider (like Gmail) shows a "Safe Link" redirect or tracking URL, please copy the original reset link below and paste it directly into your browser to avoid any issues.
            </p>
          </div>
          
          <!-- Link Section -->
          <div style="background-color: #f3f8fc; padding: 20px; border-radius: 12px; border: 1px solid #cee4f6; margin: 20px 0;">
            <p style="color: #4a5568; font-size: 13px; margin: 0 0 10px 0; font-weight: 600;">Or copy this reset link:</p>
            <p style="word-break: break-all; color: #4374a0; font-size: 13px; margin: 0; font-family: 'Courier New', monospace; background-color: white; padding: 12px; border-radius: 8px; border: 1px solid #cee4f6;">${resetUrl}</p>
          </div>
          
          <!-- Footer Notes -->
          <div style="margin-top: 35px; padding-top: 25px; border-top: 2px solid #e6f2fb;">
            <p style="color: #718096; font-size: 14px; margin: 0 0 12px 0;">
              <strong>This password reset link expires in 1 hour.</strong>
            </p>
            <p style="color: #718096; font-size: 14px; margin: 0;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged and your account is secure.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f3f8fc; padding: 30px; text-align: center; border-top: 1px solid #cee4f6;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
            Need help? We're here for you! 
            <a href="mailto:support@petrealm.com" style="color: #7bb3d9; text-decoration: none; font-weight: 500;">support@petrealm.com</a>
          </p>
          <p style="color: #718096; font-size: 13px; margin: 15px 0 0 0;">
            © 2025 Pet Realm. All rights reserved.
          </p>
          <p style="color: #a0aec0; font-size: 12px; margin: 5px 0 0 0;">
            Maldives' Premier Pet Care Marketplace
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
