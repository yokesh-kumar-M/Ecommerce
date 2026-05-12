import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import type { PaginatedResponse, Product } from '@/types';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/?ordering=-last_update&page_size=8`,
      { 
        next: { revalidate: 300 },
        signal: controller.signal,
      },
    );
    clearTimeout(id);
    
    if (!res.ok) return [];
    const data: PaginatedResponse<Product> = await res.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products.length) return null;

  return (
    <section className="container mx-auto px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Products</h2>
          <p className="mt-1 text-muted-foreground">Handpicked just for you</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/products">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
