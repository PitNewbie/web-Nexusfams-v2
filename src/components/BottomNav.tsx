import { Home, Network, User, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { PageId } from '../types/nexus';

interface BottomNavProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const ITEMS: { id: PageId; label: string; icon: typeof Home }[] = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'peralatan', label: 'Peralatan', icon: Wrench },
  { id: 'struktur', label: 'Struktur', icon: Network },
  { id: 'profil', label: 'Profil', icon: User },
];

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none">
      <nav
        aria-label="Navigasi seluler"
        className="pointer-events-auto max-w-md mx-auto h-15 rounded-2xl glass-nav grid grid-cols-4 items-center px-1.5"
      >
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
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
              <Icon className="relative z-10 w-[19px] h-[19px]" strokeWidth={isActive ? 2.3 : 1.9} />
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
