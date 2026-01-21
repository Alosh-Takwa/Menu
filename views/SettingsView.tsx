
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Restaurant } from '../types';
import { Store, CreditCard, Smartphone, Palette, Globe, Shield, HelpCircle, CheckCircle2, DollarSign, ChevronLeft, PlusCircle } from 'lucide-react';

interface SettingsViewProps {
  onNavigate: (tab: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isCustomCurrency, setIsCustomCurrency] = useState(false);

  useEffect(() => {
    setRestaurant(db.getCurrentRestaurant());
  }, []);

  const handleSave = () => {
    if (restaurant) {
      db.updateRestaurant(restaurant.id, restaurant);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (!restaurant) return null;

  const currencies = ['ر.س', 'د.إ', 'د.ك', 'ب.د', 'ر.ع', 'ر.ق', '$', '€', '£'];

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32 font-sans">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
           <CheckCircle2 size={24} />
           <span className="font-black">تم حفظ كافة التغييرات بنجاح!</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">إعدادات النظام</h1>
          <p className="text-gray-500 font-medium">تحكم في هوية مطعمك، مظهر المنيو، واشتراكك</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><Store size={24}/></div>
              <h2 className="text-2xl font-black">هوية المطعم</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 flex justify-center mb-6">
                 <div className="relative group cursor-pointer" onClick={() => alert('محاكاة: اختر صورة جديدة للشعار')}>
                    <img src={restaurant.logo} className="w-32 h-32 rounded-full border-8 border-gray-50 object-cover shadow-lg transition-transform group-hover:scale-105" alt="" />
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase text-center p-4">تغيير الشعار</div>
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">اسم المطعم</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={restaurant.name} 
                  onChange={e => setRestaurant({...restaurant, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">نوع العملة</label>
                <div className="relative">
                  <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  {isCustomCurrency ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-12 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="أدخل رمز العملة"
                        value={restaurant.currency}
                        onChange={e => setRestaurant({...restaurant, currency: e.target.value})}
                      />
                      <button onClick={() => setIsCustomCurrency(false)} className="text-[10px] font-black text-blue-600 whitespace-nowrap">رجوع للقائمة</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <select 
                        className="w-full bg-gray-50 border-none rounded-2xl pr-12 pl-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                        value={restaurant.currency}
                        onChange={e => {
                          if (e.target.value === 'custom') {
                            setIsCustomCurrency(true);
                            setRestaurant({...restaurant, currency: ''});
                          } else {
                            setRestaurant({...restaurant, currency: e.target.value});
                          }
                        }}
                      >
                        {currencies.map(c => <option key={c} value={c}>{c === '$' ? 'دولار ($)' : c === 'ر.س' ? 'ريال سعودي (ر.س)' : c}</option>)}
                        <option value="custom">إضافة عملة أخرى +</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">رابط المنيو (Slug)</label>
                <div className="flex items-center bg-gray-50 rounded-2xl px-6 py-4 group focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 text-sm font-bold ml-1">sop.com/</span>
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-black text-blue-600" 
                    value={restaurant.slug}
                    onChange={e => setRestaurant({...restaurant, slug: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">رقم التواصل</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={restaurant.phone}
                  onChange={e => setRestaurant({...restaurant, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">عنوان المطعم</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={restaurant.address}
                  onChange={e => setRestaurant({...restaurant, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-sm"><Smartphone size={24}/></div>
              <h2 className="text-2xl font-black">الميزات المتقدمة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] hover:bg-gray-100 transition-colors cursor-pointer group">
                <div>
                  <p className="font-black text-gray-800 text-sm">نظام الطلبات المباشرة</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Direct Orders</p>
                </div>
                <div className="w-14 h-8 bg-blue-600 rounded-full flex items-center px-1 shadow-inner relative"><div className="w-6 h-6 bg-white rounded-full mr-auto shadow-md"></div></div>
              </div>
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] hover:bg-gray-100 transition-colors cursor-pointer group">
                <div>
                  <p className="font-black text-gray-800 text-sm">نظام الحجز الآلي</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Auto Reservations</p>
                </div>
                <div className="w-14 h-8 bg-blue-600 rounded-full flex items-center px-1 shadow-inner relative"><div className="w-6 h-6 bg-white rounded-full mr-auto shadow-md"></div></div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-3">اشتراكك الحالي</div>
                <div className="text-3xl font-black mb-1">الاحترافية</div>
                <div className="text-blue-100 text-xs font-bold mb-8 uppercase">Professional Plan</div>
                <ul className="space-y-3 mb-10 text-sm font-bold">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div> أطباق غير محدودة</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div> QR Code مخصص</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div> دعم فني مميز</li>
                </ul>
                <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-50 transition-all hover:scale-105">ترقية الباقة الآن</button>
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-gray-100 space-y-4">
              <button 
                onClick={() => onNavigate('menu-customization')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group"
              >
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><Palette size={20}/></div>
                    <span className="text-sm font-black text-gray-700">تخصيص ألوان المنيو</span>
                 </div>
                 <ChevronLeft size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
              </button>
              <button 
                onClick={() => onNavigate('password-change')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group"
              >
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-500 rounded-xl"><Shield size={20}/></div>
                    <span className="text-sm font-black text-gray-700">تغيير كلمة المرور</span>
                 </div>
                 <ChevronLeft size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-500 rounded-xl"><HelpCircle size={20}/></div>
                    <span className="text-sm font-black text-gray-700">مركز المساعدة</span>
                 </div>
                 <Globe size={16} className="text-gray-300" />
              </button>
           </div>
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-[90]">
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[32px] shadow-2xl border border-white flex gap-4">
            <button onClick={handleSave} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">حفظ كافة الإعدادات</button>
            <button className="px-8 py-4 bg-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
