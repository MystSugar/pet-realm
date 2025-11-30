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
    const { license, businessHours, deliveryZones } = body;

    // Update business details
    const updatedShop = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        license: license || null,
        businessHours: businessHours || null,
        deliveryZones: deliveryZones || null,
      },
      select: {
        id: true,
        license: true,
        businessHours: true,
        deliveryZones: true,
      },
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating business details:", error);
    return NextResponse.json({ error: "Failed to update business details" }, { status: 500 });
  }
}
