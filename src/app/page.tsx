'use client';

import { useMemo, useState } from 'react';

type DocItem = {
  id: number;
  title: string;
  type: string;
  year: number;
  date: string;
  topic: string;
  summary: string;
  keywords: string[];
  source_url: string;
  full_text: string;
};

const documents: DocItem[] = [
  {
    id: 1,
    title: 'הוראת ביצוע 4/2024 - ניכוי מס במקור',
    type: 'הוראת ביצוע',
    year: 2024,
    date: '2024-06-10',
    topic: 'ניכוי מס במקור',
    summary: 'הוראות בנושא ניכוי מס במקור לעסקים ולמשלמים.',
    keywords: ['ניכוי מס במקור', 'ניכוי', 'withholding tax'],
    source_url: '#',
    full_text: 'המסמך עוסק בכללים, תחולה, חריגים ודגשים מקצועיים בנושא ניכוי מס במקור.',
  },
  {
    id: 2,
    title: 'חוזר מס הכנסה 1/2025 - מחירי העברה',
    type: 'חוזר',
    year: 2025,
    date: '2025-01-15',
    topic: 'מיסוי בינלאומי',
    summary: 'הנחיות מקצועיות בנושא מחירי העברה ודיווח.',
    keywords: ['מחירי העברה', 'transfer pricing', 'cbc', 'cbcr'],
    source_url: '#',
    full_text: 'המסמך כולל הגדרות, חובות תיעוד, כללי דיווח ופרשנות מקצועית בתחום מחירי העברה.',
  },
  {
    id: 3,
    title: 'תמצית החלטת מיסוי - שינוי מבנה',
    type: 'תמצית החלטת מיסוי',
    year: 2023,
    date: '2023-09-20',
    topic: 'שינויי מבנה',
    summary: 'תמצית החלטת מיסוי בנושא שינוי מבנה והעברת נכסים.',
    keywords: ['החלטת מיסוי', 'רולינג', 'שינוי מבנה'],
    source_url: '#',
    full_text: 'המסמך כולל תנאים, עובדות מרכזיות, עמדת הרשות ותוצאת המס.',
  },
  {
    id: 4,
    title: 'תקנות מס הכנסה - נקודות זיכוי',
    type: 'תקנות',
    year: 2022,
    date: '2022-03-01',
    topic: 'זיכויים והקלות',
    summary: 'תקנות בנושא נקודות זיכוי והוראות יישום.',
    keywords: ['נקודות זיכוי', 'זיכוי ממס', 'ילדים'],
    source_url: '#',
    full_text: 'המסמך מפרט זכאות, תנאים, מנגנון חישוב והוראות יישום שונות.',
  },
  {
    id: 5,
    title: 'הנחיה מקצועית - מעמ בעסקאות שירות',
    type: 'הנחיה',
    year: 2024,
    date: '2024-11-07',
    topic: 'מעמ',
    summary: 'הנחיה מקצועית בנושא מעמ בעסקאות שירות.',
    keywords: ['מעמ', 'מע"מ', 'vat', 'שירותים'],
    source_url: '#',
    full_text: 'המסמך מסביר סיווג עסקאות, חבות מס, חריגים ודוגמאות יישומיות.',
  },
];

const synonyms: Record<string, string[]> = {
  'החלטת מיסוי': ['רולינג', 'תמצית החלטת מיסוי'],
  'רולינג': ['החלטת מיסוי', 'תמצית החלטת מיסוי'],
  'מחירי העברה': ['transfer pricing', 'cbc', 'cbcr'],
  'נקודות זיכוי': ['זיכוי ממס', 'ילדים'],
  'מעמ': ['מע"מ', 'vat'],
  'מע"מ': ['מעמ', 'vat'],
  'הוראת ביצוע': ['נוהל', 'הנחיה'],
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/["'׳״]/g, '')
    .replace(/[^\u0590-\u05FFa-z0-9\s/-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandQuery(query: string) {
  const base = normalize(query);
  if (!base) return [];

  const terms = new Set(base.split(' ').filter(Boolean));

  for (const [key, values] of Object.entries(synonyms)) {
    const nk = normalize(key);
    const nv = values.map(normalize);
    if (base.includes(nk) || nv.some((v) => base.includes(v))) {
      terms.add(nk);
      nv.forEach((v) => terms.add(v));
    }
  }

  return [...terms];
}

function scoreDoc(doc: DocItem, terms: string[]) {
  const title = normalize(doc.title);
  const type = normalize(doc.type);
  const topic = normalize(doc.topic);
  const summary = normalize(doc.summary);
  const keywords = normalize(doc.keywords.join(' '));
  const fullText = normalize(doc.full_text);
  const year = String(doc.year);

  let score = 0;

  for (const term of terms) {
    if (title.includes(term)) score += 50;
    if (type.includes(term)) score += 30;
    if (topic.includes(term)) score += 25;
    if (keywords.includes(term)) score += 20;
    if (summary.includes(term)) score += 12;
    if (fullText.includes(term)) score += 8;
    if (year === term) score += 35;
  }

  return score;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('הכל');
  const [yearFilter, setYearFilter] = useState('הכל');

  const types = ['הכל', ...Array.from(new Set(documents.map((d) => d.type)))];
  const years = ['הכל', ...Array.from(new Set(documents.map((d) => String(d.year)))).sort((a, b) => Number(b) - Number(a))];

  const results = useMemo(() => {
    const terms = expandQuery(query);

    return documents
      .filter((doc) => typeFilter === 'הכל' || doc.type === typeFilter)
      .filter((doc) => yearFilter === 'הכל' || String(doc.year) === yearFilter)
      .map((doc) => ({ ...doc, score: scoreDoc(doc, terms) }))
      .filter((doc) => !query.trim() || doc.score > 0)
      .sort((a, b) => b.score - a.score || b.year - a.year);
  }, [query, typeFilter, yearFilter]);

  return (
    <main className="min-h-screen bg-white text-slate-900" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">חיפוש חכם במסמכי מס</h1>
        <p className="text-slate-600 mb-8">
          חיפוש בהנחיות, תקנות, הוראות ביצוע, חוזרים ותמציות החלטות מיסוי
        </p>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש למשל: נקודות זיכוי, מחירי העברה, החלטת מיסוי"
            className="md:col-span-2 rounded-xl border px-4 py-3"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border px-4 py-3"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="rounded-xl border px-4 py-3"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['החלטת מיסוי', 'מחירי העברה', 'נקודות זיכוי', 'מע"מ', 'הוראת ביצוע'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
            >
              {term}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="rounded-2xl border p-6">לא נמצאו תוצאות</div>
          ) : (
            results.map((doc) => (
              <article key={doc.id} className="rounded-2xl border p-5 shadow-sm">
                <div className="mb-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{doc.type}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{doc.topic}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{doc.year}</span>
                </div>

                <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
                <p className="text-slate-600 mb-3">{doc.summary}</p>

                <div className="mb-3 flex flex-wrap gap-2">
                  {doc.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-full border px-3 py-1 text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">{doc.date}</span>
                  <a
                    href={doc.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-white"
                  >
                    פתח מקור
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
