'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partiesSchema } from '@/lib/validation/declaration';
import { z } from 'zod';

type FormValues = z.infer<typeof partiesSchema>;

export default function PartiesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(partiesSchema),
  });

  useEffect(() => {
    fetch(`/api/declarations/${params.id}`)
      .then((res) => res.json())
      .then((decl) => {
        if (decl.data && decl.data.parties) {
          reset(decl.data.parties);
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
          data: { parties: data },
          step: 2,
        }),
      });

      if (res.ok) {
        router.push(`/declarations/${params.id}/wizard/transport`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Laden...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-4">Beteiligte</h2>

      {/* Exporter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Versender (Exporter)</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              {...register('exporter.name')}
              data-testid="input-exporter-name"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
            {errors.exporter?.name && (
              <p className="text-red-500 text-sm">{errors.exporter.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Strasse *</label>
            <input
              {...register('exporter.address.street')}
              data-testid="input-exporter-street"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
            {errors.exporter?.address?.street && (
              <p className="text-red-500 text-sm">{errors.exporter.address.street.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Stadt *</label>
              <input
                {...register('exporter.address.city')}
                data-testid="input-exporter-city"
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              {errors.exporter?.address?.city && (
                <p className="text-red-500 text-sm">{errors.exporter.address.city.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Land (ISO) *</label>
              <input
                {...register('exporter.address.country')}
                data-testid="input-exporter-country"
                placeholder="DE"
                className="mt-1 block w-full border border-gray-300 rounded p-2 uppercase"
                maxLength={2}
              />
              {errors.exporter?.address?.country && (
                <p className="text-red-500 text-sm">{errors.exporter.address.country.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recipient */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-gray-700">Empfänger (Recipient)</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              {...register('recipient.name')}
              data-testid="input-recipient-name"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
            {errors.recipient?.name && (
              <p className="text-red-500 text-sm">{errors.recipient.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Strasse *</label>
            <input
              {...register('recipient.address.street')}
              data-testid="input-recipient-street"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
            {errors.recipient?.address?.street && (
              <p className="text-red-500 text-sm">{errors.recipient.address.street.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Stadt *</label>
              <input
                {...register('recipient.address.city')}
                data-testid="input-recipient-city"
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              {errors.recipient?.address?.city && (
                <p className="text-red-500 text-sm">{errors.recipient.address.city.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Land (ISO) *</label>
              <input
                {...register('recipient.address.country')}
                data-testid="input-recipient-country"
                placeholder="US"
                className="mt-1 block w-full border border-gray-300 rounded p-2 uppercase"
                maxLength={2}
              />
              {errors.recipient?.address?.country && (
                <p className="text-red-500 text-sm">{errors.recipient.address.country.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
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
