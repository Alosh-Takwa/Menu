
import React, { useState, useEffect } from 'react';
import { Users, Store, CreditCard, Activity, Search, ShieldAlert, CheckCircle, XCircle, Settings, LayoutGrid, DollarSign, ArrowUpRight, Ban, Eye, Trash2, Globe, Mail, Phone, Save, ToggleLeft, ToggleRight, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { PLANS } from '../constants';
import { db } from '../services/db';
import { Restaurant, PlatformSettings } from '../types';

const AdminView: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'restaurants' | 'platform_settings' | 'stats' | 'plans'>('restaurants');
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(db.getPlatformSettings());

  useEffect(() => {
    setRestaurants(db.getAllRestaurants());
    setPlatformSettings(db.getPlatformSettings());
  }, []);

  const handleToggleStatus = (id: number, currentStatus: Restaurant['status']) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    db.updateRestaurantStatus(id, newStatus);
    setRestaurants(db.getAllRestaurants());
  };

  const handleUpdatePlan = (id: number, planId: number) => {
    db.updateRestaurantPlan(id, planId);
    setRestaurants(db.getAllRestaurants());
    alert('تم تحديث الباقة بنجاح');
  };

  const handleSavePlatformSettings = () => {
    db.updatePlatformSettings(platformSettings);
    alert('تم حفظ إعدادات المنصة بنجاح!');
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans pb-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
               لوحة التحكم المركزية
               <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">SOP Admin</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1">أهلاً بك، تحكم في كافة تفاصيل المنصة من مكان واحد.</p>
          </div>
          
          <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
             {[
               { id: 'restaurants', label: 'المطاعم', icon: <Store size={14}/> },
               { id: 'platform_settings', label: 'الإعدادات', icon: <Settings size={14}/> },
               { id: 'stats', label: 'التقارير', icon: <Activity size={14}/> }
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)} 
                 className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 {tab.icon}
                 {tab.label}
               </button>
             ))}
          </div>
        </div>

        {/* 1. Restaurants Management Tab */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="relative group max-w-2xl">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="ابحث عن مطعم باسمه أو رابط المنيو..." 
                  className="w-full bg-white border border-slate-100 rounded-2xl py-4 pr-12 pl-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map(res => (
                   <div key={res.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl transition-all group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="relative">
                            <img src={res.logo} className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-slate-50" />
                            {res.status === 'active' ? (
                               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            ) : (
                               <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full"></div>
                            )}
                         </div>
                         <div className="flex flex-col items-end gap-2">
                           <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${res.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                              {res.status === 'active' ? 'نشط' : 'معلق'}
                           </span>
                           <span className="text-[9px] font-black text-slate-300 uppercase">#{res.id}</span>
                         </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-800 mb-1">{res.name}</h3>
                      <p className="text-xs text-blue-600 font-bold mb-6 truncate">sop-pos.com/{res.slug}</p>
                      
                      <div className="space-y-4 mb-8">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                            <span>الباقة الحالية</span>
                            <span className="text-slate-800">{PLANS.find(p => p.id === res.planId)?.nameAr}</span>
                         </div>
                         <div className="flex gap-1">
                            {PLANS.map(p => (
                              <button 
                                key={p.id}
                                onClick={() => handleUpdatePlan(res.id, p.id)}
                                className={`flex-1 py-1 text-[8px] font-black rounded-md border transition-all ${res.planId === p.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
                              >
                                {p.nameAr.split(' ')[1] || p.nameAr}
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="flex gap-2 mt-auto">
                         <button 
                           onClick={() => handleToggleStatus(res.id, res.status)} 
                           className={`flex-1 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${res.status === 'active' ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-600'}`}
                         >
                            {res.status === 'active' ? <Ban size={14}/> : <CheckCircle size={14}/>}
                            {res.status === 'active' ? 'تعليق الحساب' : 'تفعيل'}
                         </button>
                         <button onClick={() => { db.setCurrentUser(res.id); window.open('/menu-preview'); }} className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl active:scale-95"><Eye size={20}/></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* 2. Platform Settings Tab */}
        {activeTab === 'platform_settings' && (
           <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm max-w-4xl mx-auto animate-in zoom-in duration-300">
              <div className="flex items-center gap-4 mb-12">
                 <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-xl"><Settings size={28}/></div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-800">إعدادات المنصة</h2>
                    <p className="text-slate-400 text-sm font-bold">تحكم في البيانات العامة والواجهة الرئيسية.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">اسم المنصة</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                         value={platformSettings.siteName}
                         onChange={e => setPlatformSettings({...platformSettings, siteName: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">بريد الدعم الفني</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                         value={platformSettings.supportEmail}
                         onChange={e => setPlatformSettings({...platformSettings, supportEmail: e.target.value})}
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">هاتف التواصل</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                         value={platformSettings.supportPhone}
                         onChange={e => setPlatformSettings({...platformSettings, supportPhone: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">نص التذييل (Footer)</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                         value={platformSettings.footerText}
                         onChange={e => setPlatformSettings({...platformSettings, footerText: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="md:col-span-2 p-10 bg-slate-900 rounded-[3rem] flex items-center justify-between text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex items-center gap-6">
                       <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                          <ShieldAlert className="text-amber-400" size={32} />
                       </div>
                       <div>
                          <p className="text-xl font-black">وضعية الصيانة (Maintenance Mode)</p>
                          <p className="text-sm text-slate-400 font-bold">عند التفعيل، سيتم إغلاق المنصة أمام الزوار الجدد.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setPlatformSettings({...platformSettings, isMaintenanceMode: !platformSettings.isMaintenanceMode})}
                      className="relative z-10"
                    >
                       {platformSettings.isMaintenanceMode ? <ToggleRight size={64} className="text-blue-500"/> : <ToggleLeft size={64} className="text-slate-700"/>}
                    </button>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                 </div>
              </div>

              <button 
                onClick={handleSavePlatformSettings} 
                className="w-full mt-12 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                 <Save size={24}/> حفظ كافة الإعدادات
              </button>
           </div>
        )}

        {/* 3. Stats Tab */}
        {activeTab === 'stats' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
              {[
                { label: 'إجمالي المطاعم', value: restaurants.length, change: '+5 هذا الشهر', icon: <Store/>, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'المطاعم النشطة', value: restaurants.filter(r=>r.status==='active').length, change: '92% من الإجمالي', icon: <ShieldCheck/>, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'باقة الشركات', value: restaurants.filter(r=>r.planId===3).length, change: 'VIP الحسابات', icon: <DollarSign/>, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'نمو المنصة', value: '+18%', change: 'معدل سنوي', icon: <Activity/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col hover:translate-y-[-5px] transition-all">
                   <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-6 shadow-sm`}>{s.icon}</div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                   <h4 className="text-4xl font-black text-slate-900 mb-4">{s.value}</h4>
                   <div className="mt-auto pt-4 border-t border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{s.change}</div>
                </div>
              ))}
              
              <div className="md:col-span-2 lg:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                 <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3"><Activity size={20} className="text-blue-600"/> سجل النشاط الأخير</h3>
                 <div className="space-y-6">
                    {restaurants.slice(0, 5).map((r, i) => (
                       <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400">{i+1}</div>
                             <div>
                                <p className="font-black text-slate-800 text-sm">{r.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">قام بتحديث الباقة قبل يومين</p>
                             </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-200" />
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default AdminView;
