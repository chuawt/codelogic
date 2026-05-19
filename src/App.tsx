import React, { useState } from 'react';
import { Difficulty, GameStatus, Theme } from './types';
import DifficultyMenu from './components/DifficultyMenu';
import GameBoard from './components/GameBoard';
import SettingsModal from './components/SettingsModal';
import { Settings, Home, HelpCircle, Trophy, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [gameState, setGameState] = useState<GameStatus>('MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('Classic');
  const [theme, setTheme] = useState<Theme>('Lollipop');
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const startLevel = (d: Difficulty) => {
    setDifficulty(d);
    setGameState('PLAYING');
  };

  return (
    <div className={`h-[100dvh] w-full overflow-hidden flex flex-col font-sans transition-all duration-700 ${
      theme === 'Animals' ? 'text-emerald-100 is-light-theme' : 'text-white'
    } ${
      theme === 'Galactic' ? 'theme-galactic' : 
      theme === 'Fantasy' ? 'theme-fantasy' : 
      theme === 'Animals' ? 'theme-animals' : 'bg-surface'
    }`}>
      {/* Navbar - Fixed height */}
      <header className={`shrink-0 backdrop-blur-xl border-b border-white/10 px-4 h-14 flex justify-between items-center z-50 ${
        theme === 'Lollipop' ? 'bg-surface/80' : 
        theme === 'Animals' ? 'bg-white/20 border-black/10' : 'bg-black/20'
      }`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setGameState('MENU')}>
          <div className="grid grid-cols-2 gap-1 p-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400 peg-3d shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-100 peg-3d shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 peg-3d shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-sky-300 peg-3d shadow-sm" />
          </div>
          <h1 className="text-xl font-bold tracking-[0.15em] flex">
            {['C','O','D','E','L','O','G','I','C'].map((char, index) => {
              const colors = ['text-rose-400', 'text-orange-300', 'text-amber-200', 'text-emerald-300', 'text-sky-300', 'text-violet-300'];
              return <span key={`logo-${index}`} className={colors[index % colors.length]}>{char}</span>
            })}
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => setGameState('MENU')}
            className="text-on-surface-variant hover:text-white transition-colors p-1"
            title="Home"
          >
            <Home size={24} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="text-on-surface-variant hover:text-white transition-colors p-1"
            title="Settings"
          >
            <Settings size={24} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setShowRules(true)}
            className="text-on-surface-variant hover:text-white transition-colors p-1"
            title="Help"
          >
            <HelpCircle size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden px-2 sm:px-4 py-2 sm:py-4 max-w-lg mx-auto w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {gameState === 'MENU' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full h-full overflow-y-auto custom-scrollbar"
            >
              <DifficultyMenu 
                onSelect={startLevel} 
                onShowRules={() => setShowRules(true)}
                onShowSettings={() => setShowSettings(true)}
                theme={theme}
              />
            </motion.div>
          ) : (
            <motion.div
              key="board"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full h-full overflow-hidden flex flex-col"
            >
              <GameBoard theme={theme} difficulty={difficulty} onQuit={() => setGameState('MENU')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentTheme={theme}
        onThemeChange={(t) => {
          setTheme(t);
        }}
      />

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass-card w-full max-w-sm p-8 rounded-3xl space-y-6 my-auto transition-all duration-500 ${
                theme !== 'Lollipop' ? 'theme-' + theme.toLowerCase() : ''
              }`}
              style={{
                borderColor: theme !== 'Lollipop' ? 'var(--theme-accent)' : undefined,
                boxShadow: theme !== 'Lollipop' ? '0 0 40px var(--theme-surface-glow)' : undefined
              }}
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 transition-colors duration-500" style={{ color: theme !== 'Lollipop' ? 'var(--theme-accent)' : 'var(--color-primary)' }}>
                <Info className={theme === 'Lollipop' ? 'text-secondary' : ''} style={{ color: theme !== 'Lollipop' ? 'var(--theme-accent)' : undefined }} /> Game Intelligence
              </h2>
              <div className="space-y-4 text-on-surface-variant leading-relaxed text-sm">
                <p>Crack the secret sequence generated by the computer. The colors may repeat.</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full perfect-dot shrink-0" />
                    <p><span className="text-red-400 font-bold">Red Glow:</span> Correct color in the exact right position.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-white shrink-0 border border-black/20 shadow-sm" />
                    <p><span className="text-white font-bold">Solid White:</span> Correct color exists but in a different position.</p>
                  </div>
                </div>
                <p>Select difficulties to change number of pegs and attempts available. Good luck, Operative.</p>
              </div>
              <button
                onClick={() => setShowRules(false)}
                className="w-full text-white font-bold py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg"
                style={{ 
                  backgroundColor: theme === 'Lollipop' ? '#10b981' : 'var(--theme-accent)',
                  boxShadow: theme === 'Lollipop' ? '0 10px 15px -3px rgba(16, 185, 129, 0.4)' : '0 10px 15px -3px var(--theme-surface-glow)'
                }}
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoIcon() {
  return <HelpCircle className="text-secondary" />;
}

function LayoutGridIcon() {
  return <Trophy size={20} className="scale-x-[-1]" />;
}
