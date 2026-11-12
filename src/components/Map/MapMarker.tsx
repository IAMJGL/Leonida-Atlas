import React, { useState } from 'react';
import { CATEGORIES } from '../../data/locations';
import { LocationItem } from '../../types';
import { MAP_WIDTH, MAP_HEIGHT } from '../../constants/map';

interface MapMarkerProps {
  location: LocationItem;
  zoom: number;
  isSelected: boolean;
  isWaypoint: boolean;
  onSelect: (location: LocationItem) => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({
  location,
  zoom,
  isSelected,
  isWaypoint,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const categoryMeta = CATEGORIES[location.category];

  // SVG coordinate calculation (map viewBox is 2000 x 2800)
  const cx = (location.x / 100) * MAP_WIDTH;
  const cy = (location.y / 100) * MAP_HEIGHT;

  // Scale marker relative to zoom level so it stays crisp and readable
  // When zoomed in 4x, scale down slightly so it doesn't block the map
  const scale = Math.max(0.6, Math.min(1.5, 1 / Math.pow(zoom, 0.45)));

  const markerColor = categoryMeta.color;
  const glyphColor = location.category === 'locations' && !location.discovered ? '#171426' : '#ffffff';

  const renderIconGlyph = () => {
    switch (location.category) {
      case 'collectibles':
        // Diamond / Gem
        return <polygon points="0,-7 7,0 0,7 -7,0" fill={glyphColor} />;
      case 'missions':
        // Star / Crosshair
        return (
          <g fill={glyphColor}>
            <circle cx="0" cy="0" r="3" />
            <line x1="-7" y1="0" x2="-3.5" y2="0" stroke={glyphColor} strokeWidth="1.6" />
            <line x1="3.5" y1="0" x2="7" y2="0" stroke={glyphColor} strokeWidth="1.6" />
            <line x1="0" y1="-7" x2="0" y2="-3.5" stroke={glyphColor} strokeWidth="1.6" />
            <line x1="0" y1="3.5" x2="0" y2="7" stroke={glyphColor} strokeWidth="1.6" />
          </g>
        );
      case 'vehicles':
        // Sleek Car wedge
        return (
          <path
            d="M -6,3 L -5,-1 L -2,-4 L 3,-4 L 6,-1 L 6,3 Z M -4,4 A 1.5 1.5 0 1 1 -4,1 A 1.5 1.5 0 1 1 -4,4 Z M 4,4 A 1.5 1.5 0 1 1 4,1 A 1.5 1.5 0 1 1 4,4 Z"
            fill={glyphColor}
          />
        );
      case 'businesses':
        // Briefcase
        return (
          <g fill={glyphColor}>
            <rect x="-6" y="-3" width="12" height="8" rx="1.5" />
            <path d="M -3,-3 L -3,-5 L 3,-5 L 3,-3" fill="none" stroke={glyphColor} strokeWidth="1.2" />
          </g>
        );
      case 'safehouses':
        // Home roof & base
        return (
          <path
            d="M 0,-7 L -7,-0.5 L -5,-0.5 L -5,6 L 5,6 L 5,-0.5 L 7,-0.5 Z"
            fill={glyphColor}
          />
        );
      case 'locations':
        // Pin dot
        return (
          <g fill={glyphColor}>
            <circle cx="0" cy="-2" r="4" />
            <path d="M -3,-1 L 0,6 L 3,-1 Z" />
          </g>
        );
      case 'secrets':
        // Eye of mystery
        return (
          <g fill={glyphColor}>
            <path d="M -7,0 Q 0,-5 7,0 Q 0,5 -7,0 Z" />
            <circle cx="0" cy="0" r="2.2" fill={markerColor} />
          </g>
        );
      default:
        return <circle cx="0" cy="0" r="4" fill={glyphColor} />;
    }
  };

  return (
    <g
      transform={`translate(${cx}, ${cy}) scale(${scale})`}
      className="cursor-pointer transition-transform duration-150"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(location);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`${location.name} (${categoryMeta.label})`}
    >
      {/* Waypoint Beacon Pulse */}
      {isWaypoint && (
        <g>
          <circle cx="0" cy="0" r="28" fill="none" stroke="#42CFC3" strokeWidth="2.5" opacity="0.8">
            <animate attributeName="r" values="14;34;14" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="16" fill="rgba(66, 207, 195, 0.25)" />
        </g>
      )}

      {/* Selected Pulse Ring */}
      {isSelected && (
        <g>
          <circle cx="0" cy="0" r="24" fill="none" stroke={markerColor} strokeWidth="2.5" opacity="0.9">
            <animate attributeName="r" values="16;30;16" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="20" fill={categoryMeta.glowColor} />
        </g>
      )}

      {/* Discovered / Undiscovered Visual State */}
      {/* Outer Disc */}
      <circle
        cx="0"
        cy="0"
        r={isHovered ? 18 : 15}
        fill={location.discovered ? 'rgba(23, 20, 38, 0.95)' : markerColor}
        stroke={location.discovered ? markerColor : '#171426'}
        strokeWidth={location.discovered ? 2 : 2.2}
        filter={isSelected || isHovered ? `drop-shadow(0 0 8px ${markerColor})` : `drop-shadow(0 2px 4px rgba(0,0,0,0.7))`}
        className="transition-all duration-150"
      />

      {/* Inner Icon Glyph */}
      <g transform={location.discovered ? 'translate(0, 0)' : 'translate(0, 0)'}>
        {renderIconGlyph()}
      </g>

      {/* Discovered Checkmark Badge in corner */}
      {location.discovered && (
        <g transform="translate(10, -10)">
          <circle cx="0" cy="0" r="6" fill="#42CFC3" stroke="#171426" strokeWidth="1.5" />
          <path d="M -3,-0.5 L -1,2 L 3,-2" fill="none" stroke="#171426" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* Hover Tooltip (Rendered directly in SVG coordinate space for zero delay) */}
      {isHovered && !isSelected && (
        <g transform="translate(0, -32)" className="pointer-events-none select-none">
          {/* Tooltip Background */}
          <rect
            x="-80"
            y="-28"
            width="160"
            height="32"
            rx="6"
            fill="#171426"
            stroke={markerColor}
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 14px rgba(0,0,0,0.85))"
          />
          {/* Tooltip Little Triangle Pointer */}
          <polygon points="-5,4 5,4 0,9" fill="#171426" stroke={markerColor} strokeWidth="1.5" />
          {/* Cover bottom stroke overlap */}
          <line x1="-5" y1="4" x2="5" y2="4" stroke="#171426" strokeWidth="2" />

          {/* Title */}
          <text
            x="0"
            y="-15"
            fill="#FFF0E8"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
            fontFamily="Outfit, sans-serif"
          >
            {location.name.length > 22 ? `${location.name.slice(0, 20)}…` : location.name}
          </text>

          {/* Category & Discovered subtext */}
          <text
            x="0"
            y="-4"
            fill={location.discovered ? '#42CFC3' : 'rgba(255, 240, 232, 0.7)'}
            fontSize="8"
            fontWeight="500"
            textAnchor="middle"
            fontFamily="Outfit, sans-serif"
          >
            {categoryMeta.label} · {location.discovered ? 'Discovered' : 'Undiscovered'}
          </text>
        </g>
      )}
    </g>
  );
};
