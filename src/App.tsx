import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { BerandaPage } from './components/BerandaPage';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { PeralatanPage } from './components/PeralatanPage';
import { ProfilPage } from './components/ProfilPage';
import { ProfilePreviewModal } from './components/ProfilePreviewModal';
import { StrukturPage } from './components/StrukturPage';
import { ToastContainer } from './components/Toast';
import { ToolOptionsModal } from './components/ToolOptionsModal';
import {
  PageId,
  RankRole,
  SharedProfileData,
  ThemeMode,
  ToastItem,
  UserProfile,
} from './types/nexus';

const DEFAULT_USER: UserProfile = {
  logged: false,
  name: 'Member',
  code: '',
  pangkat: 'MEMBER',
  avatar: '',
  bio: 'Member resmi Nexus Creator Community.',
  tiktok: '#',
  youtube: '#',
  tagId: 'NX-000000',
};

function readInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem('nexus_theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore storage errors
  }
  return 'dark';
}

function readInitialUser(): UserProfile {
  try {
    const logged = localStorage.getItem('nexus_logged') === 'true';
    if (!logged) return DEFAULT_USER;
    const pangkat = (localStorage.getItem('nexus_pangkat') as RankRole) || 'MEMBER';
    return {
      logged: true,
      name: localStorage.getItem('nexus_name') || 'Member',
      code: localStorage.getItem('nexus_code') || '',
      pangkat,
      avatar: localStorage.getItem('nexus_avatar') || '',
      bio:
        localStorage.getItem('nexus_bio') ||
        'Member resmi Nexus Creator Community.',
      tiktok: localStorage.getItem('nexus_tiktok') || '#',
      youtube: localStorage.getItem('nexus_youtube') || '#',
      tagId: localStorage.getItem('nexus_tagid') || 'NX-000000',
    };
  } catch {
    return DEFAULT_USER;
  }
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);
  const [user, setUser] = useState<UserProfile>(readInitialUser);
  const [activePage, setActivePage] = useState<PageId>('beranda');
  const [toolModalKey, setToolModalKey] = useState<'intro' | 'wm' | null>(null);
  const [previewData, setPreviewData] = useState<
    (SharedProfileData & { avatar?: string }) | null
  >(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback(
    (message: string, variant: ToastItem['variant'] = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3400);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync HTML .dark class and persist theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('nexus_theme', theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  // Parse #/share/... URL hash
  const checkShareHash = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/share/')) {
      try {
        const encrypted = hash.replace('#/share/', '');
        const decoded = decodeURIComponent(atob(encrypted));
        const parsed = JSON.parse(decoded) as SharedProfileData;
        setPreviewData({
          name: parsed.name || 'Anggota Nexus',
          pangkat: parsed.pangkat || 'MEMBER',
          bio: parsed.bio || 'Belum ada deskripsi / bio.',
          tagid: parsed.tagid || 'NX-000000',
          tiktok: parsed.tiktok || '#',
          youtube: parsed.youtube || '#',
        });
      } catch {
        notify('Tautan profil tidak valid atau rusak.', 'error');
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [notify]);

  useEffect(() => {
    checkShareHash();
    window.addEventListener('hashchange', checkShareHash);
    return () => window.removeEventListener('hashchange', checkShareHash);
  }, [checkShareHash]);

  const handleToggleTheme = (target?: ThemeMode) => {
    setTheme((prev) => (target ? target : prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (payload: {
    name: string;
    code: string;
    pangkat: RankRole;
    avatar: string;
  }) => {
    const tagId = 'NX-' + Math.floor(100000 + Math.random() * 900000);
    const nextUser: UserProfile = {
      logged: true,
      name: payload.name,
      code: payload.code,
      pangkat: payload.pangkat,
      avatar: payload.avatar,
      bio: 'Member resmi Nexus Creator Community.',
      tiktok: '#',
      youtube: '#',
      tagId,
    };

    try {
      localStorage.setItem('nexus_logged', 'true');
      localStorage.setItem('nexus_name', nextUser.name);
      localStorage.setItem('nexus_code', nextUser.code);
      localStorage.setItem('nexus_pangkat', nextUser.pangkat);
      localStorage.setItem('nexus_avatar', nextUser.avatar);
      localStorage.setItem('nexus_bio', nextUser.bio);
      localStorage.setItem('nexus_tiktok', nextUser.tiktok);
      localStorage.setItem('nexus_youtube', nextUser.youtube);
      localStorage.setItem('nexus_tagid', nextUser.tagId);
    } catch {
      // Ignore storage quota warnings
    }

    setUser(nextUser);
    notify(`Selamat datang, ${nextUser.name}!`, 'success');
  };

  const handleSaveProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('nexus_name', next.name);
        localStorage.setItem('nexus_code', next.code);
        localStorage.setItem('nexus_pangkat', next.pangkat);
        localStorage.setItem('nexus_avatar', next.avatar);
        localStorage.setItem('nexus_bio', next.bio);
        localStorage.setItem('nexus_tiktok', next.tiktok);
        localStorage.setItem('nexus_youtube', next.youtube);
        localStorage.setItem('nexus_tagid', next.tagId);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleShareProfile = async () => {
    const shareData: SharedProfileData = {
      name: user.name,
      pangkat: user.pangkat,
      bio: user.bio,
      tagid: user.tagId,
      tiktok: user.tiktok,
      youtube: user.youtube,
    };

    const base64Data = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const baseUrl = window.location.href.split('#')[0];
    const shareUrl = `${baseUrl}#/share/${base64Data}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil ${shareData.name} — Nexus Creator Community`,
          text: `Cek profil ${shareData.name} (${shareData.pangkat}) di Website Nexus Creator Community!`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if user cancels native share or unsupported in iframe
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      notify('Link profil berhasil disalin ke clipboard.', 'success');
    } catch {
      notify('Gagal menyalin link profil.', 'error');
    }
  };

  const handlePreviewOwnProfile = () => {
    setPreviewData({
      name: user.name,
      pangkat: user.pangkat,
      bio: user.bio,
      tagid: user.tagId,
      tiktok: user.tiktok,
      youtube: user.youtube,
      avatar: user.avatar,
    });
  };

  const handleClosePreview = () => {
    setPreviewData(null);
    if (window.location.hash.startsWith('#/share/')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('nexus_logged');
      localStorage.removeItem('nexus_name');
      localStorage.removeItem('nexus_code');
      localStorage.removeItem('nexus_pangkat');
      localStorage.removeItem('nexus_avatar');
      localStorage.removeItem('nexus_bio');
      localStorage.removeItem('nexus_tiktok');
      localStorage.removeItem('nexus_youtube');
      localStorage.removeItem('nexus_tagid');
    } catch {
      // Ignore storage errors
    }
    setUser(DEFAULT_USER);
    setActivePage('beranda');
    notify('Akun telah direset. Silakan masuk kembali.', 'info');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col relative selection:bg-amber-500/25">
        <div className="nexus-backdrop" aria-hidden="true" />

        <Header
          activePage={activePage}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={() => handleToggleTheme()}
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activePage === 'beranda' && (
                <BerandaPage user={user} onNavigate={handleNavigate} />
              )}
              {activePage === 'peralatan' && (
                <PeralatanPage onOpenToolModal={(key) => setToolModalKey(key)} />
              )}
              {activePage === 'struktur' && <StrukturPage />}
              {activePage === 'profil' && (
                <ProfilPage
                  user={user}
                  theme={theme}
                  onToggleTheme={(mode) => handleToggleTheme(mode)}
                  onSaveProfile={handleSaveProfile}
                  onShareProfile={handleShareProfile}
                  onPreviewOwnProfile={handlePreviewOwnProfile}
                  onLogout={handleLogout}
                  onNotify={notify}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="hidden md:block border-t border-zinc-900/6 dark:border-white/6 py-6">
          <div className="max-w-6xl mx-auto px-8 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Nexus Creator Community · Marga Resmi NexusFams</span>
            <span>Penyimpanan profil bersifat lokal pada perangkat Anda</span>
          </div>
        </footer>

        <BottomNav activePage={activePage} onNavigate={handleNavigate} />

        {/* Modals & Overlays */}
        {!user.logged && !previewData && (
          <LoginModal
            theme={theme}
            onToggleTheme={() => handleToggleTheme()}
            onSuccess={handleLoginSuccess}
          />
        )}

        <ToolOptionsModal
          toolKey={toolModalKey}
          onClose={() => setToolModalKey(null)}
          onNotify={notify}
        />

        <ProfilePreviewModal
          data={previewData}
          onClose={handleClosePreview}
        />

        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </MotionConfig>
  );
}
