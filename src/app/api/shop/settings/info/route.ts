import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShopCategory } from "@prisma/client";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, category, logo, banner } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(ShopCategory).includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Update shop info
    const updatedShop = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        name,
        description: description || null,
        category,
        logo: logo || null,
        banner: banner || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        logo: true,
        banner: true,
      },
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error("Error updating shop info:", error);
    return NextResponse.json(
      { error: "Failed to update shop info" },
      { status: 500 }
    );
  }
}
