
import { Dish, Order, Reservation, Rating, Category, Restaurant } from '../types';
import { MOCK_DISHES, MOCK_CATEGORIES, MOCK_RESTAURANT, MOCK_ORDERS, PLANS } from '../constants';

const DB_KEY = 'SOP_DATABASE_V2';

interface Database {
  restaurants: Restaurant[];
  categories: Category[];
  dishes: Dish[];
  orders: Order[];
  reservations: Reservation[];
  ratings: Rating[];
  currentUser: number | null; // ID of logged in restaurant
}

const initializeDB = (): Database => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) return JSON.parse(saved);

  const initialDB: Database = {
    restaurants: [MOCK_RESTAURANT],
    categories: MOCK_CATEGORIES,
    dishes: MOCK_DISHES,
    orders: MOCK_ORDERS,
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
  
  // Auth
  getCurrentRestaurant: () => {
    const data = initializeDB();
    return data.restaurants.find(r => r.id === data.currentUser) || null;
  },
  login: (email: string) => {
    const data = initializeDB();
    // In a real app, we'd check password. Here we simulate login.
    const restaurant = data.restaurants[0]; 
    data.currentUser = restaurant.id;
    db.save(data);
    return restaurant;
  },
  logout: () => {
    const data = initializeDB();
    data.currentUser = null;
    db.save(data);
  },

  // Restaurants
  updateRestaurant: (id: number, updates: Partial<Restaurant>) => {
    const data = initializeDB();
    data.restaurants = data.restaurants.map(r => r.id === id ? { ...r, ...updates } : r);
    db.save(data);
  },

  // Categories
  getCategories: (restaurantId: number) => {
    return initializeDB().categories.filter(c => c.restaurantId === restaurantId);
  },
  addCategory: (cat: Omit<Category, 'id'>) => {
    const data = initializeDB();
    const newCat = { ...cat, id: Date.now() };
    data.categories.push(newCat);
    db.save(data);
    return newCat;
  },
  deleteCategory: (id: number) => {
    const data = initializeDB();
    data.categories = data.categories.filter(c => c.id !== id);
    data.dishes = data.dishes.filter(d => d.categoryId !== id); // Cascade delete dishes
    db.save(data);
  },

  // Dishes
  getDishes: (restaurantId: number) => initializeDB().dishes.filter(d => d.restaurantId === restaurantId),
  addDish: (dish: Omit<Dish, 'id'>) => {
    const data = initializeDB();
    const newDish = { ...dish, id: Date.now() };
    data.dishes.push(newDish);
    db.save(data);
    return newDish;
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
  
  // Ratings
  getRatings: (restaurantId: number) => initializeDB().ratings.filter(r => r.restaurantId === restaurantId)
};
