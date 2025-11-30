import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

// GET - Fetch user's cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            imagesUrl: true,
            stock: true,
            isAvailable: true,
            deletedAt: true,
            shop: {
              select: {
                id: true,
                name: true,
                island: true,
                atoll: true,
                isVerified: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter out items with deleted or unavailable products
    const validCartItems = cartItems.filter((item) => item.product.deletedAt === null && item.product.isAvailable);

    return Response.json({ cartItems: validCartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check if product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, isAvailable: true, deletedAt: true },
    });

    if (!product || product.deletedAt || !product.isAvailable) {
      return Response.json({ error: "Product not available" }, { status: 404 });
    }

    if (quantity > product.stock) {
      return Response.json({ error: `Only ${product.stock} items available in stock` }, { status: 400 });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return Response.json({ error: `Cannot add more. Only ${product.stock} items available` }, { status: 400 });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
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
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        id: randomUUID(),
        userId: session.user.id,
        productId,
        quantity,
      },
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

    return Response.json(
      {
        cartItem,
        message: "Added to cart successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return Response.json(
      {
        error: "Failed to add to cart",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Clear entire cart
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return Response.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return Response.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
