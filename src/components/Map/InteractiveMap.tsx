import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus, Minus, RotateCcw, Compass, MapPin, Maximize2 } from 'lucide-react';
import { LeonidaMapSvg } from './LeonidaMapSvg';
import { MapMarker } from './MapMarker';
import { MinimapRadar } from './MinimapRadar';
import { LocationItem, MapSettings, Waypoint, RegionId } from '../../types';
import { REGIONS } from '../../data/locations';
import { playSound } from '../../utils/audio';
import { MAP_WIDTH, MAP_HEIGHT } from '../../constants/map';

interface InteractiveMapProps {
  locations: LocationItem[];
  selectedLocation: LocationItem | null;
  waypoint: Waypoint | null;
  settings: MapSettings;
  onSelectLocation: (location: LocationItem) => void;
  onSetWaypoint: (waypoint: Waypoint | null) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  selectedLocation,
  waypoint,
  settings,
  onSelectLocation,
  onSetWaypoint,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom limits - allow zooming out far enough to view the entire elongated state
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 4.5;

  // Initial Map Transformation
  const [zoom, setZoom] = useState<number>(0.38);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 100, y: 30 });
  const [hasAutoFitted, setHasAutoFitted] = useState(false);

  // Panning State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Viewport dimensions
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800,
  });

  // Simulated Player Location - at Ocean Drive in Southeast Vice Beach
  const [playerPos] = useState<{ x: number; y: number }>({ x: 89.5, y: 65.0 });

  // Reset / Fit full Leonida elongated peninsula inside the viewport with comfortable margins
  const resetMapPosition = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const targetZoom = Math.min((clientWidth * 0.92) / MAP_WIDTH, (clientHeight * 0.92) / MAP_HEIGHT);
      const clampedZoom = Math.max(MIN_ZOOM, Math.min(1.0, targetZoom));
      const newPanX = (clientWidth - MAP_WIDTH * clampedZoom) / 2;
      const newPanY = (clientHeight - MAP_HEIGHT * clampedZoom) / 2;
      setZoom(clampedZoom);
      setPan({ x: newPanX, y: newPanY });
      playSound('click', settings.soundEffects);
    }
  }, [settings.soundEffects]);

  // Update viewport dimensions on mount & auto-fit full elongated map
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setViewportSize({ width: clientWidth, height: clientHeight });

        if (!hasAutoFitted && clientWidth > 100 && clientHeight > 100) {
          const targetZoom = Math.min((clientWidth * 0.92) / MAP_WIDTH, (clientHeight * 0.92) / MAP_HEIGHT);
          const clampedZoom = Math.max(MIN_ZOOM, Math.min(1.0, targetZoom));
          setZoom(clampedZoom);
          setPan({
            x: (clientWidth - MAP_WIDTH * clampedZoom) / 2,
            y: (clientHeight - MAP_HEIGHT * clampedZoom) / 2,
          });
          setHasAutoFitted(true);
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [hasAutoFitted]);

  // Zoom with center anchor
  const handleZoom = useCallback(
    (delta: number, clientAnchorX?: number, clientAnchorY?: number) => {
      setZoom((prevZoom) => {
        const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom * delta));
        if (nextZoom === prevZoom) return prevZoom;

        if (containerRef.current && clientAnchorX !== undefined && clientAnchorY !== undefined) {
          const rect = containerRef.current.getBoundingClientRect();
          const mouseX = clientAnchorX - rect.left;
          const mouseY = clientAnchorY - rect.top;

          setPan((prevPan) => {
            const scaleRatio = nextZoom / prevZoom;
            const newPanX = mouseX - (mouseX - prevPan.x) * scaleRatio;
            const newPanY = mouseY - (mouseY - prevPan.y) * scaleRatio;
            return { x: newPanX, y: newPanY };
          });
        }
        return nextZoom;
      });
      playSound('click', settings.soundEffects);
    },
    [settings.soundEffects]
  );

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.18 : 0.82;
    handleZoom(zoomFactor, e.clientX, e.clientY);
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch pan and pinch-zoom handlers
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchDistRef.current = null;
      touchStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !touchDistRef.current) {
      setPan({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y,
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchDistRef.current && touchDistRef.current > 0) {
        const factor = dist / touchDistRef.current;
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        handleZoom(factor, midX, midY);
      }
      touchDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistRef.current = null;
  };

  // Center on specific map SVG coordinate
  const panToCoordinate = useCallback(
    (targetSvgX: number, targetSvgY: number, targetZoom?: number) => {
      const activeZoom = targetZoom || Math.max(zoom, 1.4);
      const newPanX = viewportSize.width / 2 - targetSvgX * activeZoom;
      const newPanY = viewportSize.height / 2 - targetSvgY * activeZoom;

      setZoom(activeZoom);
      setPan({ x: newPanX, y: newPanY });
      playSound('select', settings.soundEffects);
    },
    [viewportSize, zoom, settings.soundEffects]
  );

  // Focus when selectedLocation changes externally
  useEffect(() => {
    if (selectedLocation) {
      const targetSvgX = (selectedLocation.x / 100) * MAP_WIDTH;
      const targetSvgY = (selectedLocation.y / 100) * MAP_HEIGHT;
      panToCoordinate(targetSvgX, targetSvgY, Math.max(zoom, 1.4));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation?.id]);

  // Jump to region
  const handleJumpToRegion = (regionId: RegionId) => {
    const region = REGIONS[regionId];
    if (region) {
      const targetSvgX = (region.x / 100) * MAP_WIDTH;
      const targetSvgY = (region.y / 100) * MAP_HEIGHT;
      panToCoordinate(targetSvgX, targetSvgY, 1.5);
    }
  };

  // Calculate distance from player to waypoint (miles in elongated Leonida state)
  const calculateDistance = (tx: number, ty: number) => {
    const dx = ((tx - playerPos.x) / 100) * 45;
    const dy = ((ty - playerPos.y) / 100) * 65;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return `${dist.toFixed(1)} mi`;
  };

  // Convert playerPos to SVG space
  const playerSvgX = (playerPos.x / 100) * MAP_WIDTH;
  const playerSvgY = (playerPos.y / 100) * MAP_HEIGHT;

  // Waypoint SVG coordinates
  const waypointSvgX = waypoint ? (waypoint.x / 100) * MAP_WIDTH : null;
  const waypointSvgY = waypoint ? (waypoint.y / 100) * MAP_HEIGHT : null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#101116] overflow-hidden select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* MAP SVG CANVAS (2000 x 2800) */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="origin-top-left transition-transform duration-75"
        style={{
          width: `${MAP_WIDTH}px`,
          height: `${MAP_HEIGHT}px`,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* BASE GEOGRAPHY & ROADS */}
        <LeonidaMapSvg
          styleMode={settings.mapStyle}
          showRoads={settings.showRoads}
          showDistricts={settings.showDistrictLabels}
          showGrid={settings.showGridLines}
        />

        {/* ACTIVE GPS WAYPOINT TRAJECTORY LINE */}
        {waypointSvgX !== null && waypointSvgY !== null && (
          <g className="pointer-events-none">
            {/* Pulsing GPS dashed line from player to waypoint */}
            <line
              x1={playerSvgX}
              y1={playerSvgY}
              x2={waypointSvgX}
              y2={waypointSvgY}
              stroke="#20D9D2"
              strokeWidth="3.5"
              strokeDasharray="10 8"
              opacity="0.85"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-36"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </line>

            {/* Glowing Waypoint Target Pillar */}
            <circle cx={waypointSvgX} cy={waypointSvgY} r="18" fill="rgba(32, 217, 210, 0.25)" />
            <circle cx={waypointSvgX} cy={waypointSvgY} r="8" fill="#20D9D2" />
            <polygon
              points={`${waypointSvgX},${waypointSvgY - 45} ${waypointSvgX - 12},${waypointSvgY - 65} ${waypointSvgX + 12},${waypointSvgY - 65}`}
              fill="#20D9D2"
            />
          </g>
        )}

        {/* PLAYER POSITION MARKER */}
        <g transform={`translate(${playerSvgX}, ${playerSvgY})`} className="pointer-events-none">
          {/* Radar ping wave */}
          <circle cx="0" cy="0" r="22" fill="none" stroke="#20D9D2" strokeWidth="2" opacity="0.6">
            <animate attributeName="r" values="8;32" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Directional FOV Cone facing East (towards Atlantic) */}
          <path
            d="M 0,0 L 28,-14 A 32 32 0 0 1 28,14 Z"
            fill="rgba(32, 217, 210, 0.25)"
            stroke="#20D9D2"
            strokeWidth="1.2"
          />

          {/* Player core dot */}
          <circle cx="0" cy="0" r="6" fill="#20D9D2" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* LOCATION MARKERS LAYER */}
        <g className="location-markers-layer">
          {locations.map((loc) => (
            <MapMarker
              key={loc.id}
              location={loc}
              zoom={zoom}
              isSelected={selectedLocation?.id === loc.id}
              isWaypoint={waypoint?.locationId === loc.id}
              onSelect={onSelectLocation}
            />
          ))}
        </g>
      </svg>

      {/* FLOATING MAP HUD CONTROLS (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto items-center">
        {/* Zoom In */}
        <button
          onClick={() => handleZoom(1.28)}
          className="w-10 h-10 flex items-center justify-center bg-[#191B24]/90 hover:bg-[#252836] active:bg-[#2e3244] border border-slate-700/80 rounded-lg text-white shadow-xl backdrop-blur-md transition-colors"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Zoom Level Indicator */}
        <div className="w-10 py-1 bg-[#101116]/90 border border-slate-800 rounded-md text-[10px] font-mono text-center text-slate-300 tabular-nums">
          {Math.round(zoom * 100)}%
        </div>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(0.78)}
          className="w-10 h-10 flex items-center justify-center bg-[#191B24]/90 hover:bg-[#252836] active:bg-[#2e3244] border border-slate-700/80 rounded-lg text-white shadow-xl backdrop-blur-md transition-colors"
          title="Zoom Out (Down to 20%)"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Fit Entire State (Full Map) */}
        <button
          onClick={resetMapPosition}
          className="w-10 h-10 flex items-center justify-center bg-[#191B24]/90 hover:bg-[#252836] active:bg-[#2e3244] border border-slate-700/80 rounded-lg text-[#20D9D2] shadow-xl backdrop-blur-md transition-colors"
          title="Fit Full State (Mount Kalaga to Leonida Keys)"
          aria-label="Fit entire state in view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Focus Vice Metro North */}
        <button
          onClick={() => panToCoordinate(1500, 1780, 1.3)}
          className="w-10 h-10 flex items-center justify-center bg-[#191B24]/90 hover:bg-[#252836] border border-slate-700/80 rounded-lg text-[#FF3B91] shadow-xl backdrop-blur-md transition-colors"
          title="Focus Vice City Downtown"
          aria-label="Focus Vice City"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* REGION QUICK JUMP STRIP (Top Left Floating) */}
      <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-1.5 p-1.5 bg-[#101116]/85 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl pointer-events-auto">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#20D9D2]" />
          <span>Sectors:</span>
        </span>
        {[
          REGIONS['mount-kalaga'],
          REGIONS['ambrosia'],
          REGIONS['gellhorn-shores'],
          REGIONS['grassrivers'],
          REGIONS['vice-city-downtown'],
          REGIONS['gator-keys'],
        ].filter(Boolean).map((r) => (
          <button
            key={r.id}
            onClick={() => handleJumpToRegion(r.id)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-[#191B24] transition-colors whitespace-nowrap"
          >
            {r.name.split('&')[0].trim()}
          </button>
        ))}
      </div>

      {/* ACTIVE WAYPOINT HUD BANNER (When a waypoint is set) */}
      {waypoint && (
        <div
          className={`absolute left-4 sm:left-6 z-20 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#101116]/95 backdrop-blur-md rounded-xl border border-[#20D9D2]/40 shadow-2xl pointer-events-auto transition-all ${
            selectedLocation ? 'bottom-[62vh] sm:bottom-6' : 'bottom-4 sm:bottom-6'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#20D9D2] animate-ping shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-[#20D9D2] uppercase truncate">
              GPS Objective Waypoint
            </span>
            <span className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-xs">
              {waypoint.name || 'Custom Waypoint'} · {calculateDistance(waypoint.x, waypoint.y)}
            </span>
          </div>
          <button
            onClick={() => {
              onSetWaypoint(null);
              playSound('toggle', settings.soundEffects);
            }}
            className="ml-1 sm:ml-2 px-2 py-0.5 text-[10px] sm:text-[11px] bg-[#191B24] hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 rounded-md transition-colors shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* MINIMAP RADAR HUD (Bottom Right - hidden on mobile when bottom sheet is open) */}
      <div className={selectedLocation ? 'hidden sm:block' : 'block'}>
        <MinimapRadar
          pan={pan}
          zoom={zoom}
          viewportSize={viewportSize}
          onJumpTo={(tx, ty) => panToCoordinate(tx, ty)}
          playerPos={playerPos}
        />
      </div>

      {/* SAMPLE DATA WATERMARK BANNER (Clear fan-made disclaimer) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-40 hover:opacity-100 transition-opacity hidden sm:block">
        <span className="text-[10px] font-mono text-slate-400 tracking-wide whitespace-nowrap">
          Independent Fan Concept · Fictional Leonida Sample Coordinates · Not affiliated with Rockstar Games
        </span>
      </div>
    </div>
  );
};
