import React, { useState, useEffect } from 'react';
import { Attempt, Difficulty, GameStatus, PegColor, Theme } from '../types';
import { DIFFICULTY_SETTINGS, COLORS, COLOR_MAP, THEME_PEGS } from '../constants';
import { calculateFeedback } from '../lib/gameLogic';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Timer, Home, Info } from 'lucide-react';
import ColorPickerPopup from './ColorPickerPopup';
import GameOverModal from './GameOverModal';

interface GameBoardProps {
  difficulty: Difficulty;
  theme: Theme;
  onQuit: () => void;
}

export default function GameBoard({ difficulty, theme, onQuit }: GameBoardProps) {
  const config = DIFFICULTY_SETTINGS[difficulty];
  const [secretCode, setSecretCode] = useState<PegColor[]>([]);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [currentGuess, setCurrentGuess] = useState<(PegColor | null)[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');
  const [time, setTime] = useState(0);
  const [activePicker, setActivePicker] = useState<{ index: number; x: number; y: number } | null>(null);

  // Initialize game
  useEffect(() => {
    const availableColors = COLORS.slice(0, config.colorCount);
    const code = Array.from({ length: config.pegs }, () => availableColors[Math.floor(Math.random() * availableColors.length)]);
    setSecretCode(code);
    setCurrentGuess(Array(config.pegs).fill(null));
    setHistory([]);
    setGameStatus('PLAYING');
    setTime(0);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Lock scroll when picker is open
  useEffect(() => {
    if (activePicker) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [activePicker]);

  const handlePegClick = (index: number, e: React.MouseEvent) => {
    if (gameStatus !== 'PLAYING') return;
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Use actual viewport coordinates for the Portal-ed picker
    setActivePicker({ index, x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleColorSelect = (color: PegColor | null) => {
    if (!activePicker) return;
    const nextGuess = [...currentGuess];
    nextGuess[activePicker.index] = color;
    setCurrentGuess(nextGuess);
    setActivePicker(null);
  };

  const handleSubmit = () => {
    if (currentGuess.includes(null)) return;

    const feedback = calculateFeedback(secretCode, currentGuess as PegColor[]);
    const newAttempt: Attempt = {
      colors: [...currentGuess],
      feedback,
    };

    const newHistory = [...history, newAttempt];
    setHistory(newHistory);
    setCurrentGuess(Array(config.pegs).fill(null));

    if (feedback.perfect === config.pegs) {
      setGameStatus('WON');
    } else if (newHistory.length === config.attempts) {
      setGameStatus('LOST');
    }
  };

  const isCurrentRowFull = !currentGuess.includes(null);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col h-full space-y-4">
      {/* Game Header */}
      <div className="flex justify-between items-center px-1 shrink-0">
        <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-white/5 shadow-lg">
          <Timer size={16} className="text-primary" />
          <span className="font-mono text-base font-bold text-on-surface-variant">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={onQuit} className="p-1.5 glass-card rounded-full text-on-surface-variant hover:text-white transition-colors">
            <Home size={18} />
          </button>
        </div>
      </div>

      <div className={`flex-grow glass-card rounded-3xl p-3 sm:p-6 board-recess relative overflow-hidden flex flex-col custom-scrollbar transition-all duration-500 ${theme !== 'Lollipop' ? 'theme-' + theme.toLowerCase() : ''}`}
           style={{ 
             borderColor: theme !== 'Lollipop' ? 'var(--theme-accent)' : undefined,
             boxShadow: theme !== 'Lollipop' ? '0 0 40px var(--theme-surface-glow)' : undefined
           }}>
        <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col-reverse gap-0.5 sm:gap-1 pr-1">
          <div className="flex flex-col-reverse gap-0.5 sm:gap-1 min-h-full justify-start">
            {/* History Rows - Stacked from Bottom to Top */}
            {Array.from({ length: config.attempts }).map((_, rowIndex) => {
            const attempt = history[rowIndex];
            const isCurrent = rowIndex === history.length && gameStatus === 'PLAYING';
            const isInactive = rowIndex > history.length;

            return (
              <motion.div
                key={`row-${rowIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center justify-between p-1 sm:p-1.5 rounded-2xl transition-all h-[44px] sm:h-[64px] shrink-0 border border-transparent ${
                  isCurrent && theme !== 'Animals' ? 'shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]' : 'bg-surface-container/40'
                } ${isInactive ? 'opacity-30 grayscale' : ''}`}
                style={{
                  backgroundColor: isCurrent 
                    ? (theme === 'Lollipop' 
                      ? 'rgba(var(--primary-rgb), 0.2)' 
                      : (theme === 'Animals' ? 'transparent' : 'var(--theme-surface-glow)')) 
                    : undefined,
                  borderColor: (isCurrent && theme !== 'Animals') ? (theme === 'Lollipop' ? 'rgba(var(--primary-rgb), 0.4)' : 'var(--theme-accent)') : undefined
                }}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white/30 border border-white/5 shadow-inner">
                    {rowIndex + 1}
                  </div>
                  <div className={`flex flex-1 justify-center ${
                    difficulty === 'Easy' 
                      ? 'gap-10 sm:gap-16' 
                      : difficulty === 'Challenging' 
                        ? 'gap-2 sm:gap-3' 
                        : 'gap-5 sm:gap-7'
                  }`}>
                    {Array.from({ length: config.pegs }).map((_, colIndex) => {
                      const color = attempt ? attempt.colors[colIndex] : isCurrent ? currentGuess[colIndex] : null;
                      const isSelected = isCurrent && activePicker?.index === colIndex;
                      return (
                        <motion.div
                          key={`row-${rowIndex}-peg-${colIndex}`}
                          onClick={(e) => isCurrent && handlePegClick(colIndex, e)}
                          initial={false}
                          animate={{
                            scale: isSelected ? 1.2 : 1,
                            y: isSelected ? -4 : 0,
                            rotate: isSelected ? [0, -5, 5, 0] : 0,
                            boxShadow: isSelected 
                              ? `0 10px 25px rgba(var(--primary-rgb), 0.4)` 
                              : `0 0 0px rgba(0,0,0,0)`,
                          }}
                          transition={{ 
                            scale: { type: "spring", stiffness: 400, damping: 15 },
                            y: { type: "spring", stiffness: 400, damping: 15 },
                            rotate: isSelected ? { duration: 0.4, repeat: 0 } : { duration: 0.2 }
                          }}
                          whileHover={isCurrent ? { scale: 1.1 } : {}}
                          whileTap={isCurrent ? { scale: 0.95 } : {}}
                          className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full transition-all flex items-center justify-center cursor-pointer touch-manipulation relative overflow-visible ${
                            color 
                              ? theme === 'Lollipop' ? `peg-3d ${COLOR_MAP[color]}` : 'bg-white/10 dark-inner-shadow text-xl sm:text-2xl'
                              : 'bg-surface-container-highest shadow-inner border border-white/5'
                          } ${isCurrent ? 'hover:ring-2 ring-primary/40' : ''}`}
                        >
                          <AnimatePresence mode="popLayout">
                            {color && (
                              <motion.div
                                key={color}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="w-full h-full flex items-center justify-center rounded-full"
                              >
                                {theme !== 'Lollipop' && THEME_PEGS[theme as Exclude<Theme, 'Lollipop'>][color]}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {!color && isCurrent && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/20" />}
                          
                          {/* Pulsing selection ring */}
                          {isSelected && (
                            <motion.div
                              layoutId="selection-ring"
                              className="absolute -inset-1 rounded-full border-2"
                              style={{ borderColor: theme === 'Lollipop' ? 'rgba(var(--primary-rgb), 0.5)' : 'var(--theme-accent)' }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ 
                                opacity: [0.4, 0.8, 0.4], 
                                scale: [1, 1.1, 1],
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                ease: "easeInOut" 
                              }}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Area */}
                <div className={`w-8 h-8 sm:w-12 sm:h-12 glass-card rounded-xl flex items-center justify-center relative overflow-hidden ${theme === 'Animals' ? 'feedback-background' : ''}`}>
                  <AnimatePresence mode="wait">
                    {isCurrent && isCurrentRowFull ? (
                      <motion.button
                        key="check-button"
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSubmit();
                        }}
                        className="w-full h-full text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
                        style={{ backgroundColor: theme === 'Lollipop' ? '#10b981' : 'var(--theme-accent)' }}
                      >
                        <Check size={18} className="sm:hidden" strokeWidth={3} />
                        <Check size={28} className="hidden sm:block" strokeWidth={3} />
                      </motion.button>
                    ) : attempt?.feedback ? (
                      <motion.div 
                        key="feedback-grid"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-2 gap-0.5 sm:gap-1.5 p-0.5 sm:p-1.5 w-full h-full items-center justify-items-center"
                      >
                        {Array.from({ length: config.pegs }).map((_, i) => {
                          const isPerfect = i < attempt.feedback!.perfect;
                          const isPartial = !isPerfect && i < attempt.feedback!.perfect + attempt.feedback!.partial;
                          return (
                            <motion.div
                              key={`row-${rowIndex}-feedback-${i}`}
                              variants={{
                                hidden: { scale: 0, opacity: 0, rotate: -20 },
                                visible: { 
                                  scale: 1, 
                                  opacity: 1, 
                                  rotate: 0,
                                  transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 12
                                  }
                                }
                              }}
                              animate={isPerfect ? {
                                scale: [1, 1.2, 1],
                                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                              } : isPartial ? {
                                scale: [1, 1.15, 1],
                                transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                              } : {}}
                              className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                                isPerfect ? 'perfect-dot' : 
                                isPartial ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]' : 
                                'bg-white/5 border border-white/5'
                              }`}
                            />
                          );
                        })}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>

    <AnimatePresence>
      {activePicker && (
        <ColorPickerPopup
          position={{ x: activePicker.x, y: activePicker.y }}
          onSelect={handleColorSelect}
          onClose={() => setActivePicker(null)}
          colors={COLORS.slice(0, config.colorCount)}
          theme={theme}
        />
      )}
    </AnimatePresence>

    <AnimatePresence>
      {gameStatus !== 'PLAYING' && (
        <GameOverModal
          status={gameStatus}
          time={time}
          moves={history.length}
          secretCode={secretCode}
          theme={theme}
          onAgain={() => {
            const availableColors = COLORS.slice(0, config.colorCount);
            const code = Array.from({ length: config.pegs }, () => availableColors[Math.floor(Math.random() * availableColors.length)]);
            setSecretCode(code);
            setCurrentGuess(Array(config.pegs).fill(null));
            setHistory([]);
            setGameStatus('PLAYING');
            setTime(0);
          }}
          onMenu={onQuit}
        />
      )}
    </AnimatePresence>
  </div>
  );
}
