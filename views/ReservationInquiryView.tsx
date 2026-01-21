
import React, { useState } from 'react';
import { Search, Phone, ArrowRight, Calendar, Users, Clock, Info, XCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { db } from '../services/db';
import { Reservation, Restaurant } from '../types';

interface ReservationInquiryViewProps {
  restaurant: Restaurant;
  onBack: () => void;
}

const ReservationInquiryView: React.FC<ReservationInquiryViewProps> = ({ restaurant, onBack }) => {
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState<Reservation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    const found = db.getReservationsByPhone(phone, restaurant.id);
    setResults(found);
    setHasSearched(true);
  };

  const getStatusDetails = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return { label: 'مؤكد', color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle size={16}/> };
      case 'cancelled': return { label: 'ملغي', color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={16}/> };
      default: return { label: 'قيد الانتظار', color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={16}/> };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ fontFamily: restaurant.fontFamily }}>
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-slate-100 sticky top-0 z-50 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-slate-800">الاستعلام عن حجز</h1>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* Search Box */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
              <Search size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-800">تابع حالة حجزك</h2>
            <p className="text-slate-400 text-sm font-bold mt-1">أدخل رقم الهاتف المستخدم أثناء الحجز</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="tel" 
                required
                placeholder="05xxxxxxxx"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
              style={{ backgroundColor: restaurant.themeColor }}
            >
              ابحث عن حجز
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {hasSearched && results.length === 0 && (
            <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-slate-200">
               <HelpCircle size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold">عذراً، لم نجد أي حجوزات مرتبطة بهذا الرقم.</p>
            </div>
          )}

          {results.map(res => {
            const status = getStatusDetails(res.status);
            return (
              <div key={res.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 border-r-8" style={{ borderRightColor: status.color === 'text-green-600' ? '#10b981' : status.color === 'text-red-600' ? '#ef4444' : '#f59e0b' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-widest ${status.bg} ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </div>
                  <span className="text-[10px] text-slate-300 font-black">#{res.id.toString().slice(-4)}</span>
                </div>
                
                <h3 className="font-black text-slate-800 mb-4">{res.customerName}</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600">{res.date}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600">{res.time}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-2 col-span-2">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600">{res.guests} ضيوف</span>
                  </div>
                </div>

                {res.status === 'pending' && (
                  <div className="mt-4 p-3 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-xl flex items-center gap-2">
                    <Info size={14} /> الحجز قيد المراجعة، سنرسل لك رسالة تأكيد قريباً.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReservationInquiryView;
