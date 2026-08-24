import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Zap, HelpCircle, Layers, Grid, Search, Image as ImageIcon, Map } from 'lucide-react';
import { UserProgress } from '../types';

export type ActiveTab = 'study' | 'blitz' | 'quiz' | 'scramble' | 'match' | 'posters' | 'map';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  progress: UserProgress;
  onToggleSound: () => void;
  onOpenSearch: () => void;
  totalCards: number;
  masteredCount: number;
  posterCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progress,
  onToggleSound,
  onOpenSearch,
  totalCards,
  masteredCount,
  posterCount,
}) => {
  const masteryPercent = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'study', label: 'Flashcards', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'blitz', label: 'Der Die Das', icon: <Zap className="w-4 h-4 text-german-amber" />, badge: 'BLITZ' },
    { id: 'quiz', label: 'Speed Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'scramble', label: 'Word Order', icon: <Layers className="w-4 h-4" /> },
    { id: 'match', label: 'Pair Match', icon: <Grid className="w-4 h-4" /> },
    { id: 'posters', label: 'Poster Wall', icon: <ImageIcon className="w-4 h-4" />, badge: String(posterCount) },
    { id: 'map', label: 'Curriculum', icon: <Map className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-ink/20 bg-cream-50/90 backdrop-blur-md">
      {/* Top micro chrome */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between text-xs tracking-wider border-b border-ink/10 font-mono text-ink/70">
        <div className="flex items-center gap-3">
          <span className="font-bold text-ink uppercase tracking-widest flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-german-die"></span>
            SCHULWANDKARTE
          </span>
          <span className="hidden sm:inline text-ink/40">·</span>
          <span className="hidden sm:inline">A1–A2 DEUTSCH LERNEN</span>
          <span className="hidden md:inline text-ink/40">·</span>
          <span className="hidden md:inline text-german-der font-semibold">
            {posterCount} POSTERS · {totalCards} CARDS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-ink/20 hover:border-ink/50 hover:bg-cream-100 transition-colors text-ink"
            title="Search all cards (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[10px] bg-cream-200 px-1 py-0.5 rounded border border-ink/20 font-mono">⌘K</kbd>
          </button>

          <div className="flex items-center gap-1.5" title="Mastery progress">
            <Sparkles className="w-3.5 h-3.5 text-german-amber" />
            <span className="hidden md:inline font-semibold text-ink">{masteredCount}/{totalCards}</span>
            <span className="md:hidden font-semibold text-ink">{masteredCount}</span>
            <span className="hidden sm:inline text-ink/60">({masteryPercent}%)</span>
          </div>

          <button
            onClick={onToggleSound}
            className="p-1 rounded hover:bg-cream-200 text-ink/80 transition-colors"
            title={progress.soundEnabled ? 'Mute audio feedback' : 'Enable audio feedback'}
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4 text-german-das" /> : <VolumeX className="w-4 h-4 text-ink/40" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <nav className="flex space-x-0.5 sm:space-x-2 overflow-x-auto py-1.5 sm:py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`
                  flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-ink text-cream-50 shadow-sm'
                    : 'text-ink/80 hover:text-ink hover:bg-cream-200/70'
                  }
                `}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold tracking-tight ${
                      isActive
                        ? 'bg-german-amber text-ink'
                        : 'bg-cream-200 text-ink/70 border border-ink/20'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
