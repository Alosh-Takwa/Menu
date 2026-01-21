
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Restaurant } from '../types';
import { Search, Star, ExternalLink, MapPin, Phone, Utensils } from 'lucide-react';

const PublicCustomersView: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setRestaurants(db.getAllRestaurants().filter(r => r.status === 'active'));
  }, []);

  const filtered = restaurants.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-20 px-6">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">عائلة SOP المتنامية</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">نفتخر بخدمة نخبة من أفضل المطاعم في المملكة والمنطقة.</p>
      </div>

      <div className="max-w-xl mx-auto mb-16 px-8">
        <div className="relative">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="ابحث عن مطعمك المفضل..."
            className="w-full bg-white border border-slate-200 rounded-3xl py-5 pr-14 pl-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-8 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Utensils size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold">لم نجد أي مطعم بهذا الاسم حالياً.</p>
          </div>
        ) : (
          filtered.map((res) => (
            <div key={res.id} className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500">
               <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                  <img src={res.logo} className="w-24 h-24 rounded-3xl border-4 border-white absolute -bottom-6 right-8 object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" alt={res.name} />
               </div>
               <div className="p-8 pt-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 mb-1">{res.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} className="fill-current" />
                        <span className="text-xs font-black">4.9 تقييم</span>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">نشط</span>
                  </div>
                  
                  <div className="space-y-2 mb-8">
                     <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <MapPin size={14} /> {res.address}
                     </div>
                     <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <Phone size={14} /> {res.phone}
                     </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-xs font-black shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                       <ExternalLink size={14} /> زيارة المنيو
                    </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicCustomersView;
