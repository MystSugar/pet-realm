import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            description: true,
            island: true,
            atoll: true,
            phone: true,
            email: true,
            isVerified: true,
            category: true,
          },
        },
      },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product is available
    if (!product.isAvailable) {
      return Response.json({ error: "Product is not available" }, { status: 404 });
    }

    return Response.json({ product });
  } catch {
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
