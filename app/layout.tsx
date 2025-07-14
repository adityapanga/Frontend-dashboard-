import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '../components/NavBar' // Adjust path based on your NavBar location

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Loan Dashboard',
  description: 'Comprehensive loan management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}