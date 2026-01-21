
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, Star, AlertCircle } from 'lucide-react';
import { db } from '../services/db';
import { Order, Dish } from '../types';

const RestaurantDashboardView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [stats, setStats] = useState({ sales: 0, count: 0, reservations: 0, rating: 4.8 });

  useEffect(() => {
    const allOrders = db.getOrders();
    const allDishes = db.getDishes();
    const allRes = db.getReservations();
    
    setOrders(allOrders.slice(0, 5));
    setDishes(allDishes);
    
    const totalSales = allOrders.reduce((acc, curr) => acc + curr.total, 0);
    setStats({
      sales: totalSales,
      count: allOrders.length,
      reservations: allRes.filter(r => r.status === 'pending').length,
      rating: 4.8
    });
  }, []);

  const data = [
    { name: 'السبت', sales: stats.sales * 0.1 },
    { name: 'الأحد', sales: stats.sales * 0.2 },
    { name: 'الاثنين', sales: stats.sales * 0.15 },
    { name: 'الثلاثاء', sales: stats.sales * 0.25 },
    { name: 'الأربعاء', sales: stats.sales * 0.3 },
    { name: 'الخميس', sales: stats.sales * 0.45 },
    { name: 'الجمعة', sales: stats.sales * 0.6 },
  ];

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">لوحة التحكم</h1>
          <p className="text-gray-500 font-medium">أداء مطعمك بناءً على البيانات الفعلية</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-5 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <AlertCircle size={18} />
            <span className="text-sm font-bold">الباقة الحالية تنتهي قريباً</span>
          </div>
          <button className="bg-blue-600 text-white px-8 py-2 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all hover:scale-105">ترقية</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="p-3 w-fit rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-100"><TrendingUp size={24}/></div>
           <p className="text-gray-400 text-xs font-bold uppercase mb-1">إجمالي المبيعات</p>
           <h4 className="text-2xl font-black text-gray-800">{stats.sales} ر.س</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="p-3 w-fit rounded-2xl bg-green-600 text-white mb-4 shadow-lg shadow-green-100"><ShoppingBag size={24}/></div>
           <p className="text-gray-400 text-xs font-bold uppercase mb-1">إجمالي الطلبات</p>
           <h4 className="text-2xl font-black text-gray-800">{stats.count}</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="p-3 w-fit rounded-2xl bg-purple-600 text-white mb-4 shadow-lg shadow-purple-100"><Users size={24}/></div>
           <p className="text-gray-400 text-xs font-bold uppercase mb-1">حجوزات بانتظار التأكيد</p>
           <h4 className="text-2xl font-black text-gray-800">{stats.reservations}</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="p-3 w-fit rounded-2xl bg-amber-500 text-white mb-4 shadow-lg shadow-amber-100"><Star size={24}/></div>
           <p className="text-gray-400 text-xs font-bold uppercase mb-1">تقييم المطعم</p>
           <h4 className="text-2xl font-black text-gray-800">{stats.rating} / 5</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-8">نمو المبيعات</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-lg font-black text-gray-800 mb-8">أكثر الأطباق شهرة</h3>
          <div className="space-y-6">
            {dishes.slice(0, 4).map((dish, i) => (
              <div key={dish.id} className="flex items-center gap-4 group">
                <div className="text-lg font-black text-gray-200 group-hover:text-blue-100 transition-colors w-4">#{i+1}</div>
                <img src={dish.image} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt={dish.name} />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-gray-800 group-hover:text-blue-600 transition-colors">{dish.name}</h4>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                     <div className="bg-blue-600 h-full rounded-full" style={{ width: `${80 - (i * 15)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-black text-gray-800">أحدث الطلبات</h3>
          <button className="text-blue-600 text-sm font-black underline hover:text-blue-700 transition-colors">كافة الطلبات</button>
        </div>
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
              <th className="px-8 py-4">الطلب</th>
              <th className="px-8 py-4">العميل</th>
              <th className="px-8 py-4">الحالة</th>
              <th className="px-8 py-4">الإجمالي</th>
              <th className="px-8 py-4">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5 font-black text-gray-700 text-sm">{order.orderNumber}</td>
                <td className="px-8 py-5 text-sm font-bold text-gray-600">{order.customerName}</td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-wider uppercase ${
                    order.status === 'preparing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {order.status === 'preparing' ? 'جاري التحضير' : 'قيد الانتظار'}
                  </span>
                </td>
                <td className="px-8 py-5 font-black text-blue-600">{order.total} ر.س</td>
                <td className="px-8 py-5 text-gray-400 text-xs font-medium">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantDashboardView;
