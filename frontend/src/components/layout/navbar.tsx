'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth';

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/products?collection_id=1', label: 'Collections' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCartStore();
  const { isAuthenticated, user, clearUser } = useAuthStore();
  const { theme, setTheme } = useTheme();

  function handleLogout() {
    clearUser();
    logout();
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          ShopNest
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/products">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/orders">
                  <User className="mr-2 h-4 w-4" />
                  {user?.first_name || 'Profile'}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-b bg-background px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/orders" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">My Orders</Link>
                <button onClick={handleLogout} className="rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Sign In</Link>
                <Link href="/auth/register" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
