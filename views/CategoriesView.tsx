
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, X, Check } from 'lucide-react';
import { db } from '../services/db';
import { Category } from '../types';

const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [newCat, setNewCat] = useState({ name: '', nameEn: '' });

  useEffect(() => {
    const restaurant = db.getCurrentRestaurant();
    if (restaurant) {
      setCategories(db.getCategories(restaurant.id));
    }
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

  const handleSave = () => {
    const restaurant = db.getCurrentRestaurant();
    if (!newCat.name || !restaurant) return;
    
    if (isEditMode && currentId) {
      db.updateCategory(currentId, { name: newCat.name, nameEn: newCat.nameEn });
    } else {
      db.addCategory({
        restaurantId: restaurant.id,
        name: newCat.name,
        nameEn: newCat.nameEn || newCat.name,
        sortOrder: categories.length + 1
      });
    }

    setCategories(db.getCategories(restaurant.id));
    setIsModalOpen(false);
    setNewCat({ name: '', nameEn: '' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأطباق المرتبطة به أيضاً.')) {
      db.deleteCategory(id);
      const restaurant = db.getCurrentRestaurant();
      if (restaurant) setCategories(db.getCategories(restaurant.id));
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
            <input type="text" placeholder="ابحث عن قسم..." className="w-full bg-white border-none rounded-2xl py-3 pr-12 pl-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
              <th className="px-8 py-4">القسم (عربي)</th>
              <th className="px-8 py-4">القسم (إنجليزي)</th>
              <th className="px-8 py-4 text-center">الترتيب</th>
              <th className="px-8 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6 font-black text-gray-800 text-sm">{cat.name}</td>
                <td className="px-8 py-6 text-sm font-bold text-gray-400">{cat.nameEn}</td>
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
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-100"><Layers size={28}/></div>
                 <h2 className="text-2xl font-black text-gray-800">{isEditMode ? 'تعديل القسم' : 'إضافة قسم جديد'}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-3 rounded-full text-gray-400 hover:text-gray-600 shadow-sm"><X size={24}/></button>
            </div>
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">اسم القسم بالعربي</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={newCat.name} onChange={(e) => setNewCat({...newCat, name: e.target.value})} placeholder="مثال: المقبلات" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">اسم القسم بالإنجليزي</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={newCat.nameEn} onChange={(e) => setNewCat({...newCat, nameEn: e.target.value})} placeholder="مثال: Appetizers" />
              </div>
            </div>
            <div className="p-10 bg-gray-50 flex gap-6">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 rounded-2xl transition-all">إلغاء</button>
              <button onClick={handleSave} className="flex-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                {isEditMode ? 'تحديث القسم' : 'حفظ القسم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;
