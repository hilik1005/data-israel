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
    title: 'הנחיה מקצועית - מע"מ בעסקאות שירות',
    type: 'הנחיה',
    year: 2024,
    date: '2024-11-07',
    topic: 'מע"מ',
    summary: 'הנחיה מקצועית בנושא מע"מ בעסקאות שירות.',
    keywords: ['מע"מ', 'מעמ', 'vat', 'שירותים'],
    source_url: '#',
    full_text: 'המסמך מסביר סיווג עסקאות, חבות מס, חריגים ודוגמאות יישומיות.',
  },
  {
    id: 6,
    title: 'הנחיה מקצועית - תקנות שווי שימוש',
    type: 'הנחיה',
    year: 2023,
    date: '2023-05-12',
    topic: 'שווי שימוש',
    summary: 'הנחיה בנושא שווי שימוש ברכב והשלכות מס.',
    keywords: ['שווי שימוש', 'רכב', 'רכב צמוד'],
    source_url: '#',
    full_text: 'המסמך מפרט מצבים שונים, כללי חישוב והיבטי דיווח שוטפים.',
  },
  {
    id: 7,
    title: 'חוזר מקצועי - מוסד קבע',
    type: 'חוזר',
    year: 2024,
    date: '2024-08-03',
    topic: 'מיסוי בינלאומי',
    summary: 'הבהרות בנושא מוסד קבע ופעילות זרה.',
    keywords: ['מוסד קבע', 'permanent establishment', 'מיסוי בינלאומי'],
    source_url: '#',
    full_text: 'המסמך סוקר הגדרות, מבחנים רלוונטיים, דוגמאות ועמדת הרשות.',
  },
  {
    id: 8,
    title: 'תמצית החלטת מיסוי - מיזוג חברות',
    type: 'תמצית החלטת מיסוי',
    year: 2025,
    date: '2025-02-18',
    topic: 'מיזוגים',
    summary: 'תמצית החלטה בנושא מיזוג חברות והעברת פעילות.',
    keywords: ['מיזוג', 'החלטת מיסוי', 'רולינג', 'מיזוג חברות'],
    source_url: '#',
    full_text: 'המסמך מתאר את העובדות, התנאים והשלכות המס של המהלך.',
  }
];

const synonyms: Record<string, string[]> = {
  'החלטת מיסוי': ['רולינג', 'תמצית החלטת מיסוי'],
  'רולינג': ['החלטת מיסוי', 'תמצית החלטת מיסוי'],
  'מחירי העברה': ['transfer pricing', 'cbc', 'cbcr'],
  'נקודות זיכוי': ['זיכוי ממס', 'ילדים'],
  'מע"מ': ['מעמ', 'vat'],
  'מעמ': ['מע"מ', 'vat'],
  'הוראת ביצוע': ['נוהל', 'הנחיה'],
  'מוסד קבע': ['permanent establishment'],
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
  const years = [
    'הכל',
    ...Array.from(new Set(documents.map((d) => String(d.year)))).sort((a, b) => Number(b) - Number(a)),
  ];

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
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>חיפוש חכם במסמכי מס</h1>
          <p style={styles.subtitle}>
            חיפוש בהנחיות, תקנות, הוראות ביצוע, חוזרים ותמציות החלטות מיסוי
          </p>
        </header>

        <section style={styles.filters}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש למשל: נקודות זיכוי, מחירי העברה, החלטת מיסוי"
            style={styles.input}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={styles.select}
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
            style={styles.select}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </section>

        <section style={styles.quickTags}>
          {['החלטת מיסוי', 'מחירי העברה', 'נקודות זיכוי', 'מע"מ', 'הוראת ביצוע', 'מוסד קבע'].map((term) => (
            <button key={term} onClick={() => setQuery(term)} style={styles.tagButton}>
              {term}
            </button>
          ))}
        </section>

        <section style={styles.results}>
          {results.length === 0 ? (
            <div style={styles.empty}>לא נמצאו תוצאות</div>
          ) : (
            results.map((doc) => (
              <article key={doc.id} style={styles.card}>
                <div style={styles.badges}>
                  <span style={styles.badge}>{doc.type}</span>
                  <span style={styles.badge}>{doc.topic}</span>
                  <span style={styles.badge}>{doc.year}</span>
                </div>

                <h2 style={styles.cardTitle}>{doc.title}</h2>
                <p style={styles.cardSummary}>{doc.summary}</p>

                <div style={styles.keywords}>
                  {doc.keywords.map((keyword) => (
                    <span key={keyword} style={styles.keyword}>
                      {keyword}
                    </span>
                  ))}
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.date}>{doc.date}</span>
                  <a href={doc.source_url} target="_blank" rel="noreferrer" style={styles.linkButton}>
                    פתח מקור
                  </a>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    color: '#0f172a',
    direction: 'rtl',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 16px',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 700,
    margin: 0,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#475569',
    margin: 0,
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  input: {
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '16px',
    width: '100%',
    background: '#fff',
    boxSizing: 'border-box',
  },
  quickTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  },
  tagButton: {
    border: '1px solid #cbd5e1',
    background: '#fff',
    borderRadius: '999px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  empty: {
    border: '1px solid #e2e8f0',
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  badge: {
    background: '#e2e8f0',
    borderRadius: '999px',
    padding: '6px 10px',
    fontSize: '13px',
  },
  cardTitle: {
    fontSize: '22px',
    margin: 0,
    marginBottom: '10px',
  },
  cardSummary: {
    margin: 0,
    marginBottom: '14px',
    color: '#475569',
    lineHeight: 1.6,
  },
  keywords: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  keyword: {
    border: '1px solid #cbd5e1',
    borderRadius: '999px',
    padding: '5px 10px',
    fontSize: '12px',
    background: '#fff',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  date: {
    color: '#64748b',
    fontSize: '14px',
  },
  linkButton: {
    textDecoration: 'none',
    background: '#0f172a',
    color: '#fff',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
  },
};
