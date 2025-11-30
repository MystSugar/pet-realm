import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize R2 client for public bucket (shop images, product images, etc.)
const r2PublicClient = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const PUBLIC_BUCKET_NAME = process.env.R2_PUBLIC_BUCKET_NAME || "";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

const FOLDERS = {
  LOGOS: "shop-images/logos/",
  BANNERS: "shop-images/banners/",
  PRODUCTS: "product-images/",
};

/**
 * Upload a shop logo to R2 public bucket
 */
export async function uploadLogoToR2(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const key = `${FOLDERS.LOGOS}${filename}`;

  await r2PublicClient.send(
    new PutObjectCommand({
      Bucket: PUBLIC_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return the public URL
  return `${PUBLIC_URL}/${key}`;
}

/**
 * Upload a shop banner to R2 public bucket
 */
export async function uploadBannerToR2(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const key = `${FOLDERS.BANNERS}${filename}`;

  await r2PublicClient.send(
    new PutObjectCommand({
      Bucket: PUBLIC_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return the public URL
  return `${PUBLIC_URL}/${key}`;
}

/**
 * Upload a product image to R2 public bucket
 */
export async function uploadProductImageToR2(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const key = `${FOLDERS.PRODUCTS}${filename}`;

  await r2PublicClient.send(
    new PutObjectCommand({
      Bucket: PUBLIC_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return the public URL
  return `${PUBLIC_URL}/${key}`;
}

/**
 * Check if R2 public bucket is configured
 */
export function isR2PublicConfigured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_PUBLIC_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
  );
}
