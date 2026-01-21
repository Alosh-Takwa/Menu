
import React from 'react';
import { PLANS } from '../constants';
import { Check, Store, Shield, Rocket, Smartphone, PieChart } from 'lucide-react';

interface LandingViewProps {
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onLogin }) => {
  return (
    <div className="bg-white text-gray-900" dir="rtl">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
            <span className="text-xl font-black text-gray-800 tracking-tighter">SOP SYSTEM</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="text-gray-600 font-bold hover:text-blue-600 transition-colors">دخول</button>
            <button onClick={onLogin} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">ابدأ الآن</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
            أدِر مطعمك <span className="text-blue-600">بذكاء</span><br /> ومن مكان واحد
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            النظام الشامل لإدارة المطاعم: منيو إلكتروني، نظام POS، حجوزات، وإحصائيات مدعومة بالذكاء الاصطناعي.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={onLogin} className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-2xl shadow-blue-200 hover:scale-105 transition-all">سجل مطعمك مجاناً</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'منيو QR ذكي', desc: 'وفر لعملائك تجربة تصفح وطلب عصرية من هواتفهم مباشرة.', icon: <Smartphone /> },
            { title: 'نظام حجوزات', desc: 'نظم طاولاتك ومواعيد ضيوفك بسهولة وتجنب الازدحام.', icon: <Rocket /> },
            { title: 'تقارير مفصلة', desc: 'افهم أداء مبيعاتك وأكثر الأطباق طلباً عبر داشبورد تفاعلي.', icon: <PieChart /> },
          ].map((feat, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                {feat.icon}
              </div>
              <h3 className="text-2xl font-black mb-4">{feat.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">باقات تناسب الجميع</h2>
          <p className="text-gray-500">اختر الباقة التي تناسب حجم نشاطك التجاري</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map(plan => (
            <div key={plan.id} className={`p-10 rounded-[48px] border-2 transition-all ${plan.id === 2 ? 'border-blue-600 bg-blue-50/20 shadow-2xl scale-105 relative' : 'border-gray-100 hover:border-blue-200'}`}>
              {plan.id === 2 && <span className="absolute -top-4 right-1/2 translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-black uppercase">الأكثر طلباً</span>}
              <div className="text-center mb-10">
                <h3 className="text-2xl font-black mb-2">{plan.nameAr}</h3>
                <div className="text-4xl font-black text-gray-900">{plan.price} <span className="text-sm text-gray-400 font-bold">ر.س / شهرياً</span></div>
              </div>
              <ul className="space-y-4 mb-10">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-gray-600">
                    <Check className="text-green-500" size={18} /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onLogin} className={`w-full py-4 rounded-2xl font-black transition-all ${plan.id === 2 ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>اشترك الآن</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingView;
