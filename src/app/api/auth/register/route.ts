import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { AccountType } from "@prisma/client";
import { sendEmail, generateEmailVerificationTemplate } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, accountType, idNumber, idType } = body;

    // Validation
    if (!name || !email || !password || !accountType || !idNumber || !idType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!Object.values(AccountType).includes(accountType)) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
    }

    // Check if user already exists by email or idNumber
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { idNumber }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
      }
      if (existingUser.idNumber === idNumber) {
        return NextResponse.json({ error: "User with this ID number already exists" }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Infer userType from idType: National ID = Maldivian, Passport = Foreigner
    const userType = idType === "NATIONAL_ID" ? "MALDIVIAN" : "FOREIGNER";

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null, // Set to null if not provided
        password: hashedPassword,
        accountType: accountType as AccountType,
        emailVerified: false, // Start as not verified
        emailVerificationToken,
        emailVerificationExpires,
        idNumber,
        idType,
        userType, // Automatically inferred from idType
      },
    });

    // Send email verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${emailVerificationToken}`;
    const emailResult = await sendEmail({
      to: email,
      subject: "Welcome to Pet Realm - Verify your email",
      html: generateEmailVerificationTemplate(name, verificationUrl),
    });

    // Log for development but don't expose email sending failures to user
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`Verification email sent to ${email}: ${emailResult.success ? "Success" : emailResult.error}`);
      // eslint-disable-next-line no-console
      console.log(`Verification link: ${verificationUrl}`);
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "User created successfully! Please check your email to verify your account.",
        user: userWithoutPassword,
        requiresEmailVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    // Log error for debugging but don't expose in production
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Registration error:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
