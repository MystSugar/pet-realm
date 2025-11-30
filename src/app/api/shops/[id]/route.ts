import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const shop = await prisma.shop.findUnique({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        banner: true,
        category: true,
        island: true,
        atoll: true,
        address: true,
        phone: true,
        email: true,
        businessHours: true,
        createdAt: true,
        products: {
          where: {
            deletedAt: null,
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
            isAvailable: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Transform products to match frontend expectations
    const transformedShop = {
      ...shop,
      products: shop.products.map((product) => ({
        ...product,
        shop: {
          id: shop.id,
          name: shop.name,
          island: shop.island,
          atoll: shop.atoll,
          isVerified: false, // Removed verification system
        },
      })),
    };

    return NextResponse.json({ shop: transformedShop });
  } catch {
    return NextResponse.json({ error: "Failed to fetch shop" }, { status: 500 });
  }
}
