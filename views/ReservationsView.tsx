
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Reservation } from '../types';
import { Calendar, Users, Phone, Check, X, Clock, CalendarDays } from 'lucide-react';
import SubscriptionGuard from '../components/SubscriptionGuard';

const ReservationsView: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setReservations(db.getReservations());
  }, []);

  return (
    <SubscriptionGuard feature="reservations">
      <div className="p-8 font-sans">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">إدارة الحجوزات</h1>
            <p className="text-gray-500 font-medium">نظم مواعيد ضيوفك وقم بإدارة طاولاتك</p>
          </div>
          <button className="bg-white text-blue-600 border border-blue-100 px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-50 transition-all shadow-sm">
            <CalendarDays size={22} />
            التقويم الكامل
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reservations.length === 0 ? (
             <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold italic">لا توجد حجوزات مسجلة.</p>
             </div>
          ) : (
            reservations.map(res => (
              <div key={res.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-wrap md:flex-nowrap items-center gap-10 hover:shadow-lg transition-all border-r-8 border-r-blue-600">
                <div className="flex-1 min-w-[200px]">
                  <div className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-widest">معلومات العميل</div>
                  <h3 className="text-xl font-black text-gray-800">{res.customerName}</h3>
                  <div className="flex gap-6 mt-3 text-sm font-bold text-gray-500">
                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl"><Users size={16} className="text-blue-500" /> {res.guests} ضيوف</span>
                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl"><Clock size={16} className="text-blue-500" /> {res.date} • {res.time}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-3 text-gray-600 font-black text-sm"><Phone size={18} className="text-gray-300" /> {res.customerPhone}</span>
                </div>

                <div className="flex-shrink-0">
                  {res.status === 'pending' ? (
                    <div className="flex gap-3">
                      <button className="bg-green-600 text-white p-4 rounded-2xl hover:bg-green-700 shadow-xl shadow-green-100 transition-all active:scale-90"><Check size={22} /></button>
                      <button className="bg-red-50 text-red-600 p-4 rounded-2xl hover:bg-red-100 transition-all active:scale-90"><X size={22} /></button>
                    </div>
                  ) : (
                    <div className="bg-green-50 text-green-600 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-green-100">مؤكد</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SubscriptionGuard>
  );
};

export default ReservationsView;
