import type { ReactNode } from 'react';
import '@/components/ui/globals.css';
import Header from '../components/custom/Header'
import Footer from '../components/custom/Footer'

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
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