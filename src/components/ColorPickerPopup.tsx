import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PegColor } from '../types';
import { COLORS, COLOR_MAP, THEME_PEGS } from '../constants';
import { X } from 'lucide-react';
import { Theme } from '../types';

interface ColorPickerPopupProps {
  onSelect: (color: PegColor | null) => void;
  onClose: () => void;
  position: { x: number; y: number };
  colors: PegColor[];
  theme: Theme;
}

export default function ColorPickerPopup({ onSelect, onClose, position, colors, theme }: ColorPickerPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="fixed z-[100] glass-card p-2 rounded-full flex items-center gap-1.5 shadow-2xl border-white/20"
        style={{ 
          left: '50%',
          top: position.y - 80, 
          transform: 'translateX(-50%)'
        }}
      >
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md ${
              theme === 'Lollipop' ? `peg-3d ${COLOR_MAP[color]}` : 'bg-white/10 dark-inner-shadow text-xl'
            }`}
          >
            {theme === 'Disney' && THEME_PEGS.Disney[color]}
          </button>
        ))}
        <div className="w-[1px] h-6 bg-white/10 mx-0.5 shrink-0" />
        <button
          onClick={() => onSelect(null)}
          className="w-9 h-9 shrink-0 rounded-full bg-white/5 border border-white/20 peg-3d flex items-center justify-center text-white/20 hover:text-white/40 transition-colors active:scale-95"
          title="Remove color"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
        </button>
      </motion.div>
      <div 
        className="fixed inset-0 z-[90]" 
        onClick={onClose} 
      />
    </AnimatePresence>
  );
}
