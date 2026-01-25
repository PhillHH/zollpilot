'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemDataSchema } from '@/lib/validation/declaration';
import { z } from 'zod';

type ItemFormValues = z.infer<typeof itemDataSchema>;

export default function ItemsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemDataSchema),
    defaultValues: {
      currency: 'EUR',
    },
  });

  const fetchItems = () => {
    fetch(`/api/declarations/${params.id}`)
      .then((res) => res.json())
      .then((decl) => {
        setItems(decl.items || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [params.id]);

  const onAddItem = async (data: ItemFormValues) => {
    try {
      const res = await fetch(`/api/declarations/${params.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsAdding(false);
        reset();
        fetchItems(); // Refresh list
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onRemoveItem = async (itemId: string) => {
    if (!confirm('Position wirklich löschen?')) return;
    try {
      const res = await fetch(`/api/declarations/${params.id}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onNext = async () => {
    if (items.length === 0) {
      alert('Bitte erfassen Sie mindestens eine Warenposition.');
      return;
    }

    try {
      await fetch(`/api/declarations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 4 }),
      });
      router.push(`/declarations/${params.id}/wizard/review`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Laden...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-4">Warenpositionen</h2>

      {/* List */}
      <div className="space-y-4">
        {items.length === 0 && !isAdding && (
          <div className="text-center p-8 border border-dashed rounded text-gray-500">
            Noch keine Positionen erfasst.
          </div>
        )}
        {items.map((item, index) => (
          <div key={item.id} className="border p-4 rounded bg-gray-50 flex justify-between items-center">
            <div>
              <div className="font-bold">
                #{item.sequenceNumber} {item.data.description}
              </div>
              <div className="text-sm text-gray-600">
                Warennr: {item.data.commodityCode} | {item.data.grossMass}kg | {item.data.invoiceAmount.value} {item.data.invoiceAmount.currency}
              </div>
            </div>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-red-600 text-sm hover:underline"
            >
              Löschen
            </button>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {isAdding ? (
        <div className="border p-4 rounded bg-blue-50">
          <h3 className="font-bold mb-4">Neue Position</h3>
          <form onSubmit={handleSubmit(onAddItem)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Warenbezeichnung *</label>
              <input
                {...register('description')}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Warennummer (8-stellig) *</label>
              <input
                {...register('commodityCode')}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                placeholder="12345678"
                maxLength={8}
              />
              {errors.commodityCode && <p className="text-red-500 text-sm">{errors.commodityCode.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Rohmasse (kg) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('grossMass')}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
                {errors.grossMass && <p className="text-red-500 text-sm">{errors.grossMass.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Eigenmasse (kg) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('netMass')}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
                {errors.netMass && <p className="text-red-500 text-sm">{errors.netMass.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Rechnungsbetrag *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('invoiceAmount.value')}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
                {errors.invoiceAmount?.value && <p className="text-red-500 text-sm">{errors.invoiceAmount.value.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Währung *</label>
                <input
                  {...register('invoiceAmount.currency')}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 uppercase"
                  maxLength={3}
                />
                {errors.invoiceAmount?.currency && <p className="text-red-500 text-sm">{errors.invoiceAmount.currency.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-gray-600 px-4 py-2"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Hinzufügen
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full border-2 border-dashed border-gray-300 p-4 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500"
        >
          + Position hinzufügen
        </button>
      )}

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 px-4"
        >
          ← Zurück
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Zum Abschluss →
        </button>
      </div>
    </div>
  );
}
