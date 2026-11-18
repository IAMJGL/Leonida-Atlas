import {
  CommunityCategoryMeta,
  CommunityLandmarkItem,
  CommunityPoiCategory,
  CommunityPoiSummary,
  ConfidenceLevel,
  GtadbRawLandmarkTuple,
  LocationItem,
} from '../types';

export const GTADB_ATTRIBUTION = {
  dataCredit: 'GTA VI Landmarks Data (CC BY 4.0) — https://map.gtadb.org',
  tilesCredit: 'GTA VI Map Tiles (CC BY 4.0) — https://map.gtadb.org',
  contributors: 'gtadb.org and all contributors (YANIS V18 / GTA Mapping Community)',
  licenseName: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  repositoryUrl: 'https://github.com/rolux/gtadb.org',
  modificationsNote:
    'Raw landmarks.json stored unmodified; positional arrays are parsed into typed records with community POI categories, confidence labels, and prefixed app IDs (gtadb-*) so legacy sample/user records are never overwritten.',
} as const;

export const COMMUNITY_CATEGORIES: Record<CommunityPoiCategory, CommunityCategoryMeta> = {
  hotels: {
    id: 'hotels',
    label: 'Hotels & Resorts',
    color: '#FF5CBA',
    description: 'Oceanfront hotels, motels, and resort properties mapped by the community.',
  },
  restaurants: {
    id: 'restaurants',
    label: 'Dining & Nightlife Food',
    color: '#FF8FA3',
    description: 'Restaurants, cafes, fast-food chains, and bars.',
  },
  retail: {
    id: 'retail',
    label: 'Retail & Shops',
    color: '#FFAD83',
    description: 'Stores, supermarkets, dealerships, and commercial storefronts.',
  },
  residential: {
    id: 'residential',
    label: 'Residential',
    color: '#B488D9',
    description: 'Condominiums, apartment towers, and housing developments.',
  },
  transportation: {
    id: 'transportation',
    label: 'Transportation & Transit',
    color: '#42CFC3',
    description: 'Airports, rail/metro stations, bus hubs, marinas, and gas stations.',
  },
  natural: {
    id: 'natural',
    label: 'Natural Landmarks',
    color: '#5EC4A8',
    description: 'Beaches, waterways, parks, islands, and natural terrain features.',
  },
  government: {
    id: 'government',
    label: 'Government & Civic',
    color: '#7EA8BE',
    description: 'Civic halls, law enforcement, correctional, and municipal buildings.',
  },
  industrial: {
    id: 'industrial',
    label: 'Industrial & Ports',
    color: '#D4A373',
    description: 'Warehouses, docks, quarries, factories, and freight depots.',
  },
  leisure: {
    id: 'leisure',
    label: 'Leisure & Entertainment',
    color: '#E07BE0',
    description: 'Clubs, stadiums, courts, theaters, and recreation venues.',
  },
  public: {
    id: 'public',
    label: 'Public Services',
    color: '#98C1D9',
    description: 'Schools, libraries, plazas, and public institutions.',
  },
  utilities: {
    id: 'utilities',
    label: 'Utilities & Infrastructure',
    color: '#A5B4FC',
    description: 'Power plants, radio towers, water treatment, and grid infrastructure.',
  },
  office: {
    id: 'office',
    label: 'Offices & Corporate',
    color: '#CBD5E1',
    description: 'Corporate headquarters, financial towers, and business parks.',
  },
  construction: {
    id: 'construction',
    label: 'Construction Sites',
    color: '#F59E0B',
    description: 'Active construction zones, cranes, and unfinished developments.',
  },
  agriculture: {
    id: 'agriculture',
    label: 'Agriculture',
    color: '#84CC16',
    description: 'Farms, citrus groves, and rural agricultural tracts.',
  },
  landmarks: {
    id: 'landmarks',
    label: 'Major Landmarks',
    color: '#FFF0E8',
    description: 'Notable architectural monuments, bridges, and recognizable sights.',
  },
  other: {
    id: 'other',
    label: 'Other / Mixed Use',
    color: '#94A3B8',
    description: 'Mixed-use structures, enterable interiors, and miscellaneous POIs.',
  },
  unclassified: {
    id: 'unclassified',
    label: 'Unclassified Community POIs',
    color: '#64748B',
    description: 'Community entries awaiting category classification in GTADB.',
  },
};

const TAG_TO_COMMUNITY_CATEGORY: Record<string, CommunityPoiCategory> = {
  hotel: 'hotels',
  restaurant: 'restaurants',
  fastfood: 'restaurants',
  '#food': 'restaurants',
  '#fastfood': 'restaurants',
  '#drinks': 'restaurants',
  '#bar': 'restaurants',
  retail: 'retail',
  supermarket: 'retail',
  '#supermarket': 'retail',
  '#clothes': 'retail',
  '#shoes': 'retail',
  '#electronics': 'retail',
  '#liquor': 'retail',
  '#pharmacy': 'retail',
  '#bikeshop': 'retail',
  residential: 'residential',
  transportation: 'transportation',
  '#airport': 'transportation',
  '#airbase': 'transportation',
  '#metro': 'transportation',
  '#metromover': 'transportation',
  '#train': 'transportation',
  '#bus': 'transportation',
  '#marina': 'transportation',
  '#gas': 'transportation',
  '#carwash': 'transportation',
  '#modshop': 'transportation',
  "#pay'n'spray": 'transportation',
  natural: 'natural',
  government: 'government',
  '#police': 'government',
  '#jail': 'government',
  industrial: 'industrial',
  leisure: 'leisure',
  recreation: 'leisure',
  '#nightclub': 'leisure',
  '#stripclub': 'leisure',
  '#cinema': 'leisure',
  '#gym': 'leisure',
  '#golf': 'leisure',
  '#tennis': 'leisure',
  '#volleyball': 'leisure',
  '#ferriswheel': 'leisure',
  public: 'public',
  '#hospital': 'public',
  utilities: 'utilities',
  office: 'office',
  construction: 'construction',
  agriculture: 'agriculture',
  landmark: 'landmarks',
  'point-of-interest': 'landmarks',
  other: 'other',
  mixed: 'other',
  service: 'other',
};

function classifyCommunityCategory(tags: string[]): CommunityPoiCategory {
  if (!tags || tags.length === 0) return 'unclassified';

  for (const tag of tags) {
    const mapped = TAG_TO_COMMUNITY_CATEGORY[tag.toLowerCase()];
    if (mapped) return mapped;
  }

  return 'other';
}

function parseIgNameConfidence(igAddress: string): ConfidenceLevel {
  if (!igAddress || igAddress.startsWith('?') || igAddress.startsWith('"')) {
    return 'unknown';
  }
  if (igAddress.includes('?,' )) {
    return 'estimated';
  }
  return 'confirmed';
}

function parseIgCoordsConfidence(
  igCoordinates: [number, number] | [],
  tags: string[]
): ConfidenceLevel {
  if (!Array.isArray(igCoordinates) || igCoordinates.length < 2) {
    return 'unknown';
  }
  if (tags.some((t) => t.toLowerCase() === 'unconfirmed')) {
    return 'estimated';
  }
  return 'confirmed';
}

function parseRlConfidence(rlAddress: string, tags: string[]): ConfidenceLevel {
  if (!rlAddress || rlAddress === '?') return 'unknown';
  if (tags.includes('unconfirmed')) return 'estimated';
  return 'confirmed';
}

function deriveDisplayName(gtadbId: string, igAddress: string, rlAddress: string): {
  name: string;
  districtLabel: string;
} {
  const igParts = (igAddress || '')
    .replace(/\?$/, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const firstPart = igParts[0] || '';
  const hasKnownIgName = Boolean(firstPart && firstPart !== '?' && !firstPart.startsWith('"'));
  const districtLabel =
    igParts.slice(hasKnownIgName ? 1 : 1).join(', ') ||
    igParts.filter((p) => p !== '?').join(', ') ||
    'Leonida (Community Mapped)';

  if (hasKnownIgName) {
    return { name: firstPart, districtLabel };
  }

  const rlName = (rlAddress || '').replace(/(?<=.)\?$/, '').split(',')[0]?.trim();
  if (rlName && rlName !== '?') {
    return {
      name: `${rlName} (RL Ref)`,
      districtLabel: districtLabel || 'Leonida (Estimated)',
    };
  }

  return {
    name: `Unidentified POI (${gtadbId})`,
    districtLabel: districtLabel || 'Leonida',
  };
}

export function adaptGtadbLandmarks(
  rawData: Record<string, GtadbRawLandmarkTuple>
): CommunityLandmarkItem[] {
  return Object.entries(rawData).map(([gtadbId, tuple]) => {
    const [
      igAddress = '',
      igCoordsRaw = [],
      igPhotoRaw = [],
      rlAddress = '',
      rlCoordsRaw = [],
      rlPhotoRaw = [],
      tags = [],
      color = '',
      edited = [],
    ] = tuple;

    const igCoordinates =
      Array.isArray(igCoordsRaw) && igCoordsRaw.length >= 2
        ? ([igCoordsRaw[0], igCoordsRaw[1]] as [number, number])
        : null;
    const rlCoordinates =
      Array.isArray(rlCoordsRaw) && rlCoordsRaw.length >= 2
        ? ([rlCoordsRaw[0], rlCoordsRaw[1]] as [number, number])
        : null;
    const igPhotoSize =
      Array.isArray(igPhotoRaw) && igPhotoRaw.length >= 2
        ? ([igPhotoRaw[0], igPhotoRaw[1]] as [number, number])
        : null;
    const rlPhotoSize =
      Array.isArray(rlPhotoRaw) && rlPhotoRaw.length >= 2
        ? ([rlPhotoRaw[0], rlPhotoRaw[1]] as [number, number])
        : null;

    const igNameConfidence = parseIgNameConfidence(igAddress);
    const igCoordsConfidence = parseIgCoordsConfidence(igCoordsRaw, tags);
    const rlConfidence = parseRlConfidence(rlAddress, tags);
    const sourceWaves = tags.filter((t) => /^l[1-8]$/i.test(t));
    const { name, districtLabel } = deriveDisplayName(gtadbId, igAddress, rlAddress);

    return {
      id: `gtadb-${gtadbId}`,
      gtadbId,
      name,
      rawIgAddress: igAddress,
      rawRlAddress: rlAddress,
      communityCategory: classifyCommunityCategory(tags),
      assignedGameplayCategory: undefined,
      countsTowardGameplayProgress: false,
      igCoordinates,
      rlCoordinates,
      igPhotoSize,
      rlPhotoSize,
      rawTags: [...tags],
      rawColor: color,
      editedTimestamps: [...edited],
      districtLabel,
      provenance: {
        dataSource: 'gtadb-community',
        gtadbId,
        sourceName: 'GTADB.org (GTA VI Community Dataset)',
        sourceUrl: GTADB_ATTRIBUTION.repositoryUrl,
        license: GTADB_ATTRIBUTION.licenseName,
        attribution: GTADB_ATTRIBUTION.dataCredit,
        isCommunityEstimate: igCoordsConfidence !== 'confirmed' || igNameConfidence !== 'confirmed',
        igNameConfidence,
        igCoordsConfidence,
        rlConfidence,
        sourceWaves,
        modifiedFields: ['id (prefixed gtadb-*)', 'communityCategory (derived from tags)', 'name (display fallback)'],
      },
    };
  });
}

export function summarizeCommunityPois(items: CommunityLandmarkItem[]): CommunityPoiSummary {
  const categoryCounts = (Object.keys(COMMUNITY_CATEGORIES) as CommunityPoiCategory[]).reduce(
    (acc, key) => {
      acc[key] = 0;
      return acc;
    },
    {} as Record<CommunityPoiCategory, number>
  );

  let geolocated = 0;
  let unmapped = 0;
  let confirmedCoords = 0;
  let estimatedCoords = 0;
  let withIgPhotoRef = 0;
  let withRlPhotoRef = 0;

  for (const item of items) {
    categoryCounts[item.communityCategory] = (categoryCounts[item.communityCategory] || 0) + 1;
    if (item.igCoordinates) {
      geolocated += 1;
      if (item.provenance.igCoordsConfidence === 'confirmed') confirmedCoords += 1;
      else estimatedCoords += 1;
    } else {
      unmapped += 1;
    }
    if (item.igPhotoSize) withIgPhotoRef += 1;
    if (item.rlPhotoSize) withRlPhotoRef += 1;
  }

  return {
    total: items.length,
    geolocated,
    unmapped,
    confirmedCoords,
    estimatedCoords,
    withIgPhotoRef,
    withRlPhotoRef,
    categoryCounts,
  };
}

/**
 * Non-destructive guard ensuring imported GTADB community entries never overwrite
 * existing user-created or legacy sample LocationItem records.
 */
export function ensureNonOverwritingCommunityList(
  existingGameplayLocations: LocationItem[],
  communityItems: CommunityLandmarkItem[]
): CommunityLandmarkItem[] {
  const existingIds = new Set(existingGameplayLocations.map((l) => l.id));
  return communityItems.filter((item) => !existingIds.has(item.id));
}

let cachedLandmarks: CommunityLandmarkItem[] | null = null;
let cachedSummary: CommunityPoiSummary | null = null;
let pendingLoad: Promise<CommunityLandmarkItem[]> | null = null;

/**
 * Dynamically imports and adapts the GTADB landmarks.json dataset on demand.
 * Deduplicates concurrent calls and caches parsed records to prevent duplicate loads.
 */
export async function loadGtadbLandmarks(): Promise<CommunityLandmarkItem[]> {
  if (cachedLandmarks) {
    return cachedLandmarks;
  }
  if (pendingLoad) {
    return pendingLoad;
  }

  pendingLoad = import('./gtadb/landmarks.json')
    .then((mod) => {
      const rawData = (mod.default ?? mod) as unknown as Record<string, GtadbRawLandmarkTuple>;
      const parsed = adaptGtadbLandmarks(rawData);
      cachedLandmarks = parsed;
      cachedSummary = summarizeCommunityPois(parsed);
      return parsed;
    })
    .catch((err) => {
      pendingLoad = null;
      throw err instanceof Error ? err : new Error('Failed to load GTADB landmarks dataset');
    });

  return pendingLoad;
}

export function getCachedGtadbLandmarks(): CommunityLandmarkItem[] | null {
  return cachedLandmarks;
}

export function getCachedGtadbSummary(): CommunityPoiSummary | null {
  return cachedSummary;
}
