import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { uploadReceiptToR2, isR2Configured } from "@/lib/r2-receipts";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify order ownership
    const order = await prisma.order.findUnique({
      where: { id },
      select: { customerId: true, paymentStatus: true },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.customerId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("receipt") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: "Invalid file type. Only JPG, PNG, and PDF are allowed" }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const filename = `receipt-${id}-${randomUUID()}.${ext}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if R2 is configured
    if (!isR2Configured()) {
      return Response.json({ error: "Cloud storage is not configured. Please contact support." }, { status: 500 });
    }

    // Upload to R2 private bucket
    const r2Key = await uploadReceiptToR2(buffer, filename, file.type);

    // Update order with receipt R2 key
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        receiptUrl: r2Key, // Store R2 key (e.g., "receipts/receipt-xyz.jpg")
        receiptUploadedAt: new Date(),
      },
    });

    return Response.json({
      message: "Receipt uploaded successfully",
      receiptUrl: r2Key,
      order: updatedOrder,
    });
  } catch {
    return Response.json({ error: "Failed to upload receipt" }, { status: 500 });
  }
}
