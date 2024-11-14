import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Weather App',
  description: 'A modern weather application built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} relative min-h-screen`}>
        {/* Animated background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy" />
        
        {/* Animated particles or shapes (optional) */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        {/* Main content container with glass effect */}
        <div className="relative min-h-screen backdrop-blur-sm">
          <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
