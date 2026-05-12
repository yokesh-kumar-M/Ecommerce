import { ProductCard } from './product-card';
import type { PaginatedResponse, Product } from '@/types';

interface ProductGridProps {
  searchParams: Record<string, string | number | undefined>;
}

async function getProducts(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/?${query.toString()}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json() as Promise<PaginatedResponse<Product>>;
}

export async function ProductGrid({ searchParams }: ProductGridProps) {
  const data = await getProducts(searchParams);

  if (!data.results.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-muted/30">
        <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {data.count} {data.count === 1 ? 'product' : 'products'} found
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {data.results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
