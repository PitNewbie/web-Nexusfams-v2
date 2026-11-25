import { Home, Music2, Network, User, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { PageId } from '../types/nexus';

interface BottomNavProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  isPlayingMusic?: boolean;
}

const ITEMS: {
  id: PageId;
  label: string;
  icon: typeof Home;
  isCenter?: boolean;
}[] = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'peralatan', label: 'Peralatan', icon: Wrench },
  { id: 'music', label: 'Music', icon: Music2, isCenter: true },
  { id: 'struktur', label: 'Struktur', icon: Network },
  { id: 'profil', label: 'Profil', icon: User },
];

export function BottomNav({
  activePage,
  onNavigate,
  isPlayingMusic = false,
}: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-2.5 left-0 right-0 z-40 px-3 pointer-events-none">
      <nav
        aria-label="Navigasi seluler"
        className="pointer-events-auto max-w-md mx-auto h-16 rounded-2xl glass-nav grid grid-cols-5 items-center px-1"
      >
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="relative flex flex-col items-center justify-center -mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl"
              >
                <motion.div
                  whileTap={{ scale: 0.94 }}
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-500 to-amber-700 dark:from-amber-300 dark:to-amber-500 text-white dark:text-zinc-950 ring-2 ring-amber-400/50'
                      : 'glass-surface-elevated text-amber-700 dark:text-amber-300 border-amber-600/35 dark:border-amber-400/35'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${isPlayingMusic ? 'animate-spin' : ''}`}
                    style={
                      isPlayingMusic ? { animationDuration: '4s' } : undefined
                    }
                    strokeWidth={2.3}
                  />
                </motion.div>
                <span
                  className={`mt-1 text-[10px] font-bold tracking-tight whitespace-nowrap ${
                    isActive
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative min-h-[44px] h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isActive
                  ? 'text-amber-800 dark:text-amber-300'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="mobileNavGlassPill"
                  transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-amber-500/12 dark:bg-amber-400/14 border border-amber-600/20 dark:border-amber-400/20"
                />
              )}
              <Icon
                className="relative z-10 w-[18px] h-[18px]"
                strokeWidth={isActive ? 2.3 : 1.9}
              />
              <span className="relative z-10 text-[10px] font-semibold tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
   }
                
