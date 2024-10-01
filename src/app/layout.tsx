import { Metadata } from 'next'
import LayoutClient from './layout-client'
import { dmSans } from '@/styles/fonts'

export const metadata: Metadata = {
  title: 'Lumino Fine-Tuning Dashboard',
  description: 'Dashboard for Lumino AI services',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', url: '/icon.svg', type: 'image/svg+xml' },
  ],
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.className}>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
