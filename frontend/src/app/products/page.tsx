import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductSkeleton } from '@/components/products/product-skeleton';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our full catalog of premium products.',
};

interface ProductsPageProps {
  searchParams: {
    collection_id?: string;
    min_price?: string;
    max_price?: string;
    search?: string;
    ordering?: string;
    page?: string;
    in_stock?: string;
  };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our curated selection of premium products.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64">
          <ProductFilters />
        </aside>
        <div className="flex-1">
          <Suspense fallback={<ProductSkeleton count={12} />}>
            <ProductGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
