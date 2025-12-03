import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5");

    const orders = await prisma.order.findMany({
      where: {
        customerId: session.user.id,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Convert Prisma Decimal to number for JSON serialization
    const ordersWithNumbers = orders.map((order) => ({
      ...order,
      totalAmount: typeof order.total === "number" ? order.total : parseFloat(order.total.toString()),
    }));

    return NextResponse.json({ orders: ordersWithNumbers });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
