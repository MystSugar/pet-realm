import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deliveryType, deliveryAddress, deliveryIsland, deliveryAtoll, paymentMethod } = await request.json();

    // Validation
    if (!deliveryType || !["PICKUP", "DELIVERY"].includes(deliveryType)) {
      return Response.json({ error: "Invalid delivery type" }, { status: 400 });
    }

    if (deliveryType === "DELIVERY") {
      if (!deliveryAddress || !deliveryIsland || !deliveryAtoll) {
        return Response.json({ error: "Delivery details are required for delivery orders" }, { status: 400 });
      }
    }

    // Fetch cart items with product and shop details
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            shop: {
              select: {
                id: true,
                name: true,
                island: true,
                atoll: true,
                deliveryZones: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate all products are available and from the same shop
    const shopIds = new Set(cartItems.map((item) => item.product.shopId));
    if (shopIds.size > 1) {
      return Response.json({ error: "Cart contains items from multiple shops" }, { status: 400 });
    }

    // Validate stock availability
    for (const item of cartItems) {
      if (!item.product.isAvailable || item.product.deletedAt) {
        return Response.json({ error: `Product ${item.product.name} is no longer available` }, { status: 400 });
      }

      if (item.quantity > item.product.stock) {
        return Response.json(
          {
            error: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available`,
          },
          { status: 400 }
        );
      }
    }

    const shop = cartItems[0].product.shop;

    if (!shop.isActive) {
      return Response.json({ error: "Shop is not active" }, { status: 400 });
    }

    // Calculate order totals
    const subtotal = cartItems.reduce((total, item) => {
      const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price.toString());
      return total + price * item.quantity;
    }, 0);

    const TAX_RATE = 0.08;
    const taxAmount = subtotal * TAX_RATE;

    // Calculate delivery fee based on delivery island
    let deliveryFee = 0;
    if (deliveryType === "DELIVERY" && deliveryIsland && shop.deliveryZones) {
      const deliveryZones = shop.deliveryZones as Array<{ area: string; fee: number }>;
      const zone = deliveryZones.find((z) => z.area === deliveryIsland);
      if (zone) {
        deliveryFee = zone.fee;
      }
    }

    const total = subtotal + taxAmount + deliveryFee;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create order with order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          id: randomUUID(),
          orderNumber,
          customerId: session.user.id,
          shopId: shop.id,
          status: "PENDING",
          subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
          tax: new Prisma.Decimal(taxAmount.toFixed(2)),
          delivery: new Prisma.Decimal(deliveryFee.toFixed(2)),
          total: new Prisma.Decimal(total.toFixed(2)),
          deliveryType,
          deliveryAddress: deliveryType === "DELIVERY" ? deliveryAddress : null,
          deliveryIsland: deliveryType === "DELIVERY" ? deliveryIsland : null,
          deliveryAtoll: deliveryType === "DELIVERY" ? deliveryAtoll : null,
          paymentMethod,
          paymentStatus: "PENDING",
        },
      });

      // Create order items
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            id: randomUUID(),
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      return newOrder;
    });

    return Response.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total.toString(),
        },
        message: "Order created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
