
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Wand2, Check, X, ChefHat, Image as ImageIcon, Upload, AlertTriangle } from 'lucide-react';
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

  // Fixed asynchronous data fetching in useEffect
  useEffect(() => {
    const loadData = async () => {
      const res = db.getCurrentRestaurant();
      if (res) {
        setRestaurant(res);
        const cats = await db.getCategories(res.id);
        setCategories(cats);
        const allDishes = await db.getDishes(res.id);
        setDishes(allDishes);
        if (cats.length > 0) {
          setNewDish(prev => ({ ...prev, categoryId: cats[0].id }));
        }
      }
    };
    loadData();
  }, []);

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

  const openAddModal = () => {
    setIsEditMode(false);
    setImagePreview(null);
    setNewDish({ name: '', description: '', price: 0, categoryId: categories[0]?.id || 0, image: '', isAvailable: true });
    setIsModalOpen(true);
  };

  const openEditModal = (dish: Dish) => {
    setIsEditMode(true);
    setCurrentDishId(dish.id);
    setImagePreview(dish.image);
    setNewDish({ ...dish });
    setIsModalOpen(true);
  };

  // Fixed asynchronous deleteDish call
  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطبق؟')) {
      await db.deleteDish(id);
      if (restaurant) {
        const updatedDishes = await db.getDishes(restaurant.id);
        setDishes(updatedDishes);
      }
    }
  };

  // Fixed asynchronous update and add dish calls
  const handleSave = async () => {
    if (!newDish.name || !newDish.price || !restaurant) return;
    
    if (isEditMode && currentDishId) {
      await db.updateDish(currentDishId, newDish);
    } else {
      await db.addDish({
        restaurantId: restaurant.id,
        name: newDish.name || '',
        nameEn: newDish.name || '',
        description: newDish.description || '',
        price: Number(newDish.price),
        categoryId: newDish.categoryId || categories[0]?.id || 1,
        image: newDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
        isAvailable: newDish.isAvailable ?? true,
        preparationTime: newDish.preparationTime || 20
      });
    }

    const updatedDishes = await db.getDishes(restaurant.id);
    setDishes(updatedDishes);
    setIsModalOpen(false);
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
          <p className="text-gray-500 font-medium">تحكم في أطباقك، أسعارك ({restaurant?.currency})، وتوافر الوجبات</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:scale-105 active:scale-95">
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
            {categories.map(c => <option key={c.id}>{c.name}</option>)}
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
                <td className="px-8 py-6"><span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black">{categories.find(c => c.id === dish.categoryId)?.name}</span></td>
                <td className="px-8 py-6 text-center font-black text-blue-600">{dish.price} {restaurant?.currency}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black ${dish.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {dish.isAvailable ? 'متاح' : 'مباع'}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(dish)} className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all shadow-sm"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(dish.id)} className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all shadow-sm"><Trash2 size={16} /></button>
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
                 <h2 className="text-2xl font-black text-gray-800">{isEditMode ? 'تعديل بيانات الطبق' : 'إضافة طبق جديد'}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-3 rounded-full text-gray-400 hover:text-gray-600 shadow-sm"><X size={24}/></button>
            </div>
            <div className="p-10 grid grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
              <div className="col-span-2">
                 <label className="block text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">صورة الطبق</label>
                 <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-4 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all overflow-hidden group"
                 >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img src={imagePreview} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-sm">تغيير الصورة</div>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="text-gray-300 mb-2" />
                        <span className="text-sm font-bold text-gray-400">اضغط لرفع صورة من جهازك</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                 </div>
              </div>
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
                <textarea rows={3} className="w-full bg-gray-50 border-none rounded-3xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none" value={newDish.description} onChange={(e) => setNewDish({...newDish, description: e.target.value})} placeholder="أخبرنا عن سر لذة هذا الطبق..." />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">السعر ({restaurant?.currency})</label>
                <input type="number" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={newDish.price} onChange={(e) => setNewDish({...newDish, price: Number(e.target.value)})} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">القسم</label>
                <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer" value={newDish.categoryId} onChange={(e) => setNewDish({...newDish, categoryId: Number(e.target.value)})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                 <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-2xl">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-none bg-white text-blue-600 focus:ring-0" 
                      checked={newDish.isAvailable} 
                      onChange={e => setNewDish({...newDish, isAvailable: e.target.checked})} 
                    />
                    <span className="font-black text-sm text-gray-700">الطبق متاح حالياً للطلب</span>
                 </label>
              </div>
            </div>
            <div className="p-10 bg-gray-50 flex gap-6">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 rounded-2xl transition-all">إلغاء</button>
              <button onClick={handleSave} className="flex-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                {isEditMode ? 'تحديث البيانات' : 'حفظ الطبق'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishesView;
