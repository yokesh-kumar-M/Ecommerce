'use client';

import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';
import { formatCurrency, formatDate, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => ordersApi.list().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <Package className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">No orders yet</h2>
        <Button asChild><Link href="/products">Start Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.placed_at)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${PAYMENT_STATUS_COLORS[order.payment_status]}`}>
                {PAYMENT_STATUS_LABELS[order.payment_status]}
              </span>
            </div>
            <div className="mt-4 divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span>{item.product.title} × {item.quantity}</span>
                  <span>{formatCurrency(parseFloat(item.unit_price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <p className="font-semibold">
                Total: {formatCurrency(order.items.reduce((sum, item) => sum + parseFloat(item.unit_price) * item.quantity, 0))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
