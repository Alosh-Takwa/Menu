
import { Dish, Order, Reservation, Rating, Category, Restaurant, PlatformSettings } from '../types';
import { MOCK_RESTAURANT, MOCK_DISHES, MOCK_CATEGORIES, MOCK_ORDERS } from '../constants';

const API_BASE = window.location.origin;

const safeFetch = async (url: string, options?: any, fallback?: any) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    console.warn(`Fetch failed for ${url}, using fallback.`, e);
    return fallback;
  }
};

export const db = {
  getCurrentRestaurant: (): Restaurant | null => {
    const user = localStorage.getItem('SOP_USER');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: any) => {
    if (user) localStorage.setItem('SOP_USER', JSON.stringify(user));
    else localStorage.removeItem('SOP_USER');
  },

  isAdmin: () => localStorage.getItem('SOP_ADMIN') === 'true',

  // المطاعم
  getAllRestaurants: async (): Promise<Restaurant[]> => 
    safeFetch(`${API_BASE}/api/restaurants`, {}, [MOCK_RESTAURANT]),

  updateRestaurant: async (id: number, data: Partial<Restaurant>) => {
    const updated = await safeFetch(`${API_BASE}/api/restaurants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, { ...MOCK_RESTAURANT, ...data });
    
    const current = db.getCurrentRestaurant();
    if (current && current.id === id) db.setCurrentUser(updated);
    return updated;
  },

  updateRestaurantStatus: async (id: number, status: string) => 
    safeFetch(`${API_BASE}/api/restaurants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }),

  updateRestaurantPlan: async (id: number, planId: number) => 
    safeFetch(`${API_BASE}/api/restaurants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId })
    }),

  // الأطباق
  getDishes: async (restaurantId: number): Promise<Dish[]> => 
    safeFetch(`${API_BASE}/api/dishes?restaurantId=${restaurantId}`, {}, MOCK_DISHES),

  addDish: async (dish: Partial<Dish>) => 
    safeFetch(`${API_BASE}/api/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dish)
    }),

  updateDish: async (id: number, data: Partial<Dish>) => 
    safeFetch(`${API_BASE}/api/dishes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  // الأقسام
  getCategories: async (restaurantId: number): Promise<Category[]> => 
    safeFetch(`${API_BASE}/api/categories?restaurantId=${restaurantId}`, {}, MOCK_CATEGORIES),

  addCategory: async (category: Partial<Category>) => 
    safeFetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    }),

  updateCategory: async (id: number, data: Partial<Category>) => 
    safeFetch(`${API_BASE}/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  deleteCategory: async (id: number) => 
    safeFetch(`${API_BASE}/api/categories/${id}`, { method: 'DELETE' }),

  // الطلبات
  getOrders: async (restaurantId: number): Promise<Order[]> => 
    safeFetch(`${API_BASE}/api/orders?restaurantId=${restaurantId}`, {}, MOCK_ORDERS),

  createOrder: async (orderData: any) => 
    safeFetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }),

  updateOrderStatus: async (id: number, status: string) => 
    safeFetch(`${API_BASE}/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }),

  // الحجوزات
  getReservations: async (restaurantId: number): Promise<Reservation[]> => 
    safeFetch(`${API_BASE}/api/reservations?restaurantId=${restaurantId}`, {}, []),

  createReservation: async (data: any) => 
    safeFetch(`${API_BASE}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, { id: Date.now(), ...data, status: 'pending' }),

  updateReservationStatus: async (id: number, status: string) => 
    safeFetch(`${API_BASE}/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }),

  getReservationsByPhone: async (phone: string, restaurantId: number): Promise<Reservation[]> => 
    safeFetch(`${API_BASE}/api/reservations?phone=${phone}&restaurantId=${restaurantId}`, {}, []),

  // التقييمات
  getRatings: async (restaurantId: number): Promise<Rating[]> => 
    safeFetch(`${API_BASE}/api/ratings?restaurantId=${restaurantId}`, {}, []),

  updateRatingStatus: async (id: number, isApproved: boolean) => 
    safeFetch(`${API_BASE}/api/ratings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved })
    }),

  deleteRating: async (id: number) => 
    safeFetch(`${API_BASE}/api/ratings/${id}`, { method: 'DELETE' }),

  // إعدادات المنصة
  getPlatformSettings: async (): Promise<PlatformSettings> => 
    safeFetch(`${API_BASE}/api/platform-settings`, {}, {
      siteName: 'SOP POS',
      supportEmail: 'support@sop.com',
      supportPhone: '92000000',
      footerText: 'نظام SOP المتكامل لإدارة المطاعم بذكاء.',
      isMaintenanceMode: false
    }),

  updatePlatformSettings: async (settings: PlatformSettings) => 
    safeFetch(`${API_BASE}/api/platform-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }),

  // المصادقة
  login: async (email: string): Promise<Restaurant | null> => {
    const restaurant = await safeFetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }, MOCK_RESTAURANT);
    if (restaurant) db.setCurrentUser(restaurant);
    return restaurant;
  },

  registerRestaurant: async (data: any) => {
    const restaurant = await safeFetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, { ...MOCK_RESTAURANT, ...data });
    if (restaurant) db.setCurrentUser(restaurant);
    return restaurant;
  },

  adminLogin: (email: string, pass: string): boolean => {
    if (email === 'admin@sop.com' && pass === 'admin123') {
      localStorage.setItem('SOP_ADMIN', 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('SOP_USER');
    localStorage.removeItem('SOP_ADMIN');
    window.location.href = '/';
  }
};
