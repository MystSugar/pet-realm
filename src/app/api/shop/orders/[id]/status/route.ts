import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

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

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { id } = await params;

    // Verify the order belongs to this shop
    const order = await prisma.order.findFirst({
      where: {
        id,
        shopId: shop.id,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Set appropriate timestamp based on status
    const now = new Date();
    const timestampField: Record<string, Date | undefined> = {};
    
    if (status === "CONFIRMED") timestampField.confirmedAt = now;
    else if (status === "PREPARING") timestampField.preparingAt = now;
    else if (status === "READY_FOR_PICKUP") timestampField.readyAt = now;
    else if (status === "OUT_FOR_DELIVERY") timestampField.outForDeliveryAt = now;
    else if (status === "DELIVERED") timestampField.deliveredAt = now;
    else if (status === "PICKED_UP") timestampField.pickedUpAt = now;
    else if (status === "CANCELLED") timestampField.cancelledAt = now;

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        ...timestampField,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
