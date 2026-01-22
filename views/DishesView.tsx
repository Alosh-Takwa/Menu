
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Wand2, X, ChefHat, Upload, Loader2, Sparkles, Filter } from 'lucide-react';
import { db } from '../services/db';
import { Dish, Category, Restaurant } from '../types';
import { GoogleGenAI } from "@google/genai";

const DishesView: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDishId, setCurrentDishId] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newDish, setNewDish] = useState<Partial<Dish>>({
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    isAvailable: true,
    preparationTime: 20,
    image: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    const res = db.getCurrentRestaurant();
    if (res) {
      setRestaurant(res);
      const [cats, allDishes] = await Promise.all([
        db.getCategories(res.id),
        db.getDishes(res.id)
      ]);
      setCategories(cats);
      setDishes(allDishes);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (dish: Dish) => {
    setCurrentDishId(dish.id);
    setNewDish({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      categoryId: dish.categoryId,
      isAvailable: dish.isAvailable,
      preparationTime: dish.preparationTime,
      image: dish.image
    });
    setImagePreview(dish.image);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الطبق نهائياً؟')) {
      await db.updateDish(id, { restaurantId: -1 });
      await loadData();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setNewDish(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!newDish.name || !newDish.price || !restaurant) return;
    setIsLoading(true);
    
    if (isEditMode && currentDishId) {
      await db.updateDish(currentDishId, newDish);
    } else {
      await db.addDish({
        ...newDish,
        restaurantId: restaurant.id,
        image: newDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
      });
    }

    await loadData();
    setIsModalOpen(false);
    setNewDish({ name: '', description: '', price: 0, categoryId: 0, isAvailable: true, preparationTime: 20, image: '' });
    setImagePreview(null);
  };

  const generateAIDescription = async () => {
    if (!newDish.name) return;
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `اكتب وصفاً تسويقياً شهياً ومختصراً باللغة العربية لطبق مطعم يسمى: "${newDish.name}".`,
      });
      setNewDish(prev => ({ ...prev, description: response.text || '' }));
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">إدارة قائمة الطعام</h1>
          <p className="text-gray-500 font-medium mt-1">لديك {dishes.length} أصناف منشورة حالياً</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button 
             onClick={() => { setIsEditMode(false); setNewDish({}); setImagePreview(null); setIsModalOpen(true); }}
             className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
           >
              <Plus size={20} /> إضافة طبق جديد
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                <th className="px-10 py-6">الطبق</th>
                <th className="px-10 py-6">القسم</th>
                <th className="px-10 py-6 text-center">السعر</th>
                <th className="px-10 py-6 text-center">الحالة</th>
                <th className="px-10 py-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && dishes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                  </td>
                </tr>
              ) : dishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <img src={dish.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-800 text-sm mb-1">{dish.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold max-w-xs truncate">{dish.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-black text-xs text-gray-500">
                    <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
                      {categories.find(c => c.id === dish.categoryId)?.name || 'غير مصنف'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center font-black text-blue-600">{dish.price} {restaurant?.currency}</td>
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black ${dish.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {dish.isAvailable ? 'متاح' : 'مباع'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(dish)} className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(dish.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6">
          <div className="bg-white rounded-[48px] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
             <div className="p-10 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-600 text-white rounded-[24px] shadow-xl shadow-blue-100">
                    <ChefHat size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">{isEditMode ? 'تعديل الصنف' : 'صنف جديد'}</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition-all"><X size={24}/></button>
             </div>

             <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="md:col-span-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block mb-4">صورة الطبق (يفضل 1:1)</label>
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-4 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all overflow-hidden relative group"
                   >
                     {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" />
                     ) : (
                        <>
                          <Upload size={48} className="text-gray-200 mb-4" />
                          <span className="text-sm font-bold text-gray-400">انقر هنا لرفع صورة شهية</span>
                        </>
                     )}
                     <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block mb-2">اسم الطبق بالعربية</label>
                      <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-300" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} placeholder="مثال: مندي لحم بلدي" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block mb-2">القسم</label>
                      <select 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        value={newDish.categoryId}
                        onChange={e => setNewDish({...newDish, categoryId: Number(e.target.value)})}
                      >
                         <option value={0}>اختر القسم</option>
                         {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block mb-2">السعر ({restaurant?.currency})</label>
                      <input type="number" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-300" value={newDish.price} onChange={e => setNewDish({...newDish, price: Number(e.target.value)})} placeholder="0.00" />
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block">وصف الطبق</label>
                        <button 
                          onClick={generateAIDescription}
                          disabled={aiLoading || !newDish.name}
                          className="text-[10px] font-black text-purple-600 flex items-center gap-1 hover:text-purple-700 disabled:opacity-50"
                        >
                          {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          توليد بالذكاء الاصطناعي
                        </button>
                      </div>
                      <textarea rows={3} className="w-full bg-gray-50 border-none rounded-3xl px-6 py-4 font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-300" value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})} placeholder="أخبر عملائك عن سر لذة هذا الطبق..." />
                   </div>
                </div>
             </div>

             <div className="p-10 bg-gray-50 flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600">إلغاء</button>
                <button onClick={handleSave} className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">حفظ الطبق ونشره</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishesView;
