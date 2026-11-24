import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, BadgeCheck, FileText } from 'lucide-react';
import { SharedProfileData } from '../types/nexus';
import { Avatar } from './Avatar';

interface ProfilePreviewModalProps {
  data: (SharedProfileData & { avatar?: string }) | null;
  onClose: () => void;
}

export function ProfilePreviewModal({
  data,
  onClose,
}: ProfilePreviewModalProps) {
  const isVerified =
    data?.pangkat === 'OWNER' || data?.pangkat === 'ADMIN';

  const rankColor =
    data?.pangkat === 'OWNER'
      ? 'text-rose-600 dark:text-rose-400'
      : data?.pangkat === 'ADMIN'
      ? 'text-emerald-700 dark:text-emerald-400'
      : 'text-sky-700 dark:text-sky-400';

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f4f0] dark:bg-[#070709]"
        >
          <div className="nexus-backdrop" aria-hidden="true" />

          {/* Sticky Preview Header */}
          <header className="sticky top-0 z-10 h-14 backdrop-blur-xl bg-white/75 dark:bg-zinc-950/75 border-b border-zinc-900/8 dark:border-white/8">
            <div className="max-w-3xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[40px] px-3 -ml-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:hover:bg-white/8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Kartu Profil NexusFams
              </span>
            </div>
          </header>

          {/* Content */}
          <motion.main
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10"
          >
            <div className="glass-surface-elevated rounded-3xl overflow-hidden">
              <div className="h-36 sm:h-44 bg-gradient-to-br from-amber-500/25 via-amber-400/10 to-zinc-200/40 dark:from-amber-400/20 dark:via-zinc-900 dark:to-zinc-950 border-b border-zinc-900/8 dark:border-white/8" />

              <div className="px-6 sm:px-10 pb-8 -mt-14 text-center space-y-5">
                <Avatar
                  src={data.avatar}
                  name={data.name}
                  sizeClass="w-28 h-28"
                  textClass="text-3xl"
                  className="mx-auto ring-4 ring-[#f5f4f0] dark:ring-[#070709] shadow-xl"
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">
                      {data.name || 'Anggota Nexus'}
                    </h1>
                    {isVerified && (
                      <BadgeCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    <span className={`font-bold ${rankColor}`}>
                      {data.pangkat}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">
                      Tag ID: {data.tagid || 'NX-000000'}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                {(data.tiktok !== '#' || data.youtube !== '#') && (
                  <div className="flex items-center justify-center gap-3 pt-1">
                    {data.tiktok && data.tiktok !== '#' && (
                      <a
                        href={data.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[42px] px-4 py-2 rounded-xl glass-surface text-xs font-semibold text-zinc-900 dark:text-white hover:border-amber-600/40 dark:hover:border-amber-400/40 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>TikTok</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {data.youtube && data.youtube !== '#' && (
                      <a
                        href={data.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[42px] px-4 py-2 rounded-xl glass-surface text-xs font-semibold text-zinc-900 dark:text-white hover:border-amber-600/40 dark:hover:border-amber-400/40 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>YouTube</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Bio / Description */}
                <div className="text-left pt-3 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <FileText className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                    <span>Deskripsi Profil</span>
                  </div>
                  <div className="rounded-2xl p-5 bg-zinc-900/[0.03] dark:bg-white/[0.03] border border-zinc-900/8 dark:border-white/8 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {data.bio || 'Belum ada deskripsi / bio.'}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto min-h-[46px] px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-bold text-sm active:scale-[0.98] transition-all"
                  >
                    Masuk Ke Web Nexus
                  </button>
                </div>
              </div>
            </div>
          </motion.main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
