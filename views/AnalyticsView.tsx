
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Download, Filter, Smartphone, Monitor, Tablet, DollarSign } from 'lucide-react';
import { db } from '../services/db';

const AnalyticsView: React.FC = () => {
  const [restaurant, setRestaurant] = useState(db.getCurrentRestaurant());

  useEffect(() => {
    setRestaurant(db.getCurrentRestaurant());
  }, []);

  const salesData = [
    { name: 'يناير', value: 12000 },
    { name: 'فبراير', value: 15000 },
    { name: 'مارس', value: 18000 },
    { name: 'أبريل', value: 14000 },
    { name: 'مايو', value: 22000 },
    { name: 'يونيو', value: 25000 },
  ];

  const categoryData = [
    { name: 'رئيسي', value: 45, color: '#2563eb' },
    { name: 'مقبلات', value: 25, color: '#10b981' },
    { name: 'مشروبات', value: 20, color: '#f59e0b' },
    { name: 'حلويات', value: 10, color: '#ef4444' },
  ];

  const deviceData = [
    { name: 'جوال', value: 78, color: '#2563eb', icon: <Smartphone size={16}/> },
    { name: 'كمبيوتر', value: 15, color: '#6366f1', icon: <Monitor size={16}/> },
    { name: 'تابلت', value: 7, color: '#10b981', icon: <Tablet size={16}/> },
  ];

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">التقارير والإحصائيات المتقدمة</h1>
          <p className="text-gray-500 font-medium">تحليل معمق لمبيعاتك بالـ ({restaurant?.currency}) وأداء المنيو</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-100 px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-gray-50 shadow-sm">
            <Filter size={18} /> تصفية النتائج
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
            <Download size={18} /> تصدير PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'متوسط قيمة الطلب', value: `145 ${restaurant?.currency}`, change: '+12%', color: 'blue' },
          { label: 'عدد الزوار الفريدين', value: '4,200', change: '+5%', color: 'indigo' },
          { label: 'معدل العودة للمنيو', value: '28%', change: '+2%', color: 'green' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center transition-transform hover:scale-105">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">{item.label}</p>
            <div className="text-3xl font-black text-gray-800">{item.value}</div>
            <p className="text-green-500 text-xs font-bold mt-3 bg-green-50 px-3 py-1 rounded-full inline-block">{item.change} من الشهر الماضي</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
               <DollarSign size={20} className="text-blue-600" /> نمو المبيعات الشهرية
             </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-800 mb-8">الأجهزة المستخدمة</h3>
          <div className="h-56 relative mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={deviceData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={8} 
                  dataKey="value"
                  strokeWidth={0}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {deviceData.map(item => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition-all hover:bg-gray-100">
                <div className="flex items-center gap-3 font-black text-sm text-gray-700">
                  <div className="p-2 rounded-lg bg-white shadow-sm" style={{ color: item.color }}>{item.icon}</div>
                  {item.name}
                </div>
                <span className="font-black text-blue-600">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
