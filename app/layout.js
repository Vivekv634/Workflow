import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from './provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Workflow',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${inter.className} *:p-0 *:m-0 *:box-border`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
