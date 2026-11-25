import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Disc3,
  Heart,
  Maximize2,
  Music2,
  Pause,
  Pin,
  Play,
  Sparkles,
} from 'lucide-react';
import { MUSIC_TRACKS } from '../data/nexusData';
import { MusicTrack } from '../types/nexus';
import { formatDuration } from '../utils/audio';

interface MusicPageProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  favoriteIds: string[];
  pinnedTrackId: string;
  onSelectTrack: (track: MusicTrack, openDetail?: boolean) => void;
  onTogglePlay: () => void;
  onToggleFavorite: (trackId: string) => void;
  onPinToProfile: (trackId: string) => void;
  onOpenDetail: () => void;
}

export function MusicPage({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  favoriteIds,
  pinnedTrackId,
  onSelectTrack,
  onTogglePlay,
  onToggleFavorite,
  onPinToProfile,
  onOpenDetail,
}: MusicPageProps) {
  const [tab, setTab] = useState<'all' | 'favorites'>('all');

  const visibleTracks =
    tab === 'all'
      ? MUSIC_TRACKS
      : MUSIC_TRACKS.filter((t) => favoriteIds.includes(t.id));

  const activeTrack = currentTrack ?? MUSIC_TRACKS[0];
  const isActiveTrackPlaying =
    Boolean(currentTrack && currentTrack.id === activeTrack?.id && isPlaying);

  return (
    <div className="space-y-7">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
            <Music2 className="w-3.5 h-3.5" />
            <span>Koleksi Audio Komunitas</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">
            Musik Marga
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Putar musik resmi marga, buka tampilan pemutar penuh, atau jadikan lagu favorit di profil Anda.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter daftar musik"
          className="inline-flex items-center gap-1 p-1 rounded-xl glass-surface self-start sm:self-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'all'}
            onClick={() => setTab('all')}
            className={`relative min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              tab === 'all'
                ? 'text-zinc-950 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {tab === 'all' && (
              <motion.span
                layoutId="musicTabPill"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-900/6 dark:border-white/10"
              />
            )}
            <span className="relative z-10">
              Semua Lagu ({MUSIC_TRACKS.length})
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'favorites'}
            onClick={() => setTab('favorites')}
            className={`relative min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              tab === 'favorites'
                ? 'text-zinc-950 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {tab === 'favorites' && (
              <motion.span
                layoutId="musicTabPill"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-900/6 dark:border-white/10"
              />
            )}
            <span className="relative z-10">
              Favorit ({favoriteIds.length})
            </span>
          </button>
        </div>
      </div>

      {/* Main Split: Featured Stage + Track List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active / Featured Music Card */}
        {activeTrack && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-5 relative overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/15 dark:bg-amber-400/15 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentTrack ? 'Sedang Diputar' : 'Rilisan Perdana'}</span>
              </span>
              {currentTrack && duration > 0 && (
                <span className="font-mono-tabular">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </span>
              )}
            </div>

            {/* Disc Visual */}
            <div className="relative z-10 flex flex-col items-center py-2">
              <button
                type="button"
                onClick={() => {
                  if (!currentTrack || currentTrack.id !== activeTrack.id) {
                    onSelectTrack(activeTrack, true);
                  } else {
                    onOpenDetail();
                  }
                }}
                aria-label="Buka tampilan dalam musik"
                className="group relative w-40 h-40 rounded-full p-2 glass-surface-elevated flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br from-zinc-800 via-zinc-950 to-zinc-900 dark:from-zinc-800 dark:via-black dark:to-zinc-900 border border-amber-500/35 flex items-center justify-center shadow-inner ${
                    isActiveTrackPlaying ? 'animate-spin' : ''
                  }`}
                  style={
                    isActiveTrackPlaying
                      ? { animationDuration: '7s' }
                      : undefined
                  }
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                    <Disc3 className="w-7 h-7 text-zinc-950" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-9 h-9 rounded-xl glass-surface-elevated flex items-center justify-center text-zinc-800 dark:text-zinc-100 group-hover:scale-105 transition-transform">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </button>
            </div>

            <div className="relative z-10 text-center space-y-1">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white text-balance">
                {activeTrack.title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {activeTrack.artist} · {activeTrack.category}
                {activeTrack.year ? ` · ${activeTrack.year}` : ''}
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (!currentTrack || currentTrack.id !== activeTrack.id) {
                    onSelectTrack(activeTrack, false);
                  } else {
                    onTogglePlay();
                  }
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                {isActiveTrackPlaying ? (
                  <>
                    <Pause className="w-4 h-4" fill="currentColor" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" fill="currentColor" />
                    <span>Putar Lagu</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!currentTrack || currentTrack.id !== activeTrack.id) {
                    onSelectTrack(activeTrack, true);
                  } else {
                    onOpenDetail();
                  }
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-xl glass-surface text-zinc-900 dark:text-white hover:border-amber-600/35 dark:hover:border-amber-400/35 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Tampilan Penuh</span>
              </button>
            </div>
          </motion.section>
        )}

        {/* Right: Track Catalog List */}
        <section className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
              {tab === 'all' ? 'Daftar Musik' : 'Musik Favorit Anda'}
            </h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono-tabular">
              {visibleTracks.length} lagu
            </span>
          </div>

          {visibleTracks.length === 0 ? (
            <div className="glass-surface rounded-3xl p-8 text-center space-y-3">
              <Heart className="w-8 h-8 text-zinc-400 mx-auto" />
              <div className="space-y-1">
                <p className="font-display text-base font-bold text-zinc-900 dark:text-white">
                  Belum ada musik favorit
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Ketuk ikon hati pada lagu untuk menambahkannya ke favorit dan memajangnya di profil Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTab('all')}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 text-xs font-semibold transition-colors"
              >
                Lihat Semua Lagu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleTracks.map((track, idx) => {
                const isSelected = currentTrack?.id === track.id;
                const isTrackPlaying = isSelected && isPlaying;
                const isFav = favoriteIds.includes(track.id);
                const isPinned = pinnedTrackId === track.id;

                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: idx * 0.04 }}
                    className={`glass-surface rounded-2xl p-4 sm:p-5 transition-all ${
                      isSelected
                        ? 'border-amber-600/45 dark:border-amber-400/45 bg-amber-500/[0.05] dark:bg-amber-400/[0.05]'
                        : 'hover:border-amber-600/30 dark:hover:border-amber-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      {/* Play/Pause Disc Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isSelected) {
                            onSelectTrack(track, false);
                          } else {
                            onTogglePlay();
                          }
                        }}
                        aria-label={
                          isTrackPlaying
                            ? `Jeda ${track.title}`
                            : `Putar ${track.title}`
                        }
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-amber-600 dark:bg-amber-400 text-white dark:text-zinc-950 shadow-md'
                            : 'bg-zinc-900/6 dark:bg-white/8 text-zinc-900 dark:text-white hover:bg-amber-600 hover:text-white dark:hover:bg-amber-400 dark:hover:text-zinc-950'
                        }`}
                      >
                        {isTrackPlaying ? (
                          <Pause className="w-5 h-5" fill="currentColor" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                        )}
                      </button>

                      {/* Track Info (Tap opens full detail player) */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isSelected) {
                            onSelectTrack(track, true);
                          } else {
                            onOpenDetail();
                          }
                        }}
                        className="flex-1 min-w-0 text-left space-y-1 focus-visible:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm sm:text-base font-bold text-zinc-950 dark:text-white truncate">
                            {track.title}
                          </h3>
                          {isTrackPlaying && (
                            <span
                              aria-label="Sedang diputar"
                              className="inline-flex items-end gap-0.5 h-3.5 shrink-0"
                            >
                              <span className="w-0.5 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-bounce" />
                              <span
                                className="w-0.5 h-3.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.15s' }}
                              />
                              <span
                                className="w-0.5 h-2.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.3s' }}
                              />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {track.artist} · {track.category}
                          {isPinned ? ' · Dipajang di Profil' : ''}
                        </p>
                      </button>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(track.id)}
                          aria-label={
                            isFav
                              ? `Hapus ${track.title} dari favorit`
                              : `Tambah ${track.title} ke favorit`
                          }
                          title={isFav ? 'Hapus Favorit' : 'Tambahkan ke Favorit'}
                          className={`min-w-[42px] min-h-[42px] rounded-xl flex items-center justify-center transition-colors ${
                            isFav
                              ? 'text-rose-600 dark:text-rose-400 bg-rose-500/12'
                              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/6 dark:hover:bg-white/8 hover:text-rose-600 dark:hover:text-rose-400'
                          }`}
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={isFav ? 'currentColor' : 'none'}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => onPinToProfile(track.id)}
                          aria-label={
                            isPinned
                              ? 'Lepas pajangan dari profil'
                              : 'Pajang di profil'
                          }
                          title={
                            isPinned ? 'Dipajang di Profil' : 'Pajang di Profil'
                          }
                          className={`min-w-[42px] min-h-[42px] rounded-xl flex items-center justify-center transition-colors ${
                            isPinned
                              ? 'text-amber-700 dark:text-amber-300 bg-amber-500/15'
                              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/6 dark:hover:bg-white/8 hover:text-amber-700 dark:hover:text-amber-300'
                          }`}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
  }
    
