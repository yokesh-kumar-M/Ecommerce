import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'ShopNest', template: '%s | ShopNest' },
  description: 'Premium e-commerce experience — quality products, fast delivery.',
  keywords: ['ecommerce', 'shopping', 'online store'],
  authors: [{ name: 'ShopNest' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shopnest.vercel.app',
    siteName: 'ShopNest',
    title: 'ShopNest — Premium E-Commerce',
    description: 'Premium e-commerce experience — quality products, fast delivery.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopNest',
    description: 'Premium e-commerce experience.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
