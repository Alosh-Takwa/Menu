
import React from 'react';
import { Store, CreditCard, Bell, Shield, MapPin, Palette, Globe, Smartphone, HelpCircle } from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800">إعدادات النظام</h1>
          <p className="text-gray-500">تحكم في هوية مطعمك، مظهر المنيو، واشتراكك</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Restaurant Profile */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Store size={22}/></div>
              <h2 className="text-xl font-bold">هوية المطعم</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex justify-center mb-4">
                 <div className="relative group">
                    <img src="https://picsum.photos/seed/logo/200/200" className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover" alt="" />
                    <button className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">تغيير</button>
                 </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">اسم المطعم (عربي)</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="مطعم الشرق الأصيل" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">اسم المطعم (إنجليزي)</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="Al Sharq Authentic" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">رابط المنيو المخصص (Slug)</label>
                <div className="flex items-center bg-gray-50 rounded-2xl px-5 py-3 group focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 text-sm">sop-pos.com/</span>
                  <input type="text" className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-blue-600" defaultValue="al-sharq" />
                </div>
              </div>
            </div>
          </section>

          {/* Social Links & Features */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Smartphone size={22}/></div>
              <h2 className="text-xl font-bold">روابط التواصل والميزات</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="font-bold text-sm">نظام الطلبات المباشرة</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mr-auto"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="font-bold text-sm">نظام حجز الطاولات</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mr-auto"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                 <input type="text" placeholder="رابط إنستغرام" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                 <input type="text" placeholder="رابط تيك توك" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
           {/* Active Plan Card */}
           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">باقتك الحالية</div>
                <div className="text-3xl font-black mb-1">الشركات</div>
                <div className="text-indigo-200 text-sm mb-6">Enterprise Plan</div>
                <ul className="space-y-2 mb-8 text-sm">
                  <li className="flex items-center gap-2 opacity-90"><CreditCard size={14}/> أطباق غير محدودة</li>
                  <li className="flex items-center gap-2 opacity-90"><CreditCard size={14}/> إحصائيات متقدمة</li>
                  <li className="flex items-center gap-2 opacity-90"><CreditCard size={14}/> دعم فني 24/7</li>
                </ul>
                <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-lg active:scale-95">ترقية الباقة</button>
              </div>
              {/* Background Glow */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           </div>

           {/* Quick Actions / Shortcuts */}
           <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all group">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Palette size={18}/></div>
                    <span className="text-sm font-bold text-gray-700">تخصيص ألوان المنيو</span>
                 </div>
                 <Globe size={16} className="text-gray-300 group-hover:text-blue-500" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all group">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-500 rounded-lg"><Shield size={18}/></div>
                    <span className="text-sm font-bold text-gray-700">تغيير كلمة المرور</span>
                 </div>
                 <Globe size={16} className="text-gray-300 group-hover:text-blue-500" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all group">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-500 rounded-lg"><HelpCircle size={18}/></div>
                    <span className="text-sm font-bold text-gray-700">مركز المساعدة</span>
                 </div>
                 <Globe size={16} className="text-gray-300 group-hover:text-blue-500" />
              </button>
           </div>
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-2xl border border-white">
          <button className="px-10 py-3 bg-blue-600 text-white font-black rounded-full hover:bg-blue-700 shadow-xl transition-all active:scale-95">حفظ كافة التغييرات</button>
          <button className="px-6 py-3 bg-gray-100 text-gray-500 font-bold rounded-full hover:bg-gray-200 transition-all">إلغاء</button>
      </div>
    </div>
  );
};

export default SettingsView;
