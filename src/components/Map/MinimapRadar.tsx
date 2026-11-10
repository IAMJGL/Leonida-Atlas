import React from 'react';
import { Crosshair, Compass } from 'lucide-react';

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
  // SVG coordinates: 2000 x 1400
  // Minimap preview dimensions
  const miniW = 180;
  const miniH = 126;

  // Calculate current viewport in 2000 x 1400 space
  // Main map transform: translate(pan.x, pan.y) scale(zoom)
  // At screen (0, 0): svgX = -pan.x / zoom
  // At screen (width, height): svgW = viewportSize.width / zoom
  const viewBoxW = Math.min(2000, viewportSize.width / (zoom || 1));
  const viewBoxH = Math.min(1400, viewportSize.height / (zoom || 1));
  const viewBoxX = Math.max(0, Math.min(2000 - viewBoxW, -pan.x / (zoom || 1)));
  const viewBoxY = Math.max(0, Math.min(1400 - viewBoxH, -pan.y / (zoom || 1)));

  // Convert to minimap pixel space
  const rectX = (viewBoxX / 2000) * miniW;
  const rectY = (viewBoxY / 1400) * miniH;
  const rectW = Math.max(12, Math.min(miniW, (viewBoxW / 2000) * miniW));
  const rectH = Math.max(10, Math.min(miniH, (viewBoxH / 1400) * miniH));

  // Player position in minimap
  const playerMiniX = (playerPos.x / 100) * miniW;
  const playerMiniY = (playerPos.y / 100) * miniH;

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetSvgX = (clickX / miniW) * 2000;
    const targetSvgY = (clickY / miniH) * 1400;

    onJumpTo(targetSvgX, targetSvgY);
  };

  return (
    <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-1 pointer-events-auto">
      {/* Mini telemetry header */}
      <div className="flex items-center gap-2 px-2.5 py-1 bg-[#101116]/90 backdrop-blur-md rounded-md border border-slate-800 text-[11px] font-mono tabular-nums text-slate-400">
        <span className="flex items-center gap-1 text-[#20D9D2]">
          <Compass className="w-3.5 h-3.5" />
          <span>LEONIDA GPS</span>
        </span>
        <span className="text-slate-600">|</span>
        <span>X: {playerPos.x.toFixed(1)}</span>
        <span>Y: {playerPos.y.toFixed(1)}</span>
      </div>

      {/* Radar Box */}
      <div
        onClick={handleMinimapClick}
        className="relative w-[180px] h-[126px] bg-[#101116]/95 backdrop-blur-md rounded-xl border border-slate-800/90 shadow-2xl overflow-hidden cursor-crosshair group hover:border-[#20D9D2]/50 transition-colors"
        title="Click to jump to region"
      >
        {/* Simplified SVG silhouettes */}
        <svg viewBox="0 0 2000 1400" className="w-full h-full pointer-events-none opacity-80">
          {/* Shallow coastal water */}
          <path
            d="M 1250,150 C 1450,220 1850,380 1880,720 C 1900,980 1680,1200 1380,1280 C 1120,1350 820,1320 620,1220 Z"
            fill="#11293d"
          />
          {/* Mainland */}
          <path
            d="M 100,320 C 105,230 140,165 220,125 C 320,85 450,90 580,75 C 690,65 770,52 870,55 C 970,58 1070,72 1190,78 C 1310,82 1430,110 1510,150 C 1555,172 1575,210 1550,265 C 1520,320 1480,380 1440,440 C 1390,320 1350,380 1320,440 C 1300,500 1320,540 1360,590 C 1400,640 1420,700 1410,760 C 1390,850 1340,920 1260,980 C 1180,1040 1080,1080 980,1110 C 880,1140 760,1130 680,1090 C 600,1050 540,980 500,900 C 460,820 440,720 400,660 C 360,600 280,570 220,530 C 160,490 120,420 100,320 Z"
            fill="#1e293b"
          />
          {/* Vice Beach */}
          <path
            d="M 1660,340 C 1690,440 1730,590 1740,750 C 1745,860 1720,950 1680,1020 C 1660,1010 1640,990 1645,950 C 1660,860 1675,740 1665,600 Z"
            fill="#ff3b91"
            opacity="0.6"
          />
          {/* Gator Keys */}
          <path
            d="M 1220,1110 C 1260,1130 1280,1165 1250,1190 C 1210,1210 1160,1170 1180,1130 Z M 1120,1180 C 1150,1195 1165,1230 1130,1250 Z M 1020,1235 C 1050,1245 1060,1275 1030,1295 Z M 910,1280 C 940,1285 960,1320 930,1345 Z"
            fill="#ff9b45"
            opacity="0.6"
          />
          {/* Grassrivers */}
          <ellipse cx="700" cy="850" rx="200" ry="160" fill="#10b981" opacity="0.3" />
        </svg>

        {/* Viewport Box Indicator */}
        <div
          className="absolute border-2 border-[#20D9D2] bg-[#20D9D2]/15 rounded-sm pointer-events-none transition-all duration-75 shadow-[0_0_8px_rgba(32,217,210,0.4)]"
          style={{
            left: `${Math.max(0, Math.min(miniW - rectW, rectX))}px`,
            top: `${Math.max(0, Math.min(miniH - rectH, rectY))}px`,
            width: `${Math.min(miniW, rectW)}px`,
            height: `${Math.min(miniH, rectH)}px`,
          }}
        />

        {/* Player blip */}
        <div
          className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#20D9D2] shadow-[0_0_6px_#20D9D2] pointer-events-none"
          style={{
            left: `${playerMiniX}px`,
            top: `${playerMiniY}px`,
          }}
        />

        {/* Radar concentric sweep overlay */}
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent to-[#101116]/40 pointer-events-none" />

        {/* Corner jump cue */}
        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-[#20D9D2] font-mono pointer-events-none">
          <Crosshair className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
