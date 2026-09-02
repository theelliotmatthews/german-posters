import React, { useCallback, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, Map, RotateCcw, Volume2, X } from 'lucide-react';
import { UserProgress } from '../types';
import { sound, speakGerman } from '../utils/sound';
import { saveProgress, updateHighScore } from '../utils/storage';
import {
  completeZooQuest,
  getZooProgress,
  learnZooAnimal,
  resetZooQuest,
  startZooQuest,
} from '../utils/adventureStorage';
import { AdventureCanvas } from './adventure/AdventureCanvas';
import {
  BilingualLine,
  Direction,
  MapInteractable,
  PLAYER_START,
  ZOO_ANIMALS,
  buildAnimalQuiz,
  getFacingTarget,
  getNearbyInteractable,
  isWalkable,
} from '../data/adventures/zooQuest';

interface WeltAdventureGameProps {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

type Scene = 'title' | 'world' | 'dialog' | 'quiz' | 'journal' | 'ending';
type DialogAction = 'none' | 'startQuest' | 'openQuiz' | 'finishQuest';

interface DialogState {
  speaker: string;
  lines: BilingualLine[];
  index: number;
  portrait?: string;
  action: DialogAction;
}

const KEEPER_PORTRAIT = '/adventure/zoo/keeper.png';

function articleColor(article: string): string {
  if (article === 'der') return '#3978b7';
  if (article === 'die') return '#c94a5b';
  return '#45805b';
}

export const WeltAdventureGame: React.FC<WeltAdventureGameProps> = ({
  progress,
  setProgress,
}) => {
  const saved = getZooProgress(progress);
  const [scene, setScene] = useState<Scene>('title');
  const [player, setPlayer] = useState(PLAYER_START);
  const [direction, setDirection] = useState<Direction>('up');
  const [step, setStep] = useState(0);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [translationVisible, setTranslationVisible] = useState(false);
  const [activeAnimalId, setActiveAnimalId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<ReturnType<typeof buildAnimalQuiz> | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ text: string; correct: boolean } | null>(
    null,
  );
  const [zoneLabel, setZoneLabel] = useState(false);

  const nearby = useMemo(
    () => getNearbyInteractable(player, direction),
    [player, direction],
  );

  const commitProgress = useCallback(
    (next: UserProgress) => {
      setProgress(next);
      saveProgress(next);
    },
    [setProgress],
  );

  const enterWorld = useCallback(
    (fresh: boolean) => {
      if (fresh) commitProgress(resetZooQuest(progress));
      setPlayer(PLAYER_START);
      setDirection('up');
      setScene('world');
      setZoneLabel(true);
      window.setTimeout(() => setZoneLabel(false), 1800);
    },
    [commitProgress, progress],
  );

  const openDialog = useCallback(
    (
      speaker: string,
      lines: BilingualLine[],
      action: DialogAction = 'none',
      portrait?: string,
    ) => {
      sound.playFlip();
      setTranslationVisible(false);
      setDialog({ speaker, lines, index: 0, action, portrait });
      setScene('dialog');
    },
    [],
  );

  const move = useCallback(
    (nextDirection: Direction) => {
      if (scene !== 'world') return;
      setDirection(nextDirection);
      const target = getFacingTarget(player.x, player.y, nextDirection);
      if (!isWalkable(target.x, target.y)) {
        sound.playClick();
        return;
      }
      setPlayer(target);
      setStep((value) => value + 1);
    },
    [scene, player],
  );

  const finishDialog = useCallback(() => {
    if (!dialog) return;
    const action = dialog.action;
    setDialog(null);

    if (action === 'startQuest') {
      commitProgress(startZooQuest(progress));
      setScene('world');
      return;
    }

    if (action === 'openQuiz') {
      setScene('quiz');
      return;
    }

    if (action === 'finishQuest') {
      const completed = completeZooQuest(progress);
      const scored = updateHighScore('weltQuest', 2400, completed).updated;
      commitProgress(scored);
      sound.playCorrect();
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.65 } });
      setScene('ending');
      return;
    }

    setScene('world');
  }, [dialog, progress, commitProgress]);

  const advanceDialog = useCallback(() => {
    if (!dialog) return;
    sound.playClick();
    const currentLine = dialog.lines[dialog.index];
    if (currentLine.en && !translationVisible) {
      setTranslationVisible(true);
      return;
    }
    if (dialog.index < dialog.lines.length - 1) {
      setDialog({ ...dialog, index: dialog.index + 1 });
      setTranslationVisible(false);
    } else {
      finishDialog();
    }
  }, [dialog, translationVisible, finishDialog]);

  const interact = useCallback(() => {
    if (scene !== 'world') return;
    if (!nearby) {
      sound.playClick();
      return;
    }

    if (nearby.kind === 'keeper') {
      if (!saved.questStarted) {
        openDialog(
          'ZOOWÄRTERIN KELLER',
          [
            { de: 'Guten Morgen! Willkommen im Tierpark.', en: 'Good morning! Welcome to the zoo.' },
            { de: 'Ich brauche deine Hilfe, Forscher!', en: 'I need your help, explorer!' },
            {
              de: 'Vierundzwanzig Tier-Schilder sind leer. Beobachte jedes Tier und lerne seinen deutschen Namen.',
              en: 'Twenty-four animal signs are blank. Observe every animal and learn its German name.',
            },
            {
              de: 'Ich gebe dir das TIER-NOTIZBUCH. Komm zurück, wenn du alle vierundzwanzig Einträge hast.',
              en: 'I am giving you the ANIMAL NOTEBOOK. Come back when you have all twenty-four entries.',
            },
          ],
          'startQuest',
          KEEPER_PORTRAIT,
        );
      } else if (saved.animalsLearned.length < ZOO_ANIMALS.length) {
        openDialog(
          'ZOOWÄRTERIN KELLER',
          [
            {
              de: `Du hast ${saved.animalsLearned.length} von ${ZOO_ANIMALS.length} Tieren eingetragen.`,
              en: `You have recorded ${saved.animalsLearned.length} of ${ZOO_ANIMALS.length} animals.`,
            },
            {
              de: 'Gehe dicht an ein Gehege, schaue zum Tier und drücke LEERTASTE.',
              en: 'Walk close to an enclosure, face the animal and press SPACE.',
            },
            { de: 'Viel Erfolg!', en: 'Good luck!' },
          ],
          'none',
          KEEPER_PORTRAIT,
        );
      } else if (!saved.questComplete) {
        openDialog(
          'ZOOWÄRTERIN KELLER',
          [
            {
              de: 'Du hast alle vierundzwanzig Tiere gefunden!',
              en: 'You found all twenty-four animals!',
            },
            {
              de: 'Dein Tier-Notizbuch ist vollständig.',
              en: 'Your animal notebook is complete.',
            },
            {
              de: 'Ausgezeichnete Arbeit. Du bist jetzt TIERPARK-FORSCHER!',
              en: 'Excellent work. You are now a ZOO EXPLORER!',
            },
          ],
          'finishQuest',
          KEEPER_PORTRAIT,
        );
      } else {
        openDialog(
          'ZOOWÄRTERIN KELLER',
          [
            { de: 'Schön, dich wiederzusehen!', en: 'It is nice to see you again!' },
            {
              de: 'Der Tierpark ist stolz auf seinen besten Forscher.',
              en: 'The zoo is proud of its best explorer.',
            },
          ],
          'none',
          KEEPER_PORTRAIT,
        );
      }
      return;
    }

    if (nearby.kind === 'sign' || nearby.kind === 'binoculars') {
      openDialog(
        nearby.kind === 'sign' ? 'SCHILD' : 'FERNGLAS',
        nearby.lines ?? [{ de: 'Hier gibt es nichts zu sehen.', en: 'There is nothing to see here.' }],
      );
      return;
    }

    const animal = ZOO_ANIMALS.find((candidate) => candidate.id === nearby.animalId);
    if (!animal) return;

    if (!saved.questStarted) {
      openDialog(
        'ERZÄHLER',
        [
          {
            de: 'Das Tier schaut dich neugierig an.',
            en: 'The animal looks at you curiously.',
          },
          {
            de: 'Vielleicht solltest du zuerst mit der Zoowärterin sprechen.',
            en: 'Perhaps you should speak to the zookeeper first.',
          },
        ],
      );
      return;
    }

    if (saved.animalsLearned.includes(animal.id)) {
      speakGerman(animal.german);
      openDialog('TIER-NOTIZBUCH', [
        { de: `${animal.sound} Das ist ${animal.german}.`, en: `That is ${animal.english}.` },
        { de: animal.german, en: animal.english },
        { de: animal.factDe, en: animal.factEn },
        { de: `Mehrzahl: ${animal.plural}`, en: `Plural: ${animal.plural}` },
      ]);
      return;
    }

    setActiveAnimalId(animal.id);
    setQuiz(buildAnimalQuiz(animal));
    setQuizFeedback(null);
    speakGerman(animal.german);
    openDialog(
      'WILDE BEGEGNUNG!',
      [
        {
          de: `${animal.sound} Ein Tier kommt näher!`,
          en: `${animal.sound} An animal comes closer!`,
        },
        { de: `Hör gut zu: ${animal.german}`, en: `Listen carefully: ${animal.english}` },
        { de: animal.factDe, en: animal.factEn },
        {
          de: 'Trage den richtigen Namen in dein Tier-Notizbuch ein.',
          en: 'Enter the correct name in your animal notebook.',
        },
      ],
      'openQuiz',
    );
  }, [scene, nearby, saved, openDialog]);

  const answerQuiz = useCallback(
    (answer: string) => {
      if (!quiz || !activeAnimalId || quizFeedback?.correct) return;
      const animal = ZOO_ANIMALS.find((candidate) => candidate.id === activeAnimalId);
      if (!animal) return;

      if (answer === quiz.correct) {
        const updated = learnZooAnimal(progress, animal.id);
        commitProgress(updated);
        sound.playCorrect();
        speakGerman(animal.german);
        setQuizFeedback({
          text: `RICHTIG! ${animal.german} wurde eingetragen.`,
          correct: true,
        });
      } else {
        sound.playClick();
        setQuizFeedback({
          text: `Noch einmal! The article is “${animal.article}”.`,
          correct: false,
        });
      }
    },
    [quiz, activeAnimalId, quizFeedback, progress, commitProgress],
  );

  const closeQuiz = useCallback(() => {
    setQuiz(null);
    setQuizFeedback(null);
    setActiveAnimalId(null);
    setScene('world');
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) return;

      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (scene === 'dialog') advanceDialog();
        else if (scene === 'world') interact();
        else if (scene === 'quiz' && quizFeedback?.correct) closeQuiz();
        return;
      }

      if (event.code === 'Escape') {
        if (scene === 'journal') setScene('world');
        return;
      }

      if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        event.preventDefault();
        move('up');
      } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        event.preventDefault();
        move('down');
      } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        event.preventDefault();
        move('left');
      } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        event.preventDefault();
        move('right');
      } else if (event.code === 'KeyJ' && scene === 'world') {
        setScene('journal');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [scene, advanceDialog, interact, closeQuiz, move, quizFeedback]);

  if (scene === 'title') {
    return (
      <div className="zoo-game-shell">
        <div className="zoo-title-screen">
          <div className="zoo-title-pixels" aria-hidden="true" />
          <p className="zoo-title-kicker">SCHULWANDKARTE PRESENTS</p>
          <h1>DEUTSCH<br />WELT</h1>
          <div className="zoo-title-place">KAPITEL 01 · DER TIERPARK</div>
          <div className="zoo-title-animals" aria-hidden="true">
            {ZOO_ANIMALS.slice(0, 4).map((animal) => (
              <img key={animal.id} src={animal.sprite} alt="" />
            ))}
          </div>
          <div className="zoo-title-actions">
            <button type="button" onClick={() => enterWorld(false)}>
              {saved.questStarted ? 'SPIEL FORTSETZEN' : 'ABENTEUER STARTEN'}
            </button>
            {saved.questStarted && (
              <button type="button" className="secondary" onClick={() => enterWorld(true)}>
                NEUES SPIEL
              </button>
            )}
          </div>
          <p className="zoo-title-help">ARROWS / WASD · SPACE = INTERACT · J = JOURNAL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="zoo-game-shell">
      <div className="zoo-game-frame">
        <header className="zoo-hud">
          <div>
            <span className="zoo-hud-label">ORT</span>
            <strong>TIERPARK BERLIN</strong>
          </div>
          <div className="zoo-hud-quest">
            <span className="zoo-hud-label">AUFTRAG</span>
            <strong>
              {saved.questStarted
                ? `${saved.animalsLearned.length} / ${ZOO_ANIMALS.length} TIERE`
                : 'SPRICH MIT KELLER'}
            </strong>
          </div>
          <button type="button" onClick={() => setScene('journal')} title="Tier-Notizbuch öffnen">
            <BookOpen /> NOTIZBUCH
          </button>
          <button
            type="button"
            className="zoo-icon-button"
            onClick={() => setScene('title')}
            title="Zurück zum Titel"
          >
            <Map />
          </button>
        </header>

        <div className="zoo-world">
          <AdventureCanvas
            playerX={player.x}
            playerY={player.y}
            direction={direction}
            learnedAnimals={saved.animalsLearned}
            nearby={nearby}
            step={step}
          />

          {zoneLabel && (
            <div className="zoo-zone-label">
              <small>DU BETRITTST</small>
              TIERPARK BERLIN
            </div>
          )}

          {scene === 'world' && nearby && (
            <button type="button" className="zoo-interact-prompt" onClick={interact}>
              <kbd>SPACE</kbd>
              {nearby.label}
            </button>
          )}

          {scene === 'dialog' && dialog && (
            <div className="zoo-dialog-layer" onClick={advanceDialog}>
              <div className="zoo-dialog">
                {dialog.portrait && <img src={dialog.portrait} alt={dialog.speaker} />}
                <div>
                  <strong>{dialog.speaker}</strong>
                  <p className="zoo-dialog-german">{dialog.lines[dialog.index].de}</p>
                  {translationVisible && (
                    <p className="zoo-dialog-english">{dialog.lines[dialog.index].en}</p>
                  )}
                  <span>{dialog.index + 1} / {dialog.lines.length}</span>
                </div>
                <i aria-hidden="true">
                  {translationVisible ? 'NEXT ▼' : 'EN ▼'}
                </i>
              </div>
            </div>
          )}

          {scene === 'quiz' && quiz && activeAnimalId && (
            <div className="zoo-encounter">
              <div className="zoo-encounter-card">
                <div className="zoo-encounter-visual">
                  <img
                    src={ZOO_ANIMALS.find((animal) => animal.id === activeAnimalId)?.sprite}
                    alt=""
                  />
                  <span>WILDE BEGEGNUNG</span>
                </div>
                <div className="zoo-encounter-copy">
                  <h2>TIER-NOTIZBUCH</h2>
                  <p>{quiz.question}</p>
                  <div className="zoo-quiz-options">
                    {quiz.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        disabled={quizFeedback?.correct}
                        onClick={() => answerQuiz(option)}
                      >
                        <span
                          style={{
                            background: articleColor(option.split(' ')[0]),
                          }}
                        >
                          {option.split(' ')[0]}
                        </span>
                        {option.split(' ').slice(1).join(' ')}
                      </button>
                    ))}
                  </div>
                  {quizFeedback && (
                    <div className={quizFeedback.correct ? 'zoo-feedback correct' : 'zoo-feedback'}>
                      {quizFeedback.text}
                    </div>
                  )}
                  {quizFeedback?.correct && (
                    <button type="button" className="zoo-continue" onClick={closeQuiz}>
                      WEITER <kbd>ENTER</kbd>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {scene === 'journal' && (
            <div className="zoo-menu-layer">
              <div className="zoo-journal">
                <header>
                  <div>
                    <span>TIER-NOTIZBUCH</span>
                    <strong>{saved.animalsLearned.length} / {ZOO_ANIMALS.length} EINTRÄGE</strong>
                  </div>
                  <button type="button" onClick={() => setScene('world')}><X /></button>
                </header>
                <div className="zoo-journal-grid">
                  {ZOO_ANIMALS.map((animal, index) => {
                    const discovered = saved.animalsLearned.includes(animal.id);
                    return (
                      <article key={animal.id} className={discovered ? 'found' : ''}>
                        <span>NR. {String(index + 1).padStart(3, '0')}</span>
                        <img src={animal.sprite} alt={discovered ? animal.german : 'Unbekannt'} />
                        <div>
                          <strong>{discovered ? animal.german : '???'}</strong>
                          <small>{discovered ? animal.english : 'Noch nicht entdeckt'}</small>
                        </div>
                        {discovered && (
                          <button type="button" onClick={() => speakGerman(animal.german)}>
                            <Volume2 />
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>
                <footer>ESC = SCHLIESSEN · Gefundene Tiere können angehört werden.</footer>
              </div>
            </div>
          )}

          {scene === 'ending' && (
            <div className="zoo-menu-layer">
              <div className="zoo-ending">
                <span>AUFTRAG ERFÜLLT</span>
                <h2>TIERPARK-<br />FORSCHER</h2>
                <p>Du hast 24 neue deutsche Tiernamen gemeistert.</p>
                <div>★ 2400 FORSCHUNGSPUNKTE ★</div>
                <button type="button" onClick={() => setScene('world')}>WEITER ERKUNDEN</button>
              </div>
            </div>
          )}

          <div className="zoo-touch-controls">
            <button type="button" onClick={() => move('up')}>▲</button>
            <button type="button" onClick={() => move('left')}>◀</button>
            <button type="button" className="action" onClick={interact}>A</button>
            <button type="button" onClick={() => move('right')}>▶</button>
            <button type="button" onClick={() => move('down')}>▼</button>
          </div>
        </div>

        <footer className="zoo-statusbar">
          <span>ARROWS / WASD — MOVE</span>
          <span>SPACE — INTERACT</span>
          <span>J — NOTIZBUCH</span>
          <button
            type="button"
            onClick={() => {
              commitProgress(resetZooQuest(progress));
              setPlayer(PLAYER_START);
              setScene('title');
            }}
          >
            <RotateCcw /> RESET
          </button>
        </footer>
      </div>
    </div>
  );
};
