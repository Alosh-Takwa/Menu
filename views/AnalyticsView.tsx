
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Download, Filter } from 'lucide-react';

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

const AnalyticsView: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">التقارير والإحصائيات</h1>
          <p className="text-gray-500">تحليل معمق لمبيعاتك وأداء الأطباق</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
            <Filter size={16} /> تصفية
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
            <Download size={16} /> تصدير PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">نمو المبيعات الشهرية</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">توزيع المبيعات حسب القسم</h3>
          <div className="h-72 flex flex-col md:flex-row items-center">
            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryData} 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={5} 
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 px-6">
              {categoryData.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-bold mr-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'متوسط قيمة الطلب', value: '145 ر.س', change: '+12%' },
          { label: 'عدد الزوار الفريدين', value: '4,200', change: '+5%' },
          { label: 'معدل التكرار', value: '28%', change: '+2%' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-1">{item.label}</p>
            <div className="text-2xl font-black text-gray-800">{item.value}</div>
            <p className="text-green-500 text-xs font-bold mt-2">{item.change} من الشهر الماضي</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsView;
