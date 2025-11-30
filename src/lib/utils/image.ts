/**
 * Image Utilities for Pet Realm
 *
 * Handles image processing, validation, and optimization
 */

// Supported image types
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

// Image size limits (in bytes)
export const IMAGE_SIZE_LIMITS = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  PRODUCT: 5 * 1024 * 1024, // 5MB
  GALLERY: 10 * 1024 * 1024, // 10MB
} as const;

// Image dimensions
export const IMAGE_DIMENSIONS = {
  AVATAR: { width: 200, height: 200 },
  THUMBNAIL: { width: 300, height: 300 },
  MEDIUM: { width: 600, height: 600 },
  LARGE: { width: 1200, height: 1200 },
} as const;

// Validate image file
export function validateImageFile(
  file: File,
  maxSize: number = IMAGE_SIZE_LIMITS.PRODUCT
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as SupportedImageType)) {
    errors.push(`Unsupported file type. Supported types: ${SUPPORTED_IMAGE_TYPES.join(", ")}`);
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  // Check if file exists
  if (file.size === 0) {
    errors.push("File appears to be empty");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generate unique filename
export function generateImageFilename(originalName: string, prefix: string = ""): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop()?.toLowerCase() || "jpg";

  const baseName = prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
  return `${baseName}.${extension}`;
}

// Get image file extension
export function getImageExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "jpg";
}

// Convert file size to human readable format
export function formatImageSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Generate image URL variants
export function generateImageUrls(baseUrl: string, filename: string) {
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
  const extension = getImageExtension(filename);

  return {
    original: `${baseUrl}/${filename}`,
    thumbnail: `${baseUrl}/${nameWithoutExtension}_thumb.${extension}`,
    medium: `${baseUrl}/${nameWithoutExtension}_medium.${extension}`,
    large: `${baseUrl}/${nameWithoutExtension}_large.${extension}`,
  };
}

// Create image placeholder URL
export function createImagePlaceholder(width: number, height: number, text?: string): string {
  const placeholderText = text ? encodeURIComponent(text) : `${width}x${height}`;
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/9ca3af?text=${placeholderText}`;
}

// Check if URL is an image
export function isImageUrl(url: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i;
  return imageExtensions.test(url);
}

// Extract image dimensions from file (requires browser environment)
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("getImageDimensions requires browser environment"));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

// Calculate aspect ratio
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

// Get responsive image sizes for different screen sizes
export function getResponsiveImageSizes(baseWidth: number) {
  return {
    mobile: Math.round(baseWidth * 0.5),
    tablet: Math.round(baseWidth * 0.75),
    desktop: baseWidth,
    xl: Math.round(baseWidth * 1.25),
  };
}
