import { motion } from 'motion/react';
import { Bot, Crown, Shield, ShieldCheck } from 'lucide-react';
import { STRUCTURE_MEMBERS } from '../data/nexusData';
import { StructureMember } from '../types/nexus';

export function StrukturPage() {
  const getTierIcon = (member: StructureMember) => {
    if (member.tier === 'owner') return Crown;
    if (member.tier === 'senior') return ShieldCheck;
    if (member.position.toLowerCase().includes('bot')) return Bot;
    return Shield;
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">
          Struktur Marga
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Susunan pengurus resmi yang menjaga ekosistem dan komunitas Nexus Creator Community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STRUCTURE_MEMBERS.map((member, idx) => {
          const Icon = getTierIcon(member);
          const isOwner = member.tier === 'owner';
          const isSenior = member.tier === 'senior';

          const badgeColor = isOwner
            ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
            : isSenior
            ? 'text-amber-700 dark:text-amber-300 bg-amber-500/12'
            : 'text-sky-700 dark:text-sky-400 bg-sky-500/10';

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.28,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="glass-surface rounded-2xl p-5 sm:p-6 flex items-start gap-4 hover:border-amber-600/30 dark:hover:border-amber-400/30 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${badgeColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    0{idx + 1}. {member.position}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isOwner
                        ? 'text-rose-600 dark:text-rose-400'
                        : isSenior
                        ? 'text-amber-700 dark:text-amber-300'
                        : 'text-sky-700 dark:text-sky-400'
                    }`}
                  >
                    {isOwner ? 'Pendiri' : 'Pengurus'}
                  </span>
                </div>

                <h2 className="font-display text-lg font-bold text-zinc-950 dark:text-white truncate">
                  {member.name}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
