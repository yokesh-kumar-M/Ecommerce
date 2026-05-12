'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { login } from '@/lib/auth';
import { customerApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await api.post('/auth/register/', {
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        password2: data.confirm_password,
      });
      await login(data.email, data.password);
      const { data: customer } = await customerApi.me();
      setUser({
        id: customer.user_id,
        email: customer.email,
        username: data.username,
        first_name: customer.first_name,
        last_name: customer.last_name,
        is_staff: false,
      });
      toast({ title: 'Account created!', description: 'Welcome to ShopNest.' });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.email?.[0] || 'Registration failed. Please try again.';
      toast({ title: 'Registration failed', description: msg, variant: 'destructive' });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="first_name" className="mb-1.5 block text-sm font-medium">First Name</label>
          <input id="first_name" {...register('first_name')} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="John" />
          {errors.first_name && <p className="mt-1 text-xs text-destructive">{errors.first_name.message}</p>}
        </div>
        <div>
          <label htmlFor="last_name" className="mb-1.5 block text-sm font-medium">Last Name</label>
          <input id="last_name" {...register('last_name')} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Doe" />
          {errors.last_name && <p className="mt-1 text-xs text-destructive">{errors.last_name.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
        <input id="email" type="email" autoComplete="email" {...register('email')} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium">Username</label>
        <input id="username" {...register('username')} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="johndoe" />
        {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
        <div className="relative">
          <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" {...register('password')} className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Min. 8 characters" />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="confirm_password" className="mb-1.5 block text-sm font-medium">Confirm Password</label>
        <input id="confirm_password" type="password" autoComplete="new-password" {...register('confirm_password')} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Repeat password" />
        {errors.confirm_password && <p className="mt-1 text-xs text-destructive">{errors.confirm_password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account'}
      </Button>
    </form>
  );
}
