'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { cartApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cartId, setCartId, setItemCount, itemCount } = useCartStore();
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: async () => {
      let currentCartId = cartId;
      if (!currentCartId) {
        const { data } = await cartApi.create();
        currentCartId = data.id;
        if (currentCartId) {
          setCartId(currentCartId);
        }
      }
      if (!currentCartId) throw new Error('Could not create cart');
      await cartApi.addItem(currentCartId, { product_id: product.id, quantity: 1 });
      return currentCartId;
    },
    onSuccess: (cId) => {
      setItemCount(itemCount + 1);
      queryClient.invalidateQueries({ queryKey: ['cart', cId] });
      toast({ title: 'Added to cart', description: product.title });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Could not add to cart.', variant: 'destructive' });
    },
  });

  const image = product.images?.[0]?.image;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 opacity-20" />
          </div>
        )}
        {product.inventory === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium hover:text-primary">{product.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{product.collection.title}</p>

        {product.average_rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{product.average_rating}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <p className="font-semibold">{formatCurrency(product.unit_price)}</p>
          <Button
            size="sm"
            onClick={() => addToCart.mutate()}
            disabled={addToCart.isPending || product.inventory === 0}
          >
            <ShoppingCart className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
