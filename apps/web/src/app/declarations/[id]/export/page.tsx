'use client';

import Link from 'next/link';

export default function ExportPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-8 max-w-2xl text-center">
      <div className="bg-green-50 border border-green-200 rounded p-8 mb-8">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-800 mb-2">Anmeldung erfolgreich abgeschlossen!</h1>
        <p className="text-green-700">
          Ihre Ausfuhranmeldung wurde erfolgreich validiert und gespeichert.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <a
          href={`/api/declarations/${params.id}/pdf`}
          target="_blank"
          data-testid="link-pdf-download"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center font-bold"
        >
          📄 PDF Herunterladen
        </a>
        <Link
          href="/declarations"
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded hover:bg-gray-200 border border-gray-300"
        >
          Zurück zur Übersicht
        </Link>
      </div>
    </div>
  );
}
