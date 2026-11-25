import { AnimatePresence, motion } from 'motion/react';
import { Disc3, Heart, Maximize2, Pause, Play, X } from 'lucide-react';
import { MusicTrack } from '../types/nexus';
import { formatDuration } from '../utils/audio';

interface MusicMiniPlayerProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isFavorite: boolean;
  hidden?: boolean;
  onTogglePlay: () => void;
  onToggleFavorite: (trackId: string) => void;
  onOpenDetail: () => void;
  onClosePlayer: () => void;
}

export function MusicMiniPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  isFavorite,
  hidden = false,
  onTogglePlay,
  onToggleFavorite,
  onOpenDetail,
  onClosePlayer,
}: MusicMiniPlayerProps) {
  const progressPercent =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <AnimatePresence>
      {track && !hidden && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-[82px] md:bottom-5 left-0 right-0 z-30 px-3 sm:px-4 pointer-events-none"
        >
          <div className="pointer-events-auto max-w-md md:max-w-xl mx-auto glass-surface-elevated rounded-2xl overflow-hidden shadow-2xl">
            {/* Slim Top Progress Track */}
            <div className="h-0.5 w-full bg-zinc-900/10 dark:bg-white/10">
              <div
                className="h-full bg-amber-600 dark:bg-amber-400 transition-[width] duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="px-3 py-2 flex items-center gap-2.5 sm:gap-3">
              {/* Clickable Track Area -> Opens Full Now Playing View */}
              <button
                type="button"
                onClick={onOpenDetail}
                className="flex-1 min-w-0 flex items-center gap-3 text-left rounded-xl py-1 px-1 hover:bg-zinc-900/[0.03] dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/25 via-zinc-900 to-zinc-950 dark:from-amber-400/25 dark:via-zinc-800 dark:to-black border border-amber-500/35 flex items-center justify-center shrink-0 ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={isPlaying ? { animationDuration: '5s' } : undefined}
                >
                  <Disc3 className="w-5 h-5 text-amber-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-xs sm:text-sm font-bold text-zinc-950 dark:text-white truncate">
                    {track.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate font-mono-tabular">
                    {duration > 0
                      ? `${formatDuration(currentTime)} / ${formatDuration(duration)}`
                      : track.artist}
                  </p>
                </div>
              </button>

              {/* Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(track.id)}
                  aria-label={isFavorite ? 'Hapus dari favorit' : 'Favoritkan lagu'}
                  className={`min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center transition-colors ${
                    isFavorite
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400'
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isFavorite ? 'currentColor' : 'none'}
                  />
                </button>

                <button
                  type="button"
                  onClick={onTogglePlay}
                  aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
                  className="min-w-[42px] min-h-[42px] rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 flex items-center justify-center active:scale-95 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={onOpenDetail}
                  aria-label="Perluas tampilan musik"
                  className="hidden sm:flex min-w-[40px] min-h-[40px] rounded-xl items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/6 dark:hover:bg-white/8 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClosePlayer}
                  aria-label="Tutup pemutar musik"
                  className="min-w-[36px] min-h-[40px] rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
