import { useState, useCallback } from "react";
import { validateImageFile, generateImageFilename } from "@/lib/utils/image";

/**
 * useImageUpload Hook
 *
 * Manages image upload with validation and preview
 */

interface UploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  error: string | null;
  progress: number;
}

interface UploadActions {
  selectFile: (file: File) => void;
  uploadFile: (uploadUrl: string) => Promise<string | null>;
  reset: () => void;
  removeFile: () => void;
}

interface UseImageUploadOptions {
  maxSize?: number;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}): UploadState & UploadActions {
  const { maxSize, onUploadComplete, onUploadError } = options;

  const [state, setState] = useState<UploadState>({
    file: null,
    preview: null,
    uploading: false,
    error: null,
    progress: 0,
  });

  // Select and validate file
  const selectFile = useCallback(
    (file: File) => {
      const validation = validateImageFile(file, maxSize);

      if (!validation.isValid) {
        setState((prev) => ({
          ...prev,
          error: validation.errors.join(", "),
          file: null,
          preview: null,
        }));
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      setState((prev) => ({
        ...prev,
        file,
        preview: previewUrl,
        error: null,
        progress: 0,
      }));
    },
    [maxSize]
  );

  // Upload file to server
  const uploadFile = useCallback(
    async (uploadUrl: string): Promise<string | null> => {
      if (!state.file) {
        setState((prev) => ({ ...prev, error: "No file selected" }));
        return null;
      }

      setState((prev) => ({ ...prev, uploading: true, error: null, progress: 0 }));

      try {
        // Generate unique filename
        const filename = generateImageFilename(state.file.name);

        // Create FormData
        const formData = new FormData();
        formData.append("file", state.file, filename);

        // Upload with progress tracking
        const xhr = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              setState((prev) => ({ ...prev, progress }));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                const imageUrl = response.url || response.data?.url;

                setState((prev) => ({ ...prev, uploading: false, progress: 100 }));

                if (imageUrl) {
                  onUploadComplete?.(imageUrl);
                  resolve(imageUrl);
                } else {
                  const error = "No image URL returned from server";
                  setState((prev) => ({ ...prev, error }));
                  onUploadError?.(error);
                  reject(new Error(error));
                }
              } catch {
                const error = "Invalid server response";
                setState((prev) => ({ ...prev, uploading: false, error }));
                onUploadError?.(error);
                reject(new Error(error));
              }
            } else {
              const error = `Upload failed: ${xhr.status} ${xhr.statusText}`;
              setState((prev) => ({ ...prev, uploading: false, error }));
              onUploadError?.(error);
              reject(new Error(error));
            }
          });

          xhr.addEventListener("error", () => {
            const error = "Upload failed: Network error";
            setState((prev) => ({ ...prev, uploading: false, error }));
            onUploadError?.(error);
            reject(new Error(error));
          });

          xhr.open("POST", uploadUrl);
          xhr.send(formData);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        setState((prev) => ({ ...prev, uploading: false, error: errorMessage }));
        onUploadError?.(errorMessage);
        return null;
      }
    },
    [state.file, onUploadComplete, onUploadError]
  );

  // Reset all state
  const reset = useCallback(() => {
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }

    setState({
      file: null,
      preview: null,
      uploading: false,
      error: null,
      progress: 0,
    });
  }, [state.preview]);

  // Remove selected file
  const removeFile = useCallback(() => {
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }

    setState((prev) => ({
      ...prev,
      file: null,
      preview: null,
      error: null,
      progress: 0,
    }));
  }, [state.preview]);

  return {
    file: state.file,
    preview: state.preview,
    uploading: state.uploading,
    error: state.error,
    progress: state.progress,
    selectFile,
    uploadFile,
    reset,
    removeFile,
  };
}

/**
 * Example usage:
 *
 * const imageUpload = useImageUpload({
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   onUploadComplete: (url) => console.log('Uploaded:', url),
 * });
 *
 * // Handle file selection
 * const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = event.target.files?.[0];
 *   if (file) imageUpload.selectFile(file);
 * };
 *
 * // Upload file
 * const handleUpload = () => {
 *   imageUpload.uploadFile('/api/upload');
 * };
 */
