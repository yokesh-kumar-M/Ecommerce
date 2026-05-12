'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Star, Package, Tag } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { cartApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
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
      await cartApi.addItem(currentCartId, { product_id: product.id, quantity });
      return currentCartId;
    },
    onSuccess: (cId) => {
      setItemCount(itemCount + quantity);
      queryClient.invalidateQueries({ queryKey: ['cart', cId] });
      toast({ title: `${quantity} item${quantity > 1 ? 's' : ''} added to cart` });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Could not add to cart.', variant: 'destructive' });
    },
  });

  const images = product.images || [];
  const currentImage = images[activeImage]?.image;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
          {currentImage ? (
            <Image src={currentImage} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-16 w-16 opacity-20" />
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${i === activeImage ? 'border-primary' : 'border-transparent'}`}
              >
                <Image src={img.image} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{product.collection.title}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.title}</h1>
        </div>

        {product.average_rating && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= Math.round(product.average_rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">({product.average_rating})</span>
          </div>
        )}

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">{formatCurrency(product.unit_price)}</span>
          {product.price_with_tax !== product.unit_price && (
            <span className="text-sm text-muted-foreground">
              {formatCurrency(product.price_with_tax)} with tax
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4" />
          {product.inventory > 0 ? (
            <span className="text-emerald-600">
              {product.inventory > 10 ? 'In Stock' : `Only ${product.inventory} left`}
            </span>
          ) : (
            <span className="text-destructive">Out of Stock</span>
          )}
        </div>

        {product.description && (
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        )}

        {product.inventory > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <button
                className="px-3 py-2 hover:bg-accent disabled:opacity-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <button
                className="px-3 py-2 hover:bg-accent disabled:opacity-50"
                onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                disabled={quantity >= product.inventory}
              >
                +
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              onClick={() => addToCart.mutate()}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
