/**
 * Displays a preview of a base location on a sector map for the SCUM game.
 * 
 * Given world/game coordinates (`x`, `y`), this component:
 * - Converts the coordinates to map pixel positions.
 * - Determines the corresponding sector (5x5 grid) and sector image.
 * - Renders the sector image and overlays a marker at the precise location within the sector.
 * 
 * @param props - Component props
 * @param props.x - The X coordinate in world/game space.
 * @param props.y - The Y coordinate in world/game space.
 * 
 * @remarks
 * - The map is divided into a 5x5 grid, each sector is 400x400 px.
 * - Sector images are loaded from `/SCUMSectors/{sectorLabelY}{sectorLabelX}.png`.
 * - The marker is rendered as a red circle with a white border.
 * - The component is intended for use as a small, non-interactive preview (e.g., in tooltips).
 */
import React from 'react';

const PREVIEW_SIZE = 200; // px, tooltip preview size
const GRID_SIZE = 5;
const SECTOR_SIZE = 400; // px, sector image size (2000/5)

// These are the world/game coordinates for the three corners
const TOP_LEFT = { x: 616223.4375, y: 615032.7502 };
const TOP_RIGHT = { x: -902121.0937, y: 615628.0626 };
const BOTTOM_RIGHT = { x: -903311.7187, y: -903014.0626 };

function worldToMap(x: number, y: number) {
  const mapX = ((x - TOP_LEFT.x) / (TOP_RIGHT.x - TOP_LEFT.x)) * (GRID_SIZE * SECTOR_SIZE - 1);
  const mapY = ((y - TOP_LEFT.y) / (BOTTOM_RIGHT.y - TOP_LEFT.y)) * (GRID_SIZE * SECTOR_SIZE - 1);
  return { left: mapX, top: mapY };
}

interface BaseLocationMapPreviewProps {
  x: number;
  y: number;
}

// Z is the lowest, D the highest (Y axis, top to bottom)
// 4 is left, 0 is right (X axis, right to left)
const Y_LABELS = ['D', 'C', 'B', 'A', 'Z']; // 0 (top) to 4 (bottom)

export const BaseLocationMapPreview: React.FC<BaseLocationMapPreviewProps> = ({ x, y }) => {
  const marker = worldToMap(x, y);
  // Calculate sector (0-4)
  let sectorX = Math.floor(marker.left / SECTOR_SIZE);
  let sectorY = Math.floor(marker.top / SECTOR_SIZE);
  // Clamp to grid
  sectorX = Math.max(0, Math.min(GRID_SIZE - 1, sectorX));
  sectorY = Math.max(0, Math.min(GRID_SIZE - 1, sectorY));
  // For your naming: sectorX 4=left, 0=right; sectorY 0=D(top), 4=Z(bottom)
  const sectorLabelX = 4 - sectorX; // 4=left, 0=right
  const sectorLabelY = Y_LABELS[sectorY]; // 0=D(top), 4=Z(bottom)
  // Marker position within sector
  const markerInSectorX = marker.left - sectorX * SECTOR_SIZE;
  const markerInSectorY = marker.top - sectorY * SECTOR_SIZE;
  const scale = PREVIEW_SIZE / SECTOR_SIZE;
  // Image path: /SCUMSectors/SCUM_Map_sector_{sectorLabelY}{sectorLabelX}.png
  const sectorImg = `/SCUMSectors/${sectorLabelY}${sectorLabelX}.png`;

  return (
    <div
      style={{
        position: 'relative',
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        overflow: 'hidden',
        borderRadius: 8,
        pointerEvents: 'none',
        background: '#222',
        border: '2px solid #888',
      }}
    >
      <img
        src={sectorImg}
        alt={`Map sector ${sectorLabelY}${sectorLabelX}`}
        width={PREVIEW_SIZE}
        height={PREVIEW_SIZE}
        style={{ display: 'block', width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
        draggable={false}
      />
      {/* Marker */}
      <div
        style={{
          position: 'absolute',
          left: markerInSectorX * scale - 6,
          top: markerInSectorY * scale - 6,
          width: 12,
          height: 12,
          background: 'red',
          borderRadius: '50%',
          border: '2px solid #fff',
          boxShadow: '0 0 4px #000',
          pointerEvents: 'none',
        }}
        aria-label="Base location marker"
      />
    </div>
  );
};
