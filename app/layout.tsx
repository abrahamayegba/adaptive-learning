import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'SmartLMS – Adaptive Learning Management System',
  description: 'A smart, adaptive web-based Learning Management System that personalises your learning journey. Built for students, instructors, and administrators.',
  generator: 'v0.app',
  keywords: ['LMS', 'learning management system', 'adaptive learning', 'e-learning', 'online courses'],
}

export const viewport: Viewport = {
  themeColor: '#1e3a6e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
