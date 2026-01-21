
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Restaurant } from '../types';
import { Check, ArrowLeft, Zap, Globe, Heart, Star, ExternalLink, Quote, Mail, Phone, Menu, X } from 'lucide-react';

import PublicFeaturesView from './PublicFeaturesView';
import PublicPartnersView from './PublicPartnersView';
import PublicCustomersView from './PublicCustomersView';
import PublicPricingView from './PublicPricingView';

interface LandingViewProps {
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onLogin }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'features' | 'partners' | 'customers' | 'pricing'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const platformSettings = db.getPlatformSettings();

  useEffect(() => {
    setRestaurants(db.getAllRestaurants().filter(r => r.status === 'active'));
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'features': return <PublicFeaturesView />;
      case 'partners': return <PublicPartnersView />;
      case 'customers': return <PublicCustomersView />;
      case 'pricing': return <PublicPricingView />;
      default: return (
        <>
          {/* Hero Section */}
          <section className="relative pt-48 pb-32 px-8 overflow-hidden">
            <div className="max-w-6xl mx-auto text-center z-10 relative">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-xs font-black mb-8 animate-bounce">
                <Zap size={14} /> أكثر من {restaurants.length + 450} مطعم يثق بنا
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-10 tracking-tight">
                حول مطعمك إلى <br />
                <span className="bg-gradient-to-l from-blue-600 to-indigo-500 bg-clip-text text-transparent">منظومة ذكية</span> متكاملة
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
                نظام متطور يجمع بين سهولة المنيو الإلكتروني وقوة نظام POS المتقدم مع تحليلات الذكاء الاصطناعي.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={onLogin} className="group bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-3">
                  ابدأ الآن مجاناً
                  <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </section>

          {/* Featured Sections (Simplified for Landing Home) */}
          <section className="py-24 bg-slate-50/50 border-y border-slate-100">
             <div className="max-w-7xl mx-auto px-8 text-center">
                <h3 className="text-2xl font-black text-slate-800 mb-12">لماذا يختار أصحاب المطاعم نظامنا؟</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div onClick={() => setActiveTab('features')} className="p-10 bg-white rounded-[3rem] shadow-sm border border-slate-100 hover:border-blue-600 cursor-pointer transition-all">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Zap size={28}/></div>
                      <h4 className="font-black text-slate-800 mb-2">سرعة فائقة</h4>
                      <p className="text-sm text-slate-400 font-bold">تحديث المنيو واستقبال الطلبات في أجزاء من الثانية.</p>
                   </div>
                   <div onClick={() => setActiveTab('customers')} className="p-10 bg-white rounded-[3rem] shadow-sm border border-slate-100 hover:border-blue-600 cursor-pointer transition-all">
                      <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Heart size={28}/></div>
                      <h4 className="font-black text-slate-800 mb-2">سهولة الاستخدام</h4>
                      <p className="text-sm text-slate-400 font-bold">واجهات بسيطة مصممة لتناسب الموظفين والعملاء.</p>
                   </div>
                   <div onClick={() => setActiveTab('pricing')} className="p-10 bg-white rounded-[3rem] shadow-sm border border-slate-100 hover:border-blue-600 cursor-pointer transition-all">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Star size={28}/></div>
                      <h4 className="font-black text-slate-800 mb-2">باقات مرنة</h4>
                      <p className="text-sm text-slate-400 font-bold">خطط أسعار تبدأ من الباقة المجانية وحتى الشركات.</p>
                   </div>
                </div>
             </div>
          </section>
        </>
      );
    }
  };

  const NavItem = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
      className={`text-sm font-black transition-all ${activeTab === id ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-2xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200">S</div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{platformSettings.siteName.split(' ')[0]}</span>
          </button>
          
          <div className="hidden md:flex items-center gap-10">
            <NavItem id="home" label="الرئيسية" />
            <NavItem id="features" label="المميزات" />
            <NavItem id="partners" label="شركاؤنا" />
            <NavItem id="customers" label="عملاؤنا" />
            <NavItem id="pricing" label="الأسعار" />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="hidden md:block bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all">لوحة التحكم</button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-800 bg-slate-50 rounded-xl">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-50 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
            <NavItem id="home" label="الرئيسية" />
            <NavItem id="features" label="المميزات" />
            <NavItem id="partners" label="شركاؤنا" />
            <NavItem id="customers" label="عملاؤنا" />
            <NavItem id="pricing" label="الأسعار" />
            <button onClick={onLogin} className="bg-blue-600 text-white py-4 rounded-2xl font-black">لوحة التحكم</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
             <div className="col-span-1">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                  <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">{platformSettings.siteName.split(' ')[0]}</span>
                </div>
                <p className="text-slate-400 font-bold leading-relaxed mb-8">{platformSettings.footerText}</p>
                <div className="flex gap-4">
                  {[platformSettings.facebookUrl, platformSettings.twitterUrl, platformSettings.instagramUrl].map((url, i) => (
                    <a key={i} href={url} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                       <Globe size={20} />
                    </a>
                  ))}
                </div>
             </div>
             <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-10">
                <div>
                   <h4 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">المنصة</h4>
                   <ul className="space-y-4 text-sm font-bold text-slate-400">
                      <li><button onClick={() => setActiveTab('features')} className="hover:text-blue-600">المميزات</button></li>
                      <li><button onClick={() => setActiveTab('pricing')} className="hover:text-blue-600">الباقات</button></li>
                      <li><button onClick={() => setActiveTab('customers')} className="hover:text-blue-600">عملاؤنا</button></li>
                   </ul>
                </div>
                <div>
                   <h4 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">الدعم</h4>
                   <ul className="space-y-4 text-sm font-bold text-slate-400">
                      <li><a href="#" className="hover:text-blue-600">مركز المساعدة</a></li>
                      <li><a href="#" className="hover:text-blue-600">تواصل معنا</a></li>
                   </ul>
                </div>
                <div className="col-span-2 md:col-span-1 bg-slate-50 p-8 rounded-[2.5rem]">
                   <h4 className="font-black text-slate-800 mb-2 text-sm">تواصل معنا</h4>
                   <div className="space-y-3 mt-4">
                      <div className="flex items-center gap-3 text-sm font-black text-slate-800"><Mail size={16} className="text-blue-600" /> {platformSettings.supportEmail}</div>
                      <div className="flex items-center gap-3 text-sm font-black text-slate-800"><Phone size={16} className="text-blue-600" /> {platformSettings.supportPhone}</div>
                   </div>
                </div>
             </div>
          </div>
          <div className="text-center pt-10 border-t border-slate-50">
             <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">© 2024 {platformSettings.siteName} - جميع الحقوق محفوظة لشركة SOP للحلول التقنية</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
