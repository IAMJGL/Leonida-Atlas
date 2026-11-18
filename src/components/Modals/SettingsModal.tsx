import React from 'react';
import {
  X,
  Sliders,
  Volume2,
  VolumeX,
  Map,
  Eye,
  RotateCcw,
  ShieldAlert,
  Sun,
  Moon,
  Radar,
  Info,
} from '../Icons';
import { CommunityPoiSummary, MapRendererMode, MapSettings, MapStyleMode } from '../../types';
import { playSound } from '../../utils/audio';

interface SettingsModalProps {
  settings: MapSettings;
  onUpdateSettings: (newSettings: Partial<MapSettings>) => void;
  onClose: () => void;
  onResetProgress: () => void;
  communitySummary?: CommunityPoiSummary;
  isLoadingCommunityData?: boolean;
  communityLoadError?: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetProgress,
  communitySummary,
  isLoadingCommunityData,
  communityLoadError,
}) => {
  const activeRenderer: MapRendererMode = settings.mapRenderer ?? 'legacy-svg';

  const renderers: { id: MapRendererMode; label: string; desc: string }[] = [
    {
      id: 'legacy-svg',
      label: 'Legacy Fictional SVG',
      desc: 'Original vector map with the 42 fictional sample locations, radar, and discovery tracking',
    },
    {
      id: 'yanis-v18',
      label: 'YANIS V18 Tiles (Preview)',
      desc: 'Community geographical tile map (z=0–3, 593 tiles, CC BY 4.0) without markers',
    },
  ];

  const styles: { id: MapStyleMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'tropical',
      label: 'Tropical Coastal',
      desc: 'Balanced coastal colors, warm sandy beaches, and lush wetlands',
      icon: <Sun className="w-4 h-4 text-[#FFAD83]" />,
    },
    {
      id: 'night',
      label: 'Night Heat',
      desc: 'Deep coastal landmass with crisp amber & turquoise arterial highways',
      icon: <Moon className="w-4 h-4 text-[#FF5CBA]" />,
    },
    {
      id: 'recon',
      label: 'Tactical Recon',
      desc: 'High-contrast topographic style with turquoise bathymetric contours',
      icon: <Radar className="w-4 h-4 text-[#42CFC3]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#171426] border border-[#392344] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#211930] border-b border-[#392344] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#FF5CBA]" />
            <h2 className="text-sm font-bold text-[#FFF0E8] uppercase tracking-wider font-mono">
              Atlas Preferences & Overlays
            </h2>
          </div>
          <button
            onClick={() => {
              onClose();
              playSound('click', settings.soundEffects);
            }}
            className="w-7 h-7 rounded-lg bg-[#171426] hover:bg-[#392344] text-[#FFF0E8]/70 hover:text-[#FFF0E8] border border-[#392344] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Map Engine Switcher */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#FFF0E8]/55 mb-2">
              Map Engine
            </label>
            <div className="space-y-2">
              {renderers.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ mapRenderer: r.id });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    activeRenderer === r.id
                      ? 'bg-[#392344]/85 border-[#42CFC3]/75 text-[#FFF0E8]'
                      : 'bg-[#211930]/70 border-[#392344] text-[#FFF0E8]/70 hover:text-[#FFF0E8] hover:bg-[#2B1F3A]'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#171426] border border-[#392344] mt-0.5">
                    <Map className={`w-4 h-4 ${activeRenderer === r.id ? 'text-[#42CFC3]' : 'text-[#FFF0E8]/50'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#FFF0E8]">{r.label}</div>
                    <div className="text-[11px] text-[#FFF0E8]/60">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map Style Theme */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#FFF0E8]/55 mb-2">
              Visual Environment Theme
            </label>
            <div className="space-y-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onUpdateSettings({ mapStyle: s.id });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    settings.mapStyle === s.id
                      ? 'bg-[#392344]/85 border-[#FF5CBA]/75 text-[#FFF0E8]'
                      : 'bg-[#211930]/70 border-[#392344] text-[#FFF0E8]/70 hover:text-[#FFF0E8] hover:bg-[#2B1F3A]'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#171426] border border-[#392344] mt-0.5">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#FFF0E8]">{s.label}</div>
                    <div className="text-[11px] text-[#FFF0E8]/60">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map Overlay Toggles */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#FFF0E8]/55 mb-2">
              Vector Map Layer Toggles
            </label>
            <div className="space-y-2">
              {/* Roads */}
              <div className="flex items-center justify-between p-3 bg-[#211930] border border-[#392344] rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-[#FFF0E8]">Interstate & Highways</div>
                  <div className="text-[11px] text-[#FFF0E8]/55">
                    Show arterial roads, bridges and viaducts
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ showRoads: !settings.showRoads });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.showRoads ? 'bg-[#42CFC3]' : 'bg-[#392344]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#FFF0E8] shadow-sm transition-transform ${
                      settings.showRoads ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Districts */}
              <div className="flex items-center justify-between p-3 bg-[#211930] border border-[#392344] rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-[#FFF0E8]">District & Sector Labels</div>
                  <div className="text-[11px] text-[#FFF0E8]/55">
                    Show names of Vice Beach, Grassrivers, Keys
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ showDistrictLabels: !settings.showDistrictLabels });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.showDistrictLabels ? 'bg-[#42CFC3]' : 'bg-[#392344]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#FFF0E8] shadow-sm transition-transform ${
                      settings.showDistrictLabels ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Tactical Grid */}
              <div className="flex items-center justify-between p-3 bg-[#211930] border border-[#392344] rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-[#FFF0E8]">Tactical GPS Grid</div>
                  <div className="text-[11px] text-[#FFF0E8]/55">
                    Show Lat/Lon coordinate ticks and overlay grid
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ showGridLines: !settings.showGridLines });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.showGridLines ? 'bg-[#42CFC3]' : 'bg-[#392344]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#FFF0E8] shadow-sm transition-transform ${
                      settings.showGridLines ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Legacy Sample Locations Layer */}
              <div className="flex items-center justify-between p-3 bg-[#211930] border border-[#392344] rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-[#FFF0E8]">Legacy Sample Layer</div>
                  <div className="text-[11px] text-[#FFF0E8]/55">
                    Show the original fictional sample coordinates (42)
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ showLegacySamples: settings.showLegacySamples === false });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.showLegacySamples !== false ? 'bg-[#42CFC3]' : 'bg-[#392344]'
                  }`}
                  aria-label="Toggle legacy sample locations layer"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#FFF0E8] shadow-sm transition-transform ${
                      settings.showLegacySamples !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Audio Setting */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#FFF0E8]/55 mb-2">
              Audio Feedback
            </label>
            <div className="flex items-center justify-between p-3 bg-[#211930] border border-[#392344] rounded-xl">
              <div className="flex items-center gap-2.5">
                {settings.soundEffects ? (
                  <Volume2 className="w-4 h-4 text-[#42CFC3]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#FFF0E8]/40" />
                )}
                <div>
                  <div className="text-xs font-semibold text-[#FFF0E8]">HUD Synthesized Sound FX</div>
                  <div className="text-[11px] text-[#FFF0E8]/55">
                    Waypoint pings, selector clicks, and discovery chimes
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !settings.soundEffects;
                  onUpdateSettings({ soundEffects: next });
                  playSound('toggle', next);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.soundEffects ? 'bg-[#42CFC3]' : 'bg-[#392344]'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-[#FFF0E8] shadow-sm transition-transform ${
                    settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Independent Disclaimer & Community Attribution */}
          <div className="p-3.5 bg-[#211930] border border-[#392344] rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FFF0E8]">
              <Info className="w-4 h-4 text-[#FFAD83] shrink-0" />
              Independent Fan Companion & Attribution
            </div>
            <p className="text-[11px] text-[#FFF0E8]/65 leading-relaxed">
              Leonida Atlas is an independent fan project concept inspired by the fictional setting of GTA VI. It is not affiliated with, endorsed by, or associated with Rockstar Games or Take-Two Interactive.
            </p>
            <p className="text-[10px] text-[#FFF0E8]/55 leading-relaxed pt-1 border-t border-[#392344]/70">
              Community dataset prepared: GTA VI Landmarks Data (CC BY 4.0) — https://map.gtadb.org · Credits: gtadb.org and all contributors (YANIS V18 / GTA Mapping Community).
              {communitySummary && (
                <>
                  {' '}
                  ({communitySummary.total.toLocaleString()} POIs indexed ·{' '}
                  {communitySummary.geolocated.toLocaleString()} geolocated:{' '}
                  {communitySummary.confirmedCoords.toLocaleString()} confirmed,{' '}
                  {communitySummary.estimatedCoords.toLocaleString()} estimated)
                </>
              )}
              {!communitySummary && isLoadingCommunityData && <> (Loading dataset summary…)</>}
              {!communitySummary && !isLoadingCommunityData && communityLoadError && (
                <> ({communityLoadError})</>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#211930] border-t border-[#392344] flex justify-end">
          <button
            onClick={() => {
              onClose();
              playSound('click', settings.soundEffects);
            }}
            className="px-5 py-2 bg-[#FF5CBA] hover:bg-[#F049AD] text-[#171426] font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
