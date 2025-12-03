import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    if (!user) {
      return NextResponse.json({ emailVerified: null }, { status: 200 });
    }

    return NextResponse.json({ emailVerified: user.emailVerified }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Check verification error:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
