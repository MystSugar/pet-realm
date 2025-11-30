import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await prisma.order.groupBy({
      by: ["status"],
      where: {
        customerId: session.user.id,
      },
      _count: true,
    });

    const total = stats.reduce((sum, stat) => sum + stat._count, 0);
    const pending = stats.find((s) => s.status === "PENDING")?._count || 0;
    const completed = stats.find((s) => s.status === "DELIVERED")?._count || 0;

    return NextResponse.json({
      total,
      pending,
      completed,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order stats" }, { status: 500 });
  }
}
