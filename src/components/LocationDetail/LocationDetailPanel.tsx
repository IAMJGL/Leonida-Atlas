import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Navigation,
  Copy,
  Check,
  Edit3,
  Bookmark,
  Share2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { LocationItem, Waypoint } from '../../types';
import { CATEGORIES } from '../../data/locations';
import { playSound } from '../../utils/audio';

interface LocationDetailPanelProps {
  location: LocationItem | null;
  waypoint: Waypoint | null;
  onClose: () => void;
  onToggleDiscovered: (id: string) => void;
  onSetWaypoint: (waypoint: Waypoint | null) => void;
  onSaveNote: (id: string, note: string) => void;
  soundEffects: boolean;
}

export const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location,
  waypoint,
  onClose,
  onToggleDiscovered,
  onSetWaypoint,
  onSaveNote,
  soundEffects,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(location?.userNote || '');

  if (!location) return null;

  const categoryMeta = CATEGORIES[location.category];
  const isWaypoint = waypoint?.locationId === location.id;

  const handleCopyCoords = () => {
    const text = `Leonida GPS: X: ${location.x.toFixed(1)}, Y: ${location.y.toFixed(1)} [${location.name}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    playSound('click', soundEffects);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleDiscovered = () => {
    onToggleDiscovered(location.id);
    if (!location.discovered) {
      playSound('discover', soundEffects);
    } else {
      playSound('toggle', soundEffects);
    }
  };

  const handleToggleWaypoint = () => {
    if (isWaypoint) {
      onSetWaypoint(null);
      playSound('toggle', soundEffects);
    } else {
      onSetWaypoint({
        x: location.x,
        y: location.y,
        locationId: location.id,
        name: location.name,
      });
      playSound('waypoint', soundEffects);
    }
  };

  const handleSaveNote = () => {
    onSaveNote(location.id, noteText);
    setIsEditingNote(false);
    playSound('click', soundEffects);
  };

  return (
    <>
      {/* Mobile tap-away backdrop above the bottom sheet to quickly return to map */}
      <div
        className="fixed inset-x-0 top-0 bottom-[60vh] z-25 sm:hidden"
        onClick={() => {
          onClose();
          playSound('click', soundEffects);
        }}
        aria-hidden="true"
      />

      {/* Main Location Detail Panel: Bottom sheet on mobile (< sm), floating panel on desktop (sm+) */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 max-h-[60vh] sm:max-h-[calc(100vh-100px)] rounded-t-2xl sm:rounded-2xl border-t sm:border border-slate-700/80 bg-[#191B24]/98 sm:bg-[#191B24]/95 backdrop-blur-xl shadow-[0_-12px_40px_rgba(0,0,0,0.85)] sm:shadow-2xl overflow-hidden flex flex-col pointer-events-auto transition-transform sm:transition-all animate-in slide-in-from-bottom duration-250 sm:animate-in sm:fade-in sm:slide-in-from-left-4 sm:absolute sm:inset-auto sm:top-4 sm:left-6 sm:w-[380px]"
        role="dialog"
        aria-label={`Details for ${location.name}`}
      >
        {/* Mobile Drag Handle Indicator */}
        <div className="sm:hidden pt-2 pb-0.5 flex justify-center shrink-0 bg-[#101116]/80">
          <div className="w-10 h-1 bg-slate-600/70 rounded-full" />
        </div>

        {/* Top Banner / Image Area */}
        <div className="relative h-28 sm:h-44 bg-[#101116] overflow-hidden shrink-0">
          {location.imageUrl ? (
            <img
              src={location.imageUrl}
              alt={location.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#191B24] to-[#101116]">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-1 sm:mb-2 shadow-lg"
                style={{ backgroundColor: `${categoryMeta.color}25`, border: `1.5px solid ${categoryMeta.color}` }}
              >
                <span className="text-lg sm:text-xl font-bold" style={{ color: categoryMeta.color }}>
                  {location.name.charAt(0)}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-slate-400">{location.regionName}</span>
            </div>
          )}

          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#191B24] via-black/40 to-transparent" />

          {/* Prominent Close Button */}
          <button
            onClick={() => {
              onClose();
              playSound('click', soundEffects);
            }}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors z-20 cursor-pointer active:scale-95"
            aria-label="Close location panel and return to map"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Tag (Zero-pill discipline: unboxed clean text with subtle separator) */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-3.5 sm:left-4 right-3.5 sm:right-4 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 drop-shadow">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: categoryMeta.color, color: categoryMeta.color }}
              />
              <span className="font-semibold text-white tracking-wide text-xs">{categoryMeta.label}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 text-xs">{location.subCategory}</span>
            </div>

            <span className="text-[10px] sm:text-[11px] font-mono text-slate-300 drop-shadow">
              {location.regionName}
            </span>
          </div>
        </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Title & Discovery Status */}
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
            {location.name}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <button
              type="button"
              onClick={handleToggleDiscovered}
              className={`font-semibold flex items-center gap-1.5 transition-colors cursor-pointer hover:underline text-left ${
                location.discovered
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={location.discovered ? 'Click to mark as Undiscovered' : 'Click to mark as Discovered'}
              aria-label={location.discovered ? 'Mark as Undiscovered' : 'Mark as Discovered'}
            >
              {location.discovered ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Discovered</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Undiscovered</span>
                </>
              )}
            </button>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono text-[11px]">
              GPS {location.x.toFixed(1)}, {location.y.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Primary Action Button: Toggle Discovered */}
        <button
          type="button"
          onClick={handleToggleDiscovered}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            location.discovered
              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-gradient-to-r from-[#FF3B91] to-[#FF9B45] text-white hover:opacity-95 shadow-[0_0_16px_rgba(255,59,145,0.3)]'
          }`}
          aria-label={location.discovered ? 'Mark as Undiscovered' : 'Mark Location as Discovered'}
        >
          {location.discovered ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mark as Undiscovered
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Mark Location as Discovered
            </>
          )}
        </button>

        {/* Secondary Action: GPS Waypoint & Copy */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleToggleWaypoint}
            className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
              isWaypoint
                ? 'bg-[#20D9D2]/20 border-[#20D9D2] text-[#20D9D2]'
                : 'bg-[#101116] border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            {isWaypoint ? 'Waypoint Set' : 'Set Waypoint'}
          </button>

          <button
            onClick={handleCopyCoords}
            className="py-2 px-3 rounded-lg bg-[#101116] border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Coordinates'}
          </button>
        </div>

        {/* Description */}
        <div className="text-xs leading-relaxed text-slate-300 bg-[#101116]/50 p-3 rounded-xl border border-slate-800">
          {location.description}
        </div>

        {/* Reward / Hint Box (if present) */}
        {(location.reward || location.hint) && (
          <div className="space-y-1.5 text-xs">
            {location.reward && (
              <div className="flex items-start gap-2 p-2 bg-[#20D9D2]/10 border border-[#20D9D2]/20 rounded-lg text-slate-200">
                <span className="text-[10px] font-mono text-[#20D9D2] uppercase font-bold shrink-0">
                  REWARD:
                </span>
                <span className="text-xs">{location.reward}</span>
              </div>
            )}
            {location.hint && (
              <div className="flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-slate-200">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold shrink-0">
                  HINT:
                </span>
                <span className="text-xs">{location.hint}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {location.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-slate-400 px-2 py-0.5 bg-[#101116] rounded border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Personal User Notes */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-3 h-3 text-[#FF3B91]" />
              Explorer Notes
            </span>
            {!isEditingNote && (
              <button
                onClick={() => {
                  setNoteText(location.userNote || '');
                  setIsEditingNote(true);
                  playSound('click', soundEffects);
                }}
                className="text-[11px] text-[#20D9D2] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                {location.userNote ? 'Edit Note' : 'Add Note'}
              </button>
            )}
          </div>

          {isEditingNote ? (
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="E.g. Stored spare chopper on the roof; guard sniper patrolling..."
                rows={3}
                className="w-full p-2 bg-[#101116] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#20D9D2]"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditingNote(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-3 py-1 bg-[#20D9D2] text-slate-950 font-semibold rounded-md text-xs hover:bg-[#1db8b2]"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : location.userNote ? (
            <div className="text-xs text-slate-300 italic bg-[#101116] p-2.5 rounded-lg border border-slate-800">
              "{location.userNote}"
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">No custom notes saved for this coordinate.</p>
          )}
        </div>

        {/* Sample Data Notice */}
        <div className="text-[10px] text-slate-500 text-center pt-2">
          Sample fan concept coordinate · Saved to browser local storage
        </div>
      </div>
    </div>
  </>
);
};
