
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Restaurant } from '../types';
import { Palette, Type, Layout, Check, ArrowRight, Eye, RefreshCw } from 'lucide-react';

const MenuCustomizationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors');

  useEffect(() => {
    setRestaurant(db.getCurrentRestaurant());
  }, []);

  const handleSave = () => {
    if (restaurant) {
      db.updateRestaurant(restaurant.id, restaurant);
      alert('تم تحديث مظهر المنيو بنجاح!');
    }
  };

  if (!restaurant) return null;

  const colorPresets = [
    { name: 'أزرق SOP', color: '#2563eb' },
    { name: 'أخضر ملكي', color: '#065f46' },
    { name: 'أحمر كلاسيك', color: '#991b1b' },
    { name: 'برتقالي مشهي', color: '#f59e0b' },
    { name: 'وردي عصري', color: '#db2777' },
    { name: 'أسود فخم', color: '#111827' }
  ];

  const fonts = [
    { name: 'Cairo (افتراضي)', value: 'Cairo' },
    { name: 'Tajawal', value: 'Tajawal' },
    { name: 'Almarai', value: 'Almarai' },
    { name: 'Alexandria', value: 'Alexandria' }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans pb-32">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800">تخصيص مظهر المنيو</h1>
          <p className="text-gray-500 font-bold">اجعل المنيو يعبر عن شخصية علامتك التجارية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] p-2 flex gap-2 border border-gray-100 shadow-sm">
            <button onClick={() => setActiveTab('colors')} className={`flex-1 py-4 rounded-[32px] font-black text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'colors' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}><Palette size={18}/> الألوان</button>
            <button onClick={() => setActiveTab('fonts')} className={`flex-1 py-4 rounded-[32px] font-black text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'fonts' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}><Type size={18}/> الخطوط</button>
            <button onClick={() => setActiveTab('layout')} className={`flex-1 py-4 rounded-[32px] font-black text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'layout' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}><Layout size={18}/> التخطيط</button>
          </div>

          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm min-h-[400px]">
            {activeTab === 'colors' && (
              <div className="space-y-10">
                <div>
                  <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">اللون الرئيسي للمنيو</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {colorPresets.map(cp => (
                      <button 
                        key={cp.color} 
                        onClick={() => setRestaurant({...restaurant, themeColor: cp.color})}
                        className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${restaurant.themeColor === cp.color ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className="w-12 h-12 rounded-2xl shadow-lg" style={{ backgroundColor: cp.color }}></div>
                        <span className="text-xs font-black text-gray-600">{cp.name}</span>
                        {restaurant.themeColor === cp.color && <Check size={16} className="text-blue-600" />}
                      </button>
                    ))}
                    <div className="p-4 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50">
                        <RefreshCw size={24} className="text-gray-300" />
                        <span className="text-[10px] font-black text-gray-400">لون مخصص</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fonts' && (
              <div className="space-y-6">
                 <h3 className="text-lg font-black text-gray-800 mb-6">اختر خط الخطابة للعملاء</h3>
                 <div className="grid grid-cols-1 gap-4">
                    {fonts.map(f => (
                      <button 
                        key={f.value}
                        onClick={() => setRestaurant({...restaurant, fontFamily: f.value})}
                        className={`p-6 rounded-[32px] border-2 text-right transition-all flex justify-between items-center ${restaurant.fontFamily === f.value ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <span className="font-black text-lg" style={{ fontFamily: f.value }}>نص تجريبي: أهلاً بك في مطعمنا</span>
                        {restaurant.fontFamily === f.value && <Check className="text-blue-600" size={24} />}
                      </button>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="text-center py-20">
                <Layout size={64} className="mx-auto text-gray-200 mb-4" />
                <h3 className="font-black text-gray-400">قريباً: إمكانية تغيير شكل القائمة (شبكي/قائمة)</h3>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl overflow-hidden relative">
            <h3 className="font-black text-sm mb-6 flex items-center gap-2">
              <Eye size={16} /> معاينة مباشرة
            </h3>
            
            <div className="bg-white rounded-[32px] p-4 text-gray-800 max-w-[240px] mx-auto shadow-inner h-[400px] overflow-hidden">
               <div className="h-24 bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                  <div className="h-full w-full opacity-50 bg-gradient-to-br from-gray-200 to-gray-300"></div>
               </div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: restaurant.themeColor }}></div>
                  <div className="h-2 w-20 bg-gray-100 rounded"></div>
               </div>
               <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-50 rounded"></div>
                  <div className="h-3 w-2/3 bg-gray-50 rounded"></div>
               </div>
               <div className="mt-6 flex justify-between items-center">
                  <div className="h-4 w-12 rounded" style={{ backgroundColor: restaurant.themeColor }}></div>
                  <div className="w-8 h-8 rounded-xl shadow-md flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: restaurant.themeColor }}>+</div>
               </div>
            </div>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          </div>
          
          <button 
            onClick={handleSave}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            حفظ المظهر الجديد
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCustomizationView;
