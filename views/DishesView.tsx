
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Wand2, Check, X, ChefHat } from 'lucide-react';
import { MOCK_CATEGORIES } from '../constants';
import { db } from '../services/db';
import { Dish } from '../types';
import { GoogleGenAI } from "@google/genai";

const DishesView: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [newDish, setNewDish] = useState<Partial<Dish>>({
    name: '',
    description: '',
    price: 0,
    categoryId: MOCK_CATEGORIES[0].id,
    isAvailable: true,
    preparationTime: 20
  });

  useEffect(() => {
    const restaurant = db.getCurrentRestaurant();
    if (restaurant) {
      setDishes(db.getDishes(restaurant.id));
    }
  }, []);

  const handleSave = () => {
    const restaurant = db.getCurrentRestaurant();
    if (!newDish.name || !newDish.price || !restaurant) return;
    
    db.addDish({
      restaurantId: restaurant.id,
      name: newDish.name || '',
      nameEn: newDish.name || '',
      description: newDish.description || '',
      price: Number(newDish.price),
      categoryId: newDish.categoryId || 1,
      image: `https://picsum.photos/seed/${Date.now()}/400/300`,
      isAvailable: true,
      preparationTime: newDish.preparationTime || 20
    });

    setDishes(db.getDishes(restaurant.id));
    setIsModalOpen(false);
    setNewDish({ name: '', description: '', price: 0, categoryId: MOCK_CATEGORIES[0].id });
  };

  const generateAIDescription = async () => {
    if (!newDish.name) return;
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أنت خبير تسويق مطاعم. اكتب وصفاً شهياً وجذاباً ومختصراً باللغة العربية لطبق يسمى: "${newDish.name}". اجعل الوصف يثير الشهية.`,
      });
      setNewDish(prev => ({ ...prev, description: response.text || '' }));
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">إدارة قائمة الطعام</h1>
          <p className="text-gray-500 font-medium">تحكم في أطباقك، أسعارك، وتوافر الوجبات</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:scale-105 active:scale-95">
          <Plus size={22} />
          إضافة طبق جديد
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap items-center gap-6 bg-gray-50/50">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="ابحث عن طبق بالاسم..." className="w-full bg-white border-none rounded-2xl py-3 pr-12 pl-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select className="bg-white border-none rounded-2xl py-3 px-6 text-sm font-black shadow-sm focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>جميع الأقسام</option>
            {MOCK_CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
          </select>
        </div>

        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
              <th className="px-8 py-4">الطبق</th>
              <th className="px-8 py-4">القسم</th>
              <th className="px-8 py-4 text-center">السعر</th>
              <th className="px-8 py-4 text-center">التوفر</th>
              <th className="px-8 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dishes.map((dish) => (
              <tr key={dish.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <img src={dish.image} className="w-16 h-16 rounded-3xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={dish.name} />
                    <div>
                      <h4 className="font-black text-gray-800 text-sm mb-1">{dish.name}</h4>
                      <p className="text-[11px] text-gray-400 font-bold truncate max-w-[250px] leading-relaxed">{dish.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6"><span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black">{MOCK_CATEGORIES.find(c => c.id === dish.categoryId)?.name}</span></td>
                <td className="px-8 py-6 text-center font-black text-blue-600">{dish.price} ر.س</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black ${dish.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {dish.isAvailable ? 'متاح' : 'مباع'}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center gap-3">
                    <button className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all shadow-sm"><Edit2 size={16} /></button>
                    <button className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all shadow-sm"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-white rounded-[48px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-100"><ChefHat size={28}/></div>
                 <h2 className="text-2xl font-black text-gray-800">إضافة طبق للمنيو</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-3 rounded-full text-gray-400 hover:text-gray-600 shadow-sm"><X size={24}/></button>
            </div>
            <div className="p-10 grid grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">اسم الطبق</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={newDish.name} onChange={(e) => setNewDish({...newDish, name: e.target.value})} placeholder="مثال: مندي حضرمي أصيل" />
              </div>
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">الوصف الشهي</label>
                  <button onClick={generateAIDescription} disabled={aiLoading || !newDish.name} className="text-[10px] flex items-center gap-2 text-purple-600 font-black hover:text-purple-700 disabled:opacity-50 tracking-tighter uppercase">
                    {aiLoading ? 'جاري التوليد...' : <><Wand2 size={14} /> توليد بالذكاء الاصطناعي</>}
                  </button>
                </div>
                <textarea rows={4} className="w-full bg-gray-50 border-none rounded-3xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none" value={newDish.description} onChange={(e) => setNewDish({...newDish, description: e.target.value})} placeholder="أخبرنا عن سر لذة هذا الطبق..." />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">السعر (ر.س)</label>
                <input type="number" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={newDish.price} onChange={(e) => setNewDish({...newDish, price: Number(e.target.value)})} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">القسم</label>
                <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer" value={newDish.categoryId} onChange={(e) => setNewDish({...newDish, categoryId: Number(e.target.value)})}>
                  {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="p-10 bg-gray-50 flex gap-6">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 rounded-2xl transition-all">إلغاء</button>
              <button onClick={handleSave} className="flex-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">حفظ وإضافة للمنيو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishesView;
