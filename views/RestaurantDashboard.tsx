
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, Star, ArrowUpRight } from 'lucide-react';
import { db } from '../services/db';
import { Order, Dish } from '../types';

const RestaurantDashboardView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [stats, setStats] = useState({ sales: 0, count: 0, reservations: 0, rating: 4.8 });
  const [restaurant, setRestaurant] = useState(db.getCurrentRestaurant());

  useEffect(() => {
    const loadData = async () => {
      const res = db.getCurrentRestaurant();
      if (res) {
        setRestaurant(res);
        // Fix: Properly await asynchronous operations to resolve Promises before using slice, reduce, or length
        const allOrders = await db.getOrders(res.id);
        const allDishes = await db.getDishes(res.id);
        const allReservations = await db.getReservations(res.id);
        
        setOrders(allOrders.slice(0, 5));
        setDishes(allDishes);
        
        const totalSales = allOrders.reduce((acc, curr) => acc + curr.total, 0);
        setStats({
          sales: totalSales,
          count: allOrders.length,
          reservations: allReservations.length,
          rating: 4.8
        });
      }
    };
    loadData();
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboardView;
