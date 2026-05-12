'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { ProductReview } from '@/types';

const reviewSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(10),
  rating: z.number().min(1).max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function ProductReviews({ productId }: { productId: number }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);

  const { data: reviews = [] } = useQuery<ProductReview[]>({
    queryKey: ['product-reviews', productId],
    queryFn: () => productsApi.reviews(productId).then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const addReview = useMutation({
    mutationFn: (data: ReviewFormData) => productsApi.addReview(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      reset();
      setShowForm(false);
      toast({ title: 'Review submitted!' });
    },
    onError: () => toast({ title: 'Error', description: 'Could not submit review.', variant: 'destructive' }),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit((d) => addReview.mutate({ ...d, rating }))} className="mb-8 rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">Your Review</h3>
          <div className="mb-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)}>
                <Star className={`h-6 w-6 transition-colors ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <input {...register('name')} placeholder="Your name" className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            <textarea {...register('description')} placeholder="Share your experience..." rows={4} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <Button type="submit" className="mt-4" disabled={addReview.isPending}>
            {addReview.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{review.name}</p>
                  <div className="mt-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{review.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
