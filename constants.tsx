
import { SubscriptionPlan, Restaurant, Category, Dish, Order } from './types';

export const PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: 'Basic',
    nameAr: 'الباقة الأساسية',
    price: 99,
    maxDishes: 50,
    features: ['منيو إلكتروني QR', 'إدارة أطباق محدودة', 'رابط مخصص', 'دعم عبر البريد']
  },
  {
    id: 2,
    name: 'Professional',
    nameAr: 'الباقة الاحترافية',
    price: 249,
    maxDishes: 200,
    features: ['منيو إلكتروني QR', 'إدارة أطباق واسعة', 'إحصائيات المبيعات', 'تخصيص كامل للهوية', 'دعم فني سريع']
  },
  {
    id: 3,
    name: 'Enterprise',
    nameAr: 'باقة الشركات',
    price: 499,
    maxDishes: 9999,
    features: ['نظام الطلبات المباشرة (POS)', 'نظام حجز الطاولات', 'تحليلات الذكاء الاصطناعي', 'إدارة فروع متعددة', 'دعم فني 24/7']
  }
];

export const MOCK_RESTAURANT: Restaurant = {
  id: 1,
  name: 'مطعم مذاق الشرق',
  slug: 'mazaq-alsharq',
  logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
  planId: 2,
  status: 'active',
  address: 'الرياض - حي الملز - شارع الستين',
  phone: '0501234567',
  currency: 'ر.س',
  themeColor: '#2563eb',
  fontFamily: 'Cairo',
  // Fix: Added email field for the mock restaurant
  email: 'contact@mazaq-alsharq.com',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/' },
    { platform: 'twitter', url: 'https://twitter.com/' }
  ]
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, restaurantId: 1, name: 'المقبلات الشامية', nameEn: 'Appetizers', sortOrder: 1 },
  { id: 2, restaurantId: 1, name: 'المشويات واللحوم', nameEn: 'Main Courses', sortOrder: 2 },
  { id: 3, restaurantId: 1, name: 'الحلويات الشرقية', nameEn: 'Desserts', sortOrder: 3 },
  { id: 4, restaurantId: 1, name: 'العصائر الطبيعية', nameEn: 'Drinks', sortOrder: 4 }
];

export const MOCK_DISHES: Dish[] = [
  {
    id: 1,
    restaurantId: 1,
    categoryId: 1,
    name: 'تبولة لبنانية',
    nameEn: 'Tabbouleh',
    description: 'بقدونس مفروم مع برغل، طماطم، ونعناع بزيت الزيتون',
    price: 18,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    preparationTime: 10
  },
  {
    id: 2,
    restaurantId: 1,
    categoryId: 2,
    name: 'كباب دجاج مشوي',
    nameEn: 'Grilled Chicken Kebab',
    description: 'أسياخ كباب دجاج متبل بخلطة الشرق الخاصة',
    price: 35,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    preparationTime: 25
  },
  {
    id: 3,
    restaurantId: 1,
    categoryId: 3,
    name: 'بقلاوة بالفستق',
    nameEn: 'Pistachio Baklawa',
    description: 'رقائق العجين الهشة محشوة بالفستق الحلبي الفاخر',
    price: 22,
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    preparationTime: 15
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    restaurantId: 1,
    orderNumber: 'SOP-2024-001',
    customerName: 'فهد السبيعي',
    customerPhone: '0555555555',
    total: 88.50,
    status: 'preparing',
    items: [
      { dishId: 2, dishName: 'كباب دجاج مشوي', quantity: 2, price: 35 },
      { dishId: 1, dishName: 'تبولة لبنانية', quantity: 1, price: 18.50 }
    ],
    createdAt: 'اليوم، 12:30 م'
  }
];
