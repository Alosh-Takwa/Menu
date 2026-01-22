
import React from 'react';
import { Smartphone, Zap, PieChart, Users, ShieldCheck, Globe, Clock, ChefHat, Heart, LayoutGrid } from 'lucide-react';

const PublicFeaturesView: React.FC = () => {
  const features = [
    {
      title: 'منيو QR ذكي وتفاعلي',
      desc: 'تجربة تصفح فريدة لعملائك مع إمكانية تحديث الأسعار والأطباق لحظياً بضغطة زر.',
      icon: <Smartphone size={32} />,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
      hoverBg: 'group-hover:bg-blue-600'
    },
    {
      title: 'نظام POS متطور',
      desc: 'إدارة متكاملة للطلبات من لحظة الطلب في المنيو وحتى وصولها للمطبخ وتسليمها.',
      icon: <Zap size={32} />,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      hoverBg: 'group-hover:bg-amber-600'
    },
    {
      title: 'تحليلات المبيعات الذكية',
      desc: 'تقارير مفصلة عن الأطباق الأكثر مبيعاً، ساعات الذروة، وإيرادات المطعم اليومية.',
      icon: <PieChart size={32} />,
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50',
      hoverBg: 'group-hover:bg-indigo-600'
    },
    {
      title: 'إدارة الحجوزات',
      desc: 'نظام حجز طاولات آلي يقلل من وقت الانتظار وينظم تدفق الزوار لمطعمك.',
      icon: <Users size={32} />,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-50',
      hoverBg: 'group-hover:bg-green-600'
    },
    {
      title: 'تخصيص الهوية البصرية',
      desc: 'تحكم كامل في ألوان وخطوط المنيو ليتماشى تماماً مع علامة مطعمك التجارية.',
      icon: <LayoutGrid size={32} />,
      colorClass: 'text-purple-600',
      bgClass: 'bg-purple-50',
      hoverBg: 'group-hover:bg-purple-600'
    },
    {
      title: 'دعم فني وتشفير كامل',
      desc: 'بيانات مطعمك وعملائك في أمان تام مع دعم فني متواصل على مدار الساعة.',
      icon: <ShieldCheck size={32} />,
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-50',
      hoverBg: 'group-hover:bg-rose-600'
    }
  ];

  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-20 px-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
           <Zap size={14} /> مميزات النظام الاحترافي
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">مميزات تجعل مطعمك <br/> في الصدارة دائماً</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">نحن لا نقدم مجرد منيو، بل نظاماً متكاملاً يدير كل تفاصيل عملك بذكاء وسرعة فائقة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500 group cursor-default">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-500 ${f.bgClass} ${f.colorClass} ${f.hoverBg} group-hover:text-white shadow-inner`}>
              {f.icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-800 transition-colors group-hover:text-blue-600">{f.title}</h3>
            <p className="text-slate-500 font-bold leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-32 bg-slate-900 rounded-[4rem] mx-8 p-16 text-white text-center relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <h3 className="text-4xl font-black mb-6 tracking-tighter">هل أنت جاهز للتحول الرقمي؟</h3>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto font-bold text-lg">انضم إلى مئات المطاعم التي طورت أعمالها وزادت مبيعاتها باستخدام نظام SOP الذكي.</p>
            <button className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">ابدأ تجربة المنيو المجانية</button>
         </div>
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default PublicFeaturesView;
