
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// إعداد الاتصال بقاعدة البيانات
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sop_restaurant_db',
  waitForConnections: true,
  connectionLimit: 10
};

let pool;
try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.error('Database Connection Error:', err);
}

// --- API المصادقة والمطاعم ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM restaurants WHERE email = ?', [req.body.email]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ message: 'User not found' });
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/restaurants', async (req, res) => {
  const { name, slug, email, phone, address, planId, logo } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO restaurants (name, slug, email, phone, address, plan_id, logo, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, slug, email, phone, address, planId, logo, 'default_pass']
    );
    const [newRes] = await pool.execute('SELECT * FROM restaurants WHERE id = ?', [result.insertId]);
    res.json(newRes[0]);
  } catch (err) { res.status(500).json(err); }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM restaurants');
    res.json(rows);
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/restaurants/:id', async (req, res) => {
  const fields = req.body;
  const id = req.params.id;
  try {
    const keys = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(fields), id];
    await pool.execute(`UPDATE restaurants SET ${keys} WHERE id = ?`, values);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- API الأقسام والأطباق ---
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE restaurant_id = ?', [req.query.restaurantId]);
    res.json(rows);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/categories', async (req, res) => {
  const { restaurant_id, name, name_en, sort_order } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO categories (restaurant_id, name, name_en, sort_order) VALUES (?, ?, ?, ?)',
      [restaurant_id, name, name_en, sort_order]
    );
    res.json({ id: result.insertId });
  } catch (err) { res.status(500).json(err); }
});

app.get('/api/dishes', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM dishes WHERE restaurant_id = ?', [req.query.restaurantId]);
    res.json(rows);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/dishes', async (req, res) => {
  const fields = req.body;
  try {
    const keys = Object.keys(fields).join(', ');
    const placeholders = Object.keys(fields).map(() => '?').join(', ');
    const [result] = await pool.execute(`INSERT INTO dishes (${keys}) VALUES (${placeholders})`, Object.values(fields));
    res.json({ id: result.insertId });
  } catch (err) { res.status(500).json(err); }
});

// --- API الطلبات ---
app.get('/api/orders', async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders WHERE restaurant_id = ? ORDER BY created_at DESC', [req.query.restaurantId]);
    // لجلب تفاصيل كل طلب (items)
    for (let order of orders) {
      const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }
    res.json(orders);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/orders', async (req, res) => {
  const { restaurantId, orderNumber, customerName, total, items } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO orders (restaurant_id, order_number, customer_name, total) VALUES (?, ?, ?, ?)',
      [restaurantId, orderNumber, customerName, total]
    );
    for (let item of items) {
      await pool.execute(
        'INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES (?, ?, ?, ?)',
        [result.insertId, item.dishId, item.quantity, item.price]
      );
    }
    res.json({ success: true, id: result.insertId });
  } catch (err) { res.status(500).json(err); }
});

// --- API إعدادات المنصة ---
app.get('/api/platform-settings', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM platform_settings WHERE id = 1');
    res.json(rows[0]);
  } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
