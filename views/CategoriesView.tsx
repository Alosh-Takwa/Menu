
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { db } from '../services/db';
import { Category } from '../types';

const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [newCat, setNewCat] = useState({ name: '', nameEn: '' });

  useEffect(() => {
    const loadCategories = async () => {
      const restaurant = db.getCurrentRestaurant();
      if (restaurant) {
        const cats = await db.getCategories(restaurant.id);
        setCategories(cats);
      }
    };
    loadCategories();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setNewCat({ name: '', nameEn: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setIsEditMode(true);
    setCurrentId(cat.id);
    setNewCat({ name: cat.name, nameEn: cat.nameEn });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const restaurant = db.getCurrentRestaurant();
    if (!newCat.name || !restaurant) return;
    
    if (isEditMode && currentId) {
      await db.updateCategory(currentId, { name: newCat.name, nameEn: newCat.nameEn });
    } else {
      await db.addCategory({
        restaurantId: restaurant.id,
        name: newCat.name,
        nameEn: newCat.nameEn || newCat.name,
        sortOrder: categories.length + 1
      });
    }

    const updated = await db.getCategories(restaurant.id);
    setCategories(updated);
    setIsModalOpen(false);
    setNewCat({ name: '', nameEn: '' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأطباق المرتبطة به أيضاً.')) {
      await db.deleteCategory(id);
      const restaurant = db.getCurrentRestaurant();
      if (restaurant) {
        const updated = await db.getCategories(restaurant.id);
        setCategories(updated);
      }
    }
  };

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">إدارة الأقسام</h1>
          <p className="text-gray-500 font-medium">نظم أطباقك في أقسام ليسهل على عملائك الاختيار</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:scale-105 active:scale-95">
          <Plus size={22} />
          إضافة قسم جديد
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-6 bg-gray-50/50">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="ابحث عن قسم..." className="w-full bg-white border-none rounded-2xl py-3 pr-12 pl-6 text-sm font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
              <th className="px-8 py-4">اسم القسم (عربي)</th>
              <th className="px-8 py-4">اسم القسم (English)</th>
              <th className="px-8 py-4 text-center">الترتيب</th>
              <th className="px-8 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6 font-black text-gray-800 text-sm">{cat.name}</td>
                <td className="px-8 py-6 font-bold text-gray-400 text-sm">{cat.nameEn}</td>
                <td className="px-8 py-6 text-center font-black text-blue-600">{cat.sortOrder}</td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(cat)} className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all shadow-sm"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all shadow-sm"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-white rounded-[48px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black text-gray-800">{isEditMode ? 'تعديل بيانات القسم' : 'إضافة قسم جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-3 rounded-full text-gray-400 hover:text-gray-600 shadow-sm"><X size={24}/></button>
            </div>
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">اسم القسم (بالعربية)</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm placeholder:text-slate-300" value={newCat.name} onChange={(e) => setNewCat({...newCat, name: e.target.value})} placeholder="مثال: المقبلات الشامية" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Category Name (English)</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm placeholder:text-slate-300" value={newCat.nameEn} onChange={(e) => setNewCat({...newCat, nameEn: e.target.value})} placeholder="Example: Appetizers" />
              </div>
            </div>
            <div className="p-10 bg-gray-50 flex gap-6">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 rounded-2xl transition-all">إلغاء</button>
              <button onClick={handleSave} className="flex-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                {isEditMode ? 'تحديث البيانات' : 'حفظ القسم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;
