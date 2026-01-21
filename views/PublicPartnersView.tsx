
import React from 'react';
import { ShieldCheck, Cpu, CreditCard, Truck, Globe, Award } from 'lucide-react';

const PublicPartnersView: React.FC = () => {
  const partners = [
    { name: 'Visa & MasterCard', type: 'بوابات دفع', icon: <CreditCard size={24}/> },
    { name: 'Google Cloud', type: 'استضافة سحابية', icon: <Globe size={24}/> },
    { name: 'Stripe', type: 'حلول مالية', icon: <ShieldCheck size={24}/> },
    { name: 'IBM Watson', type: 'ذكاء اصطناعي', icon: <Cpu size={24}/> },
    { name: 'LogiLink', type: 'سلاسل إمداد', icon: <Truck size={24}/> },
    { name: 'SOP Logistics', type: 'توصيل محلي', icon: <Award size={24}/> }
  ];

  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-20 px-6">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">شركاء النجاح</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">نتعاون مع أفضل الشركات العالمية لضمان تقديم خدمة موثوقة ومتقدمة لعملائنا.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-8 max-w-7xl mx-auto">
        {partners.map((p, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center flex flex-col items-center group hover:border-blue-200 transition-all">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all mb-6">
              {p.icon}
            </div>
            <h4 className="font-black text-slate-800 mb-1">{p.name}</h4>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.type}</span>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-32 px-8">
         <div className="bg-blue-50 p-12 rounded-[3.5rem] border border-blue-100 text-center">
            <h3 className="text-2xl font-black text-blue-900 mb-4">هل ترغب في أن تصبح شريكاً؟</h3>
            <p className="text-blue-700 font-bold mb-8">نحن نبحث دائماً عن شركاء تقنيين وموردين لتعزيز منظومتنا.</p>
            <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all">تواصل مع قسم الشراكات</button>
         </div>
      </div>
    </div>
  );
};

export default PublicPartnersView;
