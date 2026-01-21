
import { Dish, Order, Reservation, Rating, Category, Restaurant } from '../types';
import { MOCK_DISHES, MOCK_CATEGORIES, MOCK_RESTAURANT, MOCK_ORDERS } from '../constants';

const DB_KEY = 'SOP_DATABASE';

interface Database {
  restaurants: Restaurant[];
  categories: Category[];
  dishes: Dish[];
  orders: Order[];
  reservations: Reservation[];
  ratings: Rating[];
}

const initializeDB = (): Database => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) return JSON.parse(saved);

  const initialDB: Database = {
    restaurants: [MOCK_RESTAURANT],
    categories: MOCK_CATEGORIES.map(c => ({ ...c, restaurantId: 1, sortOrder: 0 })),
    dishes: MOCK_DISHES.map(d => ({ ...d, restaurantId: 1 })),
    orders: MOCK_ORDERS.map(o => ({ ...o, restaurantId: 1, customerPhone: '0500000000' })),
    reservations: [
      { id: 1, restaurantId: 1, customerName: 'سلمان الفهد', customerPhone: '055112233', date: '2023-12-01', time: '19:00', guests: 4, status: 'pending' }
    ],
    ratings: [
      { id: 1, restaurantId: 1, customerName: 'أحمد علي', rating: 5, comment: 'تجربة رائعة!', isApproved: true, createdAt: new Date().toISOString() }
    ],
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  return initialDB;
};

export const db = {
  get: () => initializeDB(),
  save: (data: Database) => localStorage.setItem(DB_KEY, JSON.stringify(data)),
  
  // Dishes
  getDishes: () => initializeDB().dishes,
  addDish: (dish: Omit<Dish, 'id'>) => {
    const data = initializeDB();
    const newDish = { ...dish, id: Date.now() };
    data.dishes.push(newDish);
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    return newDish;
  },
  
  // Orders
  getOrders: () => initializeDB().orders,
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const data = initializeDB();
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('ar-SA')
    };
    data.orders.unshift(newOrder);
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    return newOrder;
  },
  updateOrderStatus: (id: number, status: Order['status']) => {
    const data = initializeDB();
    data.orders = data.orders.map(o => o.id === id ? { ...o, status } : o);
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },

  // Reservations
  getReservations: () => initializeDB().reservations,
  addReservation: (res: Omit<Reservation, 'id' | 'status'>) => {
    const data = initializeDB();
    const newRes: Reservation = { ...res, id: Date.now(), status: 'pending' };
    data.reservations.push(newRes);
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    return newRes;
  },

  // Ratings
  getRatings: () => initializeDB().ratings,
  addRating: (rating: Omit<Rating, 'id' | 'createdAt' | 'isApproved'>) => {
    const data = initializeDB();
    const newRating: Rating = { ...rating, id: Date.now(), createdAt: new Date().toISOString(), isApproved: false };
    data.ratings.unshift(newRating);
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }
};
