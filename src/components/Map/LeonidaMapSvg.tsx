import React from 'react';
import { MapStyleMode } from '../../types';
import { MAP_WIDTH, MAP_HEIGHT } from '../../constants/map';

interface LeonidaMapSvgProps {
  styleMode: MapStyleMode;
  showRoads: boolean;
  showDistricts: boolean;
  showGrid: boolean;
}

export const LeonidaMapSvg: React.FC<LeonidaMapSvgProps> = ({
  styleMode,
  showRoads,
  showDistricts,
  showGrid,
}) => {
  const isNight = styleMode === 'night';
  const isRecon = styleMode === 'recon';

  // Natural cartographic palette (no pink overlays or tints on map artwork)
  const oceanFill = isNight ? '#0E1521' : isRecon ? '#111A26' : '#121B2B';
  const shallowWaterFill = isNight ? '#152334' : isRecon ? '#182A3D' : '#192A3F';
  const reefWaterFill = isNight ? '#1A2D42' : isRecon ? '#1E384F' : '#1F3650';

  const mainlandFill = isNight ? '#1B2330' : isRecon ? '#1F2937' : '#222C3B';
  const urbanFill = isNight ? '#263142' : isRecon ? '#283648' : '#2B384C';
  const wetlandsFill = isNight ? '#16282A' : isRecon ? '#172D2E' : '#1A3132';
  const beachFill = isNight ? '#3B362E' : isRecon ? '#36342F' : '#4A4236';
  const runwayFill = isNight ? '#232C3B' : isRecon ? '#253142' : '#283344';
  const mountainFill = isNight ? '#1E2A2B' : isRecon ? '#1F2D2E' : '#233233';
  const mountainPeakFill = isNight ? '#273739' : isRecon ? '#283B3D' : '#2D4042';

  const highwayStroke = isNight ? '#FFAD83' : isRecon ? '#42CFC3' : '#F4B886';
  const highwayGlow = isNight ? 'rgba(0, 0, 0, 0.45)' : isRecon ? 'rgba(66, 207, 195, 0.2)' : 'rgba(0, 0, 0, 0.35)';
  const arterialStroke = isNight ? '#465469' : isRecon ? '#364E5E' : '#4E5D73';
  const trailStroke = isNight ? '#334155' : isRecon ? '#283D3B' : '#3B4A5E';

  return (
    <g className="leonida-map-graphics pointer-events-none">
      <defs>
        {/* Tactical grid pattern */}
        <pattern id="tactical-grid-tall" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 240, 232, 0.05)" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="1.5" fill="rgba(66, 207, 195, 0.28)" />
        </pattern>

        {/* Urban city block hatching */}
        <pattern id="urban-blocks-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="none" stroke="rgba(255, 240, 232, 0.05)" strokeWidth="0.75" />
        </pattern>

        {/* Wetlands sawgrass pattern */}
        <pattern id="sawgrass-texture" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 5,25 Q 10,12 8,5 M 12,25 Q 17,10 20,6 M 22,25 Q 24,14 27,8" fill="none" stroke="rgba(66, 207, 195, 0.16)" strokeWidth="1" />
        </pattern>

        {/* Pine forest texture for Mount Kalaga */}
        <pattern id="pine-forest-texture" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 12,4 L 7,16 L 17,16 Z M 12,16 L 12,20" fill="none" stroke="rgba(110, 175, 165, 0.2)" strokeWidth="0.8" />
        </pattern>

        {/* Depth gradients */}
        <radialGradient id="atlantic-deep-glow" cx="80%" cy="65%" r="70%">
          <stop offset="0%" stopColor="#18273B" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0C121C" stopOpacity="0.9" />
        </radialGradient>
      </defs>

      {/* 1. BASE OCEAN LAYER (2000 x 2800) */}
      <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill={oceanFill} />
      <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#atlantic-deep-glow)" />

      {/* Bathymetric coastal shelves (Shallow water & coral reefs surrounding elongated peninsula) */}
      {/* Atlantic Shelf on East Coast */}
      <path
        d="
          M 1450,260
          C 1650,380 1850,750 1860,1250
          C 1870,1650 1960,1850 1920,2150
          C 1880,2350 1680,2480 1480,2520
          C 1250,2560 980,2720 720,2780
          C 540,2810 420,2740 480,2620
          C 560,2480 750,2340 880,2220
          C 960,2150 920,2020 840,1920
          C 720,1780 620,1620 540,1420
          C 460,1220 520,950 580,720
          C 640,480 950,320 1250,260
          Z
        "
        fill={shallowWaterFill}
        opacity="0.85"
      />

      {/* Inner Reef Water (Turquoise waters around Vice Beach, Biscayne Bay & Keys) */}
      <path
        d="
          M 1540,1400
          C 1620,1520 1850,1620 1880,1850
          C 1900,2050 1850,2220 1680,2300
          C 1520,2380 1320,2460 1120,2550
          C 920,2640 760,2740 640,2750
          C 550,2760 520,2680 580,2590
          C 680,2460 880,2360 1050,2280
          C 1220,2200 1360,2080 1420,1920
          C 1480,1780 1490,1550 1540,1400
          Z
        "
        fill={reefWaterFill}
        opacity="0.8"
      />

      {/* 2. MAINLAND LEONIDA ELONGATED PENINSULA (Tall north-to-south Florida-inspired landmass) */}
      <path
        d="
          M 180,480
          C 190,360 260,270 420,250
          C 580,230 840,235 1120,245
          C 1340,255 1520,285 1620,380
          C 1660,490 1640,650 1600,820
          C 1560,980 1520,1140 1510,1300
          C 1500,1420 1530,1520 1560,1640
          C 1580,1720 1540,1820 1480,1920
          C 1440,2000 1420,2100 1360,2180
          C 1300,2260 1200,2295 1100,2290
          C 960,2280 860,2220 780,2120
          C 720,2020 700,1890 680,1750
          C 660,1620 580,1520 520,1420
          C 480,1360 380,1350 320,1300
          C 280,1230 300,1140 360,1080
          C 420,1020 520,1040 560,960
          C 600,880 560,740 480,640
          C 390,560 260,540 180,480
          Z
        "
        fill={mainlandFill}
        stroke="rgba(66, 207, 195, 0.28)"
        strokeWidth="1.8"
      />

      {/* 3. NORTH REGION: MOUNT KALAGA NATIONAL PARK (Rugged Pine Ridges & Alpine Topography) */}
      <g id="mount-kalaga-park">
        {/* Mountain Massif Elevation Base */}
        <path
          d="
            M 620,260
            C 720,245 920,250 1150,260
            C 1280,270 1380,320 1360,420
            C 1340,510 1220,580 1100,620
            C 980,660 820,640 700,590
            C 600,540 550,450 580,360
            C 600,300 605,270 620,260
            Z
          "
          fill={mountainFill}
          stroke="rgba(100, 150, 145, 0.28)"
          strokeWidth="1.5"
        />
        {/* Pine forest pattern */}
        <path
          d="
            M 620,260
            C 720,245 920,250 1150,260
            C 1280,270 1380,320 1360,420
            C 1340,510 1220,580 1100,620
            C 980,660 820,640 700,590
            C 600,540 550,450 580,360
            Z
          "
          fill="url(#pine-forest-texture)"
          opacity="0.8"
        />

        {/* High Elevation Ridgelines & Peaks */}
        <path
          d="
            M 760,310
            C 840,285 960,290 1080,310
            C 1160,330 1200,380 1170,440
            C 1120,490 1020,520 920,510
            C 820,500 760,450 740,390
            C 725,340 740,320 760,310
            Z
          "
          fill={mountainPeakFill}
          stroke="rgba(148, 163, 184, 0.35)"
          strokeWidth="1.2"
        />

        {/* Mountain Peaks Triangles with Elevation Accents */}
        <polygon points="920,330 940,370 900,370" fill="#94A3B8" opacity="0.75" />
        <polygon points="1040,345 1060,385 1020,385" fill="#94A3B8" opacity="0.6" />
        <polygon points="820,360 838,395 802,395" fill="#94A3B8" opacity="0.55" />
        <polygon points="980,420 998,455 962,455" fill="#94A3B8" opacity="0.5" />

        {/* Kalaga River Gorge (Winding rapids carving south-east from the peaks) */}
        <path
          d="
            M 920,370
            Q 860,430 890,490
            T 960,570
            T 920,660
            T 1020,760
            T 1080,850
          "
          fill="none"
          stroke={shallowWaterFill}
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Inner river stream */}
        <path
          d="
            M 920,370
            Q 860,430 890,490
            T 960,570
            T 920,660
            T 1020,760
            T 1080,850
          "
          fill="none"
          stroke="#55B8B0"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>

      {/* 4. NORTH-CENTRAL INTERIOR: AMBROSIA & LAKE AMBROSIA */}
      <g id="ambrosia-lake-basin">
        {/* Lake Ambrosia (Sprawling freshwater inland lake) */}
        <path
          d="
            M 950,860
            C 1060,830 1190,850 1260,910
            C 1330,970 1340,1060 1290,1140
            C 1230,1210 1120,1240 1020,1210
            C 920,1180 870,1100 890,1010
            C 910,930 920,870 950,860
            Z
          "
          fill={shallowWaterFill}
          stroke="rgba(32, 217, 210, 0.4)"
          strokeWidth="1.8"
        />
        {/* Central Pine Island in Lake Ambrosia */}
        <ellipse cx="1110" cy="1030" rx="45" ry="28" fill={mainlandFill} stroke="rgba(32, 217, 210, 0.3)" strokeWidth="1" />
        {/* Spillway dam and outlet canal toward southeast */}
        <rect x="1270" y="1020" width="30" height="14" fill="#38bdf8" opacity="0.8" />
        <path
          d="M 1290,1030 Q 1380,1090 1440,1190 T 1510,1360"
          fill="none"
          stroke={shallowWaterFill}
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Agricultural citrus groves & speedway land */}
        <ellipse cx="980" cy="980" rx="90" ry="60" fill="none" stroke="rgba(255, 155, 69, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
      </g>

      {/* 5. WEST COAST: PORT GELLHORN & GELLHORN BAY */}
      <g id="port-gellhorn-region">
        {/* Gellhorn Coastal Bay indentation */}
        <path
          d="
            M 310,1180
            C 260,1230 250,1310 290,1380
            C 330,1440 400,1470 470,1450
            C 440,1390 410,1320 370,1260
            C 340,1210 320,1190 310,1180
            Z
          "
          fill={shallowWaterFill}
          stroke="rgba(56, 189, 248, 0.35)"
          strokeWidth="1.2"
        />
        {/* Port Gellhorn urban footprint & docks */}
        <path
          d="M 360,1180 L 470,1170 L 490,1300 L 380,1330 Z"
          fill={urbanFill}
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="1.5"
        />
        <path d="M 360,1180 L 470,1170 L 490,1300 L 380,1330 Z" fill="url(#urban-blocks-grid)" opacity="0.4" />
        {/* Marina piers */}
        <line x1="360" y1="1200" x2="310" y2="1210" stroke="#38bdf8" strokeWidth="3" />
        <line x1="370" y1="1240" x2="320" y2="1250" stroke="#38bdf8" strokeWidth="3" />
      </g>

      {/* 6. SOUTH-CENTRAL INTERIOR: GRASSRIVERS (SUBTROPICAL WETLANDS & EVERGLADES) */}
      <g id="grassrivers-wetlands">
        {/* Immense wetlands basin */}
        <path
          d="
            M 720,1480
            C 820,1420 1020,1430 1180,1490
            C 1290,1540 1340,1650 1310,1790
            C 1270,1920 1180,2020 1050,2080
            C 920,2140 780,2080 720,1980
            C 660,1860 640,1720 670,1590
            C 685,1530 700,1500 720,1480
            Z
          "
          fill={wetlandsFill}
          opacity="0.9"
        />
        {/* Sawgrass texture */}
        <path
          d="
            M 720,1480
            C 820,1420 1020,1430 1180,1490
            C 1290,1540 1340,1650 1310,1790
            C 1270,1920 1180,2020 1050,2080
            C 920,2140 780,2080 720,1980
            C 660,1860 640,1720 670,1590
            Z
          "
          fill="url(#sawgrass-texture)"
          opacity="0.7"
        />

        {/* Intricate winding alligator bayous & airboat river paths */}
        <path
          d="
            M 780,1520 Q 840,1620 800,1710 T 890,1820 T 830,1940 T 940,2040
            M 920,1560 Q 990,1640 960,1740 T 1060,1860 T 1000,1980
            M 1080,1620 Q 1140,1710 1110,1810 T 1190,1930
            M 720,1660 Q 770,1730 750,1820 T 810,1910
          "
          fill="none"
          stroke={shallowWaterFill}
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      {/* 7. SOUTHEAST COAST: VICE CITY METRO, BISCAYNE BAY & VICE BEACH */}
      {/* Biscayne Bay Water Indentation */}
      <path
        d="
          M 1560,1650
          C 1520,1720 1500,1820 1510,1920
          C 1520,2020 1580,2100 1560,2180
          C 1540,2220 1480,2250 1420,2230
          C 1360,2160 1380,2050 1420,1960
          C 1460,1870 1450,1750 1440,1680
          C 1470,1630 1520,1620 1560,1650
          Z
        "
        fill={shallowWaterFill}
        stroke="rgba(32, 217, 210, 0.3)"
        strokeWidth="1.2"
      />

      {/* Downtown Vice High-Density Footprint */}
      <g id="downtown-vice">
        <path
          d="
            M 1400,1680
            L 1550,1670
            L 1590,1820
            L 1520,1890
            L 1420,1870
            L 1390,1770
            Z
          "
          fill={urbanFill}
          stroke="rgba(32, 217, 210, 0.45)"
          strokeWidth="1.6"
        />
        <path
          d="
            M 1400,1680
            L 1550,1670
            L 1590,1820
            L 1520,1890
            L 1420,1870
            L 1390,1770
            Z
          "
          fill="url(#urban-blocks-grid)"
          opacity="0.55"
        />
        {/* Neon downtown glow */}
        <ellipse cx="1490" cy="1780" rx="110" ry="85" fill={isNight ? 'rgba(32, 217, 210, 0.1)' : 'rgba(32, 217, 210, 0.05)'} />
      </g>

      {/* Vice City International Airport (Southwest of Downtown) */}
      <g id="escobar-international">
        <path d="M 1270,1880 L 1400,1860 L 1420,1990 L 1290,2010 Z" fill={runwayFill} />
        {/* Runway 1 (Diagonal) */}
        <line x1="1285" y1="1890" x2="1405" y2="1995" stroke="#ffffff" strokeWidth="4" strokeDasharray="14 8" opacity="0.6" />
        {/* Runway 2 (Cross Runway) */}
        <line x1="1395" y1="1895" x2="1295" y2="1985" stroke="#ffffff" strokeWidth="4" strokeDasharray="14 8" opacity="0.6" />
        {/* Terminal building */}
        <rect x="1335" y="1925" width="36" height="26" rx="4" fill="#38bdf8" opacity="0.75" />
      </g>

      {/* Causeway Islands (Mid-Bay archipelago: Starfish & Venetian) */}
      <g id="causeway-islands">
        {/* Starfish Island */}
        <polygon points="1630,1750 1680,1740 1705,1780 1675,1815 1625,1800" fill={urbanFill} stroke="rgba(32, 217, 210, 0.4)" strokeWidth="1" />
        {/* Venetian West */}
        <ellipse cx="1590" cy="1690" rx="36" ry="18" transform="rotate(-15 1590 1690)" fill={urbanFill} stroke="rgba(32, 217, 210, 0.35)" strokeWidth="1" />
        {/* Venetian East */}
        <ellipse cx="1680" cy="1670" rx="42" ry="20" transform="rotate(-10 1680 1670)" fill={urbanFill} stroke="rgba(32, 217, 210, 0.35)" strokeWidth="1" />
      </g>

      {/* Vice Beach Atlantic Barrier Island (Slender barrier running north-south) */}
      <g id="vice-beach-island">
        {/* Sand beach coastline */}
        <path
          d="
            M 1740,1540
            C 1780,1660 1830,1840 1840,2020
            C 1845,2140 1820,2240 1770,2310
            C 1750,2290 1730,2260 1735,2210
            C 1750,2100 1765,1950 1755,1800
            C 1745,1670 1715,1590 1690,1540
            Z
          "
          fill={beachFill}
          stroke="rgba(255, 155, 69, 0.45)"
          strokeWidth="1.2"
        />
        {/* Ocean Drive urban spine */}
        <path
          d="
            M 1730,1560
            C 1760,1680 1800,1840 1810,2010
            C 1815,2110 1790,2210 1750,2260
            C 1735,2230 1720,2180 1725,2100
            C 1735,1980 1740,1840 1730,1700
            C 1720,1610 1700,1565 1690,1550
            Z
          "
          fill={urbanFill}
          stroke="rgba(255, 173, 131, 0.35)"
          strokeWidth="1.5"
        />
        <path
          d="
            M 1730,1560
            C 1760,1680 1800,1840 1810,2010
            C 1815,2110 1790,2210 1750,2260
            C 1735,2230 1720,2180 1725,2100
            C 1735,1980 1740,1840 1730,1700
            Z
          "
          fill="url(#urban-blocks-grid)"
          opacity="0.45"
        />
      </g>

      {/* Port Leonida (Industrial container terminal south of Downtown) */}
      <g id="port-leonida-dockyard">
        <polygon
          points="1500,2060 1640,2050 1665,2180 1580,2215 1520,2200 1490,2130"
          fill={urbanFill}
          stroke="rgba(251, 191, 36, 0.5)"
          strokeWidth="1.6"
        />
        <rect x="1540" y="2090" width="70" height="18" fill={shallowWaterFill} />
        <rect x="1550" y="2130" width="65" height="18" fill={shallowWaterFill} />
        {/* Gantry crane positions */}
        <circle cx="1640" cy="2070" r="3.5" fill="#fbbf24" />
        <circle cx="1645" cy="2110" r="3.5" fill="#fbbf24" />
        <circle cx="1650" cy="2150" r="3.5" fill="#fbbf24" />
      </g>

      {/* 8. SOUTHERN OCEAN EXTENSION: LEONIDA KEYS (Archipelago curving south/southwest) */}
      <g id="leonida-keys-chain">
        {/* Upper Key (Key Largo equivalent) */}
        <path d="M 1280,2300 C 1330,2330 1350,2380 1310,2420 C 1260,2440 1200,2390 1220,2330 Z" fill={mainlandFill} stroke="rgba(255, 155, 69, 0.35)" strokeWidth="1.2" />
        {/* Plantation & Islamorada Key */}
        <path d="M 1150,2400 C 1190,2420 1210,2470 1170,2500 C 1120,2515 1070,2470 1100,2420 Z" fill={mainlandFill} stroke="rgba(255, 155, 69, 0.35)" strokeWidth="1.2" />
        {/* Marathon Key */}
        <path d="M 1010,2485 C 1050,2500 1065,2545 1025,2575 C 980,2590 940,2545 965,2505 Z" fill={mainlandFill} stroke="rgba(255, 155, 69, 0.35)" strokeWidth="1.2" />
        {/* Big Pine Key */}
        <path d="M 870,2560 C 910,2570 925,2615 885,2645 C 840,2660 800,2615 825,2575 Z" fill={mainlandFill} stroke="rgba(255, 155, 69, 0.35)" strokeWidth="1.2" />
        {/* Key West / Pelican Key (Southernmost Point) */}
        <path d="M 720,2640 C 760,2645 785,2695 745,2730 C 690,2755 640,2710 670,2660 Z" fill={urbanFill} stroke="rgba(255, 155, 69, 0.5)" strokeWidth="1.5" />
        {/* Outlying Coral Atolls & Reefs */}
        <circle cx="580,2720" r="22" fill={beachFill} stroke="rgba(32, 217, 210, 0.5)" strokeWidth="1.2" />
        <circle cx="510,2745" r="14" fill={beachFill} stroke="rgba(32, 217, 210, 0.5)" strokeWidth="1.2" />
      </g>

      {/* 9. ROAD & HIGHWAY NETWORK (Scaled across 2800 height) */}
      {showRoads && (
        <g id="road-network">
          {/* Secondary Arterial Connectors */}
          <path
            d="
              M 880,245 L 880,450
              M 880,650 Q 820,750 820,860
              M 820,1180 Q 750,1320 740,1480
              M 480,1280 Q 640,1220 820,1180
              M 460,1350 Q 580,1460 740,1480
              M 1260,910 Q 1380,980 1480,1050
              M 1480,1050 L 1520,1350
              M 1360,1880 L 1290,2010
              M 1720,1650 L 1780,1650
              M 1740,1950 L 1800,1950
              M 1740,2150 L 1800,2150
            "
            fill="none"
            stroke={arterialStroke}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dirt & Marsh Trails in Grassrivers */}
          <path
            d="
              M 720,1620 Q 770,1710 820,1760 T 870,1880
              M 920,1560 Q 980,1640 960,1750
              M 640,1490 Q 690,1590 710,1720
              M 1080,720 Q 1140,680 1200,700
            "
            fill="none"
            stroke={trailStroke}
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* MAJOR INTERSTATE HIGHWAYS */}
          {/* Interstate 97 (North to South Backbone traversing from Mount Kalaga down to Vice City & Keys) */}
          <path
            d="
              M 1120,245
              L 1120,480
              Q 1120,680 1140,840
              T 1240,1150
              Q 1280,1350 1340,1560
              T 1420,1780
              Q 1460,1980 1440,2150
              Q 1410,2240 1280,2300
            "
            fill="none"
            stroke={highwayStroke}
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 6px ${highwayGlow})`}
          />

          {/* Interstate Highway Center Stripe */}
          <path
            d="
              M 1120,245
              L 1120,480
              Q 1120,680 1140,840
              T 1240,1150
              Q 1280,1350 1340,1560
              T 1420,1780
              Q 1460,1980 1440,2150
              Q 1410,2240 1280,2300
            "
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="12 10"
            opacity="0.85"
          />

          {/* Interstate 95 West Branch (To Port Gellhorn) */}
          <path
            d="
              M 1140,840
              Q 920,890 740,940
              T 520,1180
              L 440,1220
            "
            fill="none"
            stroke={highwayStroke}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 5px ${highwayGlow})`}
          />

          {/* Venetian & MacArthur Causeways (Connecting Downtown Vice to Vice Beach) */}
          {/* North Causeway (Julia Tuttle) */}
          <line
            x1="1500"
            y1="1660"
            x2="1730"
            y2="1640"
            stroke={highwayStroke}
            strokeWidth="4.5"
            strokeLinecap="round"
            filter={`drop-shadow(0 0 4px ${highwayGlow})`}
          />
          {/* Venetian Causeway (Via Starfish Island) */}
          <path
            d="M 1530,1760 L 1590,1730 L 1680,1710 L 1740,1730"
            fill="none"
            stroke={highwayStroke}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* South Causeway (MacArthur to Ocean Drive) */}
          <path
            d="M 1520,1850 L 1630,1830 L 1750,1870"
            fill="none"
            stroke={highwayStroke}
            strokeWidth="4.5"
            strokeLinecap="round"
            filter={`drop-shadow(0 0 4px ${highwayGlow})`}
          />
          {/* Port Leonida Bridge */}
          <line x1="1470" y1="2020" x2="1540" y2="2080" stroke={highwayStroke} strokeWidth="4" strokeLinecap="round" />

          {/* Ocean Drive Beachfront Boulevard */}
          <path
            d="
              M 1720,1570
              C 1750,1690 1790,1860 1800,2030
              C 1805,2130 1780,2230 1740,2270
            "
            fill="none"
            stroke="#42CFC3"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))"
          />

          {/* Seven-Mile Overseas Viaduct (Keys Highway extending deep south into the ocean) */}
          <path
            d="
              M 1280,2300
              L 1250,2350
              L 1160,2420
              L 1090,2465
              L 1005,2510
              L 905,2565
              L 815,2615
              L 720,2670
            "
            fill="none"
            stroke={highwayStroke}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 6px ${highwayGlow})`}
          />
          {/* Viaduct Pylons */}
          <circle cx="1210" cy="2385" r="3.5" fill="#ffffff" />
          <circle cx="1125" cy="2440" r="3.5" fill="#ffffff" />
          <circle cx="1045" cy="2490" r="3.5" fill="#ffffff" />
          <circle cx="955" cy="2540" r="3.5" fill="#ffffff" />
          <circle cx="860" cy="2590" r="3.5" fill="#ffffff" />
          <circle cx="765" cy="2645" r="3.5" fill="#ffffff" />
        </g>
      )}

      {/* 10. TACTICAL GRID OVERLAY (2000 x 2800) */}
      {showGrid && (
        <g id="grid-overlay">
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#tactical-grid-tall)" />
          {/* Coordinate tick labels along borders */}
          {Array.from({ length: 11 }).map((_, i) => (
            <text
              key={`grid-x-${i}`}
              x={i * 200 + 10}
              y={24}
              fill="rgba(255, 255, 255, 0.28)"
              fontSize="12"
              fontFamily="monospace"
            >
              {`LON ${(81.2 - i * 0.1).toFixed(1)}°W`}
            </text>
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <text
              key={`grid-y-${i}`}
              x={12}
              y={i * 200 + 40}
              fill="rgba(255, 255, 255, 0.28)"
              fontSize="12"
              fontFamily="monospace"
            >
              {`LAT ${(27.8 - i * 0.2).toFixed(1)}°N`}
            </text>
          ))}
        </g>
      )}

      {/* 11. DISTRICT & GEOGRAPHY LABELS */}
      {showDistricts && (
        <g id="district-labels" className="select-none">
          {/* MOUNT KALAGA NATIONAL PARK (NORTH) */}
          <text
            x="980"
            y="290"
            fill="#C7D2E0"
            fontSize="30"
            fontWeight="800"
            letterSpacing="7"
            textAnchor="middle"
            filter="drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85))"
          >
            MOUNT KALAGA NATIONAL PARK
          </text>
          <text
            x="980"
            y="318"
            fill="rgba(255, 240, 232, 0.78)"
            fontSize="12"
            letterSpacing="4"
            textAnchor="middle"
          >
            NORTHERN ALPINE RIDGE · PINE VALLEY · PEAK ELEV 2,840 FT
          </text>

          {/* AMBROSIA & LAKE AMBROSIA (NORTH-CENTRAL INTERIOR) */}
          <text
            x="1110"
            y="940"
            fill="#42CFC3"
            fontSize="26"
            fontWeight="800"
            letterSpacing="5"
            textAnchor="middle"
            filter="drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85))"
          >
            LAKE AMBROSIA
          </text>
          <text
            x="1110"
            y="965"
            fill="rgba(255, 240, 232, 0.78)"
            fontSize="12"
            letterSpacing="3"
            textAnchor="middle"
          >
            FRESHWATER BASIN · DAM & CITRUS BELT
          </text>

          {/* PORT GELLHORN (WEST COAST) */}
          <text
            x="420"
            y="1140"
            fill="#FFAD83"
            fontSize="26"
            fontWeight="800"
            letterSpacing="5"
            textAnchor="middle"
            filter="drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85))"
          >
            PORT GELLHORN
          </text>
          <text
            x="420"
            y="1165"
            fill="rgba(255, 240, 232, 0.78)"
            fontSize="12"
            letterSpacing="3"
            textAnchor="middle"
          >
            WESTERN COASTAL MARINAS · SUNKEN INLETS
          </text>

          {/* GRASSRIVERS (SOUTH-CENTRAL INTERIOR) */}
          <text
            x="960"
            y="1700"
            fill="#42CFC3"
            fontSize="34"
            fontWeight="800"
            letterSpacing="9"
            textAnchor="middle"
            filter="drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85))"
          >
            GRASSRIVERS
          </text>
          <text
            x="960"
            y="1730"
            fill="rgba(255, 240, 232, 0.78)"
            fontSize="13"
            letterSpacing="5"
            textAnchor="middle"
          >
            SUBTROPICAL SAWGRASS WETLANDS & ALLIGATOR BAYOUS
          </text>

          {/* DOWNTOWN VICE (SOUTHEAST) */}
          <text
            x="1480"
            y="1730"
            fill="#FFF0E8"
            fontSize="34"
            fontWeight="900"
            letterSpacing="6"
            textAnchor="middle"
            filter="drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9))"
          >
            DOWNTOWN VICE
          </text>
          <text
            x="1480"
            y="1758"
            fill="rgba(255, 240, 232, 0.78)"
            fontSize="13"
            letterSpacing="4"
            textAnchor="middle"
          >
            BISCAYNE BAY · FINANCIAL SKYLINE
          </text>

          {/* VICE BEACH (SOUTHEAST ATLANTIC BARRIER) */}
          <text
            x="1830"
            y="1740"
            fill="#FFAD83"
            fontSize="30"
            fontWeight="900"
            letterSpacing="6"
            textAnchor="middle"
            transform="rotate(82 1830 1740)"
            filter="drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9))"
          >
            VICE BEACH
          </text>
          <text
            x="1810"
            y="1940"
            fill="rgba(255, 240, 232, 0.78)"
            fontSize="12"
            letterSpacing="3"
            textAnchor="middle"
            transform="rotate(82 1810 1940)"
          >
            OCEAN DRIVE STRIP · ATLANTIC SANDS
          </text>

          {/* PORT LEONIDA (SOUTHEAST DOCKS) */}
          <text
            x="1580"
            y="2140"
            fill="#CBD5E1"
            fontSize="22"
            fontWeight="700"
            letterSpacing="4"
            textAnchor="middle"
            filter="drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85))"
          >
            PORT LEONIDA
          </text>

          {/* LEONIDA KEYS (SOUTH OCEAN ARCHIPELAGO) */}
          <text
            x="1020"
            y="2440"
            fill="#42CFC3"
            fontSize="30"
            fontWeight="800"
            letterSpacing="7"
            textAnchor="middle"
            filter="drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9))"
          >
            LEONIDA KEYS
          </text>
          <text
            x="1020"
            y="2468"
            fill="rgba(255, 240, 232, 0.78)"
            fontSize="13"
            letterSpacing="4"
            textAnchor="middle"
          >
            OVERSEAS VIADUCT · CORAL ATOLLS · PELICAN KEY
          </text>
        </g>
      )}
    </g>
  );
};
