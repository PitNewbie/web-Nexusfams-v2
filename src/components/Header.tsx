import { Moon, Music2, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { PageId, ThemeMode } from '../types/nexus';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isPlayingMusic?: boolean;
}

const NAV_LINKS: { id: PageId; label: string; featured?: boolean }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'peralatan', label: 'Peralatan' },
  { id: 'music', label: 'Music', featured: true },
  { id: 'struktur', label: 'Struktur' },
  { id: 'profil', label: 'Profil' },
];

export function Header({
  activePage,
  onNavigate,
  theme,
  onToggleTheme,
  isPlayingMusic = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 md:h-16 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-900/8 dark:border-white/8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('beranda')}
          className="font-display text-lg md:text-xl font-extrabold tracking-tight whitespace-nowrap shrink-0 bg-gradient-to-r from-amber-700 via-amber-600 to-zinc-900 dark:from-amber-300 dark:via-amber-200 dark:to-white bg-clip-text text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg px-1"
        >
          NexusFams
        </button>

        {/* Zone 2: Desktop Single-Line Text Navigation with Music centered */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activePage === link.id;
            if (link.featured) {
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className={`relative min-h-[38px] px-4 py-1.5 rounded-xl flex items-center gap-2 whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isActive
                      ? 'bg-amber-600 text-white dark:bg-amber-400 dark:text-zinc-950 font-bold shadow-sm'
                      : 'glass-surface text-zinc-900 dark:text-zinc-100 hover:border-amber-600/40 dark:hover:border-amber-400/40 font-semibold'
                  }`}
                >
                  <Music2
                    className={`w-4 h-4 ${
                      isPlayingMusic ? 'animate-spin' : ''
                    }`}
                    style={
                      isPlayingMusic ? { animationDuration: '4s' } : undefined
                    }
                  />
                  <span>{link.label}</span>
                </button>
              );
            }

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md ${
                  isActive
                    ? 'text-zinc-950 dark:text-white font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="desktopNavUnderline"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-amber-600 dark:bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Theme Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'
            }
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl glass-surface flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-amber-600/35 dark:hover:border-amber-400/35 active:scale-[0.97] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-700" />
                <span>Gelap</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
   }
   
