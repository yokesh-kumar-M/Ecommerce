export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Collection {
  id: number;
  title: string;
  products_count: number;
}

export interface ProductImage {
  id: number;
  image: string;
}

export interface Promotion {
  id: number;
  description: string;
  discount: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  unit_price: string;
  price_with_tax: string;
  inventory: number;
  collection: Collection;
  images: ProductImage[];
  average_rating: number | null;
  last_update: string;
}

export interface ProductReview {
  id: number;
  name: string;
  description: string;
  rating: number;
  created_at: string;
}

export interface CartItem {
  id: number;
  product: Pick<Product, 'id' | 'title' | 'unit_price'>;
  quantity: number;
  total_price: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_price: string;
  created_at: string;
}

export interface Customer {
  id: number;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  birth_date: string | null;
  membership: 'B' | 'S' | 'G';
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export interface OrderItem {
  id: number;
  product: Pick<Product, 'id' | 'title' | 'unit_price'>;
  unit_price: string;
  quantity: number;
}

export interface Order {
  id: number;
  customer: number;
  placed_at: string;
  payment_status: 'P' | 'C' | 'F';
  items: OrderItem[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  status: string;
  status_code: number;
  errors: Record<string, string[]>;
}

export type MembershipLabel = { B: 'Bronze'; S: 'Silver'; G: 'Gold' };
export type PaymentStatusLabel = { P: 'Pending'; C: 'Completed'; F: 'Failed' };
