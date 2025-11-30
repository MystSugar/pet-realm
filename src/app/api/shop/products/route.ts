import { NextRequest, NextResponse } from "next/server";
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
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: {
        shopId: shop.id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        imagesUrl: true,
        isAvailable: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform imagesUrl to images for frontend compatibility
    const transformedProducts = products.map((product) => ({
      ...product,
      images: product.imagesUrl,
      available: product.isAvailable,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      name,
      description,
      price,
      stock,
      lowStockThreshold,
      category,
      images,
      tags,
      available,
      // Animal-specific fields
      breed,
      age,
      gender,
      weight,
      color,
      vaccinationStatus,
      healthCertificate,
    } = body;

    // Basic validation
    if (!name || !description || price == null || stock == null || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (price < 0 || stock < 0) {
      return NextResponse.json({ error: "Price and stock must be non-negative" }, { status: 400 });
    }

    // Determine if it's a live animal based on category
    const liveAnimalCategories = ["CATS", "BIRDS", "FISH", "REPTILES", "SMALL_PETS"];
    const isLiveAnimal = liveAnimalCategories.includes(category);

    const product = await prisma.product.create({
      data: {
        shopId: shop.id,
        name,
        description,
        price,
        stock,
        lowStockThreshold: lowStockThreshold || 5,
        category,
        imagesUrl: images || [],
        tags: tags || [],
        isAvailable: available ?? true,
        isLiveAnimal,
        breed: breed || null,
        age: age || null,
        gender: gender || null,
        weight: weight || null,
        color: color || null,
        vaccinationStatus: vaccinationStatus || null,
        healthCondition: healthCertificate || null, // Map healthCertificate to healthCondition
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
