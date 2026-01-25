'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clientLogger } from '@/lib/client-logger'

const STEP_MAP: Record<number, string> = {
  1: 'parties', // Start -> Parties
  2: 'parties',
  3: 'transport',
  4: 'items',
  5: 'review',
}

export default function DeclarationsPage() {
  const [declarations, setDeclarations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/declarations')
      .then((res) => res.json())
      .then((data) => {
        setDeclarations(data)
        setLoading(false)
      })
      .catch((err) => {
        clientLogger.error('Failed to fetch declarations', {
          error: err,
          context: 'declarations.list',
        })
        setLoading(false)
      })
  }, [])

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/declarations', { method: 'POST' })
      if (res.ok) {
        const decl = await res.json()
        router.push(`/declarations/${decl.id}/wizard/parties`)
      }
    } catch (error) {
      clientLogger.error('Failed to create declaration', {
        error,
        context: 'declarations.create',
      })
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Meine Ausfuhranmeldungen</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Neue Anmeldung
        </button>
      </div>

      {loading ? (
        <p>Laden...</p>
      ) : declarations.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded text-gray-500">
          Noch keine Anmeldungen vorhanden.
        </div>
      ) : (
        <div className="grid gap-4">
          {declarations.map((decl) => (
            <div
              key={decl.id}
              className="border p-4 rounded bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {decl.status === 'COMPLETED'
                    ? '✅ Abgeschlossen'
                    : '✏️ Entwurf'}
                </div>
                <div className="text-sm text-gray-500">
                  ID: {decl.id} | Erstellt:{' '}
                  {new Date(decl.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                {decl.status === 'DRAFT' ? (
                  <Link
                    href={`/declarations/${decl.id}/wizard/${STEP_MAP[decl.step] || 'parties'}`}
                    className="text-blue-600 hover:underline"
                  >
                    Fortsetzen (Schritt {decl.step})
                  </Link>
                ) : (
                  <Link
                    href={`/declarations/${decl.id}/export`}
                    className="text-green-600 hover:underline"
                  >
                    Ansehen
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
