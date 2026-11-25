import {
  Announcement,
  ChatThread,
  MusicTrack,
  RankRole,
  StructureMember,
  ToolItem,
  ToolOption,
} from '../types/nexus';

export const RANK_CODES: Record<'MEMBER' | 'ADMIN' | 'OWNER', string> = {
  MEMBER: '7771890',
  ADMIN: '5578901',
  OWNER: '1200921',
};

export function resolveRankFromCode(code: string): RankRole | null {
  const trimmed = code.trim();
  if (trimmed === RANK_CODES.MEMBER) return 'MEMBER';
  if (trimmed === RANK_CODES.ADMIN) return 'ADMIN';
  if (trimmed === RANK_CODES.OWNER) return 'OWNER';
  return null;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'dj-amnesia-viral-2026',
    title: 'DJ AMNESIA AL GHAZALI - APA KAU AMNESIA',
    artist: 'NexusFams Audio',
    category: 'DJ Remix',
    url: 'https://files.catbox.moe/020bjm.m4a',
    year: '2026',
  },
  {
    id: 'Dj-romlus-propun-x-su-jauh+mix-2026',
    title: 'DJ ROMLOS PROPUN X SU JAUH SA TANAM X TIA MONIKA X MORENA SLOW VIRAL TIKTOK - MAMAN FVNDY',
    artist: 'NexusFams Audio',
    category: 'DJ Remix',
    url: 'https://files.catbox.moe/np1dqr.mp3',
    year: '2026',
  },
  {
    id: 'dj-di-cari-onty-onty',
    title: 'DJ DI CARI ONTY ONTY SPEED UP',
    artist: 'NexusFams Audio',
    category: 'DJ Remix',
    url: 'https://files.catbox.moe/x2eo0n.mp3',
    year: '2026',
  },
];

export const OFFICIAL_ACCOUNTS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@nexusfams1103',
    url: 'https://tiktok.com/@nexusfams1103',
  },
  {
    id: 'discord',
    name: 'Discord',
    handle: 'Server Komunitas',
    url: 'https://discord.gg/ydhrCHK8A',
  },
  {
    id: 'whatsapp',
    name: 'Saluran WA',
    handle: 'Update Resmi Marga',
    url: 'https://whatsapp.com/channel/0029Vb8WUbxE50UjmpWeXb2D',
  },
] as const;

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Pencopotan jabatan admin',
    category: 'Informasi',
    desc: 'Jabatan Admin Besar atas nama akari resmi undur diri. Untuk keterangan lanjutan ada di saluran WhatsApp marga, terimakasih.',
    date: 'Senin, 23 Nov 2026',
    icon: 'user-slash',
  },
  {
    id: 'ann-2',
    title: 'Pencopotan jabatan admin',
    category: 'Informasi',
    desc: 'Jabatan admin poster atas nama dzaki resmi dicopot. Untuk keterangan lanjutan ada di saluran WhatsApp marga, terimakasih.',
    date: 'Senin, 2 Nov 2026',
    icon: 'user-slash',
  },
  {
    id: 'ann-3',
    title: 'Pencopotan jabatan admin',
    category: 'Informasi',
    desc: 'Jabatan admin collab atas nama wildan/danz resmi dicopot. Untuk keterangan lanjutan ada di saluran WhatsApp marga, terimakasih.',
    date: 'Sabtu, 24 Okt 2026',
    icon: 'user-slash',
  },
  {
    id: 'ann-4',
    title: 'Pengumuman Penting Buat Anggota Marga',
    category: 'Penting',
    desc: 'Buat para my anggota, jangan sekali-kali sebarin kode pangkat ke luar marga, kalau ada yang ketahuan nyebar bakal gw blacklist🤬\nAlasannya kenapa min? Tanya biawak.',
    date: 'Senin, 27 Juli 2026',
    icon: 'megaphone',
  },
  {
    id: 'ann-5',
    title: 'Database Error & Pemeliharaan System',
    category: 'Pengumuman',
    desc: 'Website saat ini bersifat sementara karena server utama sedang dalam perbaikan. Semua data akun tersimpan secara lokal di perangkat kalian.',
    date: 'Sabtu, 25 Juli 2026',
    icon: 'server',
  },
];

export const TOOLS_LIST: ToolItem[] = [
  {
    id: 'intro',
    title: 'Intro Marga',
    subtitle: 'Alight Motion',
    type: 'modal',
    modalKey: 'intro',
    icon: 'clapperboard',
  },
  {
    id: 'wm',
    title: 'WM Marga',
    subtitle: 'Alight Motion',
    type: 'modal',
    modalKey: 'wm',
    icon: 'layers',
  },
  {
    id: 'font',
    title: 'Font Marga',
    subtitle: 'Google Drive',
    type: 'link',
    link: 'https://drive.google.com/file/d/15H4OU7ekGCFf7_3x-OESgEgzXhKwSj6g/view?usp=drivesdk',
    icon: 'type',
  },
  {
    id: 'cc',
    title: 'CC Marga',
    subtitle: 'Alight Motion',
    type: 'link',
    link: 'https://alightmotion.app',
    icon: 'sparkles',
  },
];

export const TOOL_OPTIONS: Record<
  'intro' | 'wm',
  { title: string; description: string; options: ToolOption[] }
> = {
  wm: {
    title: 'Pilih WM Marga',
    description: 'Pilih versi preset watermark resmi marga NexusFams.',
    options: [
      {
        name: 'WM Marga V1 (Original)',
        subtitle: 'Preset Alight Creative',
        link: 'https://alightcreative.com/am/share/u/enakvg2wcmh1gh3i3mqedc0skkd2/p/wkrqlsgpjf-62da42c0b9010256',
      },
      {
        name: 'WM Marga V2',
        subtitle: 'Preset Alight Creative',
        link: 'https://alightcreative.com/am/share/u/NyzsVoqityctBzlx2qfPr1CCjyn2/p/NwxYIZrMoP-5c319deb2a400853',
      },
      {
        name: 'WM Marga V3',
        subtitle: 'Tautan Rentry',
        link: 'https://rentry.co/nexusfams',
      },
    ],
  },
  intro: {
    title: 'Pilih Intro Marga',
    description: 'Pilih versi template intro video untuk konten marga.',
    options: [
      {
        name: 'Intro V1',
        subtitle: 'Alight Motion',
        link: 'https://alightmotion.app',
      },
      {
        name: 'Intro V2',
        subtitle: 'Segera Hadir',
        link: '#',
      },
    ],
  },
};

export const CHAT_THREADS: ChatThread[] = [
  {
    id: 'chat-1',
    pinned: true,
    author: "PitNewbie'",
    role: 'owner',
    roleLabel: 'Owner',
    text: 'wm v2 yng dinantikan kalian udh rilis tuh. "wm v3 mana min?" v3 buat gw aja, lagian kalian vote v2🗿😭, cc sama intro masih belum ada, kira² pertengahan September bakal rilis tuh cc ama intro, soalny intro gw lagi proses pembuatan hehehe.... doain biar hpny ga keriset lgi. udh segitu aja makasih, semangat ngonten ya🙌',
  },
  {
    id: 'chat-2',
    author: 'Pitnewbie',
    role: 'owner',
    roleLabel: 'Owner',
    text: 'baguss ga web nya? siapa dlu yang buat, gw sering dibully sama member tpi masi sayang ma kalian 😑🗿',
    likes: 218,
    replies: [
      {
        id: 'rep-2-1',
        author: 'akari',
        role: 'admin',
        roleLabel: 'Admin',
        text: 'tuhhh dengerin kata owner kasian dia, iya ga biawak?🗿',
      },
      {
        id: 'rep-2-2',
        author: "PitNewbie'",
        role: 'owner',
        roleLabel: 'Owner',
        text: 'maksud lu apaan? yang biawak siapa🤬🤬',
      },
      {
        id: 'rep-2-3',
        author: 'sanzzz',
        role: 'admin',
        roleLabel: 'Admin',
        text: 'pitt tidur dh malem, beson main kaisar²an lagi',
      },
      {
        id: 'rep-2-4',
        author: 'danz',
        role: 'admin',
        roleLabel: 'Admin',
        text: 'sanzzz tidur dh malem, besok ngehytamin member rusuh lagi;)',
      },
    ],
  },
  {
    id: 'chat-3',
    author: 'dzaki',
    role: 'admin',
    roleLabel: 'Admin',
    text: 'aku admin aku berkuasa',
    likes: 42,
    replies: [
      {
        id: 'rep-3-1',
        author: 'mawan',
        role: 'admin',
        roleLabel: 'Admin',
        text: 'woilah cik, ntar diparani',
      },
      {
        id: 'rep-3-2',
        author: "PitNewbie'",
        role: 'owner',
        roleLabel: 'Owner',
        text: 'masih kupantau kau cuu.....',
      },
    ],
  },
  {
    id: 'chat-4',
    author: 'akari',
    role: 'admin',
    roleLabel: 'Admin',
    text: 'diatasku pada rada² stres 🌚',
    likes: 85,
    replies: [
      {
        id: 'rep-4-1',
        author: 'mawan',
        role: 'admin',
        roleLabel: 'Admin',
        text: 'kamu jangan gitu ya cantik, dc yu🌝',
      },
      {
        id: 'rep-4-2',
        author: 'sanzzz',
        role: 'admin',
        roleLabel: 'Admin',
        text: 'bucin tidur dh malem, beson nge bucin lagi',
      },
      {
        id: 'rep-4-3',
        author: 'akari',
        role: 'admin',
        roleLabel: 'Admin',
        text: '🗿',
      },
    ],
  },
];

export const STRUCTURE_MEMBERS: StructureMember[] = [
  {
    id: 'str-1',
    position: 'Owner',
    name: 'PitNewbie',
    tier: 'owner',
    description: 'Pendiri & pengelola utama marga Nexus Creator Community.',
  },
  {
    id: 'str-2',
    position: 'Admin Besar',
    name: 'Sanzzz',
    tier: 'senior',
    description: 'Koordinator operasional dan pengawasan komunitas.',
  },
  {
    id: 'str-3',
    position: 'Admin Biasa',
    name: 'Mawan',
    tier: 'staff',
    description: 'Pengelola harian grup serta pendamping anggota.',
  },
  {
    id: 'str-4',
    position: 'Admin Bot',
    name: 'SennStore',
    tier: 'staff',
    description: 'Pemeliharaan utilitas dan sistem bot komunitas.',
  },
];
      
