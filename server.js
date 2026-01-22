
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- قاعدة بيانات افتراضية غنية بالبيانات ---
let state = {
  restaurants: [
    {
      id: 1,
      name: 'مطعم مذاق الشرق',
      slug: 'mazaq-alsharq',
      logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200',
      planId: 2,
      status: 'active',
      address: 'الرياض - حي الملز',
      phone: '0501234567',
      currency: 'ر.س',
      themeColor: '#2563eb',
      fontFamily: 'Cairo',
      email: 'admin@mazaq.com'
    }
  ],
  categories: [
    { id: 1, restaurantId: 1, name: 'المقبلات الشامية', nameEn: 'Appetizers', sortOrder: 1 },
    { id: 2, restaurantId: 1, name: 'المشاوي واللحوم', nameEn: 'Grills', sortOrder: 2 },
    { id: 3, restaurantId: 1, name: 'الحلويات', nameEn: 'Desserts', sortOrder: 3 }
  ],
  dishes: [
    {
      id: 1,
      restaurantId: 1,
      categoryId: 1,
      name: 'حمص بيروتي',
      nameEn: 'Hummus',
      description: 'حمص بالطحينة والليمون وزيت الزيتون البكر',
      price: 15,
      image: 'https://images.unsplash.com/photo-1577906030551-8797f70357e2?auto=format&fit=crop&q=80&w=400',
      isAvailable: true,
      preparationTime: 10
    },
    {
      id: 2,
      restaurantId: 1,
      categoryId: 2,
      name: 'ريش غنم مشوية',
      nameEn: 'Lamb Chops',
      description: 'قطع ريش الغنم المتبلة بالأعشاب البرية',
      price: 65,
      image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=400',
      isAvailable: true,
      preparationTime: 25
    }
  ],
  orders: [],
  reservations: [],
  ratings: [
    {
      id: 1,
      restaurantId: 1,
      customerName: 'أحمد علي',
      rating: 5,
      comment: 'تجربة رائعة وطعام لذيذ جداً!',
      isApproved: true,
      createdAt: new Date().toISOString()
    }
  ],
  platformSettings: {
    siteName: 'SOP POS',
    supportEmail: 'support@sop.com',
    supportPhone: '92000000',
    footerText: 'نظام SOP المتكامل لإدارة المطاعم بذكاء.',
    isMaintenanceMode: false,
    facebookUrl: '#',
    twitterUrl: '#',
    instagramUrl: '#'
  }
};

// --- API Endpoints المحدثة بالكامل ---

// المطاعم والمصادقة
app.get('/api/restaurants', (req, res) => res.json(state.restaurants));
app.post('/api/auth/login', (req, res) => {
  const user = state.restaurants.find(r => r.email === req.body.email) || state.restaurants[0];
  res.json(user);
});

// الأقسام (CRUD)
app.get('/api/categories', (req, res) => {
  const { restaurantId } = req.query;
  res.json(state.categories.filter(c => c.restaurantId == restaurantId));
});
app.post('/api/categories', (req, res) => {
  const newCat = { ...req.body, id: Date.now() };
  state.categories.push(newCat);
  res.status(201).json(newCat);
});
app.put('/api/categories/:id', (req, res) => {
  state.categories = state.categories.map(c => c.id == req.params.id ? { ...c, ...req.body } : c);
  res.json({ success: true });
});
app.delete('/api/categories/:id', (req, res) => {
  state.categories = state.categories.filter(c => c.id != req.params.id);
  res.json({ success: true });
});

// الأطباق (CRUD)
app.get('/api/dishes', (req, res) => {
  const { restaurantId } = req.query;
  res.json(state.dishes.filter(d => d.restaurantId == restaurantId));
});
app.post('/api/dishes', (req, res) => {
  const newDish = { ...req.body, id: Date.now() };
  state.dishes.push(newDish);
  res.status(201).json(newDish);
});
app.put('/api/dishes/:id', (req, res) => {
  state.dishes = state.dishes.map(d => d.id == req.params.id ? { ...d, ...req.body } : d);
  res.json({ success: true });
});
app.delete('/api/dishes/:id', (req, res) => {
  state.dishes = state.dishes.filter(d => d.id != req.params.id);
  res.json({ success: true });
});

// الطلبات والحجوزات والتقييمات
app.get('/api/orders', (req, res) => res.json(state.orders));
app.post('/api/orders', (req, res) => {
  const order = { ...req.body, id: Date.now(), createdAt: new Date().toISOString() };
  state.orders.push(order);
  res.json(order);
});

app.get('/api/ratings', (req, res) => {
  const { restaurantId } = req.query;
  res.json(state.ratings.filter(r => r.restaurantId == restaurantId));
});
app.put('/api/ratings/:id', (req, res) => {
  state.ratings = state.ratings.map(r => r.id == req.params.id ? { ...r, ...req.body } : r);
  res.json({ success: true });
});

// إعدادات المنصة
app.get('/api/platform-settings', (req, res) => res.json(state.platformSettings));
app.put('/api/platform-settings', (req, res) => {
  state.platformSettings = { ...state.platformSettings, ...req.body };
  res.json(state.platformSettings);
});

// خدمة الفرونت إند
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SOP System Backend running on port ${PORT}`));
