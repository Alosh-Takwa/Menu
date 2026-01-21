
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { db } from '../services/db';
import { Rating } from '../types';

const RatingsView: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    const restaurant = db.getCurrentRestaurant();
    if (restaurant) {
      setRatings(db.getRatings(restaurant.id));
    }
  }, []);

  const handleStatusUpdate = (id: number, approved: boolean) => {
    db.updateRatingStatus(id, approved);
    const res = db.getCurrentRestaurant();
    if (res) setRatings(db.getRatings(res.id));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      db.deleteRating(id);
      const res = db.getCurrentRestaurant();
      if (res) setRatings(db.getRatings(res.id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">تقييمات العملاء</h1>
          <p className="text-gray-500">تابع آراء عملائك وقم بالرد عليها لتحسين الخدمة</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
            <Star className="text-amber-400 fill-amber-400" size={20} />
            <span className="font-bold text-lg">4.8</span>
            <span className="text-gray-400 text-xs">({ratings.length} تقييم)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-100 text-gray-400 font-bold">
            لا توجد تقييمات منشورة حالياً.
          </div>
        ) : (
          ratings.map(rev => (
            <div key={rev.id} className={`bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex gap-6 items-start transition-all hover:shadow-md ${!rev.isApproved ? 'border-r-8 border-r-amber-400' : 'border-r-8 border-r-green-500'}`}>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner">
                {rev.customerName[0]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-black text-gray-800">{rev.customerName}</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{rev.createdAt.split('T')[0]} • التقييم العام</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic bg-gray-50 p-4 rounded-2xl border border-gray-100">"{rev.comment}"</p>
                
                <div className="flex gap-3">
                  {!rev.isApproved ? (
                    <button onClick={() => handleStatusUpdate(rev.id, true)} className="text-xs font-black px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95">
                      <CheckCircle size={16} /> موافقة ونشر
                    </button>
                  ) : (
                    <button onClick={() => handleStatusUpdate(rev.id, false)} className="text-xs font-black px-5 py-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 flex items-center gap-2 transition-all active:scale-95">
                      <XCircle size={16} /> إخفاء عن المنيو
                    </button>
                  )}
                  <button onClick={() => handleDelete(rev.id)} className="text-xs font-black px-5 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 flex items-center gap-2 transition-all active:scale-95">
                    <Trash2 size={16} /> حذف
                  </button>
                  <button className="text-xs font-black px-5 py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl mr-auto flex items-center gap-2 border border-blue-50">
                    <MessageSquare size={16} /> الرد على العميل
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

export default RatingsView;
