import Link from 'next/link';
import { ArrowRight, Shield, Truck, RotateCcw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CollectionGrid } from '@/components/home/collection-grid';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
            { icon: Shield, title: 'Secure Payment', desc: 'SSL encrypted checkout' },
            { icon: RotateCcw, title: '30-Day Returns', desc: 'Hassle-free returns' },
            { icon: Star, title: 'Top Rated', desc: '4.9 avg customer rating' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CollectionGrid />
      <FeaturedProducts />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to start shopping?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Browse thousands of products with free shipping on orders over $50.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/products">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
