
import { Dish, Order, Reservation, Rating, Category, Restaurant, SubscriptionPlan } from '../types';
import { MOCK_DISHES, MOCK_CATEGORIES, MOCK_RESTAURANT, MOCK_ORDERS, PLANS } from '../constants';

const DB_KEY = 'SOP_DATABASE_V3';

interface Database {
  restaurants: Restaurant[];
  categories: Category[];
  dishes: Dish[];
  orders: Order[];
  reservations: Reservation[];
  ratings: Rating[];
  plans: SubscriptionPlan[];
  currentUser: number | null; 
}

const initializeDB = (): Database => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) return JSON.parse(saved);

  const initialDB: Database = {
    restaurants: [{
      ...MOCK_RESTAURANT,
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
    reservations: [
      { id: 1, restaurantId: 1, customerName: 'سلمان الفهد', customerPhone: '055112233', date: '2023-12-01', time: '19:00', guests: 4, status: 'pending' }
    ],
    ratings: [
      { id: 1, restaurantId: 1, customerName: 'أحمد علي', rating: 5, comment: 'تجربة رائعة!', isApproved: true, createdAt: new Date().toISOString() }
    ],
    currentUser: null
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  return initialDB;
};

export const db = {
  get: () => initializeDB(),
  save: (data: Database) => localStorage.setItem(DB_KEY, JSON.stringify(data)),
  
  getCurrentRestaurant: () => {
    const data = initializeDB();
    return data.restaurants.find(r => r.id === data.currentUser) || null;
  },

  login: (email: string) => {
    const data = initializeDB();
    const restaurant = data.restaurants.find(r => r.id === 1); 
    if (restaurant) {
      data.currentUser = restaurant.id;
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
    db.save(data);
    return newRestaurant;
  },

  logout: () => {
    const data = initializeDB();
    data.currentUser = null;
    db.save(data);
  },

  getAllRestaurants: () => initializeDB().restaurants,
  
  updateRestaurant: (id: number, updates: Partial<Restaurant>) => {
    const data = initializeDB();
    data.restaurants = data.restaurants.map(r => r.id === id ? { ...r, ...updates } : r);
    db.save(data);
  },

  deleteRestaurant: (id: number) => {
    const data = initializeDB();
    data.restaurants = data.restaurants.filter(r => r.id !== id);
    data.dishes = data.dishes.filter(d => d.restaurantId !== id);
    data.categories = data.categories.filter(c => c.restaurantId !== id);
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

  getCategories: (restaurantId: number) => initializeDB().categories.filter(c => c.restaurantId === restaurantId),
  addCategory: (cat: Omit<Category, 'id'>) => {
    const data = initializeDB();
    const newCat = { ...cat, id: Date.now() };
    data.categories.push(newCat);
    db.save(data);
    return newCat;
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

  getReservations: (restaurantId: number) => initializeDB().reservations.filter(r => r.restaurantId === restaurantId),
  getRatings: (restaurantId: number) => initializeDB().ratings.filter(r => r.restaurantId === restaurantId)
};
