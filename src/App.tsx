import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { Sidebar, SidebarTab } from './components/Sidebar/Sidebar';
import { InteractiveMap } from './components/Map/InteractiveMap';
import { LocationDetailPanel } from './components/LocationDetail/LocationDetailPanel';
import { ProgressTracker } from './components/Dashboard/ProgressTracker';
import { SettingsModal } from './components/Modals/SettingsModal';
import { INITIAL_LOCATIONS, CATEGORIES, REGIONS } from './data/locations';
import {
  LocationItem,
  LocationCategory,
  DiscoveryFilter,
  MapSettings,
  Waypoint,
  RegionId,
  ProgressSummary,
} from './types';
import { playSound } from './utils/audio';
import { Layers } from 'lucide-react';

const STORAGE_KEY_DISCOVERED = 'leonida_atlas_discovered_ids_v1';
const STORAGE_KEY_NOTES = 'leonida_atlas_user_notes_v1';
const STORAGE_KEY_SETTINGS = 'leonida_atlas_settings_v1';

const DEFAULT_SETTINGS: MapSettings = {
  showRoads: true,
  showDistrictLabels: true,
  showGridLines: false,
  soundEffects: true,
  mapStyle: 'tropical',
};

const DEFAULT_CATEGORIES: Record<LocationCategory, boolean> = {
  collectibles: true,
  missions: true,
  vehicles: true,
  businesses: true,
  safehouses: true,
  locations: true,
  secrets: true,
};

export default function App() {
  // 1. Initial State from LocalStorage
  const [locations, setLocations] = useState<LocationItem[]>(() => {
    try {
      const savedDiscovered = localStorage.getItem(STORAGE_KEY_DISCOVERED);
      const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);

      const discoveredSet = savedDiscovered ? new Set<string>(JSON.parse(savedDiscovered)) : null;
      const notesMap = savedNotes ? (JSON.parse(savedNotes) as Record<string, string>) : {};

      return INITIAL_LOCATIONS.map((loc) => ({
        ...loc,
        discovered: discoveredSet !== null ? discoveredSet.has(loc.id) : loc.discovered,
        userNote: notesMap[loc.id] || undefined,
      }));
    } catch {
      return INITIAL_LOCATIONS;
    }
  });

  const [settings, setSettings] = useState<MapSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 2. Navigation & Filter State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('locations');
  const [activeCategories, setActiveCategories] = useState<Record<LocationCategory, boolean>>(DEFAULT_CATEGORIES);
  const [discoveryFilter, setDiscoveryFilter] = useState<DiscoveryFilter>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Selection & Modal State
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [waypoint, setWaypoint] = useState<Waypoint | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync discovered locations to localStorage
  useEffect(() => {
    try {
      const discoveredIds = locations.filter((l) => l.discovered).map((l) => l.id);
      localStorage.setItem(STORAGE_KEY_DISCOVERED, JSON.stringify(discoveredIds));
    } catch {
      // storage unavailable
    }
  }, [locations]);

  // Sync user notes to localStorage
  useEffect(() => {
    try {
      const notesMap: Record<string, string> = {};
      locations.forEach((l) => {
        if (l.userNote) notesMap[l.id] = l.userNote;
      });
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesMap));
    } catch {
      // storage unavailable
    }
  }, [locations]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
  }, [settings]);

  // Handle Tab Selection in Sidebar
  const handleSelectTab = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      setIsDashboardOpen(true);
    } else if (tab === 'my-discoveries') {
      setDiscoveryFilter('discovered');
    } else if (tab === 'locations') {
      setDiscoveryFilter('all');
      setActiveCategories(DEFAULT_CATEGORIES);
    } else {
      // Direct category tab: ensure that category is visible and filtered
      const catKey = tab as LocationCategory;
      if (CATEGORIES[catKey]) {
        // Toggle only this category active
        setActiveCategories({
          collectibles: catKey === 'collectibles',
          missions: catKey === 'missions',
          vehicles: catKey === 'vehicles',
          businesses: catKey === 'businesses',
          safehouses: catKey === 'safehouses',
          locations: catKey === 'locations',
          secrets: catKey === 'secrets',
        });
      }
    }
  };

  // Toggle Discovery of a Location
  const handleToggleDiscovered = useCallback((id: string) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, discovered: !loc.discovered } : loc))
    );
    setSelectedLocation((prev) =>
      prev && prev.id === id ? { ...prev, discovered: !prev.discovered } : prev
    );
  }, []);

  // Save Note for a Location
  const handleSaveNote = useCallback((id: string, note: string) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, userNote: note } : loc))
    );
    setSelectedLocation((prev) =>
      prev && prev.id === id ? { ...prev, userNote: note } : prev
    );
  }, []);

  // Reset Progress back to initial
  const handleResetProgress = () => {
    setLocations(INITIAL_LOCATIONS);
    setSelectedLocation(null);
    setWaypoint(null);
    try {
      localStorage.removeItem(STORAGE_KEY_DISCOVERED);
      localStorage.removeItem(STORAGE_KEY_NOTES);
    } catch {}
  };

  // Toggle Category Layer
  const handleToggleCategory = (cat: LocationCategory) => {
    setActiveCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Bulk Category Layers
  const handleSetAllCategories = (visible: boolean) => {
    setActiveCategories({
      collectibles: visible,
      missions: visible,
      vehicles: visible,
      businesses: visible,
      safehouses: visible,
      locations: visible,
      secrets: visible,
    });
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<MapSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Filter Locations for Map Display
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // 1. Category Visibility Toggle
      if (!activeCategories[loc.category]) return false;

      // 2. Discovery Status Filter
      if (discoveryFilter === 'discovered' && !loc.discovered) return false;
      if (discoveryFilter === 'undiscovered' && loc.discovered) return false;

      // 3. Region Filter
      if (selectedRegion !== 'all' && loc.region !== selectedRegion) return false;

      // 4. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(query);
        const matchesRegion = loc.regionName.toLowerCase().includes(query);
        const matchesCat = CATEGORIES[loc.category].label.toLowerCase().includes(query);
        const matchesSub = loc.subCategory.toLowerCase().includes(query);
        const matchesTag = loc.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesRegion && !matchesCat && !matchesSub && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [locations, activeCategories, discoveryFilter, selectedRegion, searchQuery]);

  // Calculate Progress Stats
  const progressSummary: ProgressSummary = useMemo(() => {
    const total = locations.length;
    const discovered = locations.filter((l) => l.discovered).length;
    const undiscovered = total - discovered;
    const completionPercentage = total > 0 ? Math.round((discovered / total) * 100) : 0;

    const categoryBreakdown = (Object.keys(CATEGORIES) as LocationCategory[]).map((cat) => {
      const catLocs = locations.filter((l) => l.category === cat);
      const catTotal = catLocs.length;
      const catDisc = catLocs.filter((l) => l.discovered).length;
      return {
        category: cat,
        total: catTotal,
        discovered: catDisc,
        percentage: catTotal > 0 ? Math.round((catDisc / catTotal) * 100) : 0,
      };
    });

    const regionBreakdown = (Object.keys(REGIONS) as RegionId[]).map((regId) => {
      const reg = REGIONS[regId];
      const regLocs = locations.filter((l) => l.region === regId);
      const regTotal = regLocs.length;
      const regDisc = regLocs.filter((l) => l.discovered).length;
      return {
        region: regId,
        name: reg.name,
        total: regTotal,
        discovered: regDisc,
        percentage: regTotal > 0 ? Math.round((regDisc / regTotal) * 100) : 0,
      };
    });

    return {
      total,
      discovered,
      undiscovered,
      completionPercentage,
      categoryBreakdown,
      regionBreakdown,
    };
  }, [locations]);

  // Category counts for sidebar
  const categoryStats = useMemo(() => {
    const stats: Record<LocationCategory, { total: number; discovered: number }> = {
      collectibles: { total: 0, discovered: 0 },
      missions: { total: 0, discovered: 0 },
      vehicles: { total: 0, discovered: 0 },
      businesses: { total: 0, discovered: 0 },
      safehouses: { total: 0, discovered: 0 },
      locations: { total: 0, discovered: 0 },
      secrets: { total: 0, discovered: 0 },
    };

    locations.forEach((loc) => {
      if (stats[loc.category]) {
        stats[loc.category].total += 1;
        if (loc.discovered) stats[loc.category].discovered += 1;
      }
    });

    return stats;
  }, [locations]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#171426] text-[#FFF0E8] overflow-hidden font-sans">
      {/* 1. TOP NAVIGATION BAR */}
      <Header
        locations={locations}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          // ensure its category is active
          if (!activeCategories[loc.category]) {
            handleToggleCategory(loc.category);
          }
        }}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        progress={progressSummary}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* 2. MAIN LAYOUT: SIDEBAR + INTERACTIVE MAP */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Collapsible Left Sidebar (Docked on desktop, drawer on mobile) */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategory}
          onSetAllCategories={handleSetAllCategories}
          discoveryFilter={discoveryFilter}
          onChangeDiscoveryFilter={setDiscoveryFilter}
          selectedRegion={selectedRegion}
          onChangeRegion={setSelectedRegion}
          categoryStats={categoryStats}
          soundEffects={settings.soundEffects}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Interactive Open-World Map Canvas */}
        <main className="relative flex-1 h-full overflow-hidden bg-[#171426]">
          <InteractiveMap
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            waypoint={waypoint}
            settings={settings}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              playSound('select', settings.soundEffects);
            }}
            onSetWaypoint={setWaypoint}
          />

          {/* Floating Mobile Quick Directory Trigger (When no marker panel is open) */}
          {!selectedLocation && (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(true);
                playSound('toggle', settings.soundEffects);
              }}
              className="md:hidden absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-[#211930]/95 hover:bg-[#392344] border border-[#392344] rounded-xl text-[#FFF0E8] shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              aria-label="Open Directory and Filter Menu"
            >
              <Layers className="w-4 h-4 text-[#FF5CBA]" />
              <span className="text-xs font-bold tracking-wide">Directory</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#171426] text-[#FFAD83] border border-[#392344]">
                {filteredLocations.length}
              </span>
            </button>
          )}

          {/* Location Detail Panel (when marker selected - bottom sheet on mobile, top-left on desktop) */}
          {selectedLocation && (
            <LocationDetailPanel
              location={selectedLocation}
              waypoint={waypoint}
              onClose={() => setSelectedLocation(null)}
              onToggleDiscovered={handleToggleDiscovered}
              onSetWaypoint={setWaypoint}
              onSaveNote={handleSaveNote}
              soundEffects={settings.soundEffects}
            />
          )}

          {/* Empty search feedback when no markers match */}
          {filteredLocations.length === 0 && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2.5 bg-[#211930]/95 border border-[#392344] rounded-xl shadow-2xl backdrop-blur-md text-center pointer-events-auto">
              <p className="text-xs font-semibold text-[#FFF0E8]">
                No coordinates match your active filters
              </p>
              <div className="flex items-center justify-center gap-3 mt-1 text-[11px]">
                <button
                  onClick={() => {
                    handleSetAllCategories(true);
                    setDiscoveryFilter('all');
                    setSelectedRegion('all');
                    setSearchQuery('');
                  }}
                  className="text-[#FF8FA3] hover:text-[#FF5CBA] font-semibold hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. PROGRESS TRACKER OVERLAY / MODAL */}
      {isDashboardOpen && (
        <ProgressTracker
          progress={progressSummary}
          onClose={() => setIsDashboardOpen(false)}
          onFilterCategory={(cat) => {
            setIsDashboardOpen(false);
            handleSelectTab(cat as SidebarTab);
          }}
          onResetProgress={handleResetProgress}
          soundEffects={settings.soundEffects}
        />
      )}

      {/* 4. SETTINGS MODAL */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsSettingsOpen(false)}
          onResetProgress={handleResetProgress}
        />
      )}
    </div>
  );
}
