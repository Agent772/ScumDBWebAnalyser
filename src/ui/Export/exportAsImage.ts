// utils/exportAsImage.ts
// Utility to export a DOM element as an image using html2canvas
import html2canvas from 'html2canvas';

/**
 * Exports a DOM element as a PNG image and triggers download or returns data URL.
 * @param element The DOM element to capture
 * @param options Optional: { fileName, returnDataUrl }
 * @returns Promise<string | void> (data URL if returnDataUrl is true)
 */
export async function exportAsImage(
  element: HTMLElement,
  options?: { fileName?: string; returnDataUrl?: boolean }
): Promise<string | void> {
  if (!element) throw new Error('Element is required');
  const canvas = await html2canvas(element, { backgroundColor: null });
  const dataUrl = canvas.toDataURL('image/png');
  if (options?.returnDataUrl) return dataUrl;
  // Download
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = options?.fileName || 'export.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
