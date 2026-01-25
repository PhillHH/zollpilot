'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transportSchema, generalSchema } from '@/lib/validation/declaration';
import { z } from 'zod';

const stepSchema = z.object({
  transport: transportSchema,
  general: generalSchema,
});

type FormValues = z.infer<typeof stepSchema>;

export default function TransportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(stepSchema),
  });

  useEffect(() => {
    fetch(`/api/declarations/${params.id}`)
      .then((res) => res.json())
      .then((decl) => {
        if (decl.data) {
          // Flatten or just map if structure matches
          reset({
            transport: decl.data.transport,
            general: decl.data.general,
          });
        }
        setLoading(false);
      });
  }, [params.id, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch(`/api/declarations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            transport: data.transport,
            general: data.general,
          },
          step: 3,
        }),
      });

      if (res.ok) {
        router.push(`/declarations/${params.id}/wizard/items`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Laden...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-4">Transport & Allgemeines</h2>

      {/* General */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Allgemein</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Ausfuhrland (ISO) *</label>
            <input
              {...register('general.exportCountry')}
              data-testid="input-general-exportCountry"
              placeholder="DE"
              className="mt-1 block w-full border border-gray-300 rounded p-2 uppercase"
              maxLength={2}
            />
            {errors.general?.exportCountry && (
              <p className="text-red-500 text-sm">{errors.general.exportCountry.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Bestimmungsland (ISO) *</label>
            <input
              {...register('general.destinationCountry')}
              data-testid="input-general-destinationCountry"
              placeholder="US"
              className="mt-1 block w-full border border-gray-300 rounded p-2 uppercase"
              maxLength={2}
            />
            {errors.general?.destinationCountry && (
              <p className="text-red-500 text-sm">{errors.general.destinationCountry.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-gray-700">Transportmittel</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Verkehrszweig *</label>
            <select
              {...register('transport.mode')}
              data-testid="select-transport-mode"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              <option value="">Bitte wählen...</option>
              <option value="1">1 - Seeverkehr</option>
              <option value="2">2 - Eisenbahnverkehr</option>
              <option value="3">3 - Straßenverkehr</option>
              <option value="4">4 - Luftverkehr</option>
            </select>
            {errors.transport?.mode && (
              <p className="text-red-500 text-sm">{errors.transport.mode.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Kennzeichen / Identität *</label>
            <input
              {...register('transport.identity')}
              data-testid="input-transport-identity"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
            {errors.transport?.identity && (
              <p className="text-red-500 text-sm">{errors.transport.identity.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Staatszugehörigkeit (ISO)</label>
            <input
              {...register('transport.nationality')}
              data-testid="input-transport-nationality"
              placeholder="DE"
              className="mt-1 block w-full border border-gray-300 rounded p-2 uppercase"
              maxLength={2}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 px-4"
        >
          ← Zurück
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          data-testid="btn-next"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Speichert...' : 'Weiter →'}
        </button>
      </div>
    </form>
  );
}
