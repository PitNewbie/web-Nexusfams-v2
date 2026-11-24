import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Crown,
  Megaphone,
  MessageSquareMore,
  Server,
  UserX,
} from 'lucide-react';
import { ANNOUNCEMENTS, OFFICIAL_ACCOUNTS } from '../data/nexusData';
import { Announcement, PageId, UserProfile } from '../types/nexus';

interface BerandaPageProps {
  user: UserProfile;
  onNavigate: (page: PageId) => void;
}

type CategoryFilter = 'Semua' | Announcement['category'];

const FILTERS: CategoryFilter[] = ['Semua', 'Informasi', 'Penting', 'Pengumuman'];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function BerandaPage({ user, onNavigate }: BerandaPageProps) {
  const [filter, setFilter] = useState<CategoryFilter>('Semua');

  const filteredAnnouncements =
    filter === 'Semua'
      ? ANNOUNCEMENTS
      : ANNOUNCEMENTS.filter((item) => item.category === filter);

  const getAnnouncementIcon = (icon: Announcement['icon']) => {
    switch (icon) {
      case 'user-slash':
        return UserX;
      case 'megaphone':
        return Megaphone;
      case 'server':
        return Server;
    }
  };

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Top Split Hero + Official Channels */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Hero Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 glass-surface rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-amber-500/12 dark:bg-amber-400/12 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300">
              <Crown className="w-4 h-4 shrink-0" />
              <span>Komunitas Resmi</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular uppercase">{user.pangkat}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-balance text-zinc-950 dark:text-white leading-tight">
              Nexus Creator Community
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              Halo, <span className="font-semibold text-zinc-900 dark:text-white">{user.name || 'Kreator'}</span>. Selamat datang di website resmi marga{' '}
              <span className="font-semibold text-amber-800 dark:text-amber-300">
                Nexus Creator Community
              </span>
              . Di sini tersedia kebutuhan aset kreator, peralatan marga, serta informasi terbaru untuk seluruh anggota.
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-5 border-t border-zinc-900/8 dark:border-white/8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('peralatan')}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-semibold text-sm flex items-center gap-2 shadow-sm active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
            >
              <span>Buka Peralatan Marga</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('profil')}
              className="min-h-[44px] px-4 py-2.5 rounded-xl glass-surface text-zinc-800 dark:text-zinc-200 hover:border-amber-600/35 dark:hover:border-amber-400/35 font-semibold text-sm active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
            >
              Pengaturan Profil
            </button>
          </div>
        </motion.div>

        {/* Official Accounts Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 glass-surface rounded-3xl p-6 sm:p-7 flex flex-col justify-between"
        >
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
              Akun Official Marga
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Ikuti kanal resmi NexusFams untuk pengumuman, event, dan kolaborasi.
            </p>
          </div>

          <div className="mt-5 space-y-2.5">
            {OFFICIAL_ACCOUNTS.map((acc) => {
              const accentClass =
                acc.id === 'tiktok'
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                  : acc.id === 'discord'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                  : 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10';

              return (
                <a
                  key={acc.id}
                  href={acc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group min-h-[56px] rounded-2xl px-4 py-3 border border-zinc-900/8 dark:border-white/8 bg-white/40 dark:bg-white/[0.03] hover:bg-white/80 dark:hover:bg-white/[0.07] hover:border-amber-600/30 dark:hover:border-amber-400/30 flex items-center justify-between gap-3 transition-all duration-150 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accentClass}`}
                    >
                      {acc.id === 'tiktok' && <TikTokIcon className="w-5 h-5" />}
                      {acc.id === 'discord' && <DiscordIcon className="w-5 h-5" />}
                      {acc.id === 'whatsapp' && (
                        <MessageSquareMore className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {acc.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {acc.handle}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Papan Informasi Marga */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              Papan Informasi Marga
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
              Catatan pembaruan pengurus dan pengumuman penting komunitas.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter kategori pengumuman"
            className="inline-flex items-center gap-1 p-1 rounded-xl glass-surface self-start sm:self-auto overflow-x-auto max-w-full"
          >
            {FILTERS.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat)}
                  className={`relative min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'text-zinc-950 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="announcementFilterPill"
                      transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-900/6 dark:border-white/10"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAnnouncements.map((item, idx) => {
            const Icon = getAnnouncementIcon(item.icon);
            const iconTint =
              item.category === 'Penting'
                ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                : item.category === 'Pengumuman'
                ? 'text-amber-700 dark:text-amber-300 bg-amber-500/12'
                : 'text-zinc-700 dark:text-zinc-300 bg-zinc-900/6 dark:bg-white/8';

            return (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="glass-surface rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-amber-600/25 dark:hover:border-amber-400/25 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <span
                        className={
                          item.category === 'Penting'
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : 'text-amber-700 dark:text-amber-300 font-semibold'
                        }
                      >
                        {item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.date}</span>
                    </div>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconTint}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-zinc-950 dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                    {item.desc}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
