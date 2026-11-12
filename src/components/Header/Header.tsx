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
    { id: 'tropical', label: 'Tropical', icon: <Sun className="w-3.5 h-3.5 text-[#FF9B45]" /> },
    { id: 'night', label: 'Night Heat', icon: <Moon className="w-3.5 h-3.5 text-[#FF3B91]" /> },
    { id: 'recon', label: 'Recon', icon: <Radar className="w-3.5 h-3.5 text-[#20D9D2]" /> },
  ];

  return (
    <header className="relative z-30 h-14 bg-[#101116] border-b border-slate-800/90 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
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
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#191B24] border border-slate-700/80 text-slate-300 hover:text-white hover:bg-[#252836] transition-colors cursor-pointer"
            aria-label="Open Directory Menu"
            title="Open Directory Menu"
          >
            <Menu className="w-4 h-4 text-[#20D9D2]" />
          </button>
        )}

        <div className="flex items-center gap-2">
          {/* Neon Palm / Compass insignia */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF3B91] via-[#FF9B45] to-[#20D9D2] p-[1.5px] shadow-[0_0_12px_rgba(255,59,145,0.4)] shrink-0">
            <div className="w-full h-full bg-[#101116] rounded-[7px] flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#20D9D2]" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                LEONIDA <span className="text-[#FF3B91]">ATLAS</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-800/80 text-[#20D9D2] rounded border border-slate-700/60">
                Companion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 2: SEARCH FIELD */}
      <div ref={searchContainerRef} className="relative flex-1 min-w-[120px] max-w-md">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 sm:left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search coordinates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full h-9 pl-8 sm:pl-9 pr-7 sm:pr-8 bg-[#191B24] border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#20D9D2] focus:ring-1 focus:ring-[#20D9D2]/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                playSound('click', settings.soundEffects);
              }}
              className="absolute right-2.5 text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {isSearchFocused && searchMatches.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-[#191B24] border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="px-3 py-1.5 bg-[#101116]/60 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Matching Coordinates ({searchMatches.length})
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
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
                    className="w-full px-3 py-2 text-left hover:bg-[#252836] transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white group-hover:text-[#20D9D2] transition-colors truncate">
                          {loc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {cat.label} · {loc.regionName}
                        </div>
                      </div>
                    </div>
                    {loc.discovered ? (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Discovered
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
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
        <div className="hidden lg:flex items-center gap-1 bg-[#191B24] p-0.5 rounded-lg border border-slate-800">
          {styleModes.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                onUpdateSettings({ mapStyle: m.id });
                playSound('toggle', settings.soundEffects);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                settings.mapStyle === m.id
                  ? 'bg-[#272a38] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.icon}
              <span className="whitespace-nowrap">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            const next = !settings.soundEffects;
            onUpdateSettings({ soundEffects: next });
            playSound('click', next);
          }}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${
            settings.soundEffects
              ? 'bg-[#191B24] border-slate-700 text-[#20D9D2] hover:bg-[#252836]'
              : 'bg-[#191B24] border-slate-800 text-slate-500 hover:text-slate-300'
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
          className="flex items-center gap-2.5 h-9 px-3 bg-[#191B24] hover:bg-[#252836] border border-slate-700/80 rounded-lg text-white transition-colors"
          title="Open Completion Tracker"
        >
          <BarChart3 className="w-4 h-4 text-[#FF3B91]" />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-mono text-slate-400 leading-none">PROGRESS</span>
            <span className="text-xs font-semibold tabular-nums text-white leading-tight">
              {progress.completionPercentage}% ({progress.discovered}/{progress.total})
            </span>
          </div>
        </button>

        {/* User Profile Avatar / Chip */}
        <div className="hidden md:flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF3B91] to-[#FF9B45] flex items-center justify-center text-xs font-bold text-white shadow-md">
            VI
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => {
            onOpenSettings();
            playSound('click', settings.soundEffects);
          }}
          className="w-9 h-9 flex items-center justify-center bg-[#191B24] hover:bg-[#252836] border border-slate-700/80 rounded-lg text-slate-300 hover:text-white transition-colors"
          title="Map Settings & Overlays"
          aria-label="Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
