import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShopCategory } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as ShopCategory | null;
    const island = searchParams.get("island");
    const atoll = searchParams.get("atoll");

    // Build where clause
    const whereClause: {
      setupComplete: boolean;
      isActive: boolean;
      deletedAt: null;
      category?: ShopCategory;
      island?: string;
      atoll?: string;
    } = {
      setupComplete: true,
      isActive: true,
      deletedAt: null,
    };

    if (category) {
      whereClause.category = category;
    }

    if (island) {
      whereClause.island = island;
    }

    if (atoll) {
      whereClause.atoll = atoll;
    }

    const shops = await prisma.shop.findMany({
      where: whereClause,
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
        _count: {
          select: {
            products: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ shops });
  } catch {
    return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
  }
}
