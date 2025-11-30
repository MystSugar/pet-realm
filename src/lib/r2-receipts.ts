import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize R2 client for private bucket (receipts)
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const PRIVATE_BUCKET_NAME = process.env.R2_PRIVATE_BUCKET_NAME || "";
const RECEIPTS_FOLDER = "receipts/";

/**
 * Upload a receipt file to R2 private bucket
 */
export async function uploadReceiptToR2(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const key = `${RECEIPTS_FOLDER}${filename}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: PRIVATE_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return key; // Return the R2 key (path)
}

/**
 * Generate a signed URL for viewing a receipt (expires in 1 hour)
 */
export async function generateReceiptSignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: PRIVATE_BUCKET_NAME,
    Key: key,
  });

  // Generate signed URL that expires in 1 hour
  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  return signedUrl;
}

/**
 * Check if R2 is configured
 */
export function isR2Configured(): boolean {
  return !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_PRIVATE_BUCKET_NAME);
}
