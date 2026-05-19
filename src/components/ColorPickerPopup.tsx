import React from 'react';
import { createPortal } from 'react-dom';
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
  const [isMobile, setIsMobile] = React.useState(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  React.useLayoutEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useLayoutEffect(() => {
    setIsReady(false);
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const padding = 12;
      const screenWidth = window.innerWidth;
      const currentIsMobile = screenWidth < 640;
      
      // Calculate horizontal position
      let left = currentIsMobile ? screenWidth / 2 : position.x;
      let top = position.y - rect.height - 15;

      // Desktop horizontal clamping
      if (!currentIsMobile) {
        const halfWidth = rect.width / 2;
        if (left - halfWidth < padding) {
          left = halfWidth + padding;
        } else if (left + halfWidth > screenWidth - padding) {
          left = screenWidth - halfWidth - padding;
        }
      }

      // Vertical boundary check: if too high, flip to below the peg
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
  }, [position.x, position.y, colors.length, isMobile]);

  const content = (
    <>
      <motion.div
        key="picker-popup"
        ref={popupRef}
        initial={{ opacity: 0, scale: 0.8, x: "-50%" }}
        animate={isReady ? { 
          opacity: 1, 
          scale: 1, 
          x: "-50%"
        } : { 
          opacity: 0, 
          scale: 0.8,
          x: "-50%"
        } }
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 }
        }}
        exit={{ opacity: 0, scale: 0.8, x: "-50%" }}
        className={`fixed z-[1000] glass-card p-2 sm:p-2.5 rounded-full flex items-center gap-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/20 whitespace-nowrap overflow-visible touch-none select-none ${isReady ? 'visible' : 'invisible'}`}
        style={{ 
          left: `${adjustedPos.x}px`,
          top: `${adjustedPos.y}px`,
          position: 'fixed'
        }}
      >
        <div key="picker-container" className="flex items-center gap-1.5 sm:gap-2">
          {colors.map((color) => (
            <button
              key={`picker-btn-${color}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(color);
              }}
              className={`shrink-0 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md ${
                colors.length > 6 ? 'w-9 h-9 sm:w-16 sm:h-16' : 'w-11 h-11 sm:w-16 sm:h-16'
              } ${
                theme === 'Lollipop' ? `peg-3d ${COLOR_MAP[color]}` : (colors.length > 6 ? 'bg-white/10 dark-inner-shadow text-lg sm:text-3xl' : 'bg-white/10 dark-inner-shadow text-xl sm:text-3xl')
              }`}
            >
              {theme !== 'Lollipop' && THEME_PEGS[theme as Exclude<Theme, 'Lollipop'>][color]}
            </button>
          ))}
          <div key="picker-divider" className="w-[1px] h-6 bg-white/10 mx-0.5 shrink-0" />
          <button
            key="picker-btn-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(null);
            }}
            className={`shrink-0 rounded-full bg-white/5 border border-white/20 peg-3d flex items-center justify-center text-white/20 hover:text-white/40 transition-colors active:scale-95 ${
              colors.length > 6 ? 'w-9 h-9 sm:w-16 sm:h-16' : 'w-11 h-11 sm:w-16 sm:h-16'
            }`}
            title="Remove color"
          >
            <div key="picker-none-dot" className="w-1.5 h-1.5 rounded-full bg-current" />
          </button>
        </div>
      </motion.div>
      <div 
        key="picker-backdrop"
        className="fixed inset-0 z-[900] bg-transparent" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />
    </>
  );

  return createPortal(content, document.body);
}
