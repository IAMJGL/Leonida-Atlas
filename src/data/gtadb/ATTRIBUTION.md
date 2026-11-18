# GTADB Data & YANIS V18 Attribution

- **Source Repository**: https://github.com/rolux/gtadb.org
- **Dataset Path**: `map/data/6/landmarks.json` (3,431 records, unmodified raw copy)
- **Tileset Reference**: `maps/tiles/6/yanis,18/` (YANIS V18, GTA Mapping Community)
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0) — https://creativecommons.org/licenses/by/4.0/
- **Required Attribution**:
  - `GTA VI Landmarks Data (CC BY 4.0) — https://map.gtadb.org`
  - `GTA VI Map Tiles (CC BY 4.0) — https://map.gtadb.org`
  - Attribution: `gtadb.org and all contributors`
- **Modifications Made in Leonida Atlas**:
  - `src/data/gtadb/landmarks.json` is stored unmodified as imported.
  - `src/data/gtadbAdapter.ts` parses the positional JSON tuples at runtime into typed `CommunityLandmarkItem` objects, maps GTADB `tags` into `CommunityPoiCategory` groups without modifying raw names, coordinates, or tags, derives verification status (`confirmed` / `estimated` / `unknown`) from GTADB's `?` and `unconfirmed` markers, and prefixes internal app IDs (`gtadb-L1`, etc.) solely to prevent collisions with legacy sample/user IDs while preserving `gtadbId` (`"L1"`, etc.).
