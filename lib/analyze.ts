export function analyzeImageMetadata(metadata: Record<string, unknown> = {}) {
  return {
    size: metadata.size ?? 0,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    mimeType: metadata.mimeType ?? 'application/octet-stream',
  };
}
