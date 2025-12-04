import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the seller's shop
    const shop = await prisma.shop.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const { id } = await params;

    // Verify the order belongs to this shop and has a receipt
    const order = await prisma.order.findFirst({
      where: {
        id,
        shopId: shop.id,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.receiptUrl) {
      return NextResponse.json({ error: "No receipt uploaded yet" }, { status: 400 });
    }

    if (order.paymentStatus !== PaymentStatus.PENDING) {
      return NextResponse.json({ error: "Payment already verified" }, { status: 400 });
    }

    // Update payment status to VERIFIED and set timestamp
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        paymentStatus: PaymentStatus.VERIFIED,
        receiptVerifiedAt: new Date(),
      },
    });

    return NextResponse.json(updatedOrder);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
