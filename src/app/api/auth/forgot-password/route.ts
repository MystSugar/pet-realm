import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, generatePasswordResetTemplate } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ message: "If an account with that email exists, we've sent a reset link" }, { status: 200 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // Send password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    const emailResult = await sendEmail({
      to: email,
      subject: "Reset your Pet Realm password",
      html: generatePasswordResetTemplate(user.name, resetUrl),
    });

    // Log for development but don't expose email sending failures to user
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`Password reset email sent to ${email}: ${emailResult.success ? "Success" : emailResult.error}`);
      // eslint-disable-next-line no-console
      console.log(`Reset link: ${resetUrl}`);
    }

    return NextResponse.json({ message: "If an account with that email exists, we've sent a reset link" }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Forgot password error:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
