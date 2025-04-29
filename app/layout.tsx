import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Federico & Cecilia's Wedding",
  description: 'Join us in celebrating our love on June 14, 2025',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com" />
      </head>
      <body className={playfair.className}>
        {children}
      </body>
    </html>
  );
} 