import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  Disc3,
  Heart,
  Pause,
  Pin,
  Play,
  Repeat,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MusicTrack } from '../types/nexus';
import { formatDuration } from '../utils/audio';

interface MusicDetailModalProps {
  open: boolean;
  track: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLooping: boolean;
  isMuted: boolean;
  volume: number;
  isFavorite: boolean;
  isPinnedOnProfile: boolean;
  onClose: () => void;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkip: (deltaSeconds: number) => void;
  onToggleLoop: () => void;
  onToggleMute: () => void;
  onVolumeChange: (val: number) => void;
  onToggleFavorite: (trackId: string) => void;
  onPinToProfile: (trackId: string) => void;
}

export function MusicDetailModal({
  open,
  track,
  isPlaying,
  currentTime,
  duration,
  isLooping,
  isMuted,
  volume,
  isFavorite,
  isPinnedOnProfile,
  onClose,
  onTogglePlay,
  onSeek,
  onSkip,
  onToggleLoop,
  onToggleMute,
  onVolumeChange,
  onToggleFavorite,
  onPinToProfile,
}: MusicDetailModalProps) {
  return (
    <AnimatePresence>
      {open && track && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-zinc-950/65 dark:bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Pemutar musik ${track.title}`}
            className="w-full sm:max-w-lg glass-surface-elevated rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden max-h-[94vh] overflow-y-auto"
          >
            {/* Ambient Gold Glow */}
            <div
              aria-hidden="true"
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-amber-500/18 dark:bg-amber-400/15 blur-3xl pointer-events-none"
            />

            {/* Top Sheet Header */}
            <div className="relative z-10 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                aria-label="Perkecil pemutar"
                className="min-w-[42px] min-h-[42px] rounded-xl glass-surface flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:border-amber-600/35 dark:hover:border-amber-400/35 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

              <div className="text-center">
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  Sedang Diputar
                </p>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  NexusFams Music
                </p>
              </div>

              <button
                type="button"
                onClick={() => onToggleFavorite(track.id)}
                aria-label={isFavorite ? 'Hapus favorit' : 'Tambah favorit'}
                className={`min-w-[42px] min-h-[42px] rounded-xl glass-surface flex items-center justify-center transition-colors ${
                  isFavorite
                    ? 'text-rose-600 dark:text-rose-400 border-rose-500/35'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Large Spinning Vinyl / Cover Stage */}
            <div className="relative z-10 flex flex-col items-center py-2">
              <div className="w-52 h-52 sm:w-56 sm:h-56 rounded-full p-3 glass-surface shadow-2xl flex items-center justify-center">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br from-zinc-800 via-zinc-950 to-black border-2 border-amber-500/40 flex items-center justify-center relative ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={isPlaying ? { animationDuration: '8s' } : undefined}
                >
                  <div className="absolute inset-4 rounded-full border border-white/10" />
                  <div className="absolute inset-9 rounded-full border border-white/5" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                    <Disc3 className="w-9 h-9 text-zinc-950" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="relative z-10 text-center space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-white text-balance">
                {track.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                {track.artist} · {track.category}
                {track.year ? ` · ${track.year}` : ''}
              </p>
            </div>

            {/* Progress Slider */}
            <div className="relative z-10 space-y-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={Math.min(currentTime, duration || 100)}
                onChange={(e) => onSeek(Number(e.target.value))}
                aria-label="Posisi lagu"
                className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer h-1.5 rounded-full"
              />
              <div className="flex items-center justify-between text-xs font-mono-tabular text-zinc-500 dark:text-zinc-400">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Main Transport Controls */}
            <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={onToggleLoop}
                aria-label={isLooping ? 'Matikan ulangi lagu' : 'Ulangi lagu'}
                className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors ${
                  isLooping
                    ? 'text-amber-700 dark:text-amber-300 bg-amber-500/15'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onSkip(-10)}
                aria-label="Mundur 10 detik"
                className="min-w-[44px] min-h-[44px] rounded-xl glass-surface flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:border-amber-600/35 dark:hover:border-amber-400/35 active:scale-95 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Jeda lagu' : 'Putar lagu'}
                className="w-16 h-16 rounded-2xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 flex items-center justify-center shadow-lg active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7" fill="currentColor" />
                ) : (
                  <Play className="w-7 h-7 ml-0.5" fill="currentColor" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onSkip(10)}
                aria-label="Maju 10 detik"
                className="min-w-[44px] min-h-[44px] rounded-xl glass-surface flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:border-amber-600/35 dark:hover:border-amber-400/35 active:scale-95 transition-all"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-500" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Volume + Pin to Profile Row */}
            <div className="relative z-10 pt-3 border-t border-zinc-900/8 dark:border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 w-full sm:w-44">
                <Volume2 className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  aria-label="Volume suara"
                  className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer h-1.5"
                />
              </div>

              <button
                type="button"
                onClick={() => onPinToProfile(track.id)}
                className={`w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isPinnedOnProfile
                    ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-600/35 dark:border-amber-400/35'
                    : 'glass-surface text-zinc-800 dark:text-zinc-200 hover:border-amber-600/35 dark:hover:border-amber-400/35'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                <span>
                  {isPinnedOnProfile ? 'Dipajang di Profil' : 'Pajang di Profil'}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
