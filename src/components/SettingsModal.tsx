import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Candy, Sparkles } from 'lucide-react';
import { Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function SettingsModal({ isOpen, onClose, currentTheme, onThemeChange }: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card w-full max-w-sm p-8 rounded-3xl space-y-8 relative overflow-hidden my-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Settings</h2>
              <p className="text-white/40 text-sm">Customize your codebreaking experience.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Peg Theme</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => onThemeChange('Lollipop')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    currentTheme === 'Lollipop' 
                      ? 'bg-rose-400/20 border-rose-400 text-white' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-400/20 flex items-center justify-center">
                      <Candy size={20} className={currentTheme === 'Lollipop' ? 'text-rose-400' : 'text-white/40'} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Lollipop</div>
                      <div className="text-[10px] opacity-60">Glossy 3D candy colors</div>
                    </div>
                  </div>
                  {currentTheme === 'Lollipop' && <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />}
                </button>

                <button
                  onClick={() => onThemeChange('Animals')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    currentTheme === 'Animals' 
                      ? 'bg-emerald-500/20 border-emerald-500 text-white' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Sparkles size={20} className={currentTheme === 'Animals' ? 'text-emerald-500' : 'text-white/40'} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Animals</div>
                      <div className="text-[10px] opacity-60">Cute animal characters</div>
                    </div>
                  </div>
                  {currentTheme === 'Animals' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Alpha Build 1.0.4</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
