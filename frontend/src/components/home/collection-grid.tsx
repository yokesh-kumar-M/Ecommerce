import Link from 'next/link';
import type { Collection } from '@/types';

async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/collections/`,
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    return [];
  }
}

const COLLECTION_COLORS = [
  'from-blue-500/20 to-blue-600/5',
  'from-purple-500/20 to-purple-600/5',
  'from-emerald-500/20 to-emerald-600/5',
  'from-orange-500/20 to-orange-600/5',
  'from-pink-500/20 to-pink-600/5',
  'from-cyan-500/20 to-cyan-600/5',
];

export async function CollectionGrid() {
  const collections = await getCollections();
  if (!collections.length) return null;

  return (
    <section className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Shop by Collection</h2>
        <p className="mt-1 text-muted-foreground">Find exactly what you need</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {collections.slice(0, 6).map((collection, i) => (
          <Link
            key={collection.id}
            href={`/products?collection_id=${collection.id}`}
            className={`group flex flex-col items-center gap-3 rounded-xl bg-gradient-to-br ${COLLECTION_COLORS[i % COLLECTION_COLORS.length]} border p-6 text-center transition-shadow hover:shadow-md`}
          >
            <div className="text-2xl font-bold text-muted-foreground group-hover:text-foreground transition-colors">
              {collection.title.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{collection.title}</p>
              <p className="text-xs text-muted-foreground">{collection.products_count} items</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
