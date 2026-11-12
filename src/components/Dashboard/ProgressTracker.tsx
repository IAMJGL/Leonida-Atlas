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
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#14161f] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#101116] border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#FF3B91] to-[#FF9B45] flex items-center justify-center shadow-lg shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  Leonida Completion
                </h2>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-slate-800 text-[#20D9D2] rounded border border-slate-700">
                  Rank 14
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Track discovery across all sectors
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              playSound('click', soundEffects);
            }}
            className="w-8 h-8 rounded-lg bg-[#191B24] hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
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
            <div className="p-4 bg-[#191B24] border border-slate-800 rounded-xl relative overflow-hidden group">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Overall Mastery
              </div>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B91] via-[#FF9B45] to-[#20D9D2] tabular-nums mt-1">
                {progress.completionPercentage}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Total state exploration</div>
              {/* Subtle neon glow bottom bar */}
              <div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#FF3B91] to-[#20D9D2] transition-all duration-500"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>

            {/* Total Locations */}
            <div className="p-4 bg-[#191B24] border border-slate-800 rounded-xl">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Cataloged POIs
              </div>
              <div className="text-3xl font-extrabold text-white tabular-nums mt-1">
                {progress.total}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Active map coordinates</div>
            </div>

            {/* Discovered */}
            <div className="p-4 bg-[#191B24] border border-slate-800 rounded-xl">
              <div className="text-[11px] font-mono text-emerald-400 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Discovered
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 tabular-nums mt-1">
                {progress.discovered}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Completed & logged</div>
            </div>

            {/* Undiscovered */}
            <div className="p-4 bg-[#191B24] border border-slate-800 rounded-xl">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1">
                <Circle className="w-3 h-3" /> Remaining
              </div>
              <div className="text-3xl font-extrabold text-slate-300 tabular-nums mt-1">
                {progress.undiscovered}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Uncharted secrets</div>
            </div>
          </div>

          {/* Category Progress Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Category Exploration Breakdown
              </h3>
              <span className="text-xs text-slate-400">Click a category to focus on map</span>
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
                    className="p-3.5 bg-[#191B24] hover:bg-[#202330] border border-slate-800 rounded-xl text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span className="text-xs font-bold text-white group-hover:text-[#20D9D2] transition-colors">
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono tabular-nums text-slate-300">
                          {cat.discovered} / {cat.total}
                        </span>
                        <span
                          className="text-xs font-bold font-mono tabular-nums"
                          style={{ color: meta.color }}
                        >
                          {cat.percentage}%
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#101116] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: meta.color,
                          boxShadow: `0 0 8px ${meta.color}`,
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
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-3">
              Sector Exploration Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {progress.regionBreakdown.map((reg) => (
                <div
                  key={reg.region}
                  className="p-3 bg-[#191B24] border border-slate-800/80 rounded-xl"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200 truncate">{reg.name}</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {reg.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#101116] rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-[#20D9D2] rounded-full transition-all duration-300"
                      style={{ width: `${reg.percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {reg.discovered} of {reg.total} found
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Progress Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Discovery state is saved locally in your browser.
            </div>
            <button
              onClick={() => {
                if (confirm('Reset all discovered markers back to default sample state?')) {
                  onResetProgress();
                  playSound('toggle', soundEffects);
                }
              }}
              className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
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
