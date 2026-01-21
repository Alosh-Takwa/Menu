
import { SubscriptionPlan, Restaurant, Category, Dish, Order } from './types';

export const PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: 'Basic',
    nameAr: 'الباقة الأساسية',
    price: 99,
    maxDishes: 50,
    features: ['المنيو الإلكتروني', 'تعديل الأطباق', 'رابط مخصص']
  },
  {
    id: 2,
    name: 'Professional',
    nameAr: 'الباقة الاحترافية',
    price: 249,
    maxDishes: 200,
    features: ['تخصيص التصميم', 'QR Code', 'إحصائيات بسيطة', 'دعم فني']
  },
  {
    id: 3,
    name: 'Enterprise',
    nameAr: 'باقة الشركات',
    price: 499,
    maxDishes: 9999,
    features: ['نظام الطلبات المباشرة', 'نظام الحجز', 'إحصائيات متقدمة', 'دعم 24/7']
  }
];

// Fix: Added missing properties address, phone, and socialLinks to match Restaurant interface
export const MOCK_RESTAURANT: Restaurant = {
  id: 1,
  name: 'مطعم الشرق الأصيل',
  slug: 'al-sharq',
  logo: 'https://picsum.photos/seed/logo/200/200',
  planId: 2,
  status: 'active',
  address: 'الرياض، المملكة العربية السعودية',
  phone: '0501234567',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/al-sharq' },
    { platform: 'twitter', url: 'https://twitter.com/al-sharq' }
  ]
};

// Fix: Added missing properties restaurantId and sortOrder to match Category interface
export const MOCK_CATEGORIES: Category[] = [
  { id: 1, restaurantId: 1, name: 'المقبلات', nameEn: 'Appetizers', sortOrder: 1 },
  { id: 2, restaurantId: 1, name: 'الأطباق الرئيسية', nameEn: 'Main Courses', sortOrder: 2 },
  { id: 3, restaurantId: 1, name: 'الحلويات', nameEn: 'Desserts', sortOrder: 3 },
  { id: 4, restaurantId: 1, name: 'المشروبات', nameEn: 'Drinks', sortOrder: 4 }
];

// Fix: Added missing property restaurantId to match Dish interface
export const MOCK_DISHES: Dish[] = [
  {
    id: 1,
    restaurantId: 1,
    categoryId: 1,
    name: 'حمص باللحمة',
    nameEn: 'Hummus with Meat',
    description: 'حمص طازج مع قطع لحم الغنم والمكسرات',
    price: 25,
    image: 'https://picsum.photos/seed/dish1/400/300',
    isAvailable: true,
    preparationTime: 15
  },
  {
    id: 2,
    restaurantId: 1,
    categoryId: 2,
    name: 'مندي دجاج',
    nameEn: 'Chicken Mandi',
    description: 'أرز مندي حضرمي أصيل مع دجاج مشوي',
    price: 45,
    image: 'https://picsum.photos/seed/dish2/400/300',
    isAvailable: true,
    preparationTime: 30
  },
  {
    id: 3,
    restaurantId: 1,
    categoryId: 3,
    name: 'كنافة نابلسية',
    nameEn: 'Kunafa Nabulsi',
    description: 'كنافة ساخنة بالجبنة والقطر',
    price: 20,
    image: 'https://picsum.photos/seed/dish3/400/300',
    isAvailable: true,
    preparationTime: 20
  }
];

// Fix: Corrected OrderItem properties (dishId instead of id) and added missing restaurantId and customerPhone to Order objects
export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    restaurantId: 1,
    orderNumber: 'ORD-1001',
    customerName: 'أحمد محمد',
    customerPhone: '0500000001',
    total: 120,
    status: 'preparing',
    items: [
      { dishId: 1, dishName: 'مندي دجاج', quantity: 2, price: 45 },
      { dishId: 2, dishName: 'كنافة', quantity: 1, price: 30 }
    ],
    createdAt: '2023-10-25 14:30'
  },
  {
    id: 2,
    restaurantId: 1,
    orderNumber: 'ORD-1002',
    customerName: 'سارة خالد',
    customerPhone: '0500000002',
    total: 45,
    status: 'pending',
    items: [
      { dishId: 1, dishName: 'حمص باللحمة', quantity: 1, price: 25 },
      { dishId: 2, dishName: 'مشروب غازي', quantity: 2, price: 10 }
    ],
    createdAt: '2023-10-25 14:45'
  }
];
