import './globals.scss';
import { Noto_Sans_KR } from 'next/font/google';
import React from 'react';

const font = Noto_Sans_KR({ subsets: ['latin'], weight: ['400'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>Translator</title>
      </head>
      <body className={`${font.className} bg-stone-800 text-stone-100`}>
        <div className="container mx-auto my-5">{children}</div>
      </body>
    </html>
  );
}
