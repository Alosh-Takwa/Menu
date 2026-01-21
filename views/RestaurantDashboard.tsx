
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, Star, AlertCircle, ArrowUpRight } from 'lucide-react';
import { db } from '../services/db';
import { Order, Dish } from '../types';

const RestaurantDashboardView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [stats, setStats] = useState({ sales: 0, count: 0, reservations: 0, rating: 4.8 });
  const [restaurant, setRestaurant] = useState(db.getCurrentRestaurant());

  useEffect(() => {
    const res = db.getCurrentRestaurant();
    if (res) {
      setRestaurant(res);
      const allOrders = db.getOrders(res.id);
      const allDishes = db.getDishes(res.id);
      const allRes = db.getReservations(res.id);
      
      setOrders(allOrders.slice(0, 5));
      setDishes(allDishes);
      
      const totalSales = allOrders.reduce((acc, curr) => acc + curr.total, 0);
      setStats({
        sales: totalSales,
        count: allOrders.length,
        reservations: allRes.filter(r => r.status === 'pending').length,
        rating: 4.8
      });
    }
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
          <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
             لوحة التحكم
             <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{restaurant?.status === 'active' ? 'حساب نشط' : 'حساب معلق'}</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">أهلاً بك مجدداً في {restaurant?.name}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-5 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <AlertCircle size={18} />
            <span className="text-sm font-bold">باقة {restaurant?.planId === 1 ? 'أساسية' : restaurant?.planId === 2 ? 'احترافية' : 'شركات'}</span>
          </div>
          <button className="bg-blue-600 text-white px-8 py-2 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2">
            ترقية
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
           <div className="p-3 w-fit rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-100"><TrendingUp size={24}/></div>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">إجمالي المبيعات</p>
           <h4 className="text-2xl font-black text-gray-800">{stats.sales} {restaurant?.currency}</h4>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
           <div className="p-3 w-fit rounded-2xl bg-green-600 text-white mb-4 shadow-lg shadow-green-100"><ShoppingBag size={24}/></div>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">إجمالي الطلبات</p>
           <h4 className="text-2xl font-black text-gray-800">{stats.count}</h4>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
           <div className="p-3 w-fit rounded-2xl bg-purple-600 text-white mb-4 shadow-lg shadow-purple-100"><Users size={24}/></div>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">حجوزات نشطة</p>
           <h4 className="text-2xl font-black text-gray-800">{stats.reservations}</h4>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
           <div className="p-3 w-fit rounded-2xl bg-amber-500 text-white mb-4 shadow-lg shadow-amber-100"><Star size={24}/></div>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">التقييم العام</p>
           <h4 className="text-2xl font-black text-gray-800">{stats.rating} / 5</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-gray-800 border-r-4 border-blue-600 pr-4">منحنى المبيعات ({restaurant?.currency})</h3>
            <select className="bg-gray-50 border-none rounded-xl py-2 px-4 text-xs font-bold shadow-sm">
              <option>آخر 7 أيام</option>
              <option>آخر شهر</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={5} dot={{ r: 6, fill: '#2563eb', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-lg font-black text-gray-800 mb-8 border-r-4 border-purple-600 pr-4">الأكثر طلباً</h3>
          <div className="space-y-6">
            {dishes.slice(0, 5).map((dish, i) => (
              <div key={dish.id} className="flex items-center gap-4 group cursor-pointer">
                <div className="text-lg font-black text-gray-100 group-hover:text-blue-200 transition-colors w-6">0{i+1}</div>
                <img src={dish.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform duration-500" alt={dish.name} />
                <div className="flex-1">
                  <h4 className="font-black text-xs text-gray-800 group-hover:text-blue-600 transition-colors">{dish.name}</h4>
                  <div className="w-full bg-gray-50 h-2 rounded-full mt-3 overflow-hidden border border-gray-100 shadow-inner">
                     <div className="bg-gradient-to-l from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000" style={{ width: `${85 - (i * 12)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-black text-gray-800 border-r-4 border-green-600 pr-4">آخر العمليات</h3>
          <button className="text-blue-600 text-sm font-black underline hover:text-blue-700 transition-all active:scale-95">عرض السجل الكامل</button>
        </div>
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
              <th className="px-8 py-5">رقم الطلب</th>
              <th className="px-8 py-5">العميل</th>
              <th className="px-8 py-5 text-center">الحالة</th>
              <th className="px-8 py-5 text-center">الإجمالي</th>
              <th className="px-8 py-5">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6 font-black text-gray-800 text-sm">{order.orderNumber}</td>
                <td className="px-8 py-6 text-sm font-bold text-gray-600">{order.customerName}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                    order.status === 'preparing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {order.status === 'preparing' ? 'جاري التحضير' : 'قيد الانتظار'}
                  </span>
                </td>
                <td className="px-8 py-6 text-center font-black text-blue-600">{order.total} {restaurant?.currency}</td>
                <td className="px-8 py-6 text-gray-400 text-[11px] font-bold">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantDashboardView;
