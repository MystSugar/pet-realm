import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { island, atoll, address, phone, email } = body;

    // Validate required fields
    if (!island || !atoll || !address || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update location info
    const updatedShop = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        island,
        atoll,
        address,
        phone,
        email: email || null,
      },
      select: {
        id: true,
        island: true,
        atoll: true,
        address: true,
        phone: true,
        email: true,
      },
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating location:", error);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}
