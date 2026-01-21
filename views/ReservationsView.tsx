
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Reservation, Restaurant } from '../types';
import { Calendar, Users, Phone, Check, X, Clock, CalendarDays, Settings2, ShieldCheck, ToggleLeft, ToggleRight, CalendarRange } from 'lucide-react';
import SubscriptionGuard from '../components/SubscriptionGuard';

const ReservationsView: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list');

  useEffect(() => {
    const res = db.getCurrentRestaurant();
    if (res) {
      setRestaurant(res);
      setReservations(db.getReservations(res.id));
    }
  }, []);

  const handleSaveSettings = () => {
    if (restaurant) {
      db.updateRestaurant(restaurant.id, restaurant);
      alert('تم حفظ إعدادات الحجز بنجاح!');
      setActiveTab('list');
    }
  };

  return (
    <SubscriptionGuard feature="reservations">
      <div className="p-8 font-sans">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">نظام الحجوزات</h1>
            <p className="text-gray-500 font-medium">نظم مواعيد ضيوفك وقم بإدارة طاولاتك</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab(activeTab === 'list' ? 'settings' : 'list')}
              className={`px-8 py-3 rounded-2xl font-black flex items-center gap-3 transition-all shadow-sm ${
                activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {activeTab === 'settings' ? <CalendarDays size={22} /> : <Settings2 size={22} />}
              {activeTab === 'settings' ? 'عرض القائمة' : 'إعدادات الحجز'}
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 gap-6">
            {reservations.length === 0 ? (
               <div className="py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                  <Calendar size={64} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-black italic">لا توجد حجوزات مسجلة حالياً.</p>
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
        ) : (
          <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm max-w-4xl mx-auto">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl"><Settings2 size={24} /></div>
                <h2 className="text-2xl font-black text-gray-800">تخصيص نظام الحجز</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div>
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">وقت بدء استقبال الحجوزات</label>
                      <input 
                        type="time" 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={restaurant?.reservationSettings?.startTime}
                        onChange={e => setRestaurant({...restaurant!, reservationSettings: {...restaurant!.reservationSettings!, startTime: e.target.value}})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">وقت نهاية استقبال الحجوزات</label>
                      <input 
                        type="time" 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={restaurant?.reservationSettings?.endTime}
                        onChange={e => setRestaurant({...restaurant!, reservationSettings: {...restaurant!.reservationSettings!, endTime: e.target.value}})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <CalendarRange size={14} /> عدد الأيام المسموح بالحجز قبلها
                      </label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={restaurant?.reservationSettings?.advanceBookingDays}
                        onChange={e => setRestaurant({...restaurant!, reservationSettings: {...restaurant!.reservationSettings!, advanceBookingDays: Number(e.target.value)}})}
                        placeholder="7 أيام مثلاً"
                      />
                      <p className="text-[10px] text-gray-400 mt-2 font-bold italic">* يحدد هذا الخيار مدى إمكانية العميل للحجز المستقبلي.</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">مدة الجلسة (بالدقائق)</label>
                      <select 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        value={restaurant?.reservationSettings?.slotDuration}
                        onChange={e => setRestaurant({...restaurant!, reservationSettings: {...restaurant!.reservationSettings!, slotDuration: Number(e.target.value)}})}
                      >
                         <option value={30}>30 دقيقة</option>
                         <option value={60}>ساعة كاملة</option>
                         <option value={90}>ساعة ونصف</option>
                         <option value={120}>ساعتين</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">أقصى عدد ضيوف لكل طاولة</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={restaurant?.reservationSettings?.maxGuests}
                        onChange={e => setRestaurant({...restaurant!, reservationSettings: {...restaurant!.reservationSettings!, maxGuests: Number(e.target.value)}})}
                      />
                   </div>
                </div>

                <div className="md:col-span-2 p-6 bg-blue-50 rounded-[32px] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <ShieldCheck className="text-blue-600" size={24} />
                      <div>
                         <p className="font-black text-gray-800 text-sm">تفعيل نظام الحجز الإلكتروني</p>
                         <p className="text-[10px] text-blue-600 font-bold uppercase">إتاحة الحجز للعملاء عبر المنيو</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setRestaurant({...restaurant!, reservationSettings: {...restaurant!.reservationSettings!, isEnabled: !restaurant?.reservationSettings?.isEnabled}})}
                    className="text-blue-600"
                   >
                      {restaurant?.reservationSettings?.isEnabled ? <ToggleRight size={48} /> : <ToggleLeft size={48} className="text-gray-300" />}
                   </button>
                </div>
             </div>

             <div className="mt-12 pt-10 border-t border-gray-100 flex gap-4">
                <button onClick={handleSaveSettings} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">حفظ الإعدادات</button>
                <button onClick={() => setActiveTab('list')} className="px-10 py-4 bg-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-all">إلغاء</button>
             </div>
          </div>
        )}
      </div>
    </SubscriptionGuard>
  );
};

export default ReservationsView;
