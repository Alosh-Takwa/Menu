
import { Dish, Order, Reservation, Rating, Category, Restaurant, SubscriptionPlan, PlatformSettings } from '../types';
import { MOCK_DISHES, MOCK_CATEGORIES, MOCK_RESTAURANT, MOCK_ORDERS, PLANS } from '../constants';

const DB_KEY = 'SOP_DATABASE_V4';

interface Database {
  restaurants: Restaurant[];
  categories: Category[];
  dishes: Dish[];
  orders: Order[];
  reservations: Reservation[];
  ratings: Rating[];
  plans: SubscriptionPlan[];
  platformSettings: PlatformSettings;
  currentUser: number | null; 
  adminLoggedIn: boolean;
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000';

const initializeDB = (): Database => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) return JSON.parse(saved);

  const initialDB: Database = {
    restaurants: [{
      ...MOCK_RESTAURANT,
      email: 'owner@test.com',
      coverImage: DEFAULT_COVER,
      reservationSettings: {
        startTime: '12:00',
        endTime: '23:30',
        slotDuration: 60,
        maxGuests: 10,
        isEnabled: true,
        advanceBookingDays: 7
      }
    }],
    categories: MOCK_CATEGORIES,
    dishes: MOCK_DISHES,
    orders: MOCK_ORDERS,
    plans: PLANS,
    platformSettings: {
      siteName: 'SOP POS',
      supportEmail: 'admin@sop-pos.com',
      supportPhone: '+966 500 000 000',
      facebookUrl: 'https://facebook.com',
      twitterUrl: 'https://twitter.com',
      instagramUrl: 'https://instagram.com',
      footerText: 'نظام SOP - الحل المتكامل لإدارة المطاعم.',
      isMaintenanceMode: false
    },
    reservations: [],
    ratings: [],
    currentUser: null,
    adminLoggedIn: false
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  return initialDB;
};

export const db = {
  get: () => initializeDB(),
  save: (data: Database) => localStorage.setItem(DB_KEY, JSON.stringify(data)),
  
  adminLogin: (email: string, pass: string) => {
    if (email === 'admin@sop-pos.com' && pass === 'admin') {
      const data = initializeDB();
      data.adminLoggedIn = true;
      data.currentUser = null;
      db.save(data);
      return true;
    }
    return false;
  },

  getCurrentRestaurant: () => {
    const data = initializeDB();
    return data.restaurants.find(r => r.id === data.currentUser) || null;
  },

  setCurrentUser: (id: number | null) => {
    const data = initializeDB();
    data.currentUser = id;
    db.save(data);
  },

  login: (email: string) => {
    const data = initializeDB();
    const restaurant = data.restaurants.find(r => r.email === email); 
    if (restaurant) {
      data.currentUser = restaurant.id;
      data.adminLoggedIn = false;
      db.save(data);
    }
    return restaurant || null;
  },

  registerRestaurant: (res: Omit<Restaurant, 'id' | 'status' | 'themeColor' | 'fontFamily' | 'socialLinks'>) => {
    const data = initializeDB();
    const newId = data.restaurants.length > 0 ? Math.max(...data.restaurants.map(r => r.id)) + 1 : 1;
    const newRestaurant: Restaurant = {
      ...res,
      id: newId,
      status: 'active',
      themeColor: '#2563eb',
      fontFamily: 'Cairo',
      socialLinks: [],
      coverImage: DEFAULT_COVER,
      reservationSettings: {
        startTime: '12:00',
        endTime: '23:00',
        slotDuration: 60,
        maxGuests: 8,
        isEnabled: true,
        advanceBookingDays: 7
      }
    };
    data.restaurants.push(newRestaurant);
    data.currentUser = newId;
    data.adminLoggedIn = false;
    db.save(data);
    return newRestaurant;
  },

  logout: () => {
    const data = initializeDB();
    data.currentUser = null;
    data.adminLoggedIn = false;
    db.save(data);
  },

  isAdmin: () => initializeDB().adminLoggedIn,

  getAllRestaurants: () => initializeDB().restaurants,
  
  getPlatformSettings: () => initializeDB().platformSettings,
  updatePlatformSettings: (settings: PlatformSettings) => {
    const data = initializeDB();
    data.platformSettings = settings;
    db.save(data);
  },

  updateRestaurant: (id: number, updates: Partial<Restaurant>) => {
    const data = initializeDB();
    data.restaurants = data.restaurants.map(r => r.id === id ? { ...r, ...updates } : r);
    db.save(data);
  },

  deleteRestaurant: (id: number) => {
    const data = initializeDB();
    data.restaurants = data.restaurants.filter(r => r.id !== id);
    db.save(data);
  },

  updateRestaurantStatus: (id: number, status: Restaurant['status']) => {
    const data = initializeDB();
    data.restaurants = data.restaurants.map(r => r.id === id ? { ...r, status } : r);
    db.save(data);
  },

  updateRestaurantPlan: (id: number, planId: number) => {
    const data = initializeDB();
    data.restaurants = data.restaurants.map(r => r.id === id ? { ...r, planId } : r);
    db.save(data);
  },

  // Categories & Dishes
  getCategories: (restaurantId: number) => initializeDB().categories.filter(c => c.restaurantId === restaurantId),
  addCategory: (cat: Omit<Category, 'id'>) => {
    const data = initializeDB();
    const newCat = { ...cat, id: Date.now() };
    data.categories.push(newCat);
    db.save(data);
    return newCat;
  },
  
  // Fix: Added updateCategory to support category management
  updateCategory: (id: number, updates: Partial<Category>) => {
    const data = initializeDB();
    data.categories = data.categories.map(c => c.id === id ? { ...c, ...updates } : c);
    db.save(data);
  },

  // Fix: Added deleteCategory to support category removal and dish cleanup
  deleteCategory: (id: number) => {
    const data = initializeDB();
    data.categories = data.categories.filter(c => c.id !== id);
    // Cleanup dishes associated with this category
    data.dishes = data.dishes.filter(d => d.categoryId !== id);
    db.save(data);
  },
  
  getDishes: (restaurantId: number) => initializeDB().dishes.filter(d => d.restaurantId === restaurantId),
  addDish: (dish: Omit<Dish, 'id'>) => {
    const data = initializeDB();
    const newDish = { ...dish, id: Date.now() };
    data.dishes.push(newDish);
    db.save(data);
    return newDish;
  },
  updateDish: (id: number, updates: Partial<Dish>) => {
    const data = initializeDB();
    data.dishes = data.dishes.map(d => d.id === id ? { ...d, ...updates } : d);
    db.save(data);
  },
  deleteDish: (id: number) => {
    const data = initializeDB();
    data.dishes = data.dishes.filter(d => d.id !== id);
    db.save(data);
  },

  // Orders
  getOrders: (restaurantId: number) => initializeDB().orders.filter(o => o.restaurantId === restaurantId),
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const data = initializeDB();
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('ar-SA')
    };
    data.orders.unshift(newOrder);
    db.save(data);
    return newOrder;
  },
  updateOrderStatus: (id: number, status: Order['status']) => {
    const data = initializeDB();
    data.orders = data.orders.map(o => o.id === id ? { ...o, status } : o);
    db.save(data);
  },

  // Reservations
  getReservations: (restaurantId: number) => initializeDB().reservations.filter(r => r.restaurantId === restaurantId),
  getReservationsByPhone: (phone: string, restaurantId: number) => {
    const data = initializeDB();
    return data.reservations.filter(r => r.customerPhone === phone && r.restaurantId === restaurantId);
  },
  createReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => {
    const data = initializeDB();
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now(),
      status: 'pending'
    };
    data.reservations.push(newReservation);
    db.save(data);
    return newReservation;
  },
  updateReservationStatus: (id: number, status: Reservation['status']) => {
    const data = initializeDB();
    data.reservations = data.reservations.map(r => r.id === id ? { ...r, status } : r);
    db.save(data);
  },

  getRatings: (restaurantId: number) => initializeDB().ratings.filter(r => r.restaurantId === restaurantId),
  updateRatingStatus: (id: number, isApproved: boolean) => {
    const data = initializeDB();
    data.ratings = data.ratings.map(r => r.id === id ? { ...r, isApproved } : r);
    db.save(data);
  },
  deleteRating: (id: number) => {
    const data = initializeDB();
    data.ratings = data.ratings.filter(r => r.id !== id);
    db.save(data);
  }
};
