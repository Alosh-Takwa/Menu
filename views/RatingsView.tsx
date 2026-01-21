
import React from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle, XCircle } from 'lucide-react';

const RatingsView: React.FC = () => {
  const reviews = [
    { id: 1, customer: 'محمد س.', rating: 5, comment: 'الأكل رائع جداً والخدمة سريعة، أنصح به بشدة!', dish: 'مندي دجاج', date: '2023-11-20', status: 'approved' },
    { id: 2, customer: 'سارة أ.', rating: 4, comment: 'الحمص ممتاز لكن كان يحتاج ملح أكثر قليلاً.', dish: 'حمص باللحمة', date: '2023-11-19', status: 'pending' },
    { id: 3, customer: 'خالد م.', rating: 2, comment: 'تأخر الطلب جداً ووصل بارداً للأسف.', dish: 'كنافة', date: '2023-11-18', status: 'pending' },
  ];

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
            <span className="text-gray-400 text-xs">(120 تقييم)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
              {rev.customer[0]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-800">{rev.customer}</h3>
                  <p className="text-xs text-gray-400">{rev.date} • طبق: <span className="text-blue-600">{rev.dish}</span></p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{rev.comment}"</p>
              
              <div className="flex gap-2">
                {rev.status === 'pending' ? (
                  <>
                    <button className="text-xs font-bold px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-1">
                      <CheckCircle size={14} /> موافقة
                    </button>
                    <button className="text-xs font-bold px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-1">
                      <XCircle size={14} /> رفض
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase">منشور</span>
                )}
                <button className="text-xs font-bold px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-auto flex items-center gap-1">
                  <MessageSquare size={14} /> رد على التقييم
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsView;
