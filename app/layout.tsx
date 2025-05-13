import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Federico & Cecilia's Wedding" />
        <meta property="og:description" content="Join us in celebrating our love on June 14, 2025!" />
        <meta property="og:image" content="https://fedececy.com/images/optimized/gallery/photo_1.webp" />
        <meta property="og:url" content="https://fedececy.com" />
        <meta property="og:type" content="website" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Federico & Cecilia's Wedding" />
        <meta name="twitter:description" content="Join us in celebrating our love on June 14, 2025!" />
        <meta name="twitter:image" content="https://fedececy.com/images/optimized/gallery/photo_1.webp" />
      </head>
      <body className={playfair.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
} 