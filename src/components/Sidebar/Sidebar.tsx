import React from 'react';
import {
  Layers,
  MapPin,
  Diamond,
  Crosshair,
  Car,
  Briefcase,
  Home,
  Eye,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  CheckCircle2,
  Filter,
  BarChart3,
  X,
} from 'lucide-react';
import { LocationCategory, DiscoveryFilter, RegionId } from '../../types';
import { CATEGORIES, REGIONS } from '../../data/locations';
import { playSound } from '../../utils/audio';

export type SidebarTab =
  | 'overview'
  | 'locations'
  | 'collectibles'
  | 'missions'
  | 'vehicles'
  | 'businesses'
  | 'safehouses'
  | 'secrets'
  | 'my-discoveries';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  activeCategories: Record<LocationCategory, boolean>;
  onToggleCategory: (cat: LocationCategory) => void;
  onSetAllCategories: (visible: boolean) => void;
  discoveryFilter: DiscoveryFilter;
  onChangeDiscoveryFilter: (filter: DiscoveryFilter) => void;
  selectedRegion: RegionId | 'all';
  onChangeRegion: (region: RegionId | 'all') => void;
  categoryStats: Record<LocationCategory, { total: number; discovered: number }>;
  soundEffects: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeTab,
  onSelectTab,
  activeCategories,
  onToggleCategory,
  onSetAllCategories,
  discoveryFilter,
  onChangeDiscoveryFilter,
  selectedRegion,
  onChangeRegion,
  categoryStats,
  soundEffects,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: {
    id: SidebarTab;
    categoryKey?: LocationCategory;
    label: string;
    icon: React.ReactNode;
    color?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="w-4 h-4 text-[#FF3B91]" />,
    },
    {
      id: 'locations',
      categoryKey: 'locations',
      label: 'Locations',
      icon: <MapPin className="w-4 h-4 text-[#38BDF8]" />,
      color: '#38BDF8',
    },
    {
      id: 'collectibles',
      categoryKey: 'collectibles',
      label: 'Collectibles',
      icon: <Diamond className="w-4 h-4 text-[#FF3B91]" />,
      color: '#FF3B91',
    },
    {
      id: 'missions',
      categoryKey: 'missions',
      label: 'Missions',
      icon: <Crosshair className="w-4 h-4 text-[#20D9D2]" />,
      color: '#20D9D2',
    },
    {
      id: 'vehicles',
      categoryKey: 'vehicles',
      label: 'Vehicles',
      icon: <Car className="w-4 h-4 text-[#FF9B45]" />,
      color: '#FF9B45',
    },
    {
      id: 'businesses',
      categoryKey: 'businesses',
      label: 'Businesses',
      icon: <Briefcase className="w-4 h-4 text-[#FBBF24]" />,
      color: '#FBBF24',
    },
    {
      id: 'safehouses',
      categoryKey: 'safehouses',
      label: 'Safehouses',
      icon: <Home className="w-4 h-4 text-[#A855F7]" />,
      color: '#A855F7',
    },
    {
      id: 'secrets',
      categoryKey: 'secrets',
      label: 'Hidden Secrets',
      icon: <Eye className="w-4 h-4 text-[#10B981]" />,
      color: '#10B981',
    },
    {
      id: 'my-discoveries',
      label: 'My Discoveries',
      icon: <Bookmark className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <>
      {/* 1. DESKTOP DOCKED SIDEBAR (Preserved exactly for md+ screens) */}
      <aside
        className={`relative z-20 hidden md:flex flex-col bg-[#14161f] border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 ${
          isCollapsed ? 'w-16' : 'w-72'
        }`}
      >
        {/* Sidebar Header & Collapse Toggle */}
        <div className="h-12 px-3 border-b border-slate-800 flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400 font-mono flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#20D9D2]" />
              Atlas Directory
            </span>
          )}
          <button
            onClick={() => {
              onToggleCollapse();
              playSound('toggle', soundEffects);
            }}
            className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-[#191B24] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* FILTER CONTROLS (Only visible when expanded) */}
        {!isCollapsed && (
          <div className="p-3 border-b border-slate-800 space-y-3 bg-[#11131a]/60">
            {/* Discovery State Filter */}
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Status</span>
                <span className="text-slate-400">
                  {discoveryFilter === 'all'
                    ? 'Showing all'
                    : discoveryFilter === 'discovered'
                    ? 'Discovered only'
                    : 'Undiscovered only'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-[#191B24] p-1 rounded-lg border border-slate-800 text-[11px] font-medium">
                {(['all', 'undiscovered', 'discovered'] as DiscoveryFilter[]).map((filter) => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => {
                      onChangeDiscoveryFilter(filter);
                      playSound('click', soundEffects);
                    }}
                    className={`py-1 rounded-md transition-colors capitalize cursor-pointer ${
                      discoveryFilter === filter
                        ? 'bg-[#272a38] text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selector */}
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">Sector Filter</div>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  onChangeRegion(e.target.value as RegionId | 'all');
                  playSound('click', soundEffects);
                }}
                className="w-full h-8 px-2 bg-[#191B24] border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#20D9D2]"
              >
                <option value="all">All Leonida Sectors</option>
                {Object.values(REGIONS).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Category Toggles */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <button
                onClick={() => {
                  onSetAllCategories(true);
                  playSound('toggle', soundEffects);
                }}
                className="text-[#20D9D2] hover:underline"
              >
                Show All Layers
              </button>
              <button
                onClick={() => {
                  onSetAllCategories(false);
                  playSound('toggle', soundEffects);
                }}
                className="text-slate-400 hover:underline"
              >
                Hide All
              </button>
            </div>
          </div>
        )}

        {/* NAVIGATION ITEMS LIST */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;
            const stats = item.categoryKey ? categoryStats[item.categoryKey] : null;
            const isVisibleOnMap = item.categoryKey ? activeCategories[item.categoryKey] : true;

            return (
              <div
                key={item.id}
                className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#191B24] text-white shadow-sm border border-slate-700/70'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#191B24]/50'
                }`}
              >
                {/* Tab Click Area */}
                <button
                  onClick={() => {
                    onSelectTab(item.id);
                    playSound('select', soundEffects);
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                  title={item.label}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isCollapsed && (
                    <span className="truncate flex-1 font-semibold text-slate-200">
                      {item.label}
                    </span>
                  )}
                </button>

                {/* Counts & Map Layer Toggle (when expanded) */}
                {!isCollapsed && (
                  <div className="flex items-center gap-2 shrink-0">
                    {stats && (
                      <span className="text-[10px] font-mono tabular-nums text-slate-400">
                        {stats.discovered}/{stats.total}
                      </span>
                    )}

                    {item.categoryKey && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCategory(item.categoryKey!);
                          playSound('toggle', soundEffects);
                        }}
                        className={`w-6 h-6 flex items-center justify-center rounded hover:bg-slate-800 transition-colors ${
                          isVisibleOnMap ? 'text-[#20D9D2]' : 'text-slate-600'
                        }`}
                        title={isVisibleOnMap ? 'Hide from map' : 'Show on map'}
                        aria-label={`Toggle visibility of ${item.label}`}
                      >
                        {isVisibleOnMap ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER: QUICK STATS */}
        {!isCollapsed && (
          <div className="p-3 border-t border-slate-800 bg-[#101116]/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Leonida Region v1.0</span>
            <span className="text-[#FF3B91]">Active</span>
          </div>
        )}
      </aside>

      {/* 2. MOBILE COMPACT DRAWER & BACKDROP (md:hidden) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/75 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          onCloseMobile?.();
          playSound('toggle', soundEffects);
        }}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[84vw] max-w-xs bg-[#14161f] border-r border-slate-800 shadow-2xl flex flex-col md:hidden transition-transform duration-250 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-label="Mobile Directory Navigation"
        aria-modal="true"
      >
        {/* Mobile Header with Title and Accessible Close Button */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between bg-[#101116]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF3B91] via-[#FF9B45] to-[#20D9D2] p-[1.5px] shadow-[0_0_10px_rgba(255,59,145,0.35)] shrink-0">
              <div className="w-full h-full bg-[#101116] rounded-[7px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#20D9D2]" />
              </div>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white uppercase font-mono">
              Atlas <span className="text-[#FF3B91]">Directory</span>
            </span>
          </div>

          <button
            onClick={() => {
              onCloseMobile?.();
              playSound('toggle', soundEffects);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-[#191B24] transition-colors cursor-pointer active:scale-95"
            aria-label="Close directory menu"
          >
            <X className="w-5 h-5 text-slate-200" />
          </button>
        </div>

        {/* Filter Controls (Status, Sector, Bulk toggles) */}
        <div className="p-3 border-b border-slate-800 space-y-3 bg-[#11131a]/80 shrink-0">
          {/* Discovery State Filter */}
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Status</span>
              <span className="text-slate-400 text-[10px]">
                {discoveryFilter === 'all'
                  ? 'Showing all'
                  : discoveryFilter === 'discovered'
                  ? 'Discovered only'
                  : 'Undiscovered only'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-[#191B24] p-1 rounded-lg border border-slate-800 text-[11px] font-medium">
              {(['all', 'undiscovered', 'discovered'] as DiscoveryFilter[]).map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => {
                    onChangeDiscoveryFilter(filter);
                    playSound('click', soundEffects);
                  }}
                  className={`py-1.5 rounded-md transition-colors capitalize cursor-pointer text-center ${
                    discoveryFilter === filter
                      ? 'bg-[#272a38] text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Region Selector */}
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">Sector Filter</div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                onChangeRegion(e.target.value as RegionId | 'all');
                playSound('click', soundEffects);
              }}
              className="w-full h-9 px-2.5 bg-[#191B24] border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#20D9D2]"
            >
              <option value="all">All Leonida Sectors</option>
              {Object.values(REGIONS).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Category Toggles */}
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <button
              onClick={() => {
                onSetAllCategories(true);
                playSound('toggle', soundEffects);
              }}
              className="text-[#20D9D2] hover:underline cursor-pointer"
            >
              Show All Layers
            </button>
            <button
              onClick={() => {
                onSetAllCategories(false);
                playSound('toggle', soundEffects);
              }}
              className="text-slate-400 hover:underline cursor-pointer"
            >
              Hide All
            </button>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;
            const stats = item.categoryKey ? categoryStats[item.categoryKey] : null;
            const isVisibleOnMap = item.categoryKey ? activeCategories[item.categoryKey] : true;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#191B24] text-white shadow-sm border border-slate-700/80'
                    : 'text-slate-300 hover:text-white hover:bg-[#191B24]/60'
                }`}
              >
                {/* Tab Click Area - on mobile closes drawer and focuses map */}
                <button
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile?.();
                    playSound('select', soundEffects);
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                  title={item.label}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <span className="truncate flex-1 font-semibold text-slate-200 text-xs">
                    {item.label}
                  </span>
                </button>

                {/* Counts & Layer Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  {stats && (
                    <span className="text-[10px] font-mono tabular-nums text-slate-400">
                      {stats.discovered}/{stats.total}
                    </span>
                  )}

                  {item.categoryKey && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCategory(item.categoryKey!);
                        playSound('toggle', soundEffects);
                      }}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${
                        isVisibleOnMap ? 'text-[#20D9D2]' : 'text-slate-600'
                      }`}
                      title={isVisibleOnMap ? 'Hide from map' : 'Show on map'}
                      aria-label={`Toggle visibility of ${item.label}`}
                    >
                      {isVisibleOnMap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Mobile Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#101116]/90 text-[11px] text-slate-400 flex items-center justify-between font-mono shrink-0">
          <span>Leonida Atlas Companion</span>
          <span className="text-[#20D9D2]">Mobile View</span>
        </div>
      </aside>
    </>
  );
};
