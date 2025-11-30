import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "Pet Realm API is operational",
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Health check failed",
      },
      { status: 500 }
    );
  }
}
