export type ThemeMode = 'dark' | 'light';

export type PageId = 'beranda' | 'peralatan' | 'music' | 'struktur' | 'profil';

export type RankRole = 'MEMBER' | 'ADMIN' | 'OWNER' | 'GUEST';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  url: string;
  year?: string;
}

export interface SharedMusicData {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export interface UserProfile {
  logged: boolean;
  name: string;
  code: string;
  pangkat: RankRole;
  avatar: string;
  bio: string;
  tiktok: string;
  youtube: string;
  tagId: string;
  favoriteTrackId: string;
}

export interface SharedProfileData {
  name: string;
  pangkat: RankRole;
  bio: string;
  tagid: string;
  tiktok: string;
  youtube: string;
  favMusic?: SharedMusicData;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Informasi' | 'Penting' | 'Pengumuman';
  desc: string;
  date: string;
  icon: 'user-slash' | 'megaphone' | 'server';
}

export interface ToolOption {
  name: string;
  subtitle?: string;
  link: string;
}

export interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'modal' | 'link';
  modalKey?: 'intro' | 'wm';
  link?: string;
  icon: 'clapperboard' | 'layers' | 'type' | 'sparkles';
}

export interface ChatReply {
  id: string;
  author: string;
  role: 'owner' | 'admin';
  roleLabel: string;
  text: string;
}

export interface ChatThread {
  id: string;
  pinned?: boolean;
  author: string;
  role: 'owner' | 'admin';
  roleLabel: string;
  text: string;
  likes?: number;
  replies?: ChatReply[];
}

export interface StructureMember {
  id: string;
  position: string;
  name: string;
  tier: 'owner' | 'senior' | 'staff';
  description: string;
}

export interface ToastItem {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info';
}
