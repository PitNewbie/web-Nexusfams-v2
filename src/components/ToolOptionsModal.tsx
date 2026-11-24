import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Clock, Layers, X } from 'lucide-react';
import { TOOL_OPTIONS } from '../data/nexusData';

interface ToolOptionsModalProps {
  toolKey: 'intro' | 'wm' | null;
  onClose: () => void;
  onNotify: (message: string, variant?: 'success' | 'error' | 'info') => void;
}

export function ToolOptionsModal({
  toolKey,
  onClose,
  onNotify,
}: ToolOptionsModalProps) {
  const data = toolKey ? TOOL_OPTIONS[toolKey] : null;

  return (
    <AnimatePresence>
      {toolKey && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 dark:bg-black/75 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tool-options-title"
            className="w-full max-w-md glass-surface-elevated rounded-3xl p-6 space-y-5 relative"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Pilih Versi</span>
                </div>
                <h2
                  id="tool-options-title"
                  className="font-display text-xl font-bold text-zinc-950 dark:text-white"
                >
                  {data.title}
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {data.description}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup pilihan"
                className="min-w-[40px] min-h-[40px] rounded-xl glass-surface flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {data.options.map((opt) => {
                const isComingSoon = opt.link === '#';
                if (isComingSoon) {
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() =>
                        onNotify(
                          `${opt.name} masih dalam proses pembuatan.`,
                          'info'
                        )
                      }
                      className="w-full min-h-[56px] px-4 py-3 rounded-2xl border border-dashed border-zinc-900/15 dark:border-white/15 bg-zinc-900/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-3 text-left opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          {opt.name}
                        </p>
                        {opt.subtitle && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {opt.subtitle}
                          </p>
                        )}
                      </div>
                      <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                    </button>
                  );
                }

                return (
                  <a
                    key={opt.name}
                    href={opt.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full min-h-[56px] px-4 py-3 rounded-2xl glass-surface hover:border-amber-600/40 dark:hover:border-amber-400/40 flex items-center justify-between gap-3 active:scale-[0.99] transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {opt.name}
                      </p>
                      {opt.subtitle && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {opt.subtitle}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-700 dark:text-amber-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
