import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "4");

    // Get the current product to find similar ones
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      select: { category: true, shopId: true },
    });

    if (!currentProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Find similar products (same category, different product, from verified shops)
    const similarProducts = await prisma.product.findMany({
      where: {
        id: { not: id },
        category: currentProduct.category,
        isAvailable: true,
        deletedAt: null,
        shop: {
          isVerified: true,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        imagesUrl: true,
        tags: true,
        stock: true,
        shop: {
          select: {
            id: true,
            name: true,
            island: true,
            atoll: true,
            isVerified: true,
          },
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ products: similarProducts });
  } catch {
    return Response.json({ error: "Failed to fetch similar products" }, { status: 500 });
  }
}
