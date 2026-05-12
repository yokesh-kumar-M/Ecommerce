import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-primary">ShopNest</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium e-commerce experience. Quality products delivered fast.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground">All Products</Link></li>
              <li><Link href="/products?in_stock=true" className="hover:text-foreground">In Stock</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth/login" className="hover:text-foreground">Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-foreground">Create Account</Link></li>
              <li><Link href="/orders" className="hover:text-foreground">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/cart" className="hover:text-foreground">Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
