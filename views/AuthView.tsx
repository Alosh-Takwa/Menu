
import React, { useState } from 'react';
import { db } from '../services/db';
import { PLANS } from '../constants';
import { Store, Mail, Lock, ArrowRight, CheckCircle2, UserPlus, LogIn, Globe, ShieldCheck } from 'lucide-react';

interface AuthViewProps {
  type: 'login' | 'register';
  onSuccess: () => void;
  onSwitch: (type: 'login' | 'register') => void;
  onBackToLanding: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ type, onSuccess, onSwitch, onBackToLanding }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    slug: '',
    planId: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (type === 'register') {
        db.registerRestaurant({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          email: formData.email,
          phone: '05xxxxxxxx',
          address: 'العنوان الافتراضي',
          logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
          currency: 'ر.س',
          planId: formData.planId
        });
      } else {
        db.login(formData.email);
      }
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[48px] shadow-2xl shadow-blue-900/10 overflow-hidden relative z-10 border border-white">
        
        {/* Left Side: Illustration & Info */}
        <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-16 text-white relative">
          <div className="relative z-10">
            <button onClick={onBackToLanding} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 font-bold text-sm">
              <ArrowRight size={20} /> العودة للرئيسية
            </button>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
              <span className="text-xl font-black tracking-tighter">SOP SYSTEM</span>
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight">ابدأ رحلة التحول الرقمي لمطعمك اليوم.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">انضم لأكثر من 500 مطعم يستخدمون SOP لزيادة مبيعاتهم وتنظيم عملياتهم بذكاء.</p>
            
            <div className="space-y-6">
              {[
                { title: 'منيو QR تفاعلي', icon: <Globe size={20}/> },
                { title: 'نظام طلبات POS مدمج', icon: <LogIn size={20}/> },
                { title: 'أمان وتشفير كامل', icon: <ShieldCheck size={20}/> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="text-blue-500">{item.icon}</div>
                  <span className="font-black text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-slate-500 text-xs font-bold relative z-10">جميع الحقوق محفوظة © 2024 SOP POS System</div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 lg:p-20 bg-white">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-800 mb-2">{type === 'login' ? 'مرحباً بك مجدداً' : 'تسجيل مطعم جديد'}</h1>
              <p className="text-slate-400 font-bold">{type === 'login' ? 'سجل دخولك لإدارة عملياتك' : 'أنشئ حسابك وابدأ في استقبال الطلبات'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {type === 'register' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">اسم المطعم</label>
                  <div className="relative">
                    <Store className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="text" 
                      required
                      placeholder="مطعم مذاق الشرق"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="email" 
                    required
                    placeholder="name@restaurant.com"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {type === 'register' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">اختر الباقة</label>
                  <div className="grid grid-cols-3 gap-3">
                    {PLANS.map(plan => (
                      <button 
                        key={plan.id}
                        type="button"
                        onClick={() => setFormData({...formData, planId: plan.id})}
                        className={`py-3 rounded-xl text-[10px] font-black border-2 transition-all ${formData.planId === plan.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}
                      >
                        {plan.nameAr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'جاري التحميل...' : type === 'login' ? 'تسجيل الدخول' : 'بدء الحساب المجاني'}
                  {!loading && (type === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />)}
                </button>
              </div>

              <div className="text-center pt-6">
                <button 
                  type="button"
                  onClick={() => onSwitch(type === 'login' ? 'register' : 'login')}
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  {type === 'login' ? 'ليس لديك حساب؟ اشترك الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
