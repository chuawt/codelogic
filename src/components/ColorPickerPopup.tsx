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
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [adjustedPos, setAdjustedPos] = React.useState({ x: position.x, y: position.y });

  React.useLayoutEffect(() => {
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const padding = 12;
      const screenWidth = window.innerWidth;
      
      const isMobile = screenWidth < 640;
      
      // Calculate desired left position
      let left = isMobile 
        ? (screenWidth - rect.width) / 2 
        : position.x - rect.width / 2;

      // Vertical position - fixed height above the peg
      // We use a constant offset above the peg's top center
      let top = position.y - rect.height - 15;

      // Ensure popup is within horizontal bounds for desktop (mobile is already centered)
      if (!isMobile) {
        if (left < padding) {
          left = padding;
        } else if (left + rect.width > screenWidth - padding) {
          left = screenWidth - rect.width - padding;
        }
      }

      // Vertical boundary check: if too high, flip to below the peg
      // We still do this to prevent it from going off the very top of the screen
      if (top < padding) {
        top = position.y + 50; 
      }
      
      // If flipping below still goes off screen, clamp it
      if (top + rect.height > window.innerHeight - padding) {
        top = window.innerHeight - rect.height - padding;
      }

      setAdjustedPos({ x: left, y: top });
      setIsReady(true);
    }
  }, [position, colors.length]);

  return (
    <>
      <motion.div
        key="picker-popup"
        ref={popupRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isReady ? { 
          opacity: 1, 
          scale: 1, 
        } : { 
          opacity: 0, 
          scale: 0.8,
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 }
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed z-[100] glass-card p-1.5 sm:p-2 rounded-full flex items-center gap-1 shadow-2xl border-white/20 whitespace-nowrap ${isReady ? 'visible' : 'invisible'}`}
        style={{ 
          left: adjustedPos.x,
          top: adjustedPos.y
        }}
      >
        <div key="picker-container" className="flex items-center gap-1 sm:gap-1.5">
          {colors.map((color) => (
            <button
              key={`picker-btn-${color}`}
              onClick={() => onSelect(color)}
              className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md ${
                theme === 'Lollipop' ? `peg-3d ${COLOR_MAP[color]}` : 'bg-white/10 dark-inner-shadow text-xl'
              }`}
            >
              {theme === 'Animals' && THEME_PEGS.Animals[color]}
            </button>
          ))}
          <div key="picker-divider" className="w-[1px] h-6 bg-white/10 mx-0.5 shrink-0" />
          <button
            key="picker-btn-none"
            onClick={() => onSelect(null)}
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-white/5 border border-white/20 peg-3d flex items-center justify-center text-white/20 hover:text-white/40 transition-colors active:scale-95"
            title="Remove color"
          >
            <div key="picker-none-dot" className="w-1.5 h-1.5 rounded-full bg-current" />
          </button>
        </div>
      </motion.div>
      <div 
        key="picker-backdrop"
        className="fixed inset-0 z-[90]" 
        onClick={onClose} 
      />
    </>
  );
}
