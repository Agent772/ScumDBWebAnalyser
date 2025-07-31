/**
 * Extracts the numeric value of a specified attribute from an XML string.
 *
 * @param xml - The XML string to search within.
 * @param attr - The name of the attribute whose value should be extracted.
 * @returns The numeric value of the attribute if found; otherwise, returns 0.
 */
export function extractAttributeFromTemplateXml(xml: string, attr: string): number {
  const regex = new RegExp(`${attr}="([0-9.]+)"`);
  const match = xml.match(regex);
  return match ? parseFloat(match[1]) : 0;
}
