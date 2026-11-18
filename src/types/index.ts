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
  | 'mount-kalaga'
  | 'ambrosia'
  | 'gellhorn-shores'
  | 'grassrivers'
  | 'vice-city-downtown'
  | 'vice-beach'
  | 'port-leonida'
  | 'gator-keys';

export interface RegionInfo {
  id: RegionId;
  name: string;
  description: string;
  color: string;
  x: number; // Center coords
  y: number;
}

export type DataSourceType = 'fictional-sample' | 'gtadb-community' | 'official';

export type ConfidenceLevel = 'confirmed' | 'estimated' | 'unknown';

export type CommunityPoiCategory =
  | 'hotels'
  | 'restaurants'
  | 'retail'
  | 'residential'
  | 'transportation'
  | 'natural'
  | 'government'
  | 'industrial'
  | 'leisure'
  | 'public'
  | 'utilities'
  | 'office'
  | 'construction'
  | 'agriculture'
  | 'landmarks'
  | 'other'
  | 'unclassified';

export interface CommunityCategoryMeta {
  id: CommunityPoiCategory;
  label: string;
  color: string;
  description: string;
}

/**
 * Raw 9-element positional tuple format from rolux/gtadb.org (map/data/6/landmarks.json):
 * [igAddress, igCoordinates, igPhotoSize, rlAddress, rlCoordinates, rlPhotoSize, tags, color, edited]
 */
export type GtadbRawLandmarkTuple = [
  igAddress: string,
  igCoordinates: [number, number] | [],
  igPhotoSize: [number, number] | [],
  rlAddress: string,
  rlCoordinates: [number, number] | [],
  rlPhotoSize: [number, number] | [],
  tags: string[],
  color: string,
  edited: number[],
];

export interface LandmarkProvenance {
  dataSource: DataSourceType;
  gtadbId?: string;
  sourceName: string;
  sourceUrl?: string;
  license: string;
  attribution: string;
  isCommunityEstimate: boolean;
  igNameConfidence: ConfidenceLevel;
  igCoordsConfidence: ConfidenceLevel;
  rlConfidence: ConfidenceLevel;
  sourceWaves: string[];
  modifiedFields: string[];
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
  /** Optional provenance & gameplay-progress guard for future multi-source integration */
  dataSource?: DataSourceType;
  countsTowardGameplayProgress?: boolean;
}

export interface CommunityLandmarkItem {
  /** Collision-safe app ID (`gtadb-${gtadbId}`) */
  id: string;
  /** Original GTADB key (e.g. "L1") */
  gtadbId: string;
  /** Display title derived non-destructively from raw igAddress */
  name: string;
  /** Unmodified GTADB in-game address string */
  rawIgAddress: string;
  /** Unmodified GTADB real-world counterpart string */
  rawRlAddress: string;
  /** Community POI classification (strictly separate from gameplay LocationCategory) */
  communityCategory: CommunityPoiCategory;
  /** Optional explicit gameplay category; undefined unless manually assigned */
  assignedGameplayCategory?: LocationCategory;
  /** Community POIs never count toward gameplay 100% progress unless explicitly assigned */
  countsTowardGameplayProgress: boolean;
  /** Original GTADB world coordinates [x, y] in meters (centered at 0,0), or null if unmapped */
  igCoordinates: [number, number] | null;
  /** Original real-world WGS84 [lat, lng], or null if unavailable */
  rlCoordinates: [number, number] | null;
  /** Photo pixel dimensions from GTADB (no photos bundled yet) */
  igPhotoSize: [number, number] | null;
  rlPhotoSize: [number, number] | null;
  /** Unmodified GTADB tags array */
  rawTags: string[];
  /** Original 6-char hex color from GTADB */
  rawColor: string;
  /** Original Unix edit timestamps [record, igPhoto, rlPhoto] */
  editedTimestamps: number[];
  /** Extracted neighborhood / district hint from igAddress */
  districtLabel: string;
  provenance: LandmarkProvenance;
}

export interface CommunityPoiSummary {
  total: number;
  geolocated: number;
  unmapped: number;
  confirmedCoords: number;
  estimatedCoords: number;
  withIgPhotoRef: number;
  withRlPhotoRef: number;
  categoryCounts: Record<CommunityPoiCategory, number>;
}

export type DiscoveryFilter = 'all' | 'discovered' | 'undiscovered';

export type MapStyleMode = 'tropical' | 'recon' | 'night';

export interface MapSettings {
  showRoads: boolean;
  showDistrictLabels: boolean;
  showGridLines: boolean;
  soundEffects: boolean;
  mapStyle: MapStyleMode;
  /** Toggles visibility of the legacy 32 fictional sample locations layer (default: true) */
  showLegacySamples?: boolean;
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
