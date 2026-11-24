import { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  sizeClass?: string;
  textClass?: string;
  className?: string;
}

export function Avatar({
  src,
  name,
  sizeClass = 'w-20 h-20',
  textClass = 'text-2xl',
  className = '',
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  const initials = (name || 'NF')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const hasValidSrc = Boolean(src && src.trim() !== '' && !failed);

  return (
    <div
      className={`relative overflow-hidden rounded-full flex items-center justify-center shrink-0 select-none bg-gradient-to-br from-amber-500/20 via-zinc-200 to-zinc-300 dark:from-amber-400/20 dark:via-zinc-800 dark:to-zinc-900 ${sizeClass} ${className}`}
    >
      {hasValidSrc ? (
        <img
          src={src}
          alt={name || 'Avatar Pengguna'}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className={`font-display font-bold tracking-tight text-amber-800 dark:text-amber-300 ${textClass}`}
          aria-hidden="true"
        >
          {initials || 'NF'}
        </span>
      )}
    </div>
  );
}
