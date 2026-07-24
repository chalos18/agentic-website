import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/components/ui/globals.css';
import { display, body } from '@/lib/fonts';
import Header from '../components/custom/Header'
import Footer from '../components/custom/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Ana Oliveira',
    template: '%s · Ana Oliveira',
  },
  description: "Ana Oliveira's portfolio — fullstack engineering, a recipe blog, artists lounge, and Rubik's Cube trainer.",
}

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream text-espresso">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}


export default RootLayout;