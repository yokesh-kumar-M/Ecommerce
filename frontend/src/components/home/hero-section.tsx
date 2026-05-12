import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
            ✨ Free shipping on orders over $50
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Shop the{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Best Products
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Discover thousands of premium products with fast shipping, secure
            payments, and hassle-free returns.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </section>
  );
}
