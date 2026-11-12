import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  X,
  Sun,
  Moon,
  Radar,
  BarChart3,
  Sparkles,
  Menu,
} from 'lucide-react';
import { LocationItem, MapSettings, MapStyleMode, ProgressSummary } from '../../types';
import { CATEGORIES } from '../../data/locations';
import { playSound } from '../../utils/audio';

interface HeaderProps {
  locations: LocationItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectLocation: (loc: LocationItem) => void;
  settings: MapSettings;
  onUpdateSettings: (settings: Partial<MapSettings>) => void;
  progress: ProgressSummary;
  onOpenDashboard: () => void;
  onOpenSettings: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  locations,
  searchQuery,
  onSearchChange,
  onSelectLocation,
  settings,
  onUpdateSettings,
  progress,
  onOpenDashboard,
  onOpenSettings,
  onToggleMobileMenu,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filtered preview matches
  const searchMatches = searchQuery.trim()
    ? locations
        .filter(
          (loc) =>
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.regionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            CATEGORIES[loc.category].label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  const styleModes: { id: MapStyleMode; label: string; icon: React.ReactNode }[] = [
    { id: 'tropical', label: 'Tropical', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'night', label: 'Night Heat', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'recon', label: 'Recon', icon: <Radar className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="relative z-30 h-14 bg-[#171426] border-b border-[#392344] px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 shadow-md">
      {/* ZONE 1: BRAND LOGO & MOBILE MENU TOGGLE */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile menu trigger */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={() => {
              onToggleMobileMenu();
              playSound('click', settings.soundEffects);
            }}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#221933] border border-[#392344] text-[#FFF0E8]/85 hover:text-[#FF5CBA] hover:bg-[#392344] transition-colors cursor-pointer"
            aria-label="Open Directory Menu"
            title="Open Directory Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2">
          {/* Compass insignia */}
          <div className="relative w-8 h-8 rounded-lg bg-[#221933] border border-[#FF5CBA]/50 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-[#FF5CBA]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#FFF0E8] whitespace-nowrap">
                LEONIDA <span className="text-[#FF5CBA]">ATLAS</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#392344]/75 text-[#FFAD83] rounded border border-[#392344] font-semibold">
                Vice City
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 2: SEARCH FIELD */}
      <div ref={searchContainerRef} className="relative flex-1 min-w-[120px] max-w-md">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 sm:left-3 w-4 h-4 text-[#FFF0E8]/45 pointer-events-none" />
          <input
            type="text"
            placeholder="Search coordinates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full h-9 pl-8 sm:pl-9 pr-7 sm:pr-8 bg-[#221933] border border-[#392344] rounded-lg text-xs text-[#FFF0E8] placeholder-[#FFF0E8]/40 focus:outline-none focus:border-[#FF5CBA] focus:ring-1 focus:ring-[#FF5CBA]/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                playSound('click', settings.soundEffects);
              }}
              className="absolute right-2.5 text-[#FFF0E8]/50 hover:text-[#FF8FA3]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {isSearchFocused && searchMatches.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-[#171426] border border-[#392344] rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="px-3 py-1.5 bg-[#221933] border-b border-[#392344] text-[10px] font-mono text-[#FFAD83] uppercase tracking-wider font-semibold">
              Matching Coordinates ({searchMatches.length})
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-[#392344]/60">
              {searchMatches.map((loc) => {
                const cat = CATEGORIES[loc.category];
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectLocation(loc);
                      setIsSearchFocused(false);
                      playSound('select', settings.soundEffects);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#392344]/60 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-[#FFF0E8] group-hover:text-[#FF5CBA] transition-colors truncate">
                          {loc.name}
                        </div>
                        <div className="text-[11px] text-[#FFF0E8]/60 truncate">
                          {cat.label} · {loc.regionName}
                        </div>
                      </div>
                    </div>
                    {loc.discovered ? (
                      <span className="text-[10px] font-mono text-[#42CFC3] flex items-center gap-1 shrink-0 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Discovered
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#FFF0E8]/40 shrink-0">
                        Undiscovered
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ZONE 3: ACTIONS & TELEMETRY */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Map Style Selector */}
        <div className="hidden lg:flex items-center gap-1 bg-[#221933] p-0.5 rounded-lg border border-[#392344]">
          {styleModes.map((m) => {
            const isActive = settings.mapStyle === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onUpdateSettings({ mapStyle: m.id });
                  playSound('toggle', settings.soundEffects);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#392344] text-[#FF5CBA] border border-[#FF5CBA]/45'
                    : 'text-[#FFF0E8]/65 hover:text-[#FFF0E8] border border-transparent'
                }`}
              >
                {m.icon}
                <span className="whitespace-nowrap">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            const next = !settings.soundEffects;
            onUpdateSettings({ soundEffects: next });
            playSound('click', next);
          }}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
            settings.soundEffects
              ? 'bg-[#221933] border-[#392344] text-[#42CFC3] hover:bg-[#392344] hover:border-[#42CFC3]/50'
              : 'bg-[#221933] border-[#392344] text-[#FFF0E8]/40 hover:text-[#FFF0E8]'
          }`}
          title={settings.soundEffects ? 'Sound FX On' : 'Sound FX Muted'}
          aria-label="Toggle sound effects"
        >
          {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Progress Tracker Pill / Button */}
        <button
          onClick={() => {
            onOpenDashboard();
            playSound('click', settings.soundEffects);
          }}
          className="flex items-center gap-2.5 h-9 px-3 bg-[#221933] hover:bg-[#392344]/85 border border-[#392344] hover:border-[#FF8FA3]/50 rounded-lg text-[#FFF0E8] transition-colors cursor-pointer group"
          title="Open Completion Tracker"
        >
          <BarChart3 className="w-4 h-4 text-[#FF8FA3] group-hover:scale-105 transition-transform" />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-mono text-[#FFF0E8]/55 leading-none font-semibold">PROGRESS</span>
            <span className="text-xs font-bold tabular-nums text-[#FFF0E8] leading-tight">
              <span className="text-[#FF5CBA]">{progress.completionPercentage}%</span> ({progress.discovered}/{progress.total})
            </span>
          </div>
        </button>

        {/* User Profile Avatar / Chip */}
        <div className="hidden md:flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-[#392344] border border-[#FF8FA3]/45 flex items-center justify-center text-xs font-bold text-[#FFF0E8]">
            VI
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => {
            onOpenSettings();
            playSound('click', settings.soundEffects);
          }}
          className="w-9 h-9 flex items-center justify-center bg-[#221933] hover:bg-[#392344] border border-[#392344] hover:border-[#FFAD83]/60 rounded-lg text-[#FFF0E8]/75 hover:text-[#FFAD83] transition-colors cursor-pointer"
          title="Map Settings & Overlays"
          aria-label="Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
