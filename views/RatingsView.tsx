
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">تقييمات العملاء</h1>
          <p className="text-gray-500">تابع آراء عملائك وقم بالرد عليها لتحسين الخدمة</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" size={20} />
            <span className="font-bold text-lg">4.8</span>
            <span className="text-gray-400 text-xs">({ratings.length} تقييم)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-100 text-gray-400 font-bold">
            لا توجد تقييمات منشورة حالياً.
          </div>
        ) : (
          ratings.map(rev => (
            <div key={rev.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                {rev.customerName[0]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{rev.customerName}</h3>
                    <p className="text-xs text-gray-400">{rev.createdAt.split('T')[0]} • التقييم العام</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{rev.comment}"</p>
                
                <div className="flex gap-2">
                  {!rev.isApproved ? (
                    <>
                      <button className="text-xs font-bold px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-1">
                        <CheckCircle size={14} /> موافقة
                      </button>
                      <button className="text-xs font-bold px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-1">
                        <XCircle size={14} /> رفض
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wider">منشور</span>
                  )}
                  <button className="text-xs font-bold px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-auto flex items-center gap-1">
                    <MessageSquare size={14} /> رد على التقييم
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
