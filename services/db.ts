
import { Dish, Order, Reservation, Rating, Category, Restaurant, PlatformSettings } from '../types';

const API_URL = '/api';

export const db = {
  getCurrentRestaurant: (): Restaurant | null => {
    const user = localStorage.getItem('SOP_USER');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: any) => {
    if (user) localStorage.setItem('SOP_USER', JSON.stringify(user));
    else localStorage.removeItem('SOP_USER');
  },

  login: async (email: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) return null;
    const user = await res.json();
    db.setCurrentUser(user);
    return user;
  },

  registerRestaurant: async (data: any) => {
    const res = await fetch(`${API_URL}/restaurants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  adminLogin: (email: string, pass: string) => {
    // محاكاة دخول المشرف - يفضل تحويلها لـ API مستقبلاً
    if (email === 'admin@sop.com' && pass === 'admin123') {
      localStorage.setItem('SOP_ADMIN', 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    db.setCurrentUser(null);
    localStorage.removeItem('SOP_ADMIN');
  },

  isAdmin: () => localStorage.getItem('SOP_ADMIN') === 'true',

  // Restaurants
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    const res = await fetch(`${API_URL}/restaurants`);
    return await res.json();
  },

  updateRestaurant: async (id: number, data: Partial<Restaurant>) => {
    const res = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  updateRestaurantStatus: async (id: number, status: string) => {
    return db.updateRestaurant(id, { status: status as any });
  },

  updateRestaurantPlan: async (id: number, planId: number) => {
    return db.updateRestaurant(id, { planId });
  },

  // Dishes
  getDishes: async (restaurantId: number): Promise<Dish[]> => {
    const res = await fetch(`${API_URL}/dishes?restaurantId=${restaurantId}`);
    return await res.json();
  },

  addDish: async (dish: any) => {
    const res = await fetch(`${API_URL}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dish)
    });
    return await res.json();
  },

  updateDish: async (id: number, dish: any) => {
    const res = await fetch(`${API_URL}/dishes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dish)
    });
    return await res.json();
  },

  deleteDish: async (id: number) => {
    const res = await fetch(`${API_URL}/dishes/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Categories
  getCategories: async (restaurantId: number): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/categories?restaurantId=${restaurantId}`);
    return await res.json();
  },

  addCategory: async (cat: any) => {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    return await res.json();
  },

  // Added updateCategory method
  updateCategory: async (id: number, cat: any) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    return await res.json();
  },

  // Added deleteCategory method
  deleteCategory: async (id: number) => {
    const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Orders
  getOrders: async (restaurantId: number): Promise<Order[]> => {
    const res = await fetch(`${API_URL}/orders?restaurantId=${restaurantId}`);
    return await res.json();
  },

  createOrder: async (order: any) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return await res.json();
  },

  // Added updateOrderStatus method
  updateOrderStatus: async (id: number, status: string) => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  // Reservations
  // Added getReservations method
  getReservations: async (restaurantId: number): Promise<Reservation[]> => {
    const res = await fetch(`${API_URL}/reservations?restaurantId=${restaurantId}`);
    return await res.json();
  },

  // Added updateReservationStatus method
  updateReservationStatus: async (id: number, status: string) => {
    const res = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  // Added getReservationsByPhone method
  getReservationsByPhone: async (phone: string, restaurantId: number): Promise<Reservation[]> => {
    const res = await fetch(`${API_URL}/reservations?phone=${phone}&restaurantId=${restaurantId}`);
    return await res.json();
  },

  // Ratings
  // Added getRatings method
  getRatings: async (restaurantId: number): Promise<Rating[]> => {
    const res = await fetch(`${API_URL}/ratings?restaurantId=${restaurantId}`);
    return await res.json();
  },

  // Added updateRatingStatus method
  updateRatingStatus: async (id: number, isApproved: boolean) => {
    const res = await fetch(`${API_URL}/ratings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved })
    });
    return await res.json();
  },

  // Added deleteRating method
  deleteRating: async (id: number) => {
    const res = await fetch(`${API_URL}/ratings/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Platform Settings
  getPlatformSettings: async (): Promise<PlatformSettings> => {
    const res = await fetch(`${API_URL}/platform-settings`);
    return await res.json();
  },

  // Added updatePlatformSettings method
  updatePlatformSettings: async (settings: PlatformSettings) => {
    const res = await fetch(`${API_URL}/platform-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  }
};
