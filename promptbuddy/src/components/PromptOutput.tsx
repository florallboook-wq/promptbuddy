/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PromptOutputProps {
  prompt: string;
  className?: string;
}

export default function PromptOutput({ prompt, className }: PromptOutputProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!prompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          Generated Prompt
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 dark:hover:bg-slate-800 text-slate-300 dark:text-slate-400 text-xs font-medium rounded-lg transition-colors border border-slate-700 dark:border-slate-800"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2 text-green-400"
              >
                <Check className="w-3.5 h-3.5" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy to Clipboard
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-[#0D0D0D] p-6 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Terminal Header Decoration */}
          <div className="flex gap-1.5 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
          </div>

          <div className="font-mono text-sm leading-relaxed text-violet-300/90 whitespace-pre-wrap break-words">
            <span className="text-violet-500 mr-2">$</span>
            {prompt}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-violet-500 ml-1 align-middle"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
