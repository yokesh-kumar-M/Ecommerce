'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cart';
import { cartApi } from '@/lib/api';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummary } from '@/components/cart/cart-summary';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const { cartId, setItemCount } = useCartStore();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => cartApi.retrieve(cartId!).then((r) => r.data),
    enabled: !!cartId,
  });

  useEffect(() => {
    if (cart) setItemCount(cart.items.length);
  }, [cart, setItemCount]);

  if (!cartId || (!isLoading && (!cart || cart.items.length === 0))) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-16">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some products to get started.</p>
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y rounded-xl border bg-card">
              {cart!.items.map((item: any) => (
                <CartItemRow key={item.id} item={item} cartId={cartId!} />
              ))}
            </div>
          )}
        </div>
        <div>
          {cart && <CartSummary cart={cart} />}
        </div>
      </div>
    </div>
  );
}
