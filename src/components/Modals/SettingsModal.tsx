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
} from 'lucide-react';
import { MapSettings, MapStyleMode } from '../../types';
import { playSound } from '../../utils/audio';

interface SettingsModalProps {
  settings: MapSettings;
  onUpdateSettings: (newSettings: Partial<MapSettings>) => void;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetProgress,
}) => {
  const styles: { id: MapStyleMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'tropical',
      label: 'Tropical Coastal',
      desc: 'Balanced vibrant coastal colors, sandy beaches, lush wetlands',
      icon: <Sun className="w-4 h-4 text-[#FF9B45]" />,
    },
    {
      id: 'night',
      label: 'Night Heat',
      desc: 'Dark obsidian landmass with glowing neon pink & cyan highway arteries',
      icon: <Moon className="w-4 h-4 text-[#FF3B91]" />,
    },
    {
      id: 'recon',
      label: 'Tactical Recon',
      desc: 'High-contrast topographic style with bathymetric sonar contours',
      icon: <Radar className="w-4 h-4 text-[#20D9D2]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#14161f] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#101116] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#20D9D2]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Atlas Preferences & Overlays
            </h2>
          </div>
          <button
            onClick={() => {
              onClose();
              playSound('click', settings.soundEffects);
            }}
            className="w-7 h-7 rounded-lg bg-[#191B24] hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Map Style Theme */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
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
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                    settings.mapStyle === s.id
                      ? 'bg-[#191B24] border-[#20D9D2] text-white shadow-[0_0_12px_rgba(32,217,210,0.15)]'
                      : 'bg-[#191B24]/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-[#191B24]'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#101116] mt-0.5">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">{s.label}</div>
                    <div className="text-[11px] text-slate-400">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map Overlay Toggles */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Vector Map Layer Toggles
            </label>
            <div className="space-y-2">
              {/* Roads */}
              <div className="flex items-center justify-between p-3 bg-[#191B24] border border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-white">Interstate & Highways</div>
                  <div className="text-[11px] text-slate-400">
                    Show arterial roads, bridges and viaducts
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ showRoads: !settings.showRoads });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.showRoads ? 'bg-[#20D9D2]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.showRoads ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Districts */}
              <div className="flex items-center justify-between p-3 bg-[#191B24] border border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-white">District & Sector Labels</div>
                  <div className="text-[11px] text-slate-400">
                    Show names of Vice Beach, Grassrivers, Keys
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ showDistrictLabels: !settings.showDistrictLabels });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.showDistrictLabels ? 'bg-[#20D9D2]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.showDistrictLabels ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Tactical Grid */}
              <div className="flex items-center justify-between p-3 bg-[#191B24] border border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-white">Tactical GPS Grid</div>
                  <div className="text-[11px] text-slate-400">
                    Show Lat/Lon coordinate ticks and overlay grid
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateSettings({ showGridLines: !settings.showGridLines });
                    playSound('toggle', settings.soundEffects);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.showGridLines ? 'bg-[#20D9D2]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.showGridLines ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Audio Setting */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Audio Feedback
            </label>
            <div className="flex items-center justify-between p-3 bg-[#191B24] border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2.5">
                {settings.soundEffects ? (
                  <Volume2 className="w-4 h-4 text-[#20D9D2]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <div className="text-xs font-semibold text-white">HUD Synthesized Sound FX</div>
                  <div className="text-[11px] text-slate-400">
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
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.soundEffects ? 'bg-[#20D9D2]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Independent Disclaimer */}
          <div className="p-3 bg-[#101116] border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Info className="w-4 h-4 text-[#FF9B45] shrink-0" />
              Independent Fan Companion Concept
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Leonida Atlas is an independent fan project concept inspired by the fictional setting of GTA VI. It is not affiliated with, endorsed by, or associated with Rockstar Games or Take-Two Interactive. All coordinates and locations presented are original sample concept data.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#101116] border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              onClose();
              playSound('click', settings.soundEffects);
            }}
            className="px-4 py-2 bg-[#20D9D2] hover:bg-[#1db8b2] text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
