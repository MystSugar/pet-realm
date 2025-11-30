import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductCategory, Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search");

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isAvailable: true,
      deletedAt: null,
      shop: {
        isVerified: true,
      },
    };

    if (category && Object.values(ProductCategory).includes(category as ProductCategory)) {
      where.category = category as ProductCategory;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        imagesUrl: true,
        tags: true,
        stock: true,
        isAvailable: true,
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
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return Response.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
