'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { ordersApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { Cart } from '@/types';

export function CartSummary({ cart }: { cart: Cart }) {
  const { isAuthenticated } = useAuthStore();
  const { clearCart } = useCartStore();
  const router = useRouter();

  const checkout = useMutation({
    mutationFn: () => ordersApi.create(cart.id),
    onSuccess: () => {
      clearCart();
      toast({ title: 'Order placed!', description: 'Your order has been placed successfully.' });
      router.push('/orders');
    },
    onError: () => {
      toast({ title: 'Checkout failed', description: 'Please try again.', variant: 'destructive' });
    },
  });

  const subtotal = parseFloat(cart.total_price.toString());
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({cart.items.length} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? 'text-emerald-600' : ''}>
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {shipping > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Add {formatCurrency(50 - subtotal)} more for free shipping!
        </p>
      )}

      {isAuthenticated ? (
        <Button
          className="mt-6 w-full"
          size="lg"
          onClick={() => checkout.mutate()}
          disabled={checkout.isPending}
        >
          {checkout.isPending ? 'Placing Order...' : 'Place Order'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button className="mt-6 w-full" size="lg" asChild>
          <Link href="/auth/login">
            Sign in to Checkout <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
