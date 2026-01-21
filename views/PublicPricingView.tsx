
import React from 'react';
import { PLANS } from '../constants';
import { Check, HelpCircle } from 'lucide-react';

const PublicPricingView: React.FC = () => {
  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-20 px-6">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">باقات تناسب نمو مطعمك</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">اختر الخطة المناسبة وابدأ في تحويل مطعمك رقمياً خلال دقائق.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8 max-w-7xl mx-auto">
        {PLANS.map(plan => (
          <div key={plan.id} className={`relative p-12 rounded-[4rem] border-4 transition-all duration-500 flex flex-col ${plan.id === 2 ? 'border-blue-600 bg-blue-600 text-white shadow-2xl scale-110 z-10' : 'border-slate-100 bg-white text-slate-900 shadow-sm'}`}>
            {plan.id === 2 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">الأكثر طلباً</div>
            )}
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-black mb-4">{plan.nameAr}</h3>
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className={`text-sm font-bold uppercase ${plan.id === 2 ? 'text-blue-100' : 'text-slate-400'}`}>ر.س / شهر</span>
              </div>
            </div>
            <ul className="space-y-6 mb-12 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold">
                  <Check size={18} className={plan.id === 2 ? 'text-white' : 'text-blue-600'} />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-5 rounded-3xl font-black text-lg transition-all ${plan.id === 2 ? 'bg-white text-blue-600 hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>ابدأ الآن</button>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-32 px-8">
        <div className="text-center mb-12">
           <h3 className="text-2xl font-black text-slate-800">الأسئلة الشائعة حول الباقات</h3>
        </div>
        <div className="space-y-4">
           {[
             { q: 'هل يمكنني تغيير الباقة لاحقاً؟', a: 'نعم، يمكنك الترقية أو العودة لباقة أقل في أي وقت من لوحة التحكم.' },
             { q: 'هل توجد عمولات على المبيعات؟', a: 'لا، نظام SOP لا يقتطع أي عمولة من مبيعاتك، أنت تدفع قيمة الاشتراك فقط.' },
             { q: 'كيف يتم تفعيل نظام الحجوزات؟', a: 'نظام الحجوزات متاح تلقائياً في باقة الشركات (Enterprise) ويمكن تفعيله من الإعدادات.' }
           ].map((faq, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4">
                <HelpCircle className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-black text-slate-800 mb-1">{faq.q}</h4>
                  <p className="text-slate-500 text-sm font-medium">{faq.a}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default PublicPricingView;
