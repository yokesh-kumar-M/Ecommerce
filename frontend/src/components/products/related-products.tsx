import { ProductCard } from './product-card';
import type { PaginatedResponse, Product } from '@/types';

interface RelatedProductsProps {
  collectionId: number;
  currentProductId: number;
}

export async function RelatedProducts({ collectionId, currentProductId }: RelatedProductsProps) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/?collection_id=${collectionId}&page_size=4`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data: PaginatedResponse<Product> = await res.json();
    const related = data.results.filter((p) => p.id !== currentProductId).slice(0, 4);
    if (!related.length) return null;

    return (
      <div>
        <h3 className="mb-4 font-semibold">Related Products</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch {
    return null;
  }
}
