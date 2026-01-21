
import React from 'react';
import { Smartphone, Zap, PieChart, Users, ShieldCheck, Globe, Clock, ChefHat, Heart, LayoutGrid } from 'lucide-react';

const PublicFeaturesView: React.FC = () => {
  const features = [
    {
      title: 'منيو QR ذكي وتفاعلي',
      desc: 'تجربة تصفح فريدة لعملائك مع إمكانية تحديث الأسعار والأطباق لحظياً بضغطة زر.',
      icon: <Smartphone size={32} />,
      color: 'blue'
    },
    {
      title: 'نظام POS متطور',
      desc: 'إدارة متكاملة للطلبات من لحظة الطلب في المنيو وحتى وصولها للمطبخ وتسليمها.',
      icon: <Zap size={32} />,
      color: 'amber'
    },
    {
      title: 'تحليلات المبيعات الذكية',
      desc: 'تقارير مفصلة عن الأطباق الأكثر مبيعاً، ساعات الذروة، وإيرادات المطعم اليومية.',
      icon: <PieChart size={32} />,
      color: 'indigo'
    },
    {
      title: 'إدارة الحجوزات',
      desc: 'نظام حجز طاولات آلي يقلل من وقت الانتظار وينظم تدفق الزوار لمطعمك.',
      icon: <Users size={32} />,
      color: 'green'
    },
    {
      title: 'تخصيص الهوية البصرية',
      desc: 'تحكم كامل في ألوان وخطوط المنيو ليتماشى تماماً مع علامة مطعمك التجارية.',
      icon: <LayoutGrid size={32} />,
      color: 'purple'
    },
    {
      title: 'دعم فني وتشفير كامل',
      desc: 'بيانات مطعمك وعملائك في أمان تام مع دعم فني متواصل على مدار الساعة.',
      icon: <ShieldCheck size={32} />,
      color: 'rose'
    }
  ];

  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-20 px-6">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">مميزات تجعل مطعمك في الصدارة</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">نحن لا نقدم مجرد منيو، بل نظاماً متكاملاً يدير كل تفاصيل عملك بذكاء.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500 group">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500`}>
              {f.icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-800">{f.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-32 bg-slate-900 rounded-[4rem] mx-8 p-16 text-white text-center relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-3xl font-black mb-6">هل أنت جاهز للبدء؟</h3>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto font-bold">انضم إلى مئات المطاعم التي طورت أعمالها باستخدام نظام SOP.</p>
            <button className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">ابدأ الآن مجاناً</button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default PublicFeaturesView;
