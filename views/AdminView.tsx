
import React, { useState, useEffect } from 'react';
import { Users, Store, CreditCard, Activity, Search, MoreVertical, ShieldAlert, CheckCircle, XCircle, Settings, LayoutGrid, DollarSign, ArrowUpRight, Ban, Eye, Trash2 } from 'lucide-react';
import { PLANS } from '../constants';
import { db } from '../services/db';
import { Restaurant, SubscriptionPlan } from '../types';

const AdminView: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'plans' | 'logs'>('restaurants');

  useEffect(() => {
    setRestaurants(db.getAllRestaurants());
  }, []);

  const handleToggleStatus = (id: number, currentStatus: Restaurant['status']) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    db.updateRestaurantStatus(id, newStatus);
    setRestaurants(db.getAllRestaurants());
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المطعم نهائياً؟ سيتم حذف جميع الأطباق والطلبات المرتبطة به.')) {
      db.deleteRestaurant(id);
      setRestaurants(db.getAllRestaurants());
    }
  };

  const handleChangePlan = (id: number, planId: number) => {
    db.updateRestaurantPlan(id, planId);
    setRestaurants(db.getAllRestaurants());
    setSelectedRestaurant(null);
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: restaurants.length,
    active: restaurants.filter(r => r.status === 'active').length,
    revenue: restaurants.reduce((acc, r) => acc + (PLANS.find(p => p.id === r.planId)?.price || 0), 0),
    growth: '+12.5%'
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-slate-900 text-white p-2 rounded-xl"><LayoutGrid size={24}/></div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">نظام المشرف العام</h1>
            </div>
            <p className="text-slate-500 font-bold text-sm">إدارة كاملة للمنصة، المطاعم، والاشتراكات المالية.</p>
          </div>
          <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
             <button onClick={() => setActiveTab('restaurants')} className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'restaurants' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>المطاعم</button>
             <button onClick={() => setActiveTab('plans')} className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'plans' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>الباقات</button>
             <button onClick={() => setActiveTab('logs')} className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'logs' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>السجلات</button>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'إجمالي المطاعم', value: stats.total, icon: <Store />, color: 'blue', desc: 'نمو مستمر' },
            { label: 'نشطة حالياً', value: stats.active, icon: <Activity />, color: 'green', desc: 'نسبة 92%' },
            { label: 'الإيرادات المتوقعة', value: `${stats.revenue} ر.س`, icon: <DollarSign />, color: 'amber', desc: stats.growth },
            { label: 'نمو المنصة', value: '+12%', icon: <ArrowUpRight />, color: 'purple', desc: 'آخر 30 يوم' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-5px]">
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6`}>
                {stat.icon}
              </div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-800 mb-2">{stat.value}</h4>
              <div className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full inline-block">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        {activeTab === 'restaurants' && (
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-1">إدارة المطاعم الشريكة</h3>
                <p className="text-slate-400 text-sm font-bold italic">قم بمراجعة، تفعيل، أو تعليق أي حساب مطعم.</p>
              </div>
              <div className="relative w-full md:w-96">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="بحث باسم المطعم أو الرابط..." 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 text-sm font-bold shadow-inner focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <table className="w-full text-right">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                <tr>
                  <th className="px-10 py-5">المطعم ومعلومات التواصل</th>
                  <th className="px-10 py-5">الباقة الحالية</th>
                  <th className="px-10 py-5 text-center">حالة الحساب</th>
                  <th className="px-10 py-5 text-center">الإجراءات والتحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRestaurants.map(restaurant => (
                  <tr key={restaurant.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-8 flex items-center gap-6">
                      <div className="relative">
                        <img src={restaurant.logo} className="w-16 h-16 rounded-[1.5rem] object-cover border-4 border-white shadow-lg shadow-slate-200" alt="" />
                        {restaurant.status === 'active' && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>}
                      </div>
                      <div>
                        <span className="font-black text-slate-800 text-lg block leading-none mb-2">{restaurant.name}</span>
                        <span className="text-[11px] text-blue-600 font-black tracking-tighter flex items-center gap-2">
                           <Eye size={12} /> sop.com/{restaurant.slug}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <button 
                        onClick={() => setSelectedRestaurant(restaurant)}
                        className="bg-white border border-slate-100 px-5 py-2 rounded-xl text-xs font-black text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm flex items-center gap-3"
                      >
                        {PLANS.find(p => p.id === restaurant.planId)?.nameAr}
                        <Settings size={14} className="text-slate-300" />
                      </button>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                        restaurant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {restaurant.status === 'active' ? 'نشط ومفعل' : 'معلق مؤقتاً'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-center gap-4">
                         <button 
                          onClick={() => handleToggleStatus(restaurant.id, restaurant.status)}
                          className={`p-4 rounded-2xl transition-all shadow-sm ${
                            restaurant.status === 'active' ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' : 'bg-green-50 text-green-500 hover:bg-green-100'
                          }`}
                          title={restaurant.status === 'active' ? "تعليق الحساب" : "تنشيط الحساب"}
                         >
                           {restaurant.status === 'active' ? <Ban size={20} /> : <CheckCircle size={20} />}
                         </button>
                         <button 
                          onClick={() => handleDelete(restaurant.id)}
                          className="p-4 bg-red-50 text-red-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm group"
                         >
                           <Trash2 size={20} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredRestaurants.length === 0 && (
              <div className="p-20 text-center">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                   <Search size={48} />
                </div>
                <h4 className="text-xl font-black text-slate-400">عذراً، لم نجد أي مطعم يطابق بحثك.</h4>
              </div>
            )}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {PLANS.map(plan => (
                <div key={plan.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-16 translate-x-16 opacity-30 group-hover:scale-150 transition-transform duration-1000"></div>
                   <h3 className="text-3xl font-black text-slate-800 mb-2">{plan.nameAr}</h3>
                   <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-5xl font-black text-blue-600">{plan.price}</span>
                      <span className="text-sm font-bold text-slate-400">ر.س / شهرياً</span>
                   </div>
                   <ul className="space-y-4 mb-10">
                      {plan.features.map((f, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                            <CheckCircle size={16} className="text-green-500" /> {f}
                         </li>
                      ))}
                   </ul>
                   <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all active:scale-95">تعديل الباقة</button>
                </div>
             ))}
          </div>
        )}

        {/* Change Plan Modal */}
        {selectedRestaurant && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6" onClick={() => setSelectedRestaurant(null)}>
             <div className="bg-white rounded-[3.5rem] p-12 w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-16 translate-x-16 opacity-50"></div>
                <h3 className="text-3xl font-black text-slate-800 mb-2 relative">تعديل باقة المطعم</h3>
                <p className="text-slate-400 font-bold text-sm mb-10 relative">تغيير الباقة لمطعم: <span className="text-blue-600">{selectedRestaurant.name}</span></p>
                
                <div className="grid grid-cols-1 gap-5 mb-12 relative">
                   {PLANS.map(plan => (
                      <button 
                        key={plan.id}
                        onClick={() => handleChangePlan(selectedRestaurant.id, plan.id)}
                        className={`p-8 rounded-[2.5rem] border-4 text-right transition-all flex justify-between items-center group relative ${
                          selectedRestaurant.planId === plan.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 hover:border-blue-100 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                            selectedRestaurant.planId === plan.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'
                          }`}>
                            <CreditCard size={24} />
                          </div>
                          <div>
                            <span className="font-black text-xl block text-slate-800">{plan.nameAr}</span>
                            <span className="text-xs text-slate-400 font-black uppercase tracking-widest">{plan.price} ر.س / شهرياً</span>
                          </div>
                        </div>
                        {selectedRestaurant.planId === plan.id && <CheckCircle className="text-blue-600" size={32} />}
                      </button>
                   ))}
                </div>
                
                <div className="flex gap-4 relative">
                   <button onClick={() => setSelectedRestaurant(null)} className="flex-1 py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">إلغاء</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
