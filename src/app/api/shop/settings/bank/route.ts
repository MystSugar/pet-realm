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
    const { bankName, accountHolderName, accountNumber } = body;

    // Update bank information
    const updatedShop = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        bankName: bankName || null,
        accountHolderName: accountHolderName || null,
        accountNumber: accountNumber || null,
      },
      select: {
        id: true,
        bankName: true,
        accountHolderName: true,
        accountNumber: true,
      },
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error("Error updating bank information:", error);
    return NextResponse.json(
      { error: "Failed to update bank information" },
      { status: 500 }
    );
  }
}
