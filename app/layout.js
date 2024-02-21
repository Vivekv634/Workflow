import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from './provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Workflow',
  description: 'Visualize your flow',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${inter.className}`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
