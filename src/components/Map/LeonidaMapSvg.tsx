import React from 'react';
import { MapStyleMode } from '../../types';

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
  // Color variables depending on styleMode
  const isNight = styleMode === 'night';
  const isRecon = styleMode === 'recon';

  // Ocean fill
  const oceanFill = isNight ? '#0b0c10' : isRecon ? '#08141e' : '#0c1524';
  const shallowWaterFill = isNight ? '#10141f' : isRecon ? '#0c2233' : '#11293d';
  const reefWaterFill = isNight ? '#131b2e' : isRecon ? '#103046' : '#133e54';

  // Landmass
  const mainlandFill = isNight ? '#13151f' : isRecon ? '#141d24' : '#19202a';
  const urbanFill = isNight ? '#1b1e2c' : isRecon ? '#1b2732' : '#222b3a';
  const wetlandsFill = isNight ? '#0e1818' : isRecon ? '#132420' : '#152b24';
  const beachFill = isNight ? '#2a2228' : isRecon ? '#2d2e24' : '#3e3629';
  const runwayFill = isNight ? '#282b3d' : isRecon ? '#263745' : '#2d3748';

  // Roads
  const highwayStroke = isNight ? '#ff3b91' : isRecon ? '#00e5ff' : '#ff9b45';
  const highwayGlow = isNight ? 'rgba(255, 59, 145, 0.4)' : isRecon ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 155, 69, 0.25)';
  const arterialStroke = isNight ? '#3b4361' : isRecon ? '#2b4759' : '#414d63';
  const trailStroke = isNight ? '#222738' : isRecon ? '#1f342d' : '#2b3b33';

  return (
    <g className="leonida-map-graphics pointer-events-none">
      <defs>
        {/* Subtle grid pattern for recon / tactical feel */}
        <pattern id="tactical-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.8" />
          <circle cx="80" cy="80" r="1.5" fill="rgba(32, 217, 210, 0.2)" />
        </pattern>

        {/* Urban city block hatching */}
        <pattern id="urban-blocks" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.75" />
        </pattern>

        {/* Wetlands sawgrass pattern */}
        <pattern id="wetlands-texture" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 5,25 Q 10,12 8,5 M 12,25 Q 17,10 20,6 M 22,25 Q 24,14 27,8" fill="none" stroke="rgba(32, 217, 210, 0.08)" strokeWidth="1" />
        </pattern>

        {/* Gradient for water depth */}
        <radialGradient id="ocean-glow" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#122538" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#080c14" stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* 1. BASE OCEAN LAYER */}
      <rect x="0" y="0" width="2000" height="1400" fill={oceanFill} />
      <rect x="0" y="0" width="2000" height="1400" fill="url(#ocean-glow)" />

      {/* Bathymetric depth contours / shallow coastal shelves */}
      {/* Atlantic shelf around Vice Beach & Keys */}
      <path
        d="M 1250,150 C 1450,220 1850,380 1880,720 C 1900,980 1680,1200 1380,1280 C 1120,1350 820,1320 620,1220 C 520,1160 480,1050 540,940 C 640,780 720,700 860,640 C 980,590 1080,480 1140,320 Z"
        fill={shallowWaterFill}
        opacity="0.75"
      />
      <path
        d="M 1320,240 C 1520,320 1780,480 1800,740 C 1820,950 1620,1140 1320,1200 C 1090,1250 880,1220 740,1140 C 680,1080 720,980 820,920 C 940,840 1120,760 1200,600 C 1250,500 1280,360 1320,240 Z"
        fill={reefWaterFill}
        opacity="0.8"
      />

      {/* 2. MAINLAND LEONIDA LANDMASS */}
      {/* Huge realistic continental mass with natural peninsulas, bays, and sculpted northern mountain ridges */}
      <path
        d="
          M 100,320
          C 105,230 140,165 220,125
          C 320,85 450,90 580,75
          C 690,65 770,52 870,55
          C 970,58 1070,72 1190,78
          C 1310,82 1430,110 1510,150
          C 1555,172 1575,210 1550,265
          C 1520,320 1480,380 1440,440
          C 1390,320 1350,380 1320,440
          C 1300,500 1320,540 1360,590
          C 1400,640 1420,700 1410,760
          C 1390,850 1340,920 1260,980
          C 1180,1040 1080,1080 980,1110
          C 880,1140 760,1130 680,1090
          C 600,1050 540,980 500,900
          C 460,820 440,720 400,660
          C 360,600 280,570 220,530
          C 160,490 120,420 100,320
          Z
        "
        fill={mainlandFill}
        stroke={isNight ? 'rgba(255, 59, 145, 0.25)' : 'rgba(32, 217, 210, 0.25)'}
        strokeWidth="1.5"
      />

      {/* Mount Ambrosia & Kelly Ridge Elevation Contours (Northern topography) */}
      <g id="kelly-topography">
        {/* Shaded mountain elevation massif */}
        <path
          d="
            M 600,180
            C 660,130 750,110 840,100
            C 930,90 1020,105 1100,135
            C 1150,155 1180,190 1140,215
            C 1080,240 980,225 900,210
            C 820,195 720,220 650,215
            Z
          "
          fill={isNight ? '#161928' : isRecon ? '#172b2a' : '#1e2832'}
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="1"
        />
        {/* Higher inner ridge crest */}
        <path
          d="
            M 690,160
            C 750,125 820,115 880,110
            C 950,105 1010,120 1060,145
            C 1020,170 950,155 890,150
            C 830,145 760,165 690,160
            Z
          "
          fill={isNight ? '#1b1f32' : isRecon ? '#1a3734' : '#24323e'}
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Mountain peak markers */}
        <polygon points="860,85 870,105 850,105" fill="#a855f7" opacity="0.6" />
        <polygon points="980,95 990,115 970,115" fill="#a855f7" opacity="0.5" />
        <polygon points="760,105 770,122 750,122" fill="#a855f7" opacity="0.4" />
      </g>

      {/* Biscayne / Vice Bay water indentation carved into the east coast */}
      <path
        d="
          M 1340,430
          C 1300,480 1280,560 1290,640
          C 1300,720 1350,800 1330,880
          C 1310,930 1260,970 1200,990
          C 1140,1005 1060,980 1040,930
          C 1010,870 1040,800 1080,740
          C 1120,680 1140,610 1120,540
          C 1100,470 1050,420 1020,350
          C 1000,300 1030,240 1090,220
          C 1160,200 1220,230 1260,280
          C 1300,330 1350,380 1340,430
          Z
        "
        fill={shallowWaterFill}
        stroke="rgba(32, 217, 210, 0.2)"
        strokeWidth="1"
      />

      {/* 3. LAKE AMBROSIA (INLAND LAKE IN NORTH KELLY COUNTY) */}
      <g id="lake-ambrosia">
        <path
          d="
            M 720,220
            C 780,210 860,230 900,270
            C 940,310 930,370 890,410
            C 850,450 780,480 710,470
            C 640,460 590,410 610,340
            C 630,270 670,230 720,220
            Z
          "
          fill={shallowWaterFill}
          stroke="rgba(32, 217, 210, 0.3)"
          strokeWidth="1.2"
        />
        {/* Island inside Lake Ambrosia */}
        <path d="M 740,320 C 760,310 790,320 780,350 C 770,370 730,360 740,320 Z" fill={mainlandFill} />
        {/* River feeding from Ambrosia to the bay */}
        <path
          d="M 890,370 Q 980,400 1040,440 T 1120,540"
          fill="none"
          stroke={shallowWaterFill}
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>

      {/* 4. GRASSRIVERS (EVERGLADES WETLANDS & WATERWAYS) */}
      <g id="grassrivers-marshes">
        <path
          d="
            M 520,720
            C 560,650 640,620 740,640
            C 840,660 920,740 940,840
            C 960,940 900,1020 810,1060
            C 720,1100 620,1070 560,1010
            C 500,950 480,850 490,780
            Z
          "
          fill={wetlandsFill}
          opacity="0.85"
        />
        {/* Sawgrass texture */}
        <path
          d="
            M 520,720
            C 560,650 640,620 740,640
            C 840,660 920,740 940,840
            C 960,940 900,1020 810,1060
            C 720,1100 620,1070 560,1010
            C 500,950 480,850 490,780
            Z
          "
          fill="url(#wetlands-texture)"
          opacity="0.6"
        />
        {/* Intricate winding bayou canals */}
        <path
          d="
            M 620,640 Q 660,720 630,790 T 710,870 T 670,960 T 750,1040
            M 730,680 Q 780,740 760,820 T 840,910 T 800,1000
            M 550,780 Q 600,820 590,890 T 650,970
          "
          fill="none"
          stroke={shallowWaterFill}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      {/* 5. COASTAL ISLANDS & BARRIERS */}
      {/* Vice Beach Barrier Island (Long slender barrier island on the Atlantic) */}
      <g id="vice-beach-barrier">
        {/* Sand beach strip */}
        <path
          d="
            M 1660,340
            C 1690,440 1730,590 1740,750
            C 1745,860 1720,950 1680,1020
            C 1660,1010 1640,990 1645,950
            C 1660,860 1675,740 1665,600
            C 1655,470 1630,390 1610,340
            Z
          "
          fill={beachFill}
          stroke="rgba(255, 155, 69, 0.4)"
          strokeWidth="1"
        />
        {/* Urban spine of Vice Beach / Ocean Drive */}
        <path
          d="
            M 1640,360
            C 1665,450 1700,590 1710,740
            C 1715,840 1695,930 1660,980
            C 1645,960 1630,920 1635,850
            C 1645,740 1650,620 1640,490
            C 1630,410 1615,370 1605,350
            Z
          "
          fill={urbanFill}
          stroke="rgba(255, 59, 145, 0.3)"
          strokeWidth="1.2"
        />
        {/* Urban grid on Vice Beach */}
        <path
          d="
            M 1640,360
            C 1665,450 1700,590 1710,740
            C 1715,840 1695,930 1660,980
            C 1645,960 1630,920 1635,850
            C 1645,740 1650,620 1640,490
            C 1630,410 1615,370 1605,350
            Z
          "
          fill="url(#urban-blocks)"
          opacity="0.4"
        />
      </g>

      {/* Starfish & Venetian Causeway Islands (Mid-Bay archipelago) */}
      <g id="bay-islands">
        {/* Island 1: Starfish Island */}
        <polygon points="1470,580 1520,570 1545,610 1515,645 1465,630" fill={urbanFill} stroke="rgba(32, 217, 210, 0.3)" strokeWidth="1" />
        {/* Island 2: Venetian West */}
        <ellipse cx="1430" cy="520" rx="35" ry="18" transform="rotate(-15 1430 520)" fill={urbanFill} stroke="rgba(32, 217, 210, 0.3)" strokeWidth="1" />
        {/* Island 3: Venetian East */}
        <ellipse cx="1520" cy="500" rx="42" ry="20" transform="rotate(-10 1520 500)" fill={urbanFill} stroke="rgba(32, 217, 210, 0.3)" strokeWidth="1" />
      </g>

      {/* Port Leonida (Reclaimed industrial container terminal) */}
      <g id="port-leonida-island">
        <polygon
          points="1420,830 1540,820 1560,920 1490,950 1440,940 1410,880"
          fill={urbanFill}
          stroke="rgba(251, 191, 36, 0.4)"
          strokeWidth="1.5"
        />
        {/* Docks and slips */}
        <rect x="1460" y="850" width="60" height="15" fill={shallowWaterFill} />
        <rect x="1470" y="885" width="55" height="15" fill={shallowWaterFill} />
        {/* Gantry crane positions */}
        <circle cx="1540" cy="840" r="3" fill="#fbbf24" />
        <circle cx="1545" cy="870" r="3" fill="#fbbf24" />
        <circle cx="1550" cy="900" r="3" fill="#fbbf24" />
      </g>

      {/* Gator Keys Archipelago (Curving chain southwest) */}
      <g id="gator-keys-chain">
        {/* Key Largo equivalent (Upper Key) */}
        <path d="M 1220,1110 C 1260,1130 1280,1165 1250,1190 C 1210,1210 1160,1170 1180,1130 Z" fill={mainlandFill} stroke="rgba(255, 155, 69, 0.3)" strokeWidth="1" />
        {/* Islamorada equivalent (Middle Key) */}
        <path d="M 1120,1180 C 1150,1195 1165,1230 1130,1250 C 1090,1260 1060,1225 1080,1195 Z" fill={mainlandFill} stroke="rgba(255, 155, 69, 0.3)" strokeWidth="1" />
        {/* Marathon equivalent */}
        <path d="M 1020,1235 C 1050,1245 1060,1275 1030,1295 C 990,1310 965,1275 985,1250 Z" fill={mainlandFill} stroke="rgba(255, 155, 69, 0.3)" strokeWidth="1" />
        {/* Lower Key / Key West equivalent */}
        <path d="M 910,1280 C 940,1285 960,1320 930,1345 C 880,1365 840,1330 865,1295 Z" fill={urbanFill} stroke="rgba(255, 155, 69, 0.4)" strokeWidth="1.2" />
        {/* Outlying Coral Atolls */}
        <circle cx="810" cy="1330" r="16" fill={beachFill} stroke="rgba(32, 217, 210, 0.4)" strokeWidth="1" />
        <circle cx="760" cy="1345" r="10" fill={beachFill} stroke="rgba(32, 217, 210, 0.4)" strokeWidth="1" />
      </g>

      {/* 6. DOWNTOWN VICE METRO & RUNWAYS */}
      <g id="downtown-vice-blocks">
        {/* High-density commercial footprint */}
        <path
          d="
            M 1260,490
            L 1380,480
            L 1420,620
            L 1350,680
            L 1280,660
            L 1250,580
            Z
          "
          fill={urbanFill}
          stroke="rgba(32, 217, 210, 0.4)"
          strokeWidth="1.5"
        />
        <path
          d="
            M 1260,490
            L 1380,480
            L 1420,620
            L 1350,680
            L 1280,660
            L 1250,580
            Z
          "
          fill="url(#urban-blocks)"
          opacity="0.5"
        />
        {/* Neon core accent wash */}
        <ellipse cx="1340" cy="570" rx="90" ry="70" fill={isNight ? 'rgba(32, 217, 210, 0.08)' : 'rgba(32, 217, 210, 0.04)'} />
      </g>

      {/* Vice City International Airport */}
      <g id="airport-escobar">
        <path d="M 1150,660 L 1240,650 L 1260,760 L 1170,780 Z" fill={runwayFill} />
        {/* Runway 1 (Diagonal NW to SE) */}
        <line x1="1160" y1="670" x2="1245" y2="765" stroke="#ffffff" strokeWidth="4" strokeDasharray="14 8" opacity="0.6" />
        {/* Runway 2 (Cross Runway NE to SW) */}
        <line x1="1235" y1="675" x2="1165" y2="755" stroke="#ffffff" strokeWidth="4" strokeDasharray="14 8" opacity="0.6" />
        {/* Terminal building */}
        <rect x="1195" y="700" width="30" height="24" rx="4" fill="#38bdf8" opacity="0.7" />
      </g>

      {/* Port Gellhorn coastal area (West Coast) */}
      <g id="port-gellhorn">
        <path d="M 360,540 L 460,530 L 480,640 L 380,670 Z" fill={urbanFill} stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
        <path d="M 360,540 L 460,530 L 480,640 L 380,670 Z" fill="url(#urban-blocks)" opacity="0.3" />
      </g>

      {/* 7. ROAD & HIGHWAY NETWORK */}
      {showRoads && (
        <g id="road-network">
          {/* Secondary Arterial roads & Country connectors */}
          <path
            d="
              M 800,68 L 800,220
              M 800,470 Q 750,560 740,640
              M 480,580 Q 600,560 720,540
              M 460,630 Q 550,700 680,680
              M 1120,420 Q 1190,460 1260,490
              M 1260,660 L 1220,770
              M 1200,900 Q 1150,960 1080,1020
              M 1620,400 L 1660,400
              M 1640,620 L 1690,620
              M 1660,820 L 1710,820
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
              M 520,760 Q 560,810 590,840 T 630,920
              M 670,720 Q 720,760 710,830
              M 460,680 Q 490,750 510,820
              M 820,320 Q 860,280 910,290
            "
            fill="none"
            stroke={trailStroke}
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* MAJOR INTERSTATE HIGHWAYS */}
          {/* Interstate 97 (North to South Backbone) */}
          <path
            d="
              M 1120,78
              L 1120,220
              Q 1120,360 1140,460
              T 1190,640
              Q 1220,740 1250,860
              T 1260,980
              Q 1250,1040 1210,1110
            "
            fill="none"
            stroke={highwayStroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 6px ${highwayGlow})`}
          />

          {/* Interstate Highway Center Stripe */}
          <path
            d="
              M 1120,78
              L 1120,220
              Q 1120,360 1140,460
              T 1190,640
              Q 1220,740 1250,860
              T 1260,980
              Q 1250,1040 1210,1110
            "
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="10 8"
            opacity="0.8"
          />

          {/* Interstate 95 West Branch (To Port Gellhorn) */}
          <path
            d="
              M 1120,220
              Q 940,240 760,250
              T 480,540
              L 380,560
            "
            fill="none"
            stroke={highwayStroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 5px ${highwayGlow})`}
          />

          {/* Venetian & Tropicana Causeways (Connecting Downtown to Vice Beach across the Bay) */}
          {/* North Causeway (Julia Tuttle equivalent) */}
          <line
            x1="1340"
            y1="460"
            x2="1630"
            y2="440"
            stroke={highwayStroke}
            strokeWidth="4.5"
            strokeLinecap="round"
            filter={`drop-shadow(0 0 4px ${highwayGlow})`}
          />
          {/* Venetian Causeway (Via Starfish Island) */}
          <path
            d="M 1370,550 L 1430,520 L 1520,500 L 1640,520"
            fill="none"
            stroke={highwayStroke}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* South Causeway (MacArthur equivalent to Ocean Dr) */}
          <path
            d="M 1360,630 L 1470,620 L 1650,660"
            fill="none"
            stroke={highwayStroke}
            strokeWidth="4.5"
            strokeLinecap="round"
            filter={`drop-shadow(0 0 4px ${highwayGlow})`}
          />
          {/* Port Leonida Bridge */}
          <line x1="1350" y1="780" x2="1440" y2="840" stroke={highwayStroke} strokeWidth="4" strokeLinecap="round" />

          {/* Ocean Drive Beachfront Boulevard */}
          <path
            d="
              M 1630,370
              C 1655,460 1690,600 1700,750
              C 1705,840 1685,930 1655,980
            "
            fill="none"
            stroke="#ff3b91"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px rgba(255, 59, 145, 0.5))"
          />

          {/* Seven-Mile Overseas Viaduct (Keys Highway spanning open ocean!) */}
          <path
            d="
              M 1210,1110
              L 1235,1160
              L 1145,1205
              L 1090,1235
              L 1005,1275
              L 915,1315
              L 865,1325
            "
            fill="none"
            stroke={highwayStroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 6px ${highwayGlow})`}
          />
          {/* Viaduct Pylons over open water spans */}
          <circle cx="1185" cy="1185" r="3.5" fill="#ffffff" />
          <circle cx="1120" cy="1220" r="3.5" fill="#ffffff" />
          <circle cx="1045" cy="1255" r="3.5" fill="#ffffff" />
          <circle cx="955" cy="1295" r="3.5" fill="#ffffff" />
        </g>
      )}

      {/* 8. TACTICAL GRID OVERLAY */}
      {showGrid && (
        <g id="grid-overlay">
          <rect x="0" y="0" width="2000" height="1400" fill="url(#tactical-grid)" />
          {/* Coordinate tick labels along borders */}
          {Array.from({ length: 10 }).map((_, i) => (
            <text
              key={`grid-x-${i}`}
              x={i * 200 + 10}
              y={24}
              fill="rgba(255, 255, 255, 0.25)"
              fontSize="12"
              fontFamily="monospace"
            >
              {`LON ${(80.1 + i * 0.1).toFixed(1)}°W`}
            </text>
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <text
              key={`grid-y-${i}`}
              x={12}
              y={i * 200 + 40}
              fill="rgba(255, 255, 255, 0.25)"
              fontSize="12"
              fontFamily="monospace"
            >
              {`LAT ${(25.8 - i * 0.1).toFixed(1)}°N`}
            </text>
          ))}
        </g>
      )}

      {/* 9. DISTRICT & GEOGRAPHY LABELS */}
      {showDistricts && (
        <g id="district-labels" className="select-none">
          {/* Vice Beach */}
          <text
            x="1720"
            y="540"
            fill="#ff3b91"
            fontSize="26"
            fontWeight="700"
            letterSpacing="6"
            textAnchor="middle"
            transform="rotate(82 1720 540)"
            filter="drop-shadow(0 0 8px rgba(255, 59, 145, 0.7))"
          >
            VICE BEACH
          </text>
          <text
            x="1700"
            y="720"
            fill="rgba(255, 255, 255, 0.6)"
            fontSize="12"
            letterSpacing="3"
            textAnchor="middle"
            transform="rotate(82 1700 720)"
          >
            OCEAN DRIVE DISTRICT
          </text>

          {/* Downtown Vice */}
          <text
            x="1340"
            y="520"
            fill="#20d9d2"
            fontSize="30"
            fontWeight="800"
            letterSpacing="5"
            textAnchor="middle"
            filter="drop-shadow(0 0 10px rgba(32, 217, 210, 0.7))"
          >
            DOWNTOWN VICE
          </text>
          <text
            x="1340"
            y="545"
            fill="rgba(255, 255, 255, 0.6)"
            fontSize="13"
            letterSpacing="4"
            textAnchor="middle"
          >
            BISCAYNE BAY · FINANCIAL
          </text>

          {/* Grassrivers */}
          <text
            x="700"
            y="820"
            fill="#10b981"
            fontSize="32"
            fontWeight="800"
            letterSpacing="8"
            textAnchor="middle"
            filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))"
          >
            GRASSRIVERS
          </text>
          <text
            x="700"
            y="850"
            fill="rgba(255, 255, 255, 0.6)"
            fontSize="13"
            letterSpacing="5"
            textAnchor="middle"
          >
            SUBTROPICAL EVERGLADES & BAYOUS
          </text>

          {/* Gator Keys */}
          <text
            x="1050"
            y="1200"
            fill="#ff9b45"
            fontSize="28"
            fontWeight="800"
            letterSpacing="6"
            textAnchor="middle"
            filter="drop-shadow(0 0 8px rgba(255, 155, 69, 0.6))"
          >
            GATOR KEYS
          </text>
          <text
            x="1050"
            y="1225"
            fill="rgba(255, 255, 255, 0.6)"
            fontSize="12"
            letterSpacing="3"
            textAnchor="middle"
          >
            OVERSEAS VIADUCT · CORAL ATOLLS
          </text>

          {/* Port Leonida */}
          <text
            x="1480"
            y="910"
            fill="#fbbf24"
            fontSize="20"
            fontWeight="700"
            letterSpacing="4"
            textAnchor="middle"
          >
            PORT LEONIDA
          </text>

          {/* Lake Ambrosia & Kelly County */}
          <text
            x="750"
            y="300"
            fill="#38bdf8"
            fontSize="22"
            fontWeight="700"
            letterSpacing="4"
            textAnchor="middle"
          >
            LAKE AMBROSIA
          </text>
          <text
            x="850"
            y="180"
            fill="#a855f7"
            fontSize="26"
            fontWeight="800"
            letterSpacing="6"
            textAnchor="middle"
          >
            KELLY COUNTY
          </text>

          {/* Port Gellhorn */}
          <text
            x="420"
            y="520"
            fill="#38bdf8"
            fontSize="22"
            fontWeight="700"
            letterSpacing="4"
            textAnchor="middle"
          >
            PORT GELLHORN
          </text>
        </g>
      )}
    </g>
  );
};
