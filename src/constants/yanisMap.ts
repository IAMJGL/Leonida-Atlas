/**
 * YANIS V18 / GTADB Tile & Coordinate Projection Constants
 * Source reference: https://github.com/rolux/gtadb.org (maps/tiles.py & maps/maps.js)
 *
 * Kept strictly separate from src/constants/map.ts so the existing fictional
 * 2000x2800 SVG map and its coordinates remain completely intact until Phase 3.
 */

export type TileRange = [[minX: number, minY: number], [maxX: number, maxY: number]];

export interface YanisTileSetConfig {
  id: string;
  label: string;
  tileSize: number;
  mapW: number;
  mapH: number;
  zeroX: number;
  zeroY: number;
  minZ: number;
  /** Maximum native tile zoom directory present in YANIS V18 (0..5). */
  nativeMaxZ: number;
  /** Active zoom ceiling for the current phase (e.g. 3 initially, expandable to 5). */
  activeMaxZ: number;
  /** Client-side over-zoom cap matching gtadb.org (z = 7). */
  overZoomMaxZ: number;
  seaColor: string;
  /** Populated tile index bounds per integer zoom level (0..5). */
  tileSetRanges: Record<number, TileRange>;
  /** Base tile path prefix (empty until tiles are imported in Phase 2/3). */
  tileBaseUrl: string;
}

export const YANIS_V18_CONFIG: YanisTileSetConfig = {
  id: 'yanis,18',
  label: 'YANIS V18 (Community Reconstruction)',
  tileSize: 256,
  mapW: 32768,
  mapH: 32768,
  zeroX: 16384,
  zeroY: 16384,
  minZ: 0,
  nativeMaxZ: 5,
  // Phase 1/2 target: zoom levels 0-3 (593 tiles, ~4.37 MB). Expandable to 4 or 5 without schema changes.
  activeMaxZ: 3,
  overZoomMaxZ: 7,
  seaColor: '#2C67A4',
  tileSetRanges: {
    0: [[0, 0], [3, 3]],
    1: [[1, 1], [6, 6]],
    2: [[2, 2], [12, 12]],
    3: [[5, 5], [25, 24]],
    4: [[10, 10], [51, 49]],
    5: [[21, 21], [103, 99]],
  },
  tileBaseUrl: '/tiles/yanis,18',
};

/** Meters per pixel at zoom level z (z=0 => 32 m/px, z=5 => 1 m/px). */
export const getYanisMppx = (z: number, config: YanisTileSetConfig = YANIS_V18_CONFIG): number =>
  config.mapW / (1024 * Math.pow(2, z));

/** Converts GTADB world meters (x East, y North) to canvas pixel coordinates at zoom z. */
export const gtadbWorldToPixel = (
  worldX: number,
  worldY: number,
  z: number,
  config: YanisTileSetConfig = YANIS_V18_CONFIG
): { px: number; py: number } => {
  const mppx = getYanisMppx(z, config);
  return {
    px: (worldX + config.zeroX) / mppx,
    py: (config.zeroY - worldY) / mppx,
  };
};

/** Converts canvas pixel coordinates at zoom z back to GTADB world meters. */
export const pixelToGtadbWorld = (
  px: number,
  py: number,
  z: number,
  config: YanisTileSetConfig = YANIS_V18_CONFIG
): { worldX: number; worldY: number } => {
  const mppx = getYanisMppx(z, config);
  return {
    worldX: px * mppx - config.zeroX,
    worldY: config.zeroY - py * mppx,
  };
};

/** Formats the GTADB tile path ({z}/{z},{y},{x}.jpg) if within populated bounds and active zoom. */
export const getYanisTileUrl = (
  z: number,
  x: number,
  y: number,
  config: YanisTileSetConfig = YANIS_V18_CONFIG
): string | null => {
  if (z < config.minZ || z > config.activeMaxZ) return null;
  const range = config.tileSetRanges[z];
  if (!range) return null;
  const [[minX, minY], [maxX, maxY]] = range;
  if (x < minX || x > maxX || y < minY || y > maxY) return null;
  return `${config.tileBaseUrl}/${z}/${z},${y},${x}.jpg`;
};
