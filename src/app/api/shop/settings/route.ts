import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        logo: true,
        banner: true,
        island: true,
        atoll: true,
        address: true,
        phone: true,
        email: true,
        license: true,
        businessHours: true,
        deliveryZones: true,
        bankName: true,
        accountHolderName: true,
        accountNumber: true,
      },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("Error fetching shop settings:", error);
    return NextResponse.json({ error: "Failed to fetch shop settings" }, { status: 500 });
  }
}
