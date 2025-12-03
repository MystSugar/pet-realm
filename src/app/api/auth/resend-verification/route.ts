import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateEmailVerificationTemplate } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not (security)
      return NextResponse.json(
        { message: "If an account exists with this email, a verification link has been sent." },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${emailVerificationToken}`;
    const emailResult = await sendEmail({
      to: email,
      subject: "Verify your email - Pet Realm",
      html: generateEmailVerificationTemplate(user.name, verificationUrl),
    });

    // Log result
    // eslint-disable-next-line no-console
    console.log(`[Resend Verification] Email attempt for ${email}:`, {
      success: emailResult.success,
      error: emailResult.error || "none",
    });

    return NextResponse.json(
      { message: "Verification email sent! Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Resend verification error:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
