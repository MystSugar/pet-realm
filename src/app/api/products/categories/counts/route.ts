import { prisma } from "@/lib/prisma";
import { ProductCategory } from "@prisma/client";

export async function GET() {
  try {
    // Get product counts for each category
    const categoryCounts = await prisma.product.groupBy({
      by: ["category"],
      where: {
        isAvailable: true,
        stock: { gt: 0 },
        deletedAt: null,
        shop: {
          isVerified: true,
        },
      },
      _count: true,
    });

    // Convert to object for easier access
    const counts: Record<ProductCategory, number> = {} as Record<ProductCategory, number>;

    // Initialize all categories to 0
    Object.values(ProductCategory).forEach((category) => {
      counts[category] = 0;
    });

    // Set actual counts
    categoryCounts.forEach(({ category, _count }) => {
      if (_count) {
        counts[category] = _count;
      }
    });

    return Response.json({ counts });
  } catch {
    return Response.json({ error: "Failed to fetch category counts" }, { status: 500 });
  }
}
