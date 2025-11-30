import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadLogoToR2, uploadBannerToR2, isR2PublicConfigured } from "@/lib/r2-shop-images";
import { prisma } from "@/lib/prisma";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.accountType !== "SELLER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if R2 is configured
    if (!isR2PublicConfigured()) {
      return NextResponse.json({ error: "R2 storage is not properly configured" }, { status: 500 });
    }

    // Get the user's shop
    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "logo" or "banner"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type || (type !== "logo" && type !== "banner")) {
      return NextResponse.json({ error: "Invalid type. Must be 'logo' or 'banner'" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG and PNG are allowed" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `${shop.id}-${type}-${timestamp}.${extension}`;

    // Upload to R2 based on type
    let imageUrl: string;
    if (type === "logo") {
      imageUrl = await uploadLogoToR2(buffer, filename, file.type);
    } else {
      imageUrl = await uploadBannerToR2(buffer, filename, file.type);
    }

    // Update the shop with the new image URL
    const updateData = type === "logo" ? { logo: imageUrl } : { banner: imageUrl };
    await prisma.shop.update({
      where: { id: shop.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      url: imageUrl,
      type,
    });
  } catch (error) {
    console.error("Error uploading shop image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
