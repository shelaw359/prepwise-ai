import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://prepwise.ai'),
  title: 'PrepWise AI — AI-Powered Study Planner',
  description:
    'Generate personalized, day-by-day study plans with AI. Enter your subject, topics, and exam date — PrepWise AI builds the schedule.',
  openGraph: {
    title: 'PrepWise AI — AI-Powered Study Planner',
    description:
      'Generate personalized, day-by-day study plans with AI.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-card/50 py-6">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              PrepWise AI — Smart studying, one day at a time.
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
