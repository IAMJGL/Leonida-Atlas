import React from 'react';
import {
  X,
  Trophy,
  CheckCircle2,
  Circle,
  MapPin,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { ProgressSummary, LocationCategory, RegionId } from '../../types';
import { CATEGORIES, REGIONS } from '../../data/locations';
import { playSound } from '../../utils/audio';

interface ProgressTrackerProps {
  progress: ProgressSummary;
  onClose: () => void;
  onFilterCategory: (category: LocationCategory) => void;
  onResetProgress: () => void;
  soundEffects: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  onClose,
  onFilterCategory,
  onResetProgress,
  soundEffects,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#171426] border border-[#392344] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#211930] border-b border-[#392344] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#392344] border border-[#FF5CBA]/45 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5CBA]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-[#FFF0E8] tracking-tight truncate">
                  Leonida Completion
                </h2>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#171426] text-[#FFAD83] rounded border border-[#392344] font-semibold">
                  Rank 14
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#FFF0E8]/65 truncate">
                Track discovery across all sectors
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              playSound('click', soundEffects);
            }}
            className="w-8 h-8 rounded-lg bg-[#171426] hover:bg-[#392344] text-[#FFF0E8]/70 hover:text-[#FFF0E8] border border-[#392344] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Close dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top 4 Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Completion Percentage */}
            <div className="p-4 bg-[#211930] border border-[#392344] rounded-xl relative overflow-hidden group">
              <div className="text-[11px] font-mono text-[#FF8FA3] uppercase font-semibold">
                Overall Mastery
              </div>
              <div className="text-3xl font-extrabold text-[#FFF0E8] tabular-nums mt-1">
                {progress.completionPercentage}%
              </div>
              <div className="text-[11px] text-[#FFF0E8]/55 mt-1">Total state exploration</div>
              {/* Pink, purple, turquoise progress bar */}
              <div
                className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[#FF5CBA] via-[#7B4B94] to-[#42CFC3] transition-all duration-500"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>

            {/* Total Locations */}
            <div className="p-4 bg-[#211930] border border-[#392344] rounded-xl">
              <div className="text-[11px] font-mono text-[#FFF0E8]/60 uppercase font-semibold">
                Cataloged POIs
              </div>
              <div className="text-3xl font-extrabold text-[#FFF0E8] tabular-nums mt-1">
                {progress.total}
              </div>
              <div className="text-[11px] text-[#FFF0E8]/55 mt-1">Active map coordinates</div>
            </div>

            {/* Discovered */}
            <div className="p-4 bg-[#211930] border border-[#392344] rounded-xl">
              <div className="text-[11px] font-mono text-[#42CFC3] uppercase flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Discovered
              </div>
              <div className="text-3xl font-extrabold text-[#42CFC3] tabular-nums mt-1">
                {progress.discovered}
              </div>
              <div className="text-[11px] text-[#FFF0E8]/55 mt-1">Completed & logged</div>
            </div>

            {/* Undiscovered */}
            <div className="p-4 bg-[#211930] border border-[#392344] rounded-xl">
              <div className="text-[11px] font-mono text-[#FFAD83] uppercase flex items-center gap-1 font-semibold">
                <Circle className="w-3 h-3" /> Remaining
              </div>
              <div className="text-3xl font-extrabold text-[#FFAD83] tabular-nums mt-1">
                {progress.undiscovered}
              </div>
              <div className="text-[11px] text-[#FFF0E8]/55 mt-1">Uncharted secrets</div>
            </div>
          </div>

          {/* Category Progress Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#FFF0E8] uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5CBA]" />
                Category Exploration Breakdown
              </h3>
              <span className="text-xs text-[#FFF0E8]/55">Click a category to focus on map</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {progress.categoryBreakdown.map((cat) => {
                const meta = CATEGORIES[cat.category];
                return (
                  <button
                    key={cat.category}
                    onClick={() => {
                      onFilterCategory(cat.category);
                      playSound('select', soundEffects);
                    }}
                    className="p-3.5 bg-[#211930] hover:bg-[#392344]/65 border border-[#392344] hover:border-[#FF8FA3]/50 rounded-xl text-left transition-colors group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span className="text-xs font-bold text-[#FFF0E8] group-hover:text-[#FF8FA3] transition-colors">
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono tabular-nums text-[#FFF0E8]/65">
                          {cat.discovered} / {cat.total}
                        </span>
                        <span
                          className="text-xs font-bold font-mono tabular-nums"
                          style={{ color: meta.color }}
                        >
                          {cat.percentage}%
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FFF0E8]/40 group-hover:text-[#FF8FA3] transition-colors" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#171426] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional Sector Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-[#FFF0E8] uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#42CFC3]" />
              Sector Exploration Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {progress.regionBreakdown.map((reg) => (
                <div
                  key={reg.region}
                  className="p-3 bg-[#211930] border border-[#392344] rounded-xl"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#FFF0E8] truncate">{reg.name}</span>
                    <span className="font-mono text-[#42CFC3] font-bold tabular-nums">
                      {reg.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#171426] rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF5CBA] via-[#7B4B94] to-[#42CFC3] rounded-full transition-all duration-300"
                      style={{ width: `${reg.percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#FFF0E8]/55 font-mono">
                    {reg.discovered} of {reg.total} found
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Progress Action */}
          <div className="pt-4 border-t border-[#392344] flex items-center justify-between">
            <div className="text-xs text-[#FFF0E8]/55">
              Discovery state is saved locally in your browser.
            </div>
            <button
              onClick={() => {
                if (confirm('Reset all discovered markers back to default sample state?')) {
                  onResetProgress();
                  playSound('toggle', soundEffects);
                }
              }}
              className="px-3 py-1.5 text-xs text-[#FF8FA3] hover:text-[#FFF0E8] bg-[#221933] hover:bg-[#392344] border border-[#FF8FA3]/30 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Discovery Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
