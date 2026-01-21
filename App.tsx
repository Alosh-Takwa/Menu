
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RestaurantDashboardView from './views/RestaurantDashboard';
import CustomerMenuView from './views/CustomerMenu';
import DishesView from './views/DishesView';
import OrdersView from './views/OrdersView';
import ReservationsView from './views/ReservationsView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import RatingsView from './views/RatingsView';
import AdminView from './views/AdminView';
import AIChatBot from './components/AIChatBot';
import { UserRole } from './types';
import { LayoutGrid, Store, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('RESTAURANT');
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderRestaurantContent = () => {
    switch (activeTab) {
      case 'dashboard': return <RestaurantDashboardView />;
      case 'dishes': return <DishesView />;
      case 'orders': return <OrdersView />;
      case 'reservations': return <ReservationsView />;
      case 'ratings': return <RatingsView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      case 'menu-preview': return <CustomerMenuView isPreview={true} />;
      default: return <RestaurantDashboardView />;
    }
  };

  const renderContent = () => {
    if (role === 'CUSTOMER') return <CustomerMenuView />;
    if (role === 'ADMIN') return <AdminView />;
    return renderRestaurantContent();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden" dir="rtl">
      {/* Role Switcher (For Demo/Development) */}
      <div className="fixed bottom-4 left-4 z-[100] flex gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/50">
        <button 
          onClick={() => { setRole('ADMIN'); setActiveTab('admin'); }}
          className={`p-3 rounded-xl transition-all ${role === 'ADMIN' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-500'}`}
          title="لوحة المشرف العام"
        >
          <LayoutGrid size={24} />
        </button>
        <button 
          onClick={() => { setRole('RESTAURANT'); setActiveTab('dashboard'); }}
          className={`p-3 rounded-xl transition-all ${role === 'RESTAURANT' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-500'}`}
          title="لوحة المطعم"
        >
          <Store size={24} />
        </button>
        <button 
          onClick={() => setRole('CUSTOMER')}
          className={`p-3 rounded-xl transition-all ${role === 'CUSTOMER' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-500'}`}
          title="واجهة العميل (المنيو)"
        >
          <UserCircle size={24} />
        </button>
      </div>

      {role === 'RESTAURANT' && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <main className={`flex-1 transition-all ${role === 'RESTAURANT' ? 'mr-64' : 'mr-0'}`}>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderContent()}
        </div>
      </main>

      {role !== 'CUSTOMER' && <AIChatBot />}
    </div>
  );
};

export default App;
