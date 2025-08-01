// Extract _itemContainerEntityId from VehicleAttachment:BPC_Tractor_Carriage in a vehicle BLOB
/**
 * Extracts the `_itemContainerEntityId` property value from a vehicle blob.
 *
 * This function searches for a specific vehicle attachment marker (`VehicleAttachment:BPC_Tractor_Carriage`)
 * within the provided binary blob, then locates the `_itemContainerEntityId` property key following the marker.
 * If found, it parses and returns the property value using the appropriate property type.
 *
 * @param blob - The binary data (as a `Uint8Array`) representing the vehicle blob to parse.
 * @returns The extracted item container entity ID as a `number` if found, or `null` if not found or parsing fails.
 */
export function extractItemContainerEntityIdFromVehicleBlob(blob: Uint8Array): number | null {
  // Find the marker for the attachment
  const attachmentName = 'VehicleAttachment:BPC_Tractor_Carriage';
  const propertyName = '_itemContainerEntityId';
  const marker = new TextEncoder().encode(attachmentName);
  let markerOffset = -1;
  for (let i = 0; i <= blob.length - marker.length; i++) {
    let found = true;
    for (let j = 0; j < marker.length; j++) {
      if (blob[i + j] !== marker[j]) {
        found = false;
        break;
      }
    }
    if (found) {
      markerOffset = i;
      break;
    }
  }
  if (markerOffset === -1) return null;
  // Search for the property key after the marker
  const searchStart = markerOffset + marker.length;
  const keyBytes = new TextEncoder().encode(propertyName);
  for (let i = searchStart; i <= blob.length - keyBytes.length; i++) {
    let found = true;
    for (let j = 0; j < keyBytes.length; j++) {
      if (blob[i + j] !== keyBytes[j]) {
        found = false;
        break;
      }
    }
    if (found) {
      // Found property key, parse type and value
      const typeOffset = i + keyBytes.length + MAGIC_KEY_PADDING;
      const typeName = readNullTerminatedString(blob, typeOffset);
      const propertyType = (propertyTypes as Record<string, typeof propertyTypes["ByteProperty"]>)[typeName];
      const valueOffset = typeOffset + typeName.length + 1 + MAGIC_VALUE_PADDING;
      if (!propertyType) return null;
      const dv = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
      return readPropertyValue(dv, valueOffset, propertyType);
    }
  }
  return null;
}



// --- Robust browser-compatible Unreal property BLOB parser ---
export const MAGIC_KEY_PADDING = 0x05;
export const MAGIC_VALUE_PADDING = 0x0A;

export const propertyTypes = {
  ByteProperty: { width: 1, structType: 'Uint8' },
  IntProperty: { width: 4, structType: 'Int32' },
  BoolProperty: { width: 1, structType: 'Uint8' },
  FloatProperty: { width: 4, structType: 'Float32' },
  DoubleProperty: { width: 8, structType: 'Float64' },
  Int64Property: { width: 8, structType: 'BigInt64' },
  Int32Property: { width: 4, structType: 'Int32' },
  Int16Property: { width: 2, structType: 'Int16' },
  Int8Property: { width: 1, structType: 'Int8' },
  UInt64Property: { width: 8, structType: 'BigUint64' },
  UInt32Property: { width: 4, structType: 'Uint32' },
  UInt16Property: { width: 2, structType: 'Uint16' },
};

export function readNullTerminatedString(arr: Uint8Array, offset: number): string {
  let end = offset;
  while (end < arr.length && arr[end] !== 0x00) end++;
  return new TextDecoder().decode(arr.slice(offset, end));
}

export function getAllOffsets(blob: Uint8Array, key: string) {
  const keyBytes = new TextEncoder().encode(key);
  const results: { typeName: string; valueOffset: number; propertyType: typeof propertyTypes["ByteProperty"] }[] = [];
  let searchOffset = 0;
  while (searchOffset < blob.length) {
    // Find key
    let keyOffset = -1;
    for (let i = searchOffset; i <= blob.length - keyBytes.length; i++) {
      let found = true;
      for (let j = 0; j < keyBytes.length; j++) {
        if (blob[i + j] !== keyBytes[j]) {
          found = false;
          break;
        }
      }
      if (found) {
        keyOffset = i;
        break;
      }
    }
    if (keyOffset === -1) break;

    const typeOffset = keyOffset + keyBytes.length + MAGIC_KEY_PADDING;
    const typeName = readNullTerminatedString(blob, typeOffset);
    const propertyType = (propertyTypes as Record<string, typeof propertyTypes["ByteProperty"]>)[typeName];
    const valueOffset = typeOffset + typeName.length + 1 + MAGIC_VALUE_PADDING;
    if (!propertyType) {
      searchOffset = valueOffset;
      continue;
    }
    results.push({ typeName, valueOffset, propertyType });
    searchOffset = valueOffset + propertyType.width;
  }
  return results;
}

export function readPropertyValue(dv: DataView, offset: number, type: typeof propertyTypes["ByteProperty"]) {
  switch (type.structType) {
    case 'Uint8': return dv.getUint8(offset);
    case 'Int32': return dv.getInt32(offset, true);
    case 'Float32': return dv.getFloat32(offset, true);
    case 'Float64': return dv.getFloat64(offset, true);
    case 'BigInt64': return Number(dv.getBigInt64(offset, true));
    case 'Int16': return dv.getInt16(offset, true);
    case 'Int8': return dv.getInt8(offset);
    case 'BigUint64': return Number(dv.getBigUint64(offset, true));
    case 'Uint32': return dv.getUint32(offset, true);
    case 'Uint16': return dv.getUint16(offset, true);
    default: return null;
  }
}

/**
 * Generic Unreal property blob parser for extracting multiple keys.
 * Returns { result, warnings }.
 */
export function parseBlob(blob: Uint8Array, keys: string[]): { result: Record<string, number | bigint | (number | bigint)[]>; warnings: string[] } {
  const result: Record<string, number | bigint | (number | bigint)[]> = {};
  const warnings: string[] = [];
  if (!(blob instanceof Uint8Array)) {
    return { result: {}, warnings: ['Invalid blob: not a Uint8Array'] };
  }
  for (const key of keys) {
    const matches = getAllOffsets(blob, key);
    if (matches.length === 0) {
      warnings.push(`Key not found: ${key}`);
      continue;
    }
    const values: (number | bigint)[] = [];
    const dv = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
    for (const { valueOffset, propertyType, typeName } of matches) {
      const value = readPropertyValue(dv, valueOffset, propertyType);
      if (value !== null && value !== undefined) {
        values.push(value);
      } else {
        warnings.push(`Failed to read key: ${key} (type: ${typeName})`);
      }
    }
    result[key] = values.length === 1 ? values[0]! : values;
  }
  return { result, warnings };
}

export function extractOwnerIdFromBlob(blob: Uint8Array): number | null {
  const key = '_owningUserProfileId';
  const offsets = getAllOffsets(blob, key);
  if (offsets.length === 0) return null;
  const { valueOffset, propertyType } = offsets[0];
  const dv = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
  return readPropertyValue(dv, valueOffset, propertyType);
}
