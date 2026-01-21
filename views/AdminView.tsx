
import React from 'react';
import { Users, Store, CreditCard, Activity, Search, MoreVertical, ShieldAlert } from 'lucide-react';
import { PLANS } from '../constants';

const AdminView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800">لوحة تحكم النظام (Admin)</h1>
          <p className="text-gray-500">إدارة المطاعم، الباقات، والعمليات المالية</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">إضافة مطعم جديد</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'إجمالي المطاعم', value: '1,284', icon: <Store />, color: 'bg-blue-500' },
          { label: 'المشتركين النشطين', value: '1,120', icon: <Users />, color: 'bg-green-500' },
          { label: 'الدخل الشهري', value: '142k ر.س', icon: <CreditCard />, color: 'bg-amber-500' },
          { label: 'الطلبات النشطة', value: '4,502', icon: <Activity />, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl text-white ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <h4 className="text-2xl font-black text-gray-800">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg">أحدث المطاعم المنضمة</h3>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="بحث عن مطعم..." className="bg-gray-50 border-none rounded-xl py-2 pr-10 pl-4 text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">المطعم</th>
                <th className="px-6 py-4">الباقة</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/admin${i}/100/100`} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <span className="font-bold text-gray-800 text-sm">مطعم السعادة #{i}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {i % 2 === 0 ? 'الشركات' : 'الاحترافية'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${i === 3 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                      {i === 3 ? 'معلق' : 'نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">2023-11-20</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6">توزيع الباقات</h3>
            <div className="space-y-4">
              {PLANS.map(plan => (
                <div key={plan.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{plan.nameAr}</span>
                    <span className="font-bold text-blue-600">{Math.floor(Math.random() * 500) + 100} مطعم</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start gap-4">
            <div className="text-red-500"><ShieldAlert size={24} /></div>
            <div>
              <h4 className="font-black text-red-800 text-sm mb-1">تنبيهات الأمان</h4>
              <p className="text-red-600 text-xs leading-relaxed">هناك 3 مطاعم تجاوزت عدد محاولات الدخول الخاطئة. تم حظر عناوين IP الخاصة بهم تلقائياً.</p>
              <button className="mt-3 text-red-800 font-bold text-xs underline">مراجعة السجلات</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
