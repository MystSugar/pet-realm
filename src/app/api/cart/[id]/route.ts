import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update cart item quantity
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return Response.json({ error: "Invalid quantity" }, { status: 400 });
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            stock: true,
            isAvailable: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return Response.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (!cartItem.product.isAvailable || cartItem.product.deletedAt) {
      return Response.json({ error: "Product no longer available" }, { status: 400 });
    }

    if (quantity > cartItem.product.stock) {
      return Response.json({ error: `Only ${cartItem.product.stock} items available` }, { status: 400 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imagesUrl: true,
          },
        },
      },
    });

    return Response.json({
      cartItem: updatedItem,
      message: "Cart updated successfully",
    });
  } catch {
    return Response.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

// DELETE - Remove cart item
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return Response.json({ error: "Cart item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: params.id },
    });

    return Response.json({ message: "Item removed from cart" });
  } catch {
    return Response.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
