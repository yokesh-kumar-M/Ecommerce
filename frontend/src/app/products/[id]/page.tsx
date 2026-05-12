import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/products/product-detail';
import { ProductReviews } from '@/components/products/product-reviews';
import { RelatedProducts } from '@/components/products/related-products';

interface ProductPageProps {
  params: { id: string };
}

async function getProduct(id: string) {
  try {
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}/`,
      { 
        next: { revalidate: 60 },
        signal: controller.signal
      },
    );
    clearTimeout(timerId);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `Buy ${product.title} at ShopNest`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
      <div className="mt-16 grid gap-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductReviews productId={product.id} />
        </div>
        <div>
          <RelatedProducts collectionId={product.collection.id} currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
}
