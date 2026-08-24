import React from 'react';
import { Database } from '../types';
import { seriesLabel } from '../utils/labels';

interface CurriculumMapProps {
  database: Database;
  onOpenTopic: (seriesId: string, posterId: string) => void;
}

interface ChecklistItem {
  id: string;
  cefr: 'A1' | 'A2';
  german: string;
  english: string;
  seriesId: string;
  posterId: string | 'all';
  note?: string;
}

const CHECKLIST: ChecklistItem[] = [
  { id: 'gender', cefr: 'A1', german: 'DER DIE DAS', english: 'The three genders', seriesId: 'grundlagen-1', posterId: '01' },
  { id: 'cases', cefr: 'A1', german: '4 FÄLLE', english: 'The four cases', seriesId: 'grundlagen-1', posterId: '02' },
  { id: 'negation', cefr: 'A1', german: 'EIN KEIN NICHT', english: 'A, not a, not', seriesId: 'grundlagen-1', posterId: '03' },
  { id: 'seinhaben', cefr: 'A1', german: 'SEIN + HABEN', english: 'To be and to have', seriesId: 'grundlagen-1', posterId: '04' },
  { id: 'order', cefr: 'A1', german: 'WORTSTELLUNG', english: 'Word order', seriesId: 'grundlagen-1', posterId: '05' },
  { id: 'dusie', cefr: 'A1', german: 'DU / SIE', english: 'Informal vs formal you', seriesId: 'grundlagen-1', posterId: '06' },
  { id: 'wfragen', cefr: 'A1', german: 'W-FRAGEN', english: 'Question words', seriesId: 'grundlagen-1', posterId: '07' },
  { id: 'modals', cefr: 'A1', german: 'MODALVERBEN', english: 'Modal verbs', seriesId: 'grundlagen-1', posterId: '08' },
  { id: 'sep', cefr: 'A1', german: 'TRENNBARE VERBEN', english: 'Separable verbs', seriesId: 'grundlagen-2', posterId: '03' },
  { id: 'wo', cefr: 'A1', german: 'WO / WOHIN', english: 'Where vs where to', seriesId: 'grundlagen-1', posterId: '10' },
  { id: 'akk', cefr: 'A1', german: 'DER AKKUSATIV', english: 'Accusative case', seriesId: 'grundlagen-2', posterId: '01' },
  { id: 'dat', cefr: 'A1', german: 'DER DATIV', english: 'Dative case', seriesId: 'grundlagen-2', posterId: '09' },
  { id: 'perfekt', cefr: 'A1', german: 'DAS PERFEKT', english: 'Perfect tense (past)', seriesId: 'grundlagen-2', posterId: '04' },
  { id: 'poss', cefr: 'A1', german: 'MEIN DEIN SEIN', english: 'Possessives', seriesId: 'grundlagen-2', posterId: '05' },
  { id: 'pron', cefr: 'A1', german: 'ICH DU SIE', english: 'Personal pronouns', seriesId: 'grundlagen-2', posterId: '06' },
  { id: 'plurals', cefr: 'A1', german: 'PLURALE', english: 'Plurals', seriesId: 'alltag-plus', posterId: '01' },
  { id: 'akkp', cefr: 'A1', german: 'AKK-PRÄP', english: 'Accusative prepositions', seriesId: 'alltag-plus', posterId: '02' },
  { id: 'datp', cefr: 'A1', german: 'DAT-PRÄP', english: 'Dative prepositions', seriesId: 'alltag-plus', posterId: '03' },
  { id: 'days', cefr: 'A1', german: 'WOCHE + UHR', english: 'Days and telling the time', seriesId: 'alltag-plus', posterId: '05' },
  { id: 'countries', cefr: 'A1', german: 'LÄNDER', english: 'Countries and languages', seriesId: 'alltag-plus', posterId: '06' },
  { id: 'food', cefr: 'A1', german: 'ESSEN + TRINKEN', english: 'Food and drink', seriesId: 'wortschatz-1', posterId: '01' },
  { id: 'family', cefr: 'A1', german: 'DIE FAMILIE', english: 'The family', seriesId: 'wortschatz-2', posterId: '01' },
  { id: 'shop', cefr: 'A1', german: 'EINKAUFEN', english: 'Shopping', seriesId: 'wortschatz-2', posterId: '02' },
  { id: 'travel', cefr: 'A1', german: 'REISEN', english: 'Travel', seriesId: 'wortschatz-1', posterId: '10' },
  { id: 'imp', cefr: 'A2', german: 'DER IMPERATIV', english: 'Commands', seriesId: 'grundlagen-3', posterId: '01' },
  { id: 'comp', cefr: 'A2', german: 'GUT BESSER AM BESTEN', english: 'Comparatives', seriesId: 'grundlagen-3', posterId: '02' },
  { id: 'adj', cefr: 'A2', german: 'EIN ROTER ROCK', english: 'Adjective endings', seriesId: 'grundlagen-3', posterId: '03' },
  { id: 'war', cefr: 'A2', german: 'WAR + HATTE', english: 'Was and had', seriesId: 'grundlagen-3', posterId: '04' },
  { id: 'conn', cefr: 'A2', german: 'UND ABER WEIL', english: 'And, but, because', seriesId: 'grundlagen-3', posterId: '05' },
  { id: 'weil', cefr: 'A2', german: 'WEIL DASS WENN', english: 'Because, that, if/when', seriesId: 'alltag-plus', posterId: '10' },
  { id: 'refl', cefr: 'A2', german: 'REFLEXIV', english: 'Reflexive verbs', seriesId: 'alltag-plus', posterId: '04' },
  { id: 'wuerde', cefr: 'A2', german: 'WÜRDE', english: 'Would / polite requests', seriesId: 'alltag-plus', posterId: '11' },
  { id: 'school', cefr: 'A2', german: 'SCHULE', english: 'School and learning', seriesId: 'alltag-plus', posterId: '07' },
  { id: 'flat', cefr: 'A2', german: 'WOHNUNG', english: 'Housing', seriesId: 'alltag-plus', posterId: '08' },
  { id: 'appt', cefr: 'A2', german: 'TERMINE', english: 'Appointments', seriesId: 'alltag-plus', posterId: '09' },
  { id: 'ord', cefr: 'A2', german: 'ORDINALZAHLEN', english: 'Ordinal numbers', seriesId: 'alltag-plus', posterId: '12' },
  { id: 'work', cefr: 'A2', german: 'BERUF + ARBEIT', english: 'Jobs and work', seriesId: 'wortschatz-2', posterId: '03' },
  { id: 'doctor', cefr: 'A2', german: 'BEIM ARZT', english: 'At the doctor', seriesId: 'wortschatz-2', posterId: '05' },
];

const STILL_OPEN: { german: string; english: string; cefr: string }[] = [
  { german: 'DAS FUTUR (werden)', english: 'Future with werden', cefr: 'A2' },
  { german: 'RELATIVSÄTZE', english: 'Relative clauses', cefr: 'A2' },
  { german: 'DAS PASSIV', english: 'Passive voice', cefr: 'A2+' },
  { german: 'ZU + INFINITIV', english: 'Infinitive with zu', cefr: 'A2' },
  { german: 'HÖREN / SPRECHEN', english: 'Listening and speaking drills', cefr: 'A1–A2' },
];

export const CurriculumMap: React.FC<CurriculumMapProps> = ({ database, onOpenTopic }) => {
  const a1 = CHECKLIST.filter((i) => i.cefr === 'A1');
  const a2 = CHECKLIST.filter((i) => i.cefr === 'A2');

  const renderItem = (item: ChecklistItem) => {
    const poster = database.posters.find(
      (p) => p.series_id === item.seriesId && p.id === item.posterId,
    );
    const count = poster?.card_count ?? 0;
    const thin = count > 0 && count < 8;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onOpenTopic(item.seriesId, item.posterId)}
        className="text-left border border-ink/20 bg-cream-50 px-3 py-2 hover:border-ink transition-colors"
      >
        <div className="font-mono text-[10px] tracking-wider text-ink/50 uppercase">
          {thin ? 'Thin sheet' : 'In the deck'} · {count} cards
        </div>
        <div className="font-display font-bold text-ink text-sm leading-tight mt-0.5">
          {item.german}
        </div>
        <div className="text-xs text-ink/70">{item.english}</div>
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="border-2 border-ink bg-cream-50 p-5 sm:p-8">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
          Lehrplan · Curriculum
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-ink mt-1">
          A1–A2 map
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink/80 leading-relaxed">
          Goethe-style core for A1 and A2. Each tile opens the matching sheet.
          German name first, English in plain language underneath.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs">
          <span>{database.stats.total_series} series</span>
          <span>{database.stats.total_posters} posters</span>
          <span>{database.stats.total_cards} cards</span>
        </div>
      </div>

      <section>
        <h3 className="font-display text-xl font-bold text-ink mb-3">Series · Reihen</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {database.series.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpenTopic(s.id, 'all')}
              className="text-left border-l-4 border border-ink/20 bg-cream-50 px-3 py-3 hover:border-ink"
              style={{ borderLeftColor: s.color }}
            >
              <div className="font-bold text-ink">{seriesLabel(s)}</div>
              <div className="text-xs text-ink/60 font-mono mt-1">
                {s.level} · {s.poster_count} posters · {s.card_count} cards
              </div>
              <div className="text-xs text-ink/70 mt-1">{s.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-display text-xl font-bold text-ink mb-3">A1 · Breakthrough</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{a1.map(renderItem)}</div>
      </section>

      <section>
        <h3 className="font-display text-xl font-bold text-ink mb-3">A2 · Waystage</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{a2.map(renderItem)}</div>
      </section>

      <section>
        <h3 className="font-display text-xl font-bold text-ink mb-3">Still open</h3>
        <p className="text-sm text-ink/70 mb-3">
          Not in the card deck yet. Next sheets if we keep going.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {STILL_OPEN.map((row) => (
            <div key={row.german} className="border border-dashed border-ink/30 px-3 py-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink/50">{row.cefr}</div>
              <div className="font-bold text-ink text-sm">{row.german}</div>
              <div className="text-xs text-ink/70">{row.english}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-display text-xl font-bold text-ink mb-3">Every poster</h3>
        <div className="overflow-x-auto border border-ink/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-200 font-mono uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2">Series</th>
                <th className="px-3 py-2">Poster</th>
                <th className="px-3 py-2">English</th>
                <th className="px-3 py-2 text-right">Cards</th>
              </tr>
            </thead>
            <tbody>
              {database.posters.map((p) => (
                <tr
                  key={`${p.series_id}-${p.id}`}
                  className="border-t border-ink/10 cursor-pointer hover:bg-cream-100"
                  onClick={() => onOpenTopic(p.series_id, p.id)}
                >
                  <td className="px-3 py-1.5 whitespace-nowrap">
                    {seriesLabel({ name: p.series_name, english_name: p.series_english_name })}
                  </td>
                  <td className="px-3 py-1.5 font-semibold">{p.title}</td>
                  <td className="px-3 py-1.5 text-ink/70">{p.english_title || '—'}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{p.card_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
