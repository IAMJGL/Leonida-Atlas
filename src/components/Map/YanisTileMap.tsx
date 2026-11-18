import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Minus, Maximize2, Crosshair } from '../Icons';
import { MapSettings } from '../../types';
import { playSound } from '../../utils/audio';
import {
  YANIS_V18_CONFIG,
  getYanisMppx,
  getYanisTileUrl,
  gtadbWorldToPixel,
  pixelToGtadbWorld,
} from '../../constants/yanisMap';

export interface YanisViewportBounds {
  minWorldX: number;
  maxWorldX: number;
  minWorldY: number;
  maxWorldY: number;
  zoomZ: number;
}

interface YanisTileMapProps {
  settings: MapSettings;
  onViewportChange?: (bounds: YanisViewportBounds) => void;
}

interface TileDescriptor {
  key: string;
  z: number;
  tx: number;
  ty: number;
  url: string;
  left: number;
  top: number;
  size: number;
}

const MIN_WORLD_BOUND = -YANIS_V18_CONFIG.zeroX; // -16384
const MAX_WORLD_BOUND = YANIS_V18_CONFIG.mapW - YANIS_V18_CONFIG.zeroX; // +16384

const clampWorldCoord = (v: number): number =>
  Math.max(MIN_WORLD_BOUND, Math.min(MAX_WORLD_BOUND, v));

const clampZoomZ = (z: number, minAllowedZ: number): number =>
  Math.max(minAllowedZ, Math.min(YANIS_V18_CONFIG.overZoomMaxZ, z));

export const YanisTileMap: React.FC<YanisTileMapProps> = ({
  settings,
  onViewportChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800,
  });
  const [zoomZ, setZoomZ] = useState<number>(0);
  const [centerWorld, setCenterWorld] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorWorld, setCursorWorld] = useState<{ x: number; y: number } | null>(null);
  const [hasAutoFitted, setHasAutoFitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [failedTileUrls, setFailedTileUrls] = useState<Record<string, true>>({});

  // Refs for gesture/wheel closures without stale state
  const cameraRef = useRef({ zoomZ: 0, centerX: 0, centerY: 0, width: 1200, height: 800 });
  cameraRef.current = {
    zoomZ,
    centerX: centerWorld.x,
    centerY: centerWorld.y,
    width: viewportSize.width,
    height: viewportSize.height,
  };

  const dragOriginRef = useRef<{ screenX: number; screenY: number; worldX: number; worldY: number }>({
    screenX: 0,
    screenY: 0,
    worldX: 0,
    worldY: 0,
  });
  const pinchRef = useRef<{ dist: number; midX: number; midY: number } | null>(null);

  const computeFitZoomZ = useCallback((w: number, h: number): number => {
    const baseZ0Size = 1024;
    const scale = Math.min((w * 0.92) / baseZ0Size, (h * 0.92) / baseZ0Size);
    return Math.max(-1.5, Math.min(2.5, Math.log2(Math.max(0.15, scale))));
  }, []);

  const minAllowedZoomZ = useMemo(
    () => Math.min(-0.5, computeFitZoomZ(viewportSize.width, viewportSize.height) - 0.5),
    [computeFitZoomZ, viewportSize.width, viewportSize.height]
  );

  // Measure container & auto-fit full 32,768x32,768 world cleanly on mount
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setViewportSize({ width: clientWidth, height: clientHeight });

      if (!hasAutoFitted && clientWidth > 100 && clientHeight > 100) {
        const fitZ = computeFitZoomZ(clientWidth, clientHeight);
        setZoomZ(fitZ);
        setCenterWorld({ x: 0, y: 0 });
        setHasAutoFitted(true);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [computeFitZoomZ, hasAutoFitted]);

  // Reset / Fit Full World
  const handleResetView = useCallback(() => {
    const { width, height } = cameraRef.current;
    const fitZ = computeFitZoomZ(width, height);
    setZoomZ(fitZ);
    setCenterWorld({ x: 0, y: 0 });
    playSound('click', settings.soundEffects);
  }, [computeFitZoomZ, settings.soundEffects]);

  // Zoom around a screen anchor (or viewport center if omitted)
  const zoomByDelta = useCallback(
    (deltaZ: number, clientX?: number, clientY?: number, playAudio = true) => {
      const { zoomZ: prevZ, centerX: prevCX, centerY: prevCY, width, height } = cameraRef.current;
      const nextZ = clampZoomZ(prevZ + deltaZ, minAllowedZoomZ);
      if (Math.abs(nextZ - prevZ) < 0.0001) return;

      let anchorX = width / 2;
      let anchorY = height / 2;
      if (containerRef.current && clientX !== undefined && clientY !== undefined) {
        const rect = containerRef.current.getBoundingClientRect();
        anchorX = clientX - rect.left;
        anchorY = clientY - rect.top;
      }

      const prevCenterPx = gtadbWorldToPixel(prevCX, prevCY, prevZ);
      const prevWorldLeft = width / 2 - prevCenterPx.px;
      const prevWorldTop = height / 2 - prevCenterPx.py;
      const anchorWorld = pixelToGtadbWorld(anchorX - prevWorldLeft, anchorY - prevWorldTop, prevZ);

      const nextAnchorPx = gtadbWorldToPixel(anchorWorld.worldX, anchorWorld.worldY, nextZ);
      const nextWorldLeft = anchorX - nextAnchorPx.px;
      const nextWorldTop = anchorY - nextAnchorPx.py;
      const nextCenter = pixelToGtadbWorld(width / 2 - nextWorldLeft, height / 2 - nextWorldTop, nextZ);

      setZoomZ(nextZ);
      setCenterWorld({
        x: clampWorldCoord(nextCenter.worldX),
        y: clampWorldCoord(nextCenter.worldY),
      });

      if (playAudio) {
        playSound('click', settings.soundEffects);
      }
    },
    [minAllowedZoomZ, settings.soundEffects]
  );

  // Non-passive wheel listener for crisp cursor-anchored zoom without browser scroll interference
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const step = e.deltaY < 0 ? 0.35 : -0.35;
      zoomByDelta(step, e.clientX, e.clientY, false);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [zoomByDelta]);

  // Screen -> GTADB world coordinate helper for live HUD readout
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const { zoomZ: activeZ, centerX, centerY, width, height } = cameraRef.current;
    const centerPx = gtadbWorldToPixel(centerX, centerY, activeZ);
    const worldLeft = width / 2 - centerPx.px;
    const worldTop = height / 2 - centerPx.py;
    const localX = clientX - rect.left - worldLeft;
    const localY = clientY - rect.top - worldTop;
    return pixelToGtadbWorld(localX, localY, activeZ);
  }, []);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragOriginRef.current = {
      screenX: e.clientX,
      screenY: e.clientY,
      worldX: centerWorld.x,
      worldY: centerWorld.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const worldPt = screenToWorld(e.clientX, e.clientY);
    if (worldPt) {
      setCursorWorld({ x: worldPt.worldX, y: worldPt.worldY });
    }

    if (!isDragging) return;
    const mppx = getYanisMppx(zoomZ);
    const dx = e.clientX - dragOriginRef.current.screenX;
    const dy = e.clientY - dragOriginRef.current.screenY;

    setCenterWorld({
      x: clampWorldCoord(dragOriginRef.current.worldX - dx * mppx),
      y: clampWorldCoord(dragOriginRef.current.worldY + dy * mppx),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setCursorWorld(null);
  };

  // Mobile Touch Pan & Pinch-Zoom Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      pinchRef.current = null;
      setIsDragging(true);
      dragOriginRef.current = {
        screenX: e.touches[0].clientX,
        screenY: e.touches[0].clientY,
        worldX: centerWorld.x,
        worldY: centerWorld.y,
      };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      pinchRef.current = { dist, midX, midY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !pinchRef.current) {
      const mppx = getYanisMppx(zoomZ);
      const dx = e.touches[0].clientX - dragOriginRef.current.screenX;
      const dy = e.touches[0].clientY - dragOriginRef.current.screenY;
      setCenterWorld({
        x: clampWorldCoord(dragOriginRef.current.worldX - dx * mppx),
        y: clampWorldCoord(dragOriginRef.current.worldY + dy * mppx),
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      if (pinchRef.current && pinchRef.current.dist > 0 && dist > 0) {
        const deltaZ = Math.log2(dist / pinchRef.current.dist);
        if (Math.abs(deltaZ) > 0.005) {
          zoomByDelta(deltaZ, midX, midY, false);
        }
      }
      pinchRef.current = { dist, midX, midY };
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchRef.current = null;
  };

  // Compute screen origin of the 32,768x32,768 world & visible viewport bounds
  const { worldLeftScreen, worldTopScreen, visibleWorldBounds } = useMemo(() => {
    const centerPx = gtadbWorldToPixel(centerWorld.x, centerWorld.y, zoomZ);
    const leftScreen = viewportSize.width / 2 - centerPx.px;
    const topScreen = viewportSize.height / 2 - centerPx.py;

    const topLeftWorld = pixelToGtadbWorld(-leftScreen, -topScreen, zoomZ);
    const bottomRightWorld = pixelToGtadbWorld(
      viewportSize.width - leftScreen,
      viewportSize.height - topScreen,
      zoomZ
    );

    return {
      worldLeftScreen: leftScreen,
      worldTopScreen: topScreen,
      visibleWorldBounds: {
        minWorldX: topLeftWorld.worldX,
        maxWorldX: bottomRightWorld.worldX,
        minWorldY: bottomRightWorld.worldY,
        maxWorldY: topLeftWorld.worldY,
        zoomZ,
      },
    };
  }, [centerWorld.x, centerWorld.y, viewportSize.height, viewportSize.width, zoomZ]);

  useEffect(() => {
    onViewportChange?.(visibleWorldBounds);
  }, [onViewportChange, visibleWorldBounds]);

  // Select native tile pyramid level (0..3); over-zoom scales z=3 cleanly past zoomZ > 3
  const activeTileZ = Math.min(
    YANIS_V18_CONFIG.activeMaxZ,
    Math.max(YANIS_V18_CONFIG.minZ, Math.floor(zoomZ))
  );

  // Helper to collect strictly viewport-visible tiles for a given pyramid level z
  const collectVisibleTiles = useCallback(
    (tileZ: number): TileDescriptor[] => {
      const range = YANIS_V18_CONFIG.tileSetRanges[tileZ];
      if (!range) return [];
      const [[rangeMinX, rangeMinY], [rangeMaxX, rangeMaxY]] = range;

      const tileScreenSize = YANIS_V18_CONFIG.tileSize * Math.pow(2, zoomZ - tileZ);
      const overscan = tileZ === 0 ? 0 : 1;

      const minTx = Math.max(rangeMinX, Math.floor(-worldLeftScreen / tileScreenSize) - overscan);
      const maxTx = Math.min(
        rangeMaxX,
        Math.floor((viewportSize.width - worldLeftScreen) / tileScreenSize) + overscan
      );
      const minTy = Math.max(rangeMinY, Math.floor(-worldTopScreen / tileScreenSize) - overscan);
      const maxTy = Math.min(
        rangeMaxY,
        Math.floor((viewportSize.height - worldTopScreen) / tileScreenSize) + overscan
      );

      if (minTx > maxTx || minTy > maxTy) return [];

      const tiles: TileDescriptor[] = [];
      for (let ty = minTy; ty <= maxTy; ty += 1) {
        for (let tx = minTx; tx <= maxTx; tx += 1) {
          const url = getYanisTileUrl(tileZ, tx, ty);
          if (!url || failedTileUrls[url]) continue;
          tiles.push({
            key: `${tileZ}-${tx}-${ty}`,
            z: tileZ,
            tx,
            ty,
            url,
            left: tx * tileScreenSize,
            top: ty * tileScreenSize,
            size: tileScreenSize + 0.75, // Tiny overlap prevents 1px subpixel hairline seams
          });
        }
      }
      return tiles;
    },
    [failedTileUrls, viewportSize.height, viewportSize.width, worldLeftScreen, worldTopScreen, zoomZ]
  );

  // Keep z=0 base layer underneath higher zooms so panning/zooming never flashes solid ocean gaps
  const baseUnderlayTiles = useMemo(
    () => (activeTileZ > 0 ? collectVisibleTiles(0) : []),
    [activeTileZ, collectVisibleTiles]
  );

  const primaryTiles = useMemo(
    () => collectVisibleTiles(activeTileZ),
    [activeTileZ, collectVisibleTiles]
  );

  const handleTileError = useCallback((url: string) => {
    setFailedTileUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  }, []);

  const displayedWorldCoords = cursorWorld ?? centerWorld;
  const zoomPercent = Math.round(Math.pow(2, zoomZ) * 100);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ backgroundColor: YANIS_V18_CONFIG.seaColor }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* WORLD TILE PLANE */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          transform: `translate3d(${worldLeftScreen}px, ${worldTopScreen}px, 0)`,
          willChange: 'transform',
        }}
      >
        {/* z=0 Low-Res Underlay (only visible tiles, prevents blank gaps during zoom decode) */}
        {baseUnderlayTiles.map((tile) => (
          <img
            key={`under-${tile.key}`}
            src={tile.url}
            alt=""
            draggable={false}
            decoding="async"
            onError={() => handleTileError(tile.url)}
            className="absolute block max-w-none select-none"
            style={{
              left: `${tile.left}px`,
              top: `${tile.top}px`,
              width: `${tile.size}px`,
              height: `${tile.size}px`,
            }}
          />
        ))}

        {/* Active Target Tile Level (z=0..3, viewport-culled) */}
        {primaryTiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            draggable={false}
            decoding="async"
            onError={() => handleTileError(tile.url)}
            className="absolute block max-w-none select-none"
            style={{
              left: `${tile.left}px`,
              top: `${tile.top}px`,
              width: `${tile.size}px`,
              height: `${tile.size}px`,
            }}
          />
        ))}
      </div>

      {/* FLOATING MAP HUD CONTROLS (Top Right - matches existing SVG HUD layout) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto items-center">
        {/* Zoom In */}
        <button
          type="button"
          onClick={() => zoomByDelta(0.5)}
          className="w-10 h-10 flex items-center justify-center bg-[#171426]/90 hover:bg-[#392344] active:bg-[#492D57] border border-[#392344] hover:border-[#FF5CBA]/60 rounded-lg text-[#FFF0E8] shadow-xl backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Zoom Indicator */}
        <div
          className="w-10 py-1 bg-[#171426]/90 border border-[#392344] rounded-md text-[10px] font-mono text-center text-[#42CFC3] font-bold tabular-nums leading-tight"
          title={`Zoom ${zoomPercent}% · Tile Layer Z${activeTileZ}${zoomZ > YANIS_V18_CONFIG.activeMaxZ ? ' (Over-zoom)' : ''}`}
        >
          <div>Z{zoomZ.toFixed(1)}</div>
          <div className="text-[8px] text-[#FFF0E8]/55">T{activeTileZ}</div>
        </div>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => zoomByDelta(-0.5)}
          className="w-10 h-10 flex items-center justify-center bg-[#171426]/90 hover:bg-[#392344] active:bg-[#492D57] border border-[#392344] hover:border-[#FF5CBA]/60 rounded-lg text-[#FFF0E8] shadow-xl backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Fit Entire World */}
        <button
          type="button"
          onClick={handleResetView}
          className="w-10 h-10 flex items-center justify-center bg-[#171426]/90 hover:bg-[#392344] active:bg-[#492D57] border border-[#392344] hover:border-[#42CFC3]/70 rounded-lg text-[#42CFC3] shadow-xl backdrop-blur-md transition-colors cursor-pointer"
          title="Reset / Fit Full World (-16,384 to +16,384)"
          aria-label="Fit full YANIS V18 map in view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* WORLD COORDINATE READOUT (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-[#171426]/90 backdrop-blur-md rounded-xl border border-[#392344] text-[11px] font-mono tabular-nums text-[#FFF0E8]/85 shadow-xl pointer-events-none">
        <Crosshair className="w-3.5 h-3.5 text-[#42CFC3] shrink-0" />
        <span className="text-[#FFAD83] font-semibold uppercase">YANIS V18</span>
        <span className="text-[#392344]">|</span>
        <span>
          X: <strong className="text-[#FFF0E8]">{Math.round(displayedWorldCoords.x)}</strong> m
        </span>
        <span>
          Y: <strong className="text-[#FFF0E8]">{Math.round(displayedWorldCoords.y)}</strong> m
        </span>
      </div>

      {/* REQUIRED CC BY 4.0 MAP TILE ATTRIBUTION (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 bg-[#171426]/90 backdrop-blur-md rounded-xl border border-[#392344] text-[10px] font-mono text-[#FFF0E8]/75 shadow-xl pointer-events-auto">
        <a
          href="https://map.gtadb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#42CFC3] transition-colors"
        >
          GTA VI Map Tiles (CC BY 4.0) — map.gtadb.org
        </a>
        <span className="hidden sm:inline text-[#FFF0E8]/45"> · gtadb.org &amp; contributors</span>
      </div>
    </div>
  );
};
