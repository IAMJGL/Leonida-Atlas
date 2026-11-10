export type LocationCategory =
  | 'collectibles'
  | 'missions'
  | 'vehicles'
  | 'businesses'
  | 'safehouses'
  | 'locations'
  | 'secrets';

export interface CategoryMeta {
  id: LocationCategory;
  label: string;
  color: string; // Hex color
  glowColor: string;
  icon: string;
  description: string;
}

export type RegionId =
  | 'vice-city-downtown'
  | 'vice-beach'
  | 'gator-keys'
  | 'grassrivers'
  | 'port-leonida'
  | 'kelly-county'
  | 'gellhorn-shores';

export interface RegionInfo {
  id: RegionId;
  name: string;
  description: string;
  color: string;
  x: number; // Center coords
  y: number;
}

export interface LocationItem {
  id: string;
  name: string;
  category: LocationCategory;
  subCategory: string;
  region: RegionId;
  regionName: string;
  description: string;
  x: number; // 0 to 100 (percentage coordinate on Leonida grid)
  y: number; // 0 to 100
  discovered: boolean;
  reward?: string;
  hint?: string;
  tags: string[];
  imageUrl?: string;
  userNote?: string;
  isFictionalSample: boolean;
}

export type DiscoveryFilter = 'all' | 'discovered' | 'undiscovered';

export type MapStyleMode = 'tropical' | 'recon' | 'night';

export interface MapSettings {
  showRoads: boolean;
  showDistrictLabels: boolean;
  showGridLines: boolean;
  soundEffects: boolean;
  mapStyle: MapStyleMode;
}

export interface Waypoint {
  x: number;
  y: number;
  locationId?: string;
  name?: string;
}

export interface ProgressSummary {
  total: number;
  discovered: number;
  undiscovered: number;
  completionPercentage: number;
  categoryBreakdown: {
    category: LocationCategory;
    total: number;
    discovered: number;
    percentage: number;
  }[];
  regionBreakdown: {
    region: RegionId;
    name: string;
    total: number;
    discovered: number;
    percentage: number;
  }[];
}
