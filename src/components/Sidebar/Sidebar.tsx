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
      icon: <BarChart3 className="w-4 h-4 text-[#FF5CBA]" />,
    },
    {
      id: 'locations',
      categoryKey: 'locations',
      label: 'Locations',
      icon: <MapPin className="w-4 h-4 text-[#FFF0E8]" />,
      color: '#FFF0E8',
    },
    {
      id: 'collectibles',
      categoryKey: 'collectibles',
      label: 'Collectibles',
      icon: <Diamond className="w-4 h-4 text-[#FF5CBA]" />,
      color: '#FF5CBA',
    },
    {
      id: 'missions',
      categoryKey: 'missions',
      label: 'Missions',
      icon: <Crosshair className="w-4 h-4 text-[#FF8FA3]" />,
      color: '#FF8FA3',
    },
    {
      id: 'vehicles',
      categoryKey: 'vehicles',
      label: 'Vehicles',
      icon: <Car className="w-4 h-4 text-[#FFAD83]" />,
      color: '#FFAD83',
    },
    {
      id: 'businesses',
      categoryKey: 'businesses',
      label: 'Businesses',
      icon: <Briefcase className="w-4 h-4 text-[#B488D9]" />,
      color: '#B488D9',
    },
    {
      id: 'safehouses',
      categoryKey: 'safehouses',
      label: 'Safehouses',
      icon: <Home className="w-4 h-4 text-[#42CFC3]" />,
      color: '#42CFC3',
    },
    {
      id: 'secrets',
      categoryKey: 'secrets',
      label: 'Hidden Secrets',
      icon: <Eye className="w-4 h-4 text-[#8D99AE]" />,
      color: '#8D99AE',
    },
    {
      id: 'my-discoveries',
      label: 'My Discoveries',
      icon: <Bookmark className="w-4 h-4 text-[#FFAD83]" />,
    },
  ];

  return (
    <>
      {/* 1. DESKTOP DOCKED SIDEBAR (Preserved exactly for md+ screens) */}
      <aside
        className={`relative z-20 hidden md:flex flex-col bg-[#171426] border-r border-[#392344] transition-all duration-300 ease-in-out shrink-0 shadow-lg ${
          isCollapsed ? 'w-16' : 'w-72'
        }`}
      >
        {/* Sidebar Header & Collapse Toggle */}
        <div className="h-12 px-3 border-b border-[#392344] bg-[#1E172E] flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-xs font-bold tracking-wider uppercase text-[#FFF0E8]/90 font-mono flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#FF5CBA]" />
              Atlas Directory
            </span>
          )}
          <button
            onClick={() => {
              onToggleCollapse();
              playSound('toggle', soundEffects);
            }}
            className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-[#FFF0E8]/60 hover:text-[#FFF0E8] hover:bg-[#392344] transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* FILTER CONTROLS (Only visible when expanded) */}
        {!isCollapsed && (
          <div className="p-3 border-b border-[#392344] space-y-3 bg-[#211930]/80">
            {/* Discovery State Filter */}
            <div>
              <div className="text-[10px] font-mono uppercase text-[#FFF0E8]/60 mb-1.5 flex items-center justify-between">
                <span>Status</span>
                <span className="text-[#FFAD83] font-semibold">
                  {discoveryFilter === 'all'
                    ? 'Showing all'
                    : discoveryFilter === 'discovered'
                    ? 'Discovered only'
                    : 'Undiscovered only'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-[#171426] p-1 rounded-lg border border-[#392344] text-[11px] font-medium">
                {(['all', 'undiscovered', 'discovered'] as DiscoveryFilter[]).map((filter) => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => {
                      onChangeDiscoveryFilter(filter);
                      playSound('click', soundEffects);
                    }}
                    className={`py-1 rounded-md transition-all capitalize cursor-pointer text-center font-semibold ${
                      discoveryFilter === filter
                        ? 'bg-[#392344] text-[#FF5CBA] border border-[#FF5CBA]/40'
                        : 'text-[#FFF0E8]/60 hover:text-[#FFF0E8] border border-transparent'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selector */}
            <div>
              <div className="text-[10px] font-mono uppercase text-[#FFF0E8]/60 mb-1">Sector Filter</div>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  onChangeRegion(e.target.value as RegionId | 'all');
                  playSound('click', soundEffects);
                }}
                className="w-full h-8 px-2 bg-[#171426] border border-[#392344] rounded-lg text-xs text-[#FFF0E8] focus:outline-none focus:border-[#FF5CBA] cursor-pointer"
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
                className="text-[#FF8FA3] hover:text-[#FFAD83] font-semibold hover:underline cursor-pointer"
              >
                Show All Layers
              </button>
              <button
                onClick={() => {
                  onSetAllCategories(false);
                  playSound('toggle', soundEffects);
                }}
                className="text-[#FFF0E8]/55 hover:text-[#FFF0E8] hover:underline cursor-pointer"
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
                    ? 'bg-[#392344]/85 text-[#FFF0E8] shadow-[inset_3px_0_0_#FF5CBA] border border-[#FF5CBA]/40'
                    : 'text-[#FFF0E8]/75 hover:text-[#FFF0E8] hover:bg-[#221933] border border-transparent'
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
                    <span className={`truncate flex-1 ${isSelected ? 'font-bold text-[#FFF0E8]' : 'font-medium text-[#FFF0E8]/85'}`}>
                      {item.label}
                    </span>
                  )}
                </button>

                {/* Counts & Map Layer Toggle (when expanded) */}
                {!isCollapsed && (
                  <div className="flex items-center gap-2 shrink-0">
                    {stats && (
                      <span className={`text-[10px] font-mono tabular-nums ${isSelected ? 'text-[#FF8FA3] font-bold' : 'text-[#FFF0E8]/45'}`}>
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
                        className={`w-6 h-6 flex items-center justify-center rounded hover:bg-[#171426] transition-colors cursor-pointer ${
                          isVisibleOnMap ? 'text-[#42CFC3]' : 'text-[#FFF0E8]/25'
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
          <div className="p-3 border-t border-[#392344] bg-[#131020] text-[11px] text-[#FFF0E8]/55 flex items-center justify-between font-mono">
            <span>Leonida Atlas</span>
            <span className="text-[#42CFC3] font-semibold">Active</span>
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
        className={`fixed inset-y-0 left-0 z-50 w-[84vw] max-w-xs bg-[#171426] border-r border-[#392344] shadow-2xl flex flex-col md:hidden transition-transform duration-250 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-label="Mobile Directory Navigation"
        aria-modal="true"
      >
        {/* Mobile Header with Title and Accessible Close Button */}
        <div className="h-14 px-4 border-b border-[#392344] flex items-center justify-between bg-[#211930] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#392344] border border-[#FF5CBA]/50 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-[#FF5CBA]" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#FFF0E8] uppercase font-mono">
              Atlas <span className="text-[#FF5CBA]">Directory</span>
            </span>
          </div>

          <button
            onClick={() => {
              onCloseMobile?.();
              playSound('toggle', soundEffects);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#FFF0E8]/70 hover:text-[#FFF0E8] hover:bg-[#392344] transition-colors cursor-pointer active:scale-95"
            aria-label="Close directory menu"
          >
            <X className="w-5 h-5 text-[#FFF0E8]" />
          </button>
        </div>

        {/* Filter Controls (Status, Sector, Bulk toggles) */}
        <div className="p-3 border-b border-[#392344] space-y-3 bg-[#211930]/80 shrink-0">
          {/* Discovery State Filter */}
          <div>
            <div className="text-[10px] font-mono uppercase text-[#FFF0E8]/60 mb-1.5 flex items-center justify-between">
              <span>Status</span>
              <span className="text-[#FFAD83] text-[10px] font-semibold">
                {discoveryFilter === 'all'
                  ? 'Showing all'
                  : discoveryFilter === 'discovered'
                  ? 'Discovered only'
                  : 'Undiscovered only'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-[#171426] p-1 rounded-lg border border-[#392344] text-[11px] font-medium">
              {(['all', 'undiscovered', 'discovered'] as DiscoveryFilter[]).map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => {
                    onChangeDiscoveryFilter(filter);
                    playSound('click', soundEffects);
                  }}
                  className={`py-1.5 rounded-md transition-all capitalize cursor-pointer text-center font-semibold ${
                    discoveryFilter === filter
                      ? 'bg-[#392344] text-[#FF5CBA] border border-[#FF5CBA]/40'
                      : 'text-[#FFF0E8]/60 hover:text-[#FFF0E8] border border-transparent'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Region Selector */}
          <div>
            <div className="text-[10px] font-mono uppercase text-[#FFF0E8]/60 mb-1">Sector Filter</div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                onChangeRegion(e.target.value as RegionId | 'all');
                playSound('click', soundEffects);
              }}
              className="w-full h-9 px-2.5 bg-[#171426] border border-[#392344] rounded-lg text-xs text-[#FFF0E8] focus:outline-none focus:border-[#FF5CBA]"
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
              className="text-[#FF8FA3] hover:text-[#FFAD83] font-semibold hover:underline cursor-pointer"
            >
              Show All Layers
            </button>
            <button
              onClick={() => {
                onSetAllCategories(false);
                playSound('toggle', soundEffects);
              }}
              className="text-[#FFF0E8]/55 hover:text-[#FFF0E8] hover:underline cursor-pointer"
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
                    ? 'bg-[#392344]/85 text-[#FFF0E8] shadow-[inset_3px_0_0_#FF5CBA] border border-[#FF5CBA]/40'
                    : 'text-[#FFF0E8]/80 hover:text-[#FFF0E8] hover:bg-[#221933] border border-transparent'
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
                  <span className={`truncate flex-1 text-xs ${isSelected ? 'font-bold text-[#FFF0E8]' : 'font-medium text-[#FFF0E8]/85'}`}>
                    {item.label}
                  </span>
                </button>

                {/* Counts & Layer Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  {stats && (
                    <span className={`text-[10px] font-mono tabular-nums ${isSelected ? 'text-[#FF8FA3] font-bold' : 'text-[#FFF0E8]/45'}`}>
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
                      className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#171426] transition-colors cursor-pointer ${
                        isVisibleOnMap ? 'text-[#42CFC3]' : 'text-[#FFF0E8]/25'
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
        <div className="p-3 border-t border-[#392344] bg-[#131020] text-[11px] text-[#FFF0E8]/55 flex items-center justify-between font-mono shrink-0">
          <span>Leonida Atlas</span>
          <span className="text-[#42CFC3] font-semibold">Mobile View</span>
        </div>
      </aside>
    </>
  );
};
