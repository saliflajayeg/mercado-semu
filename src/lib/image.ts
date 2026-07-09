/**
 * Resizes and compresses an image in the browser before upload, so listings
 * stay light on slow networks. Returns a WebP blob (max `maxDim` on the long
 * edge). Falls back to the original file if the browser can't process it.
 */
export async function compressImage(
  file: File,
  maxDim = 1200,
  quality = 0.8,
): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    if (width > maxDim || height > maxDim) {
      const scale = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}
