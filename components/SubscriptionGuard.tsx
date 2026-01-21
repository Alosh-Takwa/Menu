
import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { PLANS } from '../constants';
import { db } from '../services/db';

interface SubscriptionGuardProps {
  feature: 'orders' | 'reservations' | 'advanced_stats' | 'custom_design';
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ feature, children }) => {
  const restaurant = db.getCurrentRestaurant();
  const currentPlan = PLANS.find(p => p.id === restaurant?.planId);
  
  const hasAccess = () => {
    // بناءً على طلب المستخدم: فتح الطلبات والحجوزات للجميع
    if (feature === 'orders' || feature === 'reservations') return true;
    
    if (!currentPlan) return false;
    if (currentPlan.id === 3) return true; // Enterprise has everything
    
    // Professional (ID: 2) has Design, Analytics
    if (currentPlan.id === 2) {
        return ['custom_design', 'advanced_stats'].includes(feature);
    }
    
    return false;
  };

  if (!hasAccess()) {
    return (
      <div className="relative group overflow-hidden rounded-[40px]">
        <div className="filter blur-[8px] opacity-20 pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] p-10 text-center z-10">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-5 rounded-3xl mb-6 shadow-2xl shadow-amber-200 animate-bounce">
            <Lock size={32} />
          </div>
          <h3 className="font-black text-2xl text-gray-800 mb-2 tracking-tighter">ميزة حصرية للمشتركين</h3>
          <p className="text-gray-500 font-bold mb-8 max-w-[250px] leading-relaxed">هذه الميزة متاحة فقط في باقة "الاحترافية" و "الشركات". قم بالترقية الآن واستمتع بمزايا غير محدودة.</p>
          
          <div className="flex flex-col gap-3 w-full max-w-[200px]">
             <button className="bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
               <Sparkles size={18} />
               ترقية الباقة الآن
             </button>
             <button className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors">عرض كافة الميزات</button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
