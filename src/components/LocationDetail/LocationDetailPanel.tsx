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
        className="fixed inset-x-0 bottom-0 z-30 max-h-[60vh] sm:max-h-[calc(100vh-100px)] rounded-t-2xl sm:rounded-2xl border-t sm:border border-[#392344] bg-[#171426]/98 sm:bg-[#171426]/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto transition-transform sm:transition-all animate-in slide-in-from-bottom duration-250 sm:animate-in sm:fade-in sm:slide-in-from-left-4 sm:absolute sm:inset-auto sm:top-4 sm:left-6 sm:w-[380px]"
        role="dialog"
        aria-label={`Details for ${location.name}`}
      >
        {/* Mobile Drag Handle Indicator */}
        <div className="sm:hidden pt-2 pb-0.5 flex justify-center shrink-0 bg-[#221933]/90">
          <div className="w-10 h-1 bg-[#392344] rounded-full" />
        </div>

        {/* Top Banner / Image Area (No pink overlay or pink tint on thumbnail) */}
        <div className="relative h-28 sm:h-44 bg-[#1B1829] overflow-hidden shrink-0">
          {location.imageUrl ? (
            <img
              src={location.imageUrl}
              alt={location.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#221933] to-[#171426]">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-1 sm:mb-2 shadow-lg"
                style={{ backgroundColor: `${categoryMeta.color}20`, border: `1.5px solid ${categoryMeta.color}` }}
              >
                <span className="text-lg sm:text-xl font-bold" style={{ color: categoryMeta.color }}>
                  {location.name.charAt(0)}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-[#FFF0E8]/70">{location.regionName}</span>
            </div>
          )}

          {/* Neutral dark bottom gradient scrim for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171426] via-black/35 to-transparent" />

          {/* Prominent Close Button */}
          <button
            onClick={() => {
              onClose();
              playSound('click', soundEffects);
            }}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 rounded-full bg-[#171426]/80 hover:bg-[#392344] text-[#FFF0E8] hover:text-[#FF8FA3] flex items-center justify-center backdrop-blur-md border border-[#392344] transition-colors z-20 cursor-pointer active:scale-95"
            aria-label="Close location panel and return to map"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Tag */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-3.5 sm:left-4 right-3.5 sm:right-4 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 drop-shadow">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: categoryMeta.color }}
              />
              <span className="font-semibold text-[#FFF0E8] tracking-wide text-xs">{categoryMeta.label}</span>
              <span className="text-[#FFF0E8]/60">·</span>
              <span className="text-[#FFF0E8]/80 text-xs">{location.subCategory}</span>
            </div>

            <span className="text-[10px] sm:text-[11px] font-mono text-[#FFF0E8]/80 drop-shadow">
              {location.regionName}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Title & Discovery Status */}
          <div>
            <h2 className="text-lg font-bold text-[#FFF0E8] tracking-tight leading-snug">
              {location.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <button
                type="button"
                onClick={handleToggleDiscovered}
                className={`font-semibold flex items-center gap-1.5 transition-colors cursor-pointer hover:underline text-left ${
                  location.discovered
                    ? 'text-[#42CFC3] hover:text-[#5FE0D5]'
                    : 'text-[#FFF0E8]/60 hover:text-[#FF5CBA]'
                }`}
                title={location.discovered ? 'Click to mark as Undiscovered' : 'Click to mark as Discovered'}
                aria-label={location.discovered ? 'Mark as Undiscovered' : 'Mark as Discovered'}
              >
                {location.discovered ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#42CFC3] shrink-0" />
                    <span>Discovered</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5 text-[#FFF0E8]/50 shrink-0" />
                    <span>Undiscovered</span>
                  </>
                )}
              </button>
              <span className="text-[#392344]">·</span>
              <span className="text-[#FFF0E8]/60 font-mono text-[11px]">
                GPS {location.x.toFixed(1)}, {location.y.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Primary Action Button: Selective Hot Pink */}
          <button
            type="button"
            onClick={handleToggleDiscovered}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              location.discovered
                ? 'bg-[#42CFC3]/15 border border-[#42CFC3]/45 text-[#42CFC3] hover:bg-[#42CFC3]/25'
                : 'bg-[#FF5CBA] hover:bg-[#F049AD] text-[#171426]'
            }`}
            aria-label={location.discovered ? 'Mark as Undiscovered' : 'Mark Location as Discovered'}
          >
            {location.discovered ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#42CFC3]" />
                Mark as Undiscovered
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#171426]" />
                Mark Location as Discovered
              </>
            )}
          </button>

          {/* Secondary Action: GPS Waypoint & Copy */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleToggleWaypoint}
              className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isWaypoint
                  ? 'bg-[#392344] border-[#FF5CBA] text-[#FF5CBA]'
                  : 'bg-[#221933] border-[#392344] text-[#FFF0E8]/85 hover:text-[#FFAD83] hover:border-[#FFAD83]/50'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              {isWaypoint ? 'Waypoint Set' : 'Set Waypoint'}
            </button>

            <button
              onClick={handleCopyCoords}
              className="py-2 px-3 rounded-lg bg-[#221933] border border-[#392344] text-[#FFF0E8]/85 hover:text-[#FF8FA3] hover:border-[#FF8FA3]/50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#42CFC3]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Coordinates'}
            </button>
          </div>

          {/* Description */}
          <div className="text-xs leading-relaxed text-[#FFF0E8]/90 bg-[#221933]/75 p-3 rounded-xl border border-[#392344]">
            {location.description}
          </div>

          {/* Reward / Hint Box (if present) */}
          {(location.reward || location.hint) && (
            <div className="space-y-1.5 text-xs">
              {location.reward && (
                <div className="flex items-start gap-2 p-2 bg-[#42CFC3]/10 border border-[#42CFC3]/30 rounded-lg text-[#FFF0E8]">
                  <span className="text-[10px] font-mono text-[#42CFC3] uppercase font-bold shrink-0">
                    REWARD:
                  </span>
                  <span className="text-xs text-[#FFF0E8]/90">{location.reward}</span>
                </div>
              )}
              {location.hint && (
                <div className="flex items-start gap-2 p-2 bg-[#FFAD83]/10 border border-[#FFAD83]/30 rounded-lg text-[#FFF0E8]">
                  <span className="text-[10px] font-mono text-[#FFAD83] uppercase font-bold shrink-0">
                    HINT:
                  </span>
                  <span className="text-xs text-[#FFF0E8]/90">{location.hint}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {location.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono text-[#FFF0E8]/65 px-2 py-0.5 bg-[#221933] rounded border border-[#392344]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Personal User Notes */}
          <div className="pt-2 border-t border-[#392344]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono uppercase text-[#FF8FA3] flex items-center gap-1.5 font-semibold">
                <Bookmark className="w-3 h-3 text-[#FF8FA3]" />
                Explorer Notes
              </span>
              {!isEditingNote && (
                <button
                  onClick={() => {
                    setNoteText(location.userNote || '');
                    setIsEditingNote(true);
                    playSound('click', soundEffects);
                  }}
                  className="text-[11px] text-[#FFAD83] hover:text-[#FF8FA3] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
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
                  className="w-full p-2 bg-[#221933] border border-[#392344] rounded-lg text-xs text-[#FFF0E8] focus:outline-none focus:border-[#FF5CBA]"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="px-2.5 py-1 text-xs text-[#FFF0E8]/60 hover:text-[#FFF0E8] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 bg-[#FF8FA3] hover:bg-[#FF758F] text-[#171426] font-bold rounded-md text-xs cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : location.userNote ? (
              <div className="text-xs text-[#FFF0E8]/90 italic bg-[#221933] p-2.5 rounded-lg border border-[#392344]">
                "{location.userNote}"
              </div>
            ) : (
              <p className="text-[11px] text-[#FFF0E8]/50 italic">No custom notes saved for this coordinate.</p>
            )}
          </div>

          {/* Sample Data Notice */}
          <div className="text-[10px] text-[#FFF0E8]/40 text-center pt-2">
            Sample fan concept coordinate · Saved to browser local storage
          </div>
        </div>
      </div>
    </>
  );
};
