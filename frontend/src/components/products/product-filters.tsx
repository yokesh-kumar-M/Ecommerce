'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collectionsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { Collection } from '@/types';

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: collections } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => collectionsApi.list().then((r) => Array.isArray(r.data) ? r.data : r.data.results ?? []),
  });

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page');
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  const activeCollection = searchParams.get('collection_id');
  const inStock = searchParams.get('in_stock');

  return (
    <div className="space-y-6 rounded-xl border bg-card p-4">
      <div>
        <h3 className="mb-3 font-semibold">Collections</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('collection_id', null)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${!activeCollection ? 'bg-primary/10 font-medium text-primary' : ''}`}
          >
            All Collections
          </button>
          {collections?.map((c) => (
            <button
              key={c.id}
              onClick={() => updateFilter('collection_id', String(c.id))}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${activeCollection === String(c.id) ? 'bg-primary/10 font-medium text-primary' : ''}`}
            >
              {c.title}
              <span className="ml-2 text-xs text-muted-foreground">({c.products_count})</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Availability</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('in_stock', null)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${!inStock ? 'bg-primary/10 font-medium text-primary' : ''}`}
          >
            All Items
          </button>
          <button
            onClick={() => updateFilter('in_stock', 'true')}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${inStock === 'true' ? 'bg-primary/10 font-medium text-primary' : ''}`}
          >
            In Stock Only
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Sort By</h3>
        <select
          value={searchParams.get('ordering') || ''}
          onChange={(e) => updateFilter('ordering', e.target.value || null)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Default</option>
          <option value="unit_price">Price: Low to High</option>
          <option value="-unit_price">Price: High to Low</option>
          <option value="title">Name: A-Z</option>
          <option value="-last_update">Newest First</option>
        </select>
      </div>

      {(activeCollection || inStock || searchParams.get('ordering') || searchParams.get('search')) && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => router.push('/products')}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
