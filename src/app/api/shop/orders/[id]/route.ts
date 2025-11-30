import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Fetch the order with all details
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        shopId: shop.id,
        deletedAt: null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imagesUrl: true,
              },
            },
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            bankName: true,
            accountHolderName: true,
            accountNumber: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate signed URL for receipt if it exists
    let receiptUrl = order.receiptUrl;
    if (receiptUrl && !receiptUrl.startsWith("/uploads/")) {
      // It's an R2 key, generate signed URL
      const { generateReceiptSignedUrl } = await import("@/lib/r2-receipts");
      receiptUrl = await generateReceiptSignedUrl(receiptUrl);
    }

    return NextResponse.json({
      ...order,
      receiptUrl,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY"],
  READY_FOR_PICKUP: ["PICKED_UP"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
};

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify order exists and belongs to the shop
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
        shopId: shop.id,
        deletedAt: null,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Validate status transition
    const allowedTransitions = VALID_STATUS_TRANSITIONS[existingOrder.status] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json({ error: `Cannot transition from ${existingOrder.status} to ${status}` }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                imagesUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
