import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Clapperboard,
  Heart,
  Layers,
  Lock,
  Pin,
  Sparkles,
  Type,
} from 'lucide-react';
import { CHAT_THREADS, TOOLS_LIST } from '../data/nexusData';
import { ToolItem } from '../types/nexus';

interface PeralatanPageProps {
  onOpenToolModal: (key: 'intro' | 'wm') => void;
}

export function PeralatanPage({ onOpenToolModal }: PeralatanPageProps) {
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getToolIcon = (icon: ToolItem['icon']) => {
    switch (icon) {
      case 'clapperboard':
        return Clapperboard;
      case 'layers':
        return Layers;
      case 'type':
        return Type;
      case 'sparkles':
        return Sparkles;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Peralatan Marga */}
      <section className="lg:col-span-5 space-y-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
            Peralatan Marga
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Kumpulan preset, watermark, font, dan aset Alight Motion resmi NexusFams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {TOOLS_LIST.map((tool, index) => {
            const Icon = getToolIcon(tool.icon);
            const cardClasses =
              'group glass-surface rounded-2xl p-5 flex flex-col justify-between gap-4 text-left hover:border-amber-600/35 dark:hover:border-amber-400/35 active:scale-[0.98] transition-all min-h-[138px]';

            if (tool.type === 'modal' && tool.modalKey) {
              return (
                <motion.button
                  key={tool.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  onClick={() => onOpenToolModal(tool.modalKey!)}
                  className={cardClasses}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/12 dark:bg-amber-400/12 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-zinc-950 dark:text-white">
                      {tool.title}
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {tool.subtitle}
                    </p>
                  </div>
                </motion.button>
              );
            }

            return (
              <motion.a
                key={tool.id}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={cardClasses}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/12 dark:bg-amber-400/12 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-zinc-950 dark:text-white">
                    {tool.title}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {tool.subtitle}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* Right Column: Chat Global */}
      <section className="lg:col-span-7 space-y-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
            Chat Global
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Catatan diskusi pengurus dan pengumuman di papan obrolan marga.
          </p>
        </div>

        <div className="space-y-3.5">
          {CHAT_THREADS.map((thread, idx) => {
            const isLiked = Boolean(likedIds[thread.id]);
            const displayLikes =
              thread.likes !== undefined
                ? thread.likes + (isLiked ? 1 : 0)
                : undefined;

            return (
              <motion.article
                key={thread.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className={`glass-surface rounded-2xl p-5 space-y-3 ${
                  thread.pinned
                    ? 'border-amber-600/35 dark:border-amber-400/35 bg-amber-500/[0.04] dark:bg-amber-400/[0.04]'
                    : ''
                }`}
              >
                {thread.pinned && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    <Pin className="w-3.5 h-3.5" />
                    <span>Disematkan oleh Owner</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-display font-bold text-zinc-950 dark:text-white">
                    {thread.author}
                  </span>
                  <span aria-hidden="true" className="text-zinc-400">
                    ·
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      thread.role === 'owner'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {thread.roleLabel}
                  </span>
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {thread.text}
                </p>

                {displayLikes !== undefined && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toggleLike(thread.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium min-h-[36px] px-2.5 -ml-2.5 rounded-lg transition-colors ${
                        isLiked
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400'
                      }`}
                    >
                      <Heart
                        className="w-3.5 h-3.5"
                        fill={isLiked ? 'currentColor' : 'none'}
                      />
                      <span className="font-mono-tabular">
                        {displayLikes} Menyukai
                      </span>
                    </button>
                  </div>
                )}

                {thread.replies && thread.replies.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-zinc-900/8 dark:border-white/8 space-y-2.5">
                    {thread.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-xl px-3.5 py-2.5 bg-zinc-900/[0.03] dark:bg-white/[0.03] border border-zinc-900/6 dark:border-white/6 space-y-1"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {reply.author}
                          </span>
                          <span aria-hidden="true" className="text-zinc-400">
                            ·
                          </span>
                          <span
                            className={`font-semibold ${
                              reply.role === 'owner'
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {reply.roleLabel}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.article>
            );
          })}

          <div className="glass-surface rounded-2xl px-4 py-3.5 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Tombol pesan telah dinonaktifkan oleh Owner.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
