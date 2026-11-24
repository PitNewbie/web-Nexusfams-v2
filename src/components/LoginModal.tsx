import { ChangeEvent, FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Moon, Shield, Sun } from 'lucide-react';
import { resolveRankFromCode } from '../data/nexusData';
import { RankRole, ThemeMode } from '../types/nexus';
import { Avatar } from './Avatar';

interface LoginModalProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSuccess: (payload: {
    name: string;
    code: string;
    pangkat: RankRole;
    avatar: string;
  }) => void;
}

export function LoginModal({
  theme,
  onToggleTheme,
  onSuccess,
}: LoginModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('Ukuran foto maksimal 3 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setAvatar(ev.target.result);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = code.trim();

    if (!trimmedName || !trimmedCode) {
      setError('Nama dan kode pangkat wajib diisi.');
      return;
    }

    const pangkat = resolveRankFromCode(trimmedCode);
    if (!pangkat) {
      setError('Kode pangkat salah atau tidak terdaftar.');
      return;
    }

    onSuccess({
      name: trimmedName,
      code: trimmedCode,
      pangkat,
      avatar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/55 dark:bg-black/75 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-surface-elevated rounded-3xl p-6 sm:p-8 relative"
      >
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={
            theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'
          }
          className="absolute top-5 right-5 min-w-[40px] min-h-[40px] rounded-xl glass-surface flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:border-amber-600/40 dark:hover:border-amber-400/40 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-amber-700" />
          )}
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-zinc-950 dark:text-white">
            NexusFams
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Masukkan identitas kreator dan 7 digit kode pangkat marga.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Picker */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-900/[0.03] dark:bg-white/[0.03] border border-zinc-900/8 dark:border-white/8">
            <Avatar
              src={avatar}
              name={name || 'NF'}
              sizeClass="w-12 h-12"
              textClass="text-base"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Foto Profil (Opsional)
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                Pilih foto dari galeri perangkat.
              </p>
            </div>
            <label
              htmlFor="loginAvatarFile"
              className="min-h-[38px] px-3 py-1.5 rounded-xl glass-surface text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer flex items-center gap-1.5 shrink-0 hover:border-amber-600/40 dark:hover:border-amber-400/40 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Pilih</span>
              <input
                id="loginAvatarFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="loginName"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Nama Lengkap / Nickname
            </label>
            <input
              id="loginName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: PitNewbie"
              required
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/80 dark:bg-zinc-950/65 border border-zinc-900/12 dark:border-white/12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="loginCode"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Kode Pangkat
            </label>
            <input
              id="loginCode"
              type="password"
              inputMode="numeric"
              maxLength={7}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError('');
              }}
              placeholder="7 digit kode pangkat..."
              required
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/80 dark:bg-zinc-950/65 border border-zinc-900/12 dark:border-white/12 text-sm font-mono-tabular text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[46px] py-3 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-bold text-sm shadow-md active:scale-[0.98] transition-all"
          >
            Masuk Sekarang
          </button>
        </form>
      </motion.div>
    </div>
  );
}
