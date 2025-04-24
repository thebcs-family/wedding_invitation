import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Person1 & Person2\'s Wedding',
  description: 'Join us in celebrating our love and commitment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 