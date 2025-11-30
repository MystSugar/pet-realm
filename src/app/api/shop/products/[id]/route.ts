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

    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        shopId: shop.id,
        deletedAt: null,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Transform to match frontend expectations
    const transformedProduct = {
      ...product,
      images: product.imagesUrl,
      available: product.isAvailable,
      healthCertificate: product.healthCondition,
    };

    return NextResponse.json(transformedProduct);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    // Verify product exists and belongs to the shop
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        shopId: shop.id,
        deletedAt: null,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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

    // Validate provided fields
    if (price !== undefined && price < 0) {
      return NextResponse.json({ error: "Price must be non-negative" }, { status: 400 });
    }

    if (stock !== undefined && stock < 0) {
      return NextResponse.json({ error: "Stock must be non-negative" }, { status: 400 });
    }

    // Determine if it's a live animal based on category
    const liveAnimalCategories = ["CATS", "BIRDS", "FISH", "REPTILES", "SMALL_PETS"];
    const isLiveAnimal = category ? liveAnimalCategories.includes(category) : existingProduct.isLiveAnimal;

    // Build update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (lowStockThreshold !== undefined) updateData.lowStockThreshold = lowStockThreshold;
    if (category !== undefined) {
      updateData.category = category;
      updateData.isLiveAnimal = isLiveAnimal;
    }
    if (images !== undefined) updateData.imagesUrl = images;
    if (tags !== undefined) updateData.tags = tags;
    if (available !== undefined) updateData.isAvailable = available;

    // Animal-specific updates
    if (breed !== undefined) updateData.breed = breed || null;
    if (age !== undefined) updateData.age = age || null;
    if (gender !== undefined) updateData.gender = gender || null;
    if (weight !== undefined) updateData.weight = weight || null;
    if (color !== undefined) updateData.color = color || null;
    if (vaccinationStatus !== undefined) updateData.vaccinationStatus = vaccinationStatus || null;
    if (healthCertificate !== undefined) updateData.healthCondition = healthCertificate || null;

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    });

    // Transform response
    const transformedProduct = {
      ...updatedProduct,
      images: updatedProduct.imagesUrl,
      available: updatedProduct.isAvailable,
      healthCertificate: updatedProduct.healthCondition,
    };

    return NextResponse.json(transformedProduct);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify product exists and belongs to the shop
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        shopId: shop.id,
        deletedAt: null,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Soft delete
    await prisma.product.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        deletedBy: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
