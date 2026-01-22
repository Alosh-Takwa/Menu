
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Restaurant } from '../types';
import { Search, Star, ExternalLink, MapPin, Phone, Utensils } from 'lucide-react';

interface PublicCustomersViewProps {
  onVisitMenu: (id: number) => void;
}

const PublicCustomersView: React.FC<PublicCustomersViewProps> = ({ onVisitMenu }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fixed asynchronous data fetching in useEffect
  useEffect(() => {
    const loadRestaurants = async () => {
      const allRestaurants = await db.getAllRestaurants();
      setRestaurants(allRestaurants.filter(r => r.status === 'active'));
    };
    loadRestaurants();
  }, []);

  const filtered = restaurants.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">شركاء النجاح</h2>
          <p className="text-sm md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">استعرض نخبة المطاعم التي اختارت SOP لإدارة عملياتها.</p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <div className="relative group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن مطعمك المفضل..."
              className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-4 pr-14 pl-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <Utensils size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">لم نجد أي مطعم بهذا الاسم.</p>
            </div>
          ) : (
            filtered.map((res) => (
              <div key={res.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:translate-y-[-4px]">
                 {/* Restaurant Cover Image */}
                 <div className="h-40 md:h-56 relative overflow-hidden">
                    <img 
                      src={res.coverImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt="Cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                       <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black text-white border border-white/20 uppercase tracking-widest">
                          {res.planId === 3 ? 'بلاتيني' : 'عضو SOP'}
                       </div>
                    </div>
                 </div>

                 {/* Content Area */}
                 <div className="p-6 md:p-8 relative">
                    {/* Logo Overlay */}
                    <div className="absolute -top-12 right-6 md:right-8">
                      <img 
                        src={res.logo} 
                        className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl border-4 border-white object-cover shadow-2xl bg-white" 
                        alt={res.name} 
                      />
                    </div>

                    <div className="mt-10">
                      <h3 className="text-xl md:text-3xl font-black text-slate-800 mb-1">{res.name}</h3>
                      <div className="flex items-center gap-1.5 text-amber-500 mb-6">
                        <Star size={14} className="fill-current" />
                        <span className="text-xs font-black">4.9 التقييم</span>
                      </div>
                      
                      <div className="space-y-2 mb-8 text-slate-400 text-xs font-bold">
                         <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-600" /> {res.address}</div>
                         <div className="flex items-center gap-2"><Phone size={14} className="text-blue-600" /> {res.phone}</div>
                      </div>

                      <button 
                        onClick={() => onVisitMenu(res.id)}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black shadow-lg hover:bg-blue-600 transition-all active-scale flex items-center justify-center gap-2 group/btn"
                      >
                         <span>عرض المنيو الإلكتروني</span>
                         <ExternalLink size={14} className="group-hover/btn:translate-x-[-2px] transition-transform" />
                      </button>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicCustomersView;
