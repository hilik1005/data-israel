import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'חיפוש חכם במסמכי מס',
  description: 'חיפוש חכם בהנחיות, תקנות, הוראות ביצוע, חוזרים ותמציות החלטות מיסוי',
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
