import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get seller's shop
    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true, name: true },
    });

    if (!shop) {
      return Response.json({ error: "Shop not found" }, { status: 404 });
    }

    // Fetch dashboard stats
    const [totalProducts, activeProducts, orders] = await Promise.all([
      prisma.product.count({
        where: { shopId: shop.id, deletedAt: null },
      }),
      prisma.product.count({
        where: { shopId: shop.id, deletedAt: null, isAvailable: true },
      }),
      prisma.order.findMany({
        where: { shopId: shop.id, deletedAt: null },
        select: {
          id: true,
          status: true,
          total: true,
        },
      }),
    ]);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const revenue = orders
      .filter((o) => o.status === "DELIVERED" || o.status === "PICKED_UP")
      .reduce((sum, o) => {
        const total = typeof o.total === "number" ? o.total : parseFloat(o.total.toString());
        return sum + total;
      }, 0);

    // Fetch recent orders
    const recentOrders = await prisma.order.findMany({
      where: { shopId: shop.id, deletedAt: null },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    return Response.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        revenue,
      },
      recentOrders,
    });
  } catch {
    return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
