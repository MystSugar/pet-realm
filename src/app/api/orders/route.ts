import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fetch orders for the current user
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          customerId: session.user.id,
          deletedAt: null,
        },
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              island: true,
              atoll: true,
            },
          },
          items: {
            select: {
              id: true,
              quantity: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: {
          customerId: session.user.id,
          deletedAt: null,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return Response.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
