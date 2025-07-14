import type { Metadata } from 'next/font/google'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '../components/NavBar'
import { Toaster } from 'sonner'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AbhiLoans - Loan Management Dashboard',
  description: 'Comprehensive fintech loan management system with advanced analytics and customer insights',
  keywords: 'loans, fintech, dashboard, banking, financial services',
  authors: [{ name: 'AbhiLoans Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <NavBar />
        <main className="relative">
          {children}
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}