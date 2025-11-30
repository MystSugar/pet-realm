import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReceiptSignedUrl } from "@/lib/r2-receipts";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
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
            island: true,
            atoll: true,
            phone: true,
            bankName: true,
            accountHolderName: true,
            accountNumber: true,
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Check authorization - only order owner or shop owner can view
    if (order.customerId !== session.user.id && order.shopId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate signed URL for receipt if it exists and is stored in R2
    if (order.receiptUrl && !order.receiptUrl.startsWith("/uploads/")) {
      try {
        const signedUrl = await generateReceiptSignedUrl(order.receiptUrl);
        return Response.json({
          order: {
            ...order,
            receiptUrl: signedUrl, // Replace R2 key with signed URL
          },
        });
      } catch (error) {
        // If signed URL generation fails, return order without receipt URL
        return Response.json({
          order: {
            ...order,
            receiptUrl: null,
          },
        });
      }
    }

    return Response.json({ order });
  } catch {
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
