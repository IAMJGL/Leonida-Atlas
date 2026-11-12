import React from 'react';
import { Crosshair, Compass } from 'lucide-react';
import { MAP_WIDTH, MAP_HEIGHT } from '../../constants/map';

interface MinimapRadarProps {
  pan: { x: number; y: number };
  zoom: number;
  viewportSize: { width: number; height: number };
  onJumpTo: (targetX: number, targetY: number) => void;
  playerPos: { x: number; y: number };
}

export const MinimapRadar: React.FC<MinimapRadarProps> = ({
  pan,
  zoom,
  viewportSize,
  onJumpTo,
  playerPos,
}) => {
  // Minimap preview dimensions (aspect ratio 1 : 1.4 matching 2000 x 2800)
  const miniW = 140;
  const miniH = 196;

  // Calculate current viewport in MAP_WIDTH x MAP_HEIGHT space
  const viewBoxW = Math.min(MAP_WIDTH, viewportSize.width / (zoom || 1));
  const viewBoxH = Math.min(MAP_HEIGHT, viewportSize.height / (zoom || 1));
  const viewBoxX = Math.max(0, Math.min(MAP_WIDTH - viewBoxW, -pan.x / (zoom || 1)));
  const viewBoxY = Math.max(0, Math.min(MAP_HEIGHT - viewBoxH, -pan.y / (zoom || 1)));

  // Convert to minimap pixel space
  const rectX = (viewBoxX / MAP_WIDTH) * miniW;
  const rectY = (viewBoxY / MAP_HEIGHT) * miniH;
  const rectW = Math.max(12, Math.min(miniW, (viewBoxW / MAP_WIDTH) * miniW));
  const rectH = Math.max(12, Math.min(miniH, (viewBoxH / MAP_HEIGHT) * miniH));

  // Player position in minimap
  const playerMiniX = (playerPos.x / 100) * miniW;
  const playerMiniY = (playerPos.y / 100) * miniH;

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetSvgX = (clickX / miniW) * MAP_WIDTH;
    const targetSvgY = (clickY / miniH) * MAP_HEIGHT;

    onJumpTo(targetSvgX, targetSvgY);
  };

  return (
    <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-1 pointer-events-auto">
      {/* Mini telemetry header */}
      <div className="flex items-center gap-2 px-2.5 py-1 bg-[#171426]/90 backdrop-blur-md rounded-md border border-[#392344] text-[11px] font-mono tabular-nums text-[#FFF0E8]/80 shadow-lg">
        <span className="flex items-center gap-1 text-[#42CFC3] font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>LEONIDA GPS</span>
        </span>
        <span className="text-[#392344]">|</span>
        <span>X: {playerPos.x.toFixed(1)}</span>
        <span>Y: {playerPos.y.toFixed(1)}</span>
      </div>

      {/* Radar Box (Natural cartographic radar look) */}
      <div
        onClick={handleMinimapClick}
        className="relative w-[140px] h-[196px] bg-[#101824]/95 backdrop-blur-md rounded-xl border border-[#392344] shadow-2xl overflow-hidden cursor-crosshair group hover:border-[#42CFC3]/70 transition-colors"
        title="Click to jump across Leonida"
      >
        {/* Simplified natural SVG silhouettes */}
        <svg viewBox="0 0 2000 2800" className="w-full h-full pointer-events-none opacity-90">
          {/* Shallow coastal water */}
          <path
            d="M 1450,260 C 1650,380 1850,750 1860,1250 C 1870,1650 1960,1850 1920,2150 C 1880,2350 1680,2480 1480,2520 C 1250,2560 980,2720 720,2780 C 540,2810 420,2740 480,2620 C 560,2480 750,2340 880,2220 C 960,2150 920,2020 840,1920 C 720,1780 620,1620 540,1420 C 460,1220 520,950 580,720 C 640,480 950,320 1250,260 Z"
            fill="#172536"
          />
          {/* Elongated Mainland */}
          <path
            d="M 180,480 C 190,360 260,270 420,250 C 580,230 840,235 1120,245 C 1340,255 1520,285 1620,380 C 1660,490 1640,650 1600,820 C 1560,980 1520,1140 1510,1300 C 1500,1420 1530,1520 1560,1640 C 1580,1720 1540,1820 1480,1920 C 1440,2000 1420,2100 1360,2180 C 1300,2260 1200,2295 1100,2290 C 960,2280 860,2220 780,2120 C 720,2020 700,1890 680,1750 C 660,1620 580,1520 520,1420 C 480,1360 380,1350 320,1300 C 280,1230 300,1140 360,1080 C 420,1020 520,1040 560,960 C 600,880 560,740 480,640 C 390,560 260,540 180,480 Z"
            fill="#243040"
          />
          {/* Mount Kalaga North */}
          <path d="M 620,260 C 720,245 920,250 1150,260 C 1280,270 1380,320 1360,420 C 1340,510 1220,580 1100,620 C 980,660 820,640 700,590 Z" fill="#2A3B38" opacity="0.7" />
          {/* Lake Ambrosia */}
          <ellipse cx="1110" cy="1030" rx="140" ry="110" fill="#182D42" />
          {/* Port Gellhorn */}
          <rect x="360" y="1180" width="120" height="130" fill="#334155" opacity="0.8" />
          {/* Grassrivers */}
          <ellipse cx="980" cy="1750" rx="280" ry="240" fill="#1C3636" opacity="0.65" />
          {/* Vice Beach */}
          <path d="M 1740,1540 C 1780,1660 1830,1840 1840,2020 C 1845,2140 1820,2240 1770,2310 Z" fill="#463E35" opacity="0.9" />
          {/* Leonida Keys */}
          <path d="M 1280,2300 L 1150,2400 L 1010,2485 L 870,2560 L 720,2640" stroke="#475569" strokeWidth="24" strokeLinecap="round" opacity="0.9" fill="none" />
        </svg>

        {/* Viewport Box Indicator */}
        <div
          className="absolute border border-[#42CFC3] bg-[#42CFC3]/15 rounded-sm pointer-events-none transition-all duration-75"
          style={{
            left: `${Math.max(0, Math.min(miniW - rectW, rectX))}px`,
            top: `${Math.max(0, Math.min(miniH - rectH, rectY))}px`,
            width: `${Math.min(miniW, rectW)}px`,
            height: `${Math.min(miniH, rectH)}px`,
          }}
        />

        {/* Player blip */}
        <div
          className="absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-[#42CFC3] border border-[#FFF0E8] pointer-events-none"
          style={{
            left: `${playerMiniX}px`,
            top: `${playerMiniY}px`,
          }}
        />

        {/* Subtle edge vignette */}
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent to-[#0B1018]/45 pointer-events-none" />

        {/* Corner jump cue */}
        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-[#42CFC3] font-mono pointer-events-none">
          <Crosshair className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
