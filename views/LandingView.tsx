
import React from 'react';
import { PLANS } from '../constants';
import { Check, Store, Shield, Rocket, Smartphone, PieChart, Star, Users, Zap, ArrowLeft } from 'lucide-react';

interface LandingViewProps {
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onLogin }) => {
  return (
    <div className="bg-white selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
      {/* Dynamic Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-2xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200">S</div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">SOP SYSTEM</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">المميزات</a>
            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">الأسعار</a>
            <a href="#testimonials" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">شركاؤنا</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="hidden sm:block text-slate-600 font-black text-sm px-6 py-2 hover:bg-slate-50 rounded-xl transition-all">تسجيل الدخول</button>
            <button onClick={onLogin} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:scale-105 transition-all">ابدأ الآن</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center z-10 relative">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-xs font-black mb-8 animate-bounce">
            <Zap size={14} /> أكثر من 500 مطعم يثق بنا
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-10 tracking-tight">
            حول مطعمك إلى <br />
            <span className="bg-gradient-to-l from-blue-600 to-indigo-500 bg-clip-text text-transparent">منظومة ذكية</span> متكاملة
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            النظام السعودي الأول لإدارة المطاعم الذي يجمع بين سهولة المنيو الإلكتروني وقوة نظام POS المتقدم مع تحليلات الذكاء الاصطناعي.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button onClick={onLogin} className="group bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-3">
              ابدأ تجربتك المجانية
              <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
            </button>
            <button className="bg-white text-slate-900 border-2 border-slate-100 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
              شاهد المنيو التجريبي
              <Smartphone size={24} />
            </button>
          </div>
        </div>
        
        {/* Animated Dashboard Preview */}
        <div className="mt-24 max-w-7xl mx-auto bg-white rounded-[3rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-4 border-slate-50 relative animate-float">
          <img 
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-auto rounded-[2.5rem] object-cover aspect-[21/9]" 
            alt="SOP Dashboard" 
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { val: '+1M', label: 'طلب معالج' },
            { val: '99.9%', label: 'استقرار النظام' },
            { val: '+500', label: 'مطعم شريك' },
            { val: '24/7', label: 'دعم فني' }
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl md:text-6xl font-black text-blue-500 mb-2">{s.val}</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-xl text-slate-500 font-medium">صممنا النظام ليكون سهلاً للموظفين وقوياً للمديرين.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'منيو QR ذكي', desc: 'تحديث فوري للأسعار، صور عالية الجودة، وتصنيفات سهلة التصفح.', icon: <Smartphone />, color: 'blue' },
              { title: 'إدارة الطلبات POS', desc: 'نظام متكامل لتتبع الطلبات من المطبخ وحتى تسليمها للعميل.', icon: <Rocket />, color: 'indigo' },
              { title: 'نظام الحجوزات', desc: 'أتح لعملائك حجز طاولاتهم مسبقاً مع نظام تنبيهات آلي.', icon: <Users />, color: 'purple' },
              { title: 'تحليلات ذكية', desc: 'تقارير يومية عن الأطباق الأكثر مبيعاً وسلوك العملاء.', icon: <PieChart />, color: 'amber' },
              { title: 'أمان عالي للبيانات', desc: 'تشفير كامل لبياناتك ونسخ احتياطي يومي لضمان الاستمرارية.', icon: <Shield />, color: 'green' },
              { title: 'هوية مخصصة', desc: 'اجعل المنيو يعبر عن علامتك التجارية بألوانك وشعارك الخاص.', icon: <Star />, color: 'rose' }
            ].map((feat, i) => (
              <div key={i} className="group bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 bg-${feat.color}-50 text-${feat.color}-600 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 36 })}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">{feat.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">باقات مرنة لكل الأحجام</h2>
            <p className="text-xl text-slate-500 font-medium">ابدأ صغيراً واكبر معنا بلا حدود.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            {PLANS.map(plan => (
              <div key={plan.id} className={`p-12 rounded-[4rem] border-4 transition-all duration-500 relative flex flex-col ${plan.id === 2 ? 'border-blue-600 bg-blue-600 text-white shadow-[0_50px_80px_-20px_rgba(37,99,235,0.4)] scale-110 z-10 py-16' : 'border-slate-100 bg-white text-slate-900 hover:border-blue-200 shadow-sm hover:shadow-xl'}`}>
                {plan.id === 2 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest">الأكثر طلباً</div>
                )}
                <div className="mb-10">
                  <h3 className="text-3xl font-black mb-4">{plan.nameAr}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className={`text-sm font-bold uppercase ${plan.id === 2 ? 'text-blue-100' : 'text-slate-400'}`}>ر.س / شهرياً</span>
                  </div>
                </div>
                <div className={`h-[2px] w-full mb-10 ${plan.id === 2 ? 'bg-white/20' : 'bg-slate-50'}`}></div>
                <ul className="space-y-6 mb-12 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-bold">
                      <div className={`p-1 rounded-full ${plan.id === 2 ? 'bg-white/20' : 'bg-blue-50'}`}>
                        <Check size={16} className={plan.id === 2 ? 'text-white' : 'text-blue-600'} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={onLogin} 
                  className={`w-full py-5 rounded-3xl font-black text-lg transition-all active:scale-95 ${
                    plan.id === 2 
                    ? 'bg-white text-blue-600 shadow-xl shadow-blue-800/20 hover:bg-slate-50' 
                    : 'bg-slate-900 text-white hover:bg-blue-600'
                  }`}
                >
                  اشترك الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
              <span className="text-xl font-black text-slate-800 tracking-tighter">SOP SYSTEM</span>
            </div>
            <p className="text-slate-400 text-sm font-bold">الحل الأمثل لإدارة المطاعم في المملكة. جميع الحقوق محفوظة © 2024</p>
          </div>
          <div className="flex gap-10 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-blue-600">سياسة الخصوصية</a>
            <a href="#" className="hover:text-blue-600">الشروط والأحكام</a>
            <a href="#" className="hover:text-blue-600">تواصل معنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
