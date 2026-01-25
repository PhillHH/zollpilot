'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clientLogger } from '@/lib/client-logger'

export default function NewDeclarationPage() {
  const router = useRouter()

  useEffect(() => {
    fetch('/api/declarations', { method: 'POST' })
      .then((res) => res.json())
      .then((decl) => {
        router.replace(`/declarations/${decl.id}/wizard/parties`)
      })
      .catch((err) =>
        clientLogger.error('Failed to create new declaration', {
          error: err,
          context: 'declarations.new',
        })
      )
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Anmeldung wird erstellt...</p>
    </div>
  )
}
