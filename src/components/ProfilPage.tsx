import { ChangeEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  BadgeCheck,
  Camera,
  Check,
  Copy,
  Disc3,
  Eye,
  KeyRound,
  Link2,
  LogOut,
  Moon,
  Music2,
  Palette,
  Pause,
  Play,
  Share2,
  Shield,
  Sun,
  Trash2,
  UserCog,
} from 'lucide-react';
import { MUSIC_TRACKS, resolveRankFromCode } from '../data/nexusData';
import { MusicTrack, ThemeMode, UserProfile } from '../types/nexus';
import { Avatar } from './Avatar';

interface ProfilPageProps {
  user: UserProfile;
  theme: ThemeMode;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onToggleTheme: (mode: ThemeMode) => void;
  onSaveProfile: (updates: Partial<UserProfile>) => void;
  onShareProfile: () => void;
  onPreviewOwnProfile: () => void;
  onPlayTrack: (track: MusicTrack) => void;
  onOpenMusicPage: () => void;
  onLogout: () => void;
  onNotify: (message: string, variant?: 'success' | 'error' | 'info') => void;
}

type SettingsTab = 'identitas' | 'sosial' | 'tampilan' | 'keamanan';

const SETTINGS_TABS: { id: SettingsTab; label: string; icon: typeof UserCog }[] = [
  { id: 'identitas', label: 'Identitas', icon: UserCog },
  { id: 'sosial', label: 'Sosial Media', icon: Link2 },
  { id: 'tampilan', label: 'Tampilan', icon: Palette },
  { id: 'keamanan', label: 'Keamanan', icon: Shield },
];

export function ProfilPage({
  user,
  theme,
  currentTrack,
  isPlaying,
  onToggleTheme,
  onSaveProfile,
  onShareProfile,
  onPreviewOwnProfile,
  onPlayTrack,
  onOpenMusicPage,
  onLogout,
  onNotify,
}: ProfilPageProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('identitas');
  const [nameInput, setNameInput] = useState(user.name);
  const [bioInput, setBioInput] = useState(user.bio);
  const [avatarDraft, setAvatarDraft] = useState(user.avatar);
  const [favTrackDraft, setFavTrackDraft] = useState(user.favoriteTrackId);
  const [tiktokInput, setTiktokInput] = useState(
    user.tiktok === '#' ? '' : user.tiktok
  );
  const [youtubeInput, setYoutubeInput] = useState(
    user.youtube === '#' ? '' : user.youtube
  );
  const [newRankCode, setNewRankCode] = useState('');
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    setNameInput(user.name);
    setBioInput(user.bio);
    setAvatarDraft(user.avatar);
    setFavTrackDraft(user.favoriteTrackId);
    setTiktokInput(user.tiktok === '#' ? '' : user.tiktok);
    setYoutubeInput(user.youtube === '#' ? '' : user.youtube);
  }, [user]);

  const pinnedMusic = MUSIC_TRACKS.find((t) => t.id === user.favoriteTrackId);
  const isPinnedMusicPlaying = Boolean(
    pinnedMusic && currentTrack?.id === pinnedMusic.id && isPlaying
  );

  const hasUnsavedIdentity =
    nameInput.trim() !== user.name ||
    bioInput.trim() !== user.bio ||
    avatarDraft !== user.avatar ||
    favTrackDraft !== user.favoriteTrackId;

  const hasUnsavedSocial =
    (tiktokInput.trim() || '#') !== user.tiktok ||
    (youtubeInput.trim() || '#') !== user.youtube;

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      onNotify('Ukuran gambar maksimal 3 MB agar tetap ringan.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === 'string') {
        setAvatarDraft(result);
        onNotify('Foto profil siap disimpan.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyTagId = async () => {
    try {
      await navigator.clipboard.writeText(user.tagId);
      setCopiedId(true);
      onNotify('Tag ID disalin ke clipboard.', 'success');
      setTimeout(() => setCopiedId(false), 1800);
    } catch {
      onNotify('Gagal menyalin Tag ID.', 'error');
    }
  };

  const handleSaveIdentity = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      onNotify('Username tidak boleh kosong.', 'error');
      return;
    }
    onSaveProfile({
      name: trimmedName,
      bio: bioInput.trim() || 'Member resmi Nexus Creator Community.',
      avatar: avatarDraft,
      favoriteTrackId: favTrackDraft,
    });
    onNotify('Identitas profil berhasil diperbarui.', 'success');
  };

  const handleSaveSocials = () => {
    onSaveProfile({
      tiktok: tiktokInput.trim() || '#',
      youtube: youtubeInput.trim() || '#',
    });
    onNotify('Tautan sosial media berhasil disimpan.', 'success');
  };

  const handleUpdateRankCode = () => {
    const resolved = resolveRankFromCode(newRankCode);
    if (!resolved) {
      onNotify('Kode pangkat salah atau tidak terdaftar.', 'error');
      return;
    }
    onSaveProfile({
      code: newRankCode.trim(),
      pangkat: resolved,
    });
    setNewRankCode('');
    onNotify(`Pangkat diperbarui menjadi ${resolved}.`, 'success');
  };

  const isVerified = user.pangkat === 'OWNER' || user.pangkat === 'ADMIN';
  const rankAccent =
    user.pangkat === 'OWNER'
      ? 'text-rose-600 dark:text-rose-400'
      : user.pangkat === 'ADMIN'
      ? 'text-emerald-700 dark:text-emerald-400'
      : 'text-sky-700 dark:text-sky-400';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Glass Profile Showcase */}
      <section className="lg:col-span-5 glass-surface rounded-3xl overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent dark:from-amber-400/20 dark:via-zinc-900 dark:to-zinc-950 border-b border-zinc-900/8 dark:border-white/8" />

        <div className="px-6 pb-6 -mt-12 text-center space-y-4">
          <div className="relative inline-block">
            <Avatar
              src={avatarDraft}
              name={nameInput || user.name}
              sizeClass="w-24 h-24"
              textClass="text-2xl"
              className="ring-4 ring-white/90 dark:ring-zinc-950 shadow-lg"
            />
            <label
              htmlFor="quickAvatarUpload"
              title="Ubah foto profil"
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <input
                id="quickAvatarUpload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="sr-only"
              />
            </label>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white truncate max-w-[260px]">
                {user.name}
              </h1>
              {isVerified && (
                <BadgeCheck
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0"
                  aria-label="Terverifikasi"
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className={`font-semibold ${rankAccent}`}>{user.pangkat}</span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={handleCopyTagId}
                className="inline-flex items-center gap-1 font-mono-tabular hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <span>{user.tagId}</span>
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-sm mx-auto">
            {user.bio || 'Belum ada bio akun.'}
          </p>

          {/* Showcased Favorite Music on Profile */}
          <div className="text-left rounded-2xl p-3.5 bg-zinc-900/[0.03] dark:bg-white/[0.03] border border-zinc-900/8 dark:border-white/8">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5" />
                <span>Musik Favorit</span>
              </span>
              <button
                type="button"
                onClick={onOpenMusicPage}
                className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Kelola
              </button>
            </div>

            {pinnedMusic ? (
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-zinc-900 to-black border border-amber-500/30 flex items-center justify-center shrink-0 ${
                    isPinnedMusicPlaying ? 'animate-spin' : ''
                  }`}
                  style={
                    isPinnedMusicPlaying ? { animationDuration: '5s' } : undefined
                  }
                >
                  <Disc3 className="w-5 h-5 text-amber-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xs sm:text-sm font-bold text-zinc-950 dark:text-white truncate">
                    {pinnedMusic.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {pinnedMusic.artist} · {pinnedMusic.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onPlayTrack(pinnedMusic)}
                  aria-label={
                    isPinnedMusicPlaying
                      ? `Jeda ${pinnedMusic.title}`
                      : `Putar ${pinnedMusic.title}`
                  }
                  className="min-w-[40px] min-h-[40px] rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 flex items-center justify-center shrink-0 active:scale-95 transition-all"
                >
                  {isPinnedMusicPlaying ? (
                    <Pause className="w-4 h-4" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Belum ada musik favorit yang dipajang.
                </p>
                <button
                  type="button"
                  onClick={onOpenMusicPage}
                  className="min-h-[34px] px-3 py-1 rounded-lg glass-surface text-xs font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap"
                >
                  Pilih Lagu
                </button>
              </div>
            )}
          </div>

          {/* Social Quick Links */}
          <div className="flex items-center justify-center gap-2.5 pt-1">
            <a
              href={user.tiktok !== '#' ? user.tiktok : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (user.tiktok === '#') {
                  e.preventDefault();
                  setActiveTab('sosial');
                  onNotify('Isi tautan TikTok di tab Sosial Media.', 'info');
                }
              }}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                user.tiktok !== '#'
                  ? 'border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 hover:border-amber-600/40 dark:hover:border-amber-400/40'
                  : 'border-dashed border-zinc-900/15 dark:border-white/15 text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <span>TikTok</span>
            </a>

            <a
              href={user.youtube !== '#' ? user.youtube : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (user.youtube === '#') {
                  e.preventDefault();
                  setActiveTab('sosial');
                  onNotify('Isi tautan YouTube di tab Sosial Media.', 'info');
                }
              }}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                user.youtube !== '#'
                  ? 'border-zinc-900/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 hover:border-amber-600/40 dark:hover:border-amber-400/40'
                  : 'border-dashed border-zinc-900/15 dark:border-white/15 text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <span>YouTube</span>
            </a>
          </div>

          <div className="pt-3 border-t border-zinc-900/8 dark:border-white/8 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onShareProfile}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span>Bagikan Profil</span>
            </button>
            <button
              type="button"
              onClick={onPreviewOwnProfile}
              className="min-h-[44px] px-4 py-2.5 rounded-xl glass-surface text-zinc-800 dark:text-zinc-200 hover:border-amber-600/35 dark:hover:border-amber-400/35 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Pratinjau</span>
            </button>
          </div>
        </div>
      </section>

      {/* Right Column: Tidy Categorized Settings Hub */}
      <section className="lg:col-span-7 glass-surface rounded-3xl p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-zinc-950 dark:text-white">
              Pengaturan Akun
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
              Kelola identitas, musik favorit, tautan sosial, tema tampilan, dan pangkat Anda.
            </p>
          </div>
        </div>

        {/* Clean Segmented Settings Navigation */}
        <div
          role="tablist"
          aria-label="Kategori pengaturan profil"
          className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-zinc-900/[0.04] dark:bg-white/[0.04] border border-zinc-900/8 dark:border-white/8"
        >
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`relative min-h-[42px] px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? 'text-zinc-950 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="settingsTabPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                    className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-900/8 dark:border-white/10"
                  />
                )}
                <Icon className="relative z-10 w-4 h-4 shrink-0" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Settings Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'identitas' && (
            <motion.div
              key="identitas"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              {/* Photo Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-900/8 dark:border-white/8">
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={avatarDraft}
                    name={nameInput || user.name}
                    sizeClass="w-14 h-14"
                    textClass="text-lg"
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Foto Profil
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Format JPG/PNG dari galeri (maks. 3 MB).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="settingsAvatarFile"
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-zinc-900/12 dark:border-white/12 bg-white/60 dark:bg-white/[0.05] hover:border-amber-600/40 dark:hover:border-amber-400/40 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Pilih Foto</span>
                    <input
                      id="settingsAvatarFile"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="sr-only"
                    />
                  </label>
                  {avatarDraft && (
                    <button
                      type="button"
                      onClick={() => setAvatarDraft('')}
                      aria-label="Hapus foto profil"
                      className="min-h-[40px] min-w-[40px] rounded-xl border border-zinc-900/12 dark:border-white/12 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label
                  htmlFor="editUsername"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Username / Nama Tampilan
                </label>
                <input
                  id="editUsername"
                  type="text"
                  maxLength={32}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-900/12 dark:border-white/12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60 transition-all"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="editBio"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Bio Profil
                  </label>
                  <span className="text-xs font-mono-tabular text-zinc-400">
                    {bioInput.length}/160
                  </span>
                </div>
                <textarea
                  id="editBio"
                  rows={3}
                  maxLength={160}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Ceritakan sedikit tentang gaya editing atau konten Anda..."
                  className="w-full px-4 py-3 rounded-xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-900/12 dark:border-white/12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60 transition-all resize-none"
                />
              </div>

              {/* Favorite Music Selector for Profile */}
              <div className="space-y-1.5">
                <label
                  htmlFor="editFavMusic"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Musik Favorit yang Dipajang di Profil
                </label>
                <select
                  id="editFavMusic"
                  value={favTrackDraft}
                  onChange={(e) => setFavTrackDraft(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-900/12 dark:border-white/12 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/60 transition-all"
                >
                  <option value="">Tidak ada musik yang dipajang</option>
                  {MUSIC_TRACKS.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.title} — {track.artist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {hasUnsavedIdentity
                    ? 'Ada perubahan identitas yang belum disimpan.'
                    : 'Semua identitas sudah tersimpan.'}
                </span>
                <button
                  type="button"
                  onClick={handleSaveIdentity}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-semibold text-sm active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
                >
                  Simpan Identitas
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'sosial' && (
            <motion.div
              key="sosial"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="editTiktok"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Tautan Akun TikTok
                </label>
                <input
                  id="editTiktok"
                  type="url"
                  value={tiktokInput}
                  onChange={(e) => setTiktokInput(e.target.value)}
                  placeholder="https://tiktok.com/@username"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-900/12 dark:border-white/12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="editYoutube"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Tautan Kanal YouTube
                </label>
                <input
                  id="editYoutube"
                  type="url"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder="https://youtube.com/@channel"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-900/12 dark:border-white/12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60 transition-all"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {hasUnsavedSocial
                    ? 'Ada perubahan tautan yang belum disimpan.'
                    : 'Tautan sosial sudah diperbarui.'}
                </span>
                <button
                  type="button"
                  onClick={handleSaveSocials}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-semibold text-sm active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
                >
                  Simpan Tautan
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'tampilan' && (
            <motion.div
              key="tampilan"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Tema Antarmuka
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Pilih tampilan kaca buram mode gelap atau mode terang sesuai kenyamanan mata.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => onToggleTheme('dark')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    theme === 'dark'
                      ? 'border-amber-500 bg-zinc-900 text-white shadow-md'
                      : 'border-zinc-900/12 dark:border-white/12 bg-zinc-900/5 dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 hover:border-amber-600/35'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 text-amber-300 flex items-center justify-center shrink-0">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-bold">
                        Mode Gelap
                      </span>
                      {theme === 'dark' && (
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs opacity-75 mt-1 leading-relaxed">
                      Kaca gelap obsidian dengan aksen emas Nexus yang elegan.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleTheme('light')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    theme === 'light'
                      ? 'border-amber-600 bg-white text-zinc-950 shadow-md'
                      : 'border-zinc-900/12 dark:border-white/12 bg-white/50 dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 hover:border-amber-400/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-bold">
                        Mode Terang
                      </span>
                      {theme === 'light' && (
                        <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs opacity-75 mt-1 leading-relaxed">
                      Kaca susu cerah dengan kontras tinggi untuk penggunaan siang hari.
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'keamanan' && (
            <motion.div
              key="keamanan"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Rank Upgrade / Switch */}
              <div className="space-y-3 pb-5 border-b border-zinc-900/8 dark:border-white/8">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                    <span>Verifikasi Ulang Kode Pangkat</span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Pangkat aktif saat ini:{' '}
                    <span className={`font-semibold ${rankAccent}`}>
                      {user.pangkat}
                    </span>
                    . Masukkan 7 digit kode baru untuk memperbarui status tanpa menghapus data profil.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={7}
                    value={newRankCode}
                    onChange={(e) => setNewRankCode(e.target.value)}
                    placeholder="Masukkan 7 digit kode pangkat..."
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-900/12 dark:border-white/12 text-sm font-mono-tabular text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateRankCode}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl glass-surface hover:border-amber-600/40 dark:hover:border-amber-400/40 font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
                  >
                    Perbarui Pangkat
                  </button>
                </div>
              </div>

              {/* Logout / Reset Confirmation */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    Reset & Keluar Akun
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Menghapus sesi lokal dan mengembalikan tampilan ke halaman masuk awal.
                  </p>
                </div>

                {!confirmLogout ? (
                  <button
                    type="button"
                    onClick={() => setConfirmLogout(true)}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Reset / Keluar Akun</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Yakin ingin keluar dan mereset seluruh data profil lokal di perangkat ini?
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={onLogout}
                        className="min-h-[40px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                      >
                        Ya, Reset Sekarang
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmLogout(false)}
                        className="min-h-[40px] px-4 py-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
                }
