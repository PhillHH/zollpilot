'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDeclarationPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/declarations', { method: 'POST' })
      .then((res) => res.json())
      .then((decl) => {
        router.replace(`/declarations/${decl.id}/wizard/parties`);
      })
      .catch((err) => console.error(err));
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Anmeldung wird erstellt...</p>
    </div>
  );
}
