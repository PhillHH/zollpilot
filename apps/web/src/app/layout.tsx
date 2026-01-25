import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { auth, signOut } from '@/auth'

export const metadata: Metadata = {
  title: 'ZollPilot',
  description: 'Structured customs data management platform',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <body>
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Link href="/" style={{ marginRight: '1rem' }}>
              Home
            </Link>
            <Link href="/declarations">Declarations</Link>
          </div>
          <div>
            {session ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem' }}>{session.user?.email}</span>
                <form
                  action={async () => {
                    'use server'
                    await signOut()
                  }}
                >
                  <button type="submit" style={{ cursor: 'pointer' }}>Logout</button>
                </form>
              </div>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>
        </nav>
        <main style={{ padding: '2rem' }}>{children}</main>
      </body>
    </html>
  )
}
