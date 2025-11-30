import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { ShopCategory } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a shop
    const existingShop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
    });

    if (existingShop) {
      return Response.json({ error: "You already have a shop. Please edit your existing shop instead." }, { status: 400 });
    }

    const { name, description, category, island, atoll, address, phone, email, license, businessHours, deliveryZones } = await request.json();

    // Validation
    if (!name || !description || !category || !island || !atoll || !address || !phone) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate category
    if (!Object.values(ShopCategory).includes(category)) {
      return Response.json({ error: "Invalid shop category" }, { status: 400 });
    }

    // Validate phone number
    if (!/^[79]\d{6}$/.test(phone)) {
      return Response.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    // Create shop
    const shop = await prisma.shop.create({
      data: {
        id: randomUUID(),
        ownerId: session.user.id,
        name: name.trim(),
        description: description.trim(),
        category,
        island,
        atoll,
        address: address.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        license: license?.trim() || null,
        businessHours: businessHours || null,
        deliveryZones: deliveryZones || null,
        isActive: true,
        isVerified: false,
        setupComplete: true,
        setupStep: 5,
      },
    });

    return Response.json(
      {
        shop: {
          id: shop.id,
          name: shop.name,
          setupComplete: shop.setupComplete,
        },
        message: "Shop created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // Log for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error("Error creating shop:", error.message);
    }
    return Response.json(
      {
        error: "Failed to create shop",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
