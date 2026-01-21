
export type UserRole = 'ADMIN' | 'RESTAURANT' | 'CUSTOMER';

export interface SubscriptionPlan {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  maxDishes: number;
  features: string[];
}

export interface Category {
  id: number;
  restaurantId: number;
  name: string;
  nameEn: string;
  sortOrder: number;
}

export interface Dish {
  id: number;
  restaurantId: number;
  categoryId: number;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  preparationTime: number;
  allergens?: string[];
}

export interface Order {
  id: number;
  restaurantId: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  dishId: number;
  dishName: string;
  quantity: number;
  price: number;
}

export interface ReservationSettings {
  startTime: string;
  endTime: string;
  slotDuration: number;
  maxGuests: number;
  isEnabled: boolean;
  advanceBookingDays: number;
}

export interface Reservation {
  id: number;
  restaurantId: number;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Rating {
  id: number;
  restaurantId: number;
  dishId?: number;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  logo: string;
  coverImage?: string;
  planId: number;
  status: 'active' | 'suspended' | 'expired';
  address: string;
  phone: string;
  currency: string;
  themeColor: string;
  fontFamily: string;
  socialLinks: { platform: string; url: string }[];
  email?: string;
  reservationSettings?: ReservationSettings;
}

export interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  footerText: string;
  isMaintenanceMode: boolean;
}
