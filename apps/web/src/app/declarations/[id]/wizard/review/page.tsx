'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [decl, setDecl] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/declarations/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setDecl(data);
        setLoading(false);
      });
  }, [params.id]);

  const onComplete = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/declarations/${params.id}/complete`, {
        method: 'POST',
      });

      if (res.ok) {
        router.push(`/declarations/${params.id}/export`);
      } else {
        const err = await res.json();
        setError(JSON.stringify(err.details || err.error));
      }
    } catch (e) {
      setError('Netzwerkfehler');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Laden...</div>;
  if (!decl) return <div>Fehler beim Laden</div>;

  const { data, items } = decl;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-4">Zusammenfassung & Abschluss</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <strong>Fehler:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-gray-700 mb-2">Beteiligte</h3>
          <p className="text-sm">
            <span className="font-semibold">Versender:</span> {data.parties?.exporter?.name}<br />
            {data.parties?.exporter?.address?.street}, {data.parties?.exporter?.address?.city}, {data.parties?.exporter?.address?.country}
          </p>
          <p className="text-sm mt-2">
            <span className="font-semibold">Empfänger:</span> {data.parties?.recipient?.name}<br />
            {data.parties?.recipient?.address?.street}, {data.parties?.recipient?.address?.city}, {data.parties?.recipient?.address?.country}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-gray-700 mb-2">Transport</h3>
          <p className="text-sm">
            <span className="font-semibold">Verkehrszweig:</span> {data.transport?.mode}<br />
            <span className="font-semibold">Identität:</span> {data.transport?.identity}<br />
            <span className="font-semibold">Route:</span> {data.general?.exportCountry} → {data.general?.destinationCountry}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-700 mb-2">Warenpositionen ({items?.length})</h3>
        <ul className="text-sm space-y-1">
          {items?.map((item: any, i: number) => (
            <li key={i}>
              #{item.sequenceNumber}: {item.data.description} ({item.data.commodityCode}) - {item.data.grossMass}kg
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 px-4"
        >
          ← Zurück
        </button>
        <button
          onClick={onComplete}
          disabled={submitting}
          data-testid="btn-complete"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 font-bold"
        >
          {submitting ? 'Prüft & Speichert...' : 'Kostenpflichtig Abschließen'}
        </button>
      </div>
    </div>
  );
}
