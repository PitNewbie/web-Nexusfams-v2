import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { BerandaPage } from './components/BerandaPage';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { MusicDetailModal } from './components/MusicDetailModal';
import { MusicMiniPlayer } from './components/MusicMiniPlayer';
import { MusicPage } from './components/MusicPage';
import { PeralatanPage } from './components/PeralatanPage';
import { ProfilPage } from './components/ProfilPage';
import { ProfilePreviewModal } from './components/ProfilePreviewModal';
import { StrukturPage } from './components/StrukturPage';
import { ToastContainer } from './components/Toast';
import { ToolOptionsModal } from './components/ToolOptionsModal';
import { MUSIC_TRACKS } from './data/nexusData';
import {
  MusicTrack,
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
  favoriteTrackId: '',
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
    const pangkat =
      (localStorage.getItem('nexus_pangkat') as RankRole) || 'MEMBER';
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
      favoriteTrackId: localStorage.getItem('nexus_favorite_track_id') || '',
    };
  } catch {
    return DEFAULT_USER;
  }
}

function readInitialFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem('nexus_favorite_tracks');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
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

  // Music Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(
    readInitialFavoriteIds
  );

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

  // Sync Audio Element Volume/Loop/Mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
    audio.loop = isLooping;
  }, [volume, isMuted, isLooping]);

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
          favMusic: parsed.favMusic,
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

  // Audio playback controls
  const playTrack = useCallback(
    async (track: MusicTrack, openDetail = false) => {
      const audio = audioRef.current;
      if (!audio) return;

      const isSameUrl = currentTrack?.url === track.url;
      if (isSameUrl) {
        if (audio.paused) {
          try {
            await audio.play();
            setIsPlaying(true);
          } catch {
            notify('Gagal memutar audio. Coba ketuk lagi.', 'error');
          }
        } else if (!openDetail) {
          audio.pause();
          setIsPlaying(false);
        }
        if (openDetail) setIsDetailOpen(true);
        return;
      }

      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);
      audio.src = track.url;
      audio.load();
      if (openDetail) setIsDetailOpen(true);

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        notify('Gagal memuat streaming audio.', 'error');
      }
    },
    [currentTrack, notify]
  );

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        notify('Gagal memutar audio.', 'error');
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentTrack, notify]);

  const handleSeek = (newTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkip = (deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + deltaSeconds)
    );
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const handleClosePlayer = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setIsDetailOpen(false);
    setCurrentTrack(null);
  };

  const handleToggleFavorite = (trackId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(trackId);
      const next = exists
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];

      try {
        localStorage.setItem('nexus_favorite_tracks', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }

      if (!exists) {
        if (!user.favoriteTrackId) {
          handleSaveProfile({ favoriteTrackId: trackId });
          notify('Ditambahkan ke favorit & dipajang di profil!', 'success');
        } else {
          notify('Ditambahkan ke daftar favorit.', 'success');
        }
      } else {
        if (user.favoriteTrackId === trackId) {
          handleSaveProfile({ favoriteTrackId: next[0] || '' });
        }
        notify('Dihapus dari favorit.', 'info');
      }
      return next;
    });
  };

  const handlePinToProfile = (trackId: string) => {
    const isAlreadyPinned = user.favoriteTrackId === trackId;
    if (isAlreadyPinned) {
      handleSaveProfile({ favoriteTrackId: '' });
      notify('Musik dilepas dari tampilan profil.', 'info');
      return;
    }

    if (!favoriteIds.includes(trackId)) {
      const nextFavs = [...favoriteIds, trackId];
      setFavoriteIds(nextFavs);
      try {
        localStorage.setItem('nexus_favorite_tracks', JSON.stringify(nextFavs));
      } catch {
        // Ignore storage errors
      }
    }
    handleSaveProfile({ favoriteTrackId: trackId });
    notify('Musik favorit dipajang di profil Anda!', 'success');
  };

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
      favoriteTrackId: '',
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
      localStorage.setItem('nexus_favorite_track_id', nextUser.favoriteTrackId);
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
        localStorage.setItem('nexus_favorite_track_id', next.favoriteTrackId);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleShareProfile = async () => {
    const pinnedTrack = MUSIC_TRACKS.find((t) => t.id === user.favoriteTrackId);
    const shareData: SharedProfileData = {
      name: user.name,
      pangkat: user.pangkat,
      bio: user.bio,
      tagid: user.tagId,
      tiktok: user.tiktok,
      youtube: user.youtube,
      favMusic: pinnedTrack
        ? {
            id: pinnedTrack.id,
            title: pinnedTrack.title,
            artist: pinnedTrack.artist,
            url: pinnedTrack.url,
          }
        : undefined,
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
    const pinnedTrack = MUSIC_TRACKS.find((t) => t.id === user.favoriteTrackId);
    setPreviewData({
      name: user.name,
      pangkat: user.pangkat,
      bio: user.bio,
      tagid: user.tagId,
      tiktok: user.tiktok,
      youtube: user.youtube,
      avatar: user.avatar,
      favMusic: pinnedTrack
        ? {
            id: pinnedTrack.id,
            title: pinnedTrack.title,
            artist: pinnedTrack.artist,
            url: pinnedTrack.url,
          }
        : undefined,
    });
  };

  const handleClosePreview = () => {
    setPreviewData(null);
    if (window.location.hash.startsWith('#/share/')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleLogout = () => {
    handleClosePlayer();
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
      localStorage.removeItem('nexus_favorite_track_id');
      localStorage.removeItem('nexus_favorite_tracks');
    } catch {
      // Ignore storage errors
    }
    setFavoriteIds([]);
    setUser(DEFAULT_USER);
    setActivePage('beranda');
    notify('Akun telah direset. Silakan masuk kembali.', 'info');
  };

  const extraBottomPad = currentTrack ? 'pb-40 md:pb-24' : 'pb-28 md:py-10';

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col relative selection:bg-amber-500/25">
        <div className="nexus-backdrop" aria-hidden="true" />

        {/* Persistent Global Audio Element */}
        <audio
          ref={audioRef}
          preload="metadata"
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration || 0);
            }
          }}
          onEnded={() => {
            if (!isLooping) setIsPlaying(false);
          }}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />

        <Header
          activePage={activePage}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={() => handleToggleTheme()}
          isPlayingMusic={isPlaying}
        />

        <main
          className={`flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 ${extraBottomPad}`}
        >
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
              {activePage === 'music' && (
                <MusicPage
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  favoriteIds={favoriteIds}
                  pinnedTrackId={user.favoriteTrackId}
                  onSelectTrack={(track, openDetail) =>
                    playTrack(track, openDetail)
                  }
                  onTogglePlay={togglePlayPause}
                  onToggleFavorite={handleToggleFavorite}
                  onPinToProfile={handlePinToProfile}
                  onOpenDetail={() => setIsDetailOpen(true)}
                />
              )}
              {activePage === 'struktur' && <StrukturPage />}
              {activePage === 'profil' && (
                <ProfilPage
                  user={user}
                  theme={theme}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onToggleTheme={(mode) => handleToggleTheme(mode)}
                  onSaveProfile={handleSaveProfile}
                  onShareProfile={handleShareProfile}
                  onPreviewOwnProfile={handlePreviewOwnProfile}
                  onPlayTrack={(track) => playTrack(track, false)}
                  onOpenMusicPage={() => handleNavigate('music')}
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

        <MusicMiniPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          isFavorite={
            currentTrack ? favoriteIds.includes(currentTrack.id) : false
          }
          hidden={isDetailOpen || Boolean(previewData) || !user.logged}
          onTogglePlay={togglePlayPause}
          onToggleFavorite={handleToggleFavorite}
          onOpenDetail={() => setIsDetailOpen(true)}
          onClosePlayer={handleClosePlayer}
        />

        <BottomNav
          activePage={activePage}
          onNavigate={handleNavigate}
          isPlayingMusic={isPlaying}
        />

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

        <MusicDetailModal
          open={isDetailOpen}
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          isLooping={isLooping}
          isMuted={isMuted}
          volume={volume}
          isFavorite={
            currentTrack ? favoriteIds.includes(currentTrack.id) : false
          }
          isPinnedOnProfile={
            currentTrack ? user.favoriteTrackId === currentTrack.id : false
          }
          onClose={() => setIsDetailOpen(false)}
          onTogglePlay={togglePlayPause}
          onSeek={handleSeek}
          onSkip={handleSkip}
          onToggleLoop={() => setIsLooping((prev) => !prev)}
          onToggleMute={() => setIsMuted((prev) => !prev)}
          onVolumeChange={(val) => {
            setVolume(val);
            if (val > 0 && isMuted) setIsMuted(false);
          }}
          onToggleFavorite={handleToggleFavorite}
          onPinToProfile={handlePinToProfile}
        />

        <ProfilePreviewModal
          data={previewData}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlaySharedMusic={(track) => playTrack(track, false)}
          onClose={handleClosePreview}
        />

        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </MotionConfig>
  );
        }
