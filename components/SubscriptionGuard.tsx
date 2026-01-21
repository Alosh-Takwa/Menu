
import React from 'react';
import { Lock } from 'lucide-react';
import { PLANS, MOCK_RESTAURANT } from '../constants';

interface SubscriptionGuardProps {
  feature: 'orders' | 'reservations' | 'advanced_stats' | 'custom_design';
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ feature, children }) => {
  const currentPlan = PLANS.find(p => p.id === MOCK_RESTAURANT.planId);
  
  const hasAccess = () => {
    if (!currentPlan) return false;
    if (currentPlan.id === 3) return true; // Enterprise has all
    if (currentPlan.id === 2) {
        return ['custom_design', 'qr'].includes(feature);
    }
    return false;
  };

  if (!hasAccess()) {
    return (
      <div className="relative group">
        <div className="filter blur-[2px] opacity-40 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
          <div className="bg-amber-100 text-amber-600 p-3 rounded-full mb-3">
            <Lock size={24} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">ميزة مقفولة</h3>
          <p className="text-[10px] text-gray-500 mb-4">هذه الميزة متاحة في الباقات المتقدمة فقط</p>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg hover:bg-blue-700 transition-all">
            ترقية الباقة الآن
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
