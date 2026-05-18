import React from 'react';
import { Theme, Difficulty, PegColor } from '../types';
import { DIFFICULTY_SETTINGS, COLOR_MAP, COLORS, THEME_PEGS } from '../constants';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, CircleDot, LayoutGrid, HelpCircle, Settings } from 'lucide-react';

interface DifficultyMenuProps {
  onSelect: (d: Difficulty) => void;
  onShowRules: () => void;
  onShowSettings: () => void;
  theme: Theme;
}

export default function DifficultyMenu({ onSelect, onShowRules, onShowSettings, theme }: DifficultyMenuProps) {
  return (
    <div className="space-y-8 w-full max-w-lg">
      <header className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-primary tracking-tight">Choose Your Challenge</h2>
        <p className="text-on-surface-variant">Decipher the hidden sequence before the turns run out. Every move brings you closer to the truth.</p>
      </header>

      <div className="space-y-4">
        {(['Easy', 'Classic', 'Challenging'] as Difficulty[]).map((level) => {
          const config = DIFFICULTY_SETTINGS[level];
          const isClassic = level === 'Classic';
          
          return (
            <motion.div
              key={`difficulty-${level}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(level)}
              className={`glass-card p-6 flex items-center justify-between group cursor-pointer relative overflow-hidden transition-all hover:ring-2 hover:ring-emerald-500 ${
                isClassic ? 'border-primary/40' : 'border-white/10'
              }`}
            >
              {isClassic && (
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              )}
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-full board-recess flex items-center justify-center p-2">
                  <div className={`grid ${
                    level === 'Easy' ? 'grid-cols-3' : 
                    level === 'Classic' ? 'grid-cols-2' : 
                    'grid-cols-3'
                  } gap-1.5`}>
                    {[...Array(config.pegs)].map((_, i) => {
                      const availableColors = COLORS.slice(0, config.colorCount);
                      const color = availableColors[i % availableColors.length];
                      return (
                        <div 
                          key={`preview-${level}-${i}`} 
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                            theme === 'Lollipop' ? `peg-3d shadow-lg ${COLOR_MAP[color]}` : 'bg-white/10 text-[10px]'
                          }`}
                        >
                          {theme === 'Animals' && THEME_PEGS.Animals[color]}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xl font-bold ${
                      level === 'Easy' ? 'text-emerald-300' : 
                      level === 'Classic' ? 'text-orange-300' : 
                      'text-rose-400'
                    }`}>{level}</h3>
                    {isClassic && (
                      <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-on-surface-variant mt-1 text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><CircleDot size={12} className="text-rose-400" /> {config.pegs} Pegs</span>
                    <span className="flex items-center gap-1.5"><RotateCcw size={12} className="text-orange-300" /> {config.attempts} Tries</span>
                    <span className="flex items-center gap-1.5"><LayoutGrid size={12} className="text-sky-300" /> {config.colorCount} Colors</span>
                  </div>
                </div>
              </div>

              <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </motion.div>
          );
        })}
      </div>

      <p className="text-right text-on-surface-variant text-xs italic pt-4">
        <span className="text-rose-400 italic">♥</span> by chuawt
      </p>
    </div>
  );
}
