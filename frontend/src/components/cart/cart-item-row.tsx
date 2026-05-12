'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
  cartId: string;
}

export function CartItemRow({ item, cartId }: CartItemRowProps) {
  const queryClient = useQueryClient();

  const updateQuantity = useMutation({
    mutationFn: (quantity: number) => cartApi.updateItem(cartId, item.id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart', cartId] }),
  });

  const removeItem = useMutation({
    mutationFn: () => cartApi.deleteItem(cartId, item.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart', cartId] }),
  });

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
          No img
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link href={`/products/${item.product.id}`} className="line-clamp-1 font-medium hover:text-primary">
          {item.product.title}
        </Link>
        <p className="text-sm text-muted-foreground">{formatCurrency(item.product.unit_price)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity.mutate(item.quantity - 1)}
          disabled={item.quantity <= 1 || updateQuantity.isPending}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity.mutate(item.quantity + 1)}
          disabled={updateQuantity.isPending}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <p className="w-20 text-right font-semibold">{formatCurrency(item.total_price)}</p>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => removeItem.mutate()}
        disabled={removeItem.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
