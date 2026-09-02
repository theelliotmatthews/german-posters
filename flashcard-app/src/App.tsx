import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TopicPicker } from './components/TopicPicker';
import { FlashcardDeck } from './components/FlashcardDeck';
import { GenderBlitzGame } from './components/GenderBlitzGame';
import { SpeedQuizGame } from './components/SpeedQuizGame';
import { WordScrambleGame } from './components/WordScrambleGame';
import { MatchGridGame } from './components/MatchGridGame';
import { ListenSpeakGame } from './components/ListenSpeakGame';
import { WeltAdventureGame } from './components/WeltAdventureGame';
import { PosterGallery } from './components/PosterGallery';
import { CurriculumMap } from './components/CurriculumMap';
import { CardSearchModal } from './components/CardSearchModal';
import { Database, UserProgress, Card } from './types';
import { sound } from './utils/sound';
import { loadProgress, saveProgress } from './utils/storage';
import { seriesLabel } from './utils/labels';
import databaseData from './data/flashcards.json';

export const App: React.FC = () => {
  const database = databaseData as unknown as Database;
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [activeTab, setActiveTab] = useState<ActiveTab>('study');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [topicSeriesId, setTopicSeriesId] = useState<string>('all');
  const [topicPosterId, setTopicPosterId] = useState<string>('all');

  useEffect(() => {
    sound.setEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  const handleToggleSound = () => {
    const next = !progress.soundEnabled;
    sound.setEnabled(next);
    setProgress((prev) => {
      const updated = { ...prev, soundEnabled: next };
      saveProgress(updated);
      return updated;
    });
  };

  const handleStudyPosterDeck = (posterId: string, seriesId: string) => {
    setTopicSeriesId(seriesId);
    setTopicPosterId(posterId);
    setActiveTab('study');
  };

  const handleSelectCardFromSearch = (card: Card) => {
    setTopicSeriesId(card.series_id);
    setTopicPosterId(card.poster_id);
    setActiveTab('study');
  };

  const masteredCount = Object.values(progress.cardStatus).filter(
    (status) => status === 'mastered'
  ).length;

  const topicKey = `${topicSeriesId}::${topicPosterId}`;
  const seriesNames = database.series.map((s) => seriesLabel(s)).join(', ');
  const isViewportFitTab = activeTab !== 'posters' && activeTab !== 'map';
  const hideTopicPicker = activeTab === 'posters' || activeTab === 'map' || activeTab === 'welt';

  return (
    <div
      className={`bg-cream-100 text-ink flex flex-col font-sans ${
        isViewportFitTab ? 'h-dvh overflow-hidden' : 'min-h-screen'
      }`}
    >
      <div className="shrink-0 z-40">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          progress={progress}
          onToggleSound={handleToggleSound}
          onOpenSearch={() => setIsSearchOpen(true)}
          totalCards={database.stats.total_cards}
          masteredCount={masteredCount}
          posterCount={database.stats.total_posters}
        />
        {!hideTopicPicker && (
          <TopicPicker
            database={database}
            seriesId={topicSeriesId}
            posterId={topicPosterId}
            onSeriesChange={setTopicSeriesId}
            onPosterChange={setTopicPosterId}
            compact={isViewportFitTab}
          />
        )}
      </div>

      <main
        className={`flex-1 ${
          isViewportFitTab ? 'min-h-0 overflow-hidden py-1 sm:py-2' : 'py-2 sm:py-8'
        }`}
      >
        {activeTab === 'study' && (
          <FlashcardDeck
            database={database}
            progress={progress}
            setProgress={setProgress}
            onViewPoster={(pid, sid) => {
              setTopicPosterId(pid);
              setTopicSeriesId(sid);
              setActiveTab('posters');
            }}
            seriesId={topicSeriesId}
            posterId={topicPosterId}
            viewportFit
          />
        )}

        {activeTab === 'blitz' && (
          <GenderBlitzGame
            key={topicKey}
            database={database}
            progress={progress}
            setProgress={setProgress}
            seriesId={topicSeriesId}
            posterId={topicPosterId}
          />
        )}

        {activeTab === 'quiz' && (
          <SpeedQuizGame
            key={topicKey}
            database={database}
            progress={progress}
            setProgress={setProgress}
            seriesId={topicSeriesId}
            posterId={topicPosterId}
          />
        )}

        {activeTab === 'scramble' && (
          <WordScrambleGame
            key={topicKey}
            database={database}
            progress={progress}
            setProgress={setProgress}
            seriesId={topicSeriesId}
            posterId={topicPosterId}
          />
        )}

        {activeTab === 'match' && (
          <MatchGridGame
            key={topicKey}
            database={database}
            progress={progress}
            setProgress={setProgress}
            seriesId={topicSeriesId}
            posterId={topicPosterId}
          />
        )}

        {activeTab === 'listen' && (
          <ListenSpeakGame
            key={topicKey}
            database={database}
            progress={progress}
            setProgress={setProgress}
            seriesId={topicSeriesId}
            posterId={topicPosterId}
          />
        )}

        {activeTab === 'welt' && (
          <WeltAdventureGame progress={progress} setProgress={setProgress} />
        )}

        {activeTab === 'posters' && (
          <PosterGallery
            database={database}
            onStudyPosterDeck={handleStudyPosterDeck}
            selectedPosterId={topicPosterId !== 'all' ? topicPosterId : null}
            selectedSeriesId={topicSeriesId !== 'all' ? topicSeriesId : null}
          />
        )}

        {activeTab === 'map' && (
          <CurriculumMap
            database={database}
            onOpenTopic={(seriesId, posterId) => {
              setTopicSeriesId(seriesId);
              setTopicPosterId(posterId === 'all' ? 'all' : posterId);
              setActiveTab('study');
            }}
          />
        )}
      </main>

      <CardSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        database={database}
        onSelectCard={handleSelectCardFromSearch}
      />

      {!isViewportFitTab && (
        <footer className="hidden sm:block border-t border-ink/15 bg-cream-50 py-6 mt-12 text-xs font-mono text-ink/60 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-german-das"></span>
              <span>SCHULWANDKARTE v1.0 · A1/A2 GERMAN FLASHCARDS & GAMES</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span>{database.stats.total_posters} Posters</span>
              <span>·</span>
              <span>{database.stats.total_cards} Cards</span>
              <span>·</span>
              <span>
                {database.stats.total_series} Series ({seriesNames})
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
