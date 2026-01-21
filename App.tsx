
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
import LandingView from './views/LandingView';
import AIChatBot from './components/AIChatBot';
import { db } from './services/db';
import { UserRole, Restaurant } from './types';
import { LayoutGrid, Store, UserCircle, LogIn } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('RESTAURANT');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Restaurant | null>(null);

  useEffect(() => {
    const user = db.getCurrentRestaurant();
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    const user = db.login('admin@sop.com'); // Simulated login
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    setRole('RESTAURANT');
  };

  const handleLogout = () => {
    db.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setRole('RESTAURANT');
  };

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
    // Fix: Removed redundant `role !== 'CUSTOMER'` check as it's already narrowed
    if (!isLoggedIn) return <LandingView onLogin={handleLogin} />;
    if (role === 'ADMIN') return <AdminView />;
    return renderRestaurantContent();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden font-sans" dir="rtl">
      {/* Dev Tool: Role & Auth Switcher */}
      <div className="fixed bottom-6 left-6 z-[100] flex gap-2 bg-white/90 backdrop-blur-xl p-3 rounded-3xl shadow-2xl border border-white/50 ring-1 ring-black/5">
        <button 
          onClick={() => { setRole('ADMIN'); setActiveTab('admin'); }}
          className={`p-4 rounded-2xl transition-all ${role === 'ADMIN' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'hover:bg-gray-100 text-gray-400'}`}
          title="لوحة المشرف العام"
        >
          <LayoutGrid size={24} />
        </button>
        <button 
          onClick={() => { setRole('RESTAURANT'); if (isLoggedIn) setActiveTab('dashboard'); }}
          className={`p-4 rounded-2xl transition-all ${role === 'RESTAURANT' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'hover:bg-gray-100 text-gray-400'}`}
          title="لوحة المطعم"
        >
          <Store size={24} />
        </button>
        <button 
          onClick={() => setRole('CUSTOMER')}
          className={`p-4 rounded-2xl transition-all ${role === 'CUSTOMER' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'hover:bg-gray-100 text-gray-400'}`}
          title="واجهة العميل (المنيو)"
        >
          <UserCircle size={24} />
        </button>
        {!isLoggedIn && role === 'RESTAURANT' && (
           <button 
            onClick={handleLogin}
            className="p-4 rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-all border border-green-100"
            title="تسجيل دخول سريع"
          >
            <LogIn size={24} />
          </button>
        )}
      </div>

      {isLoggedIn && role === 'RESTAURANT' && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      )}

      <main className={`flex-1 transition-all ${isLoggedIn && role === 'RESTAURANT' ? 'mr-64' : 'mr-0'}`}>
        <div className="animate-in fade-in duration-700">
          {renderContent()}
        </div>
      </main>

      {isLoggedIn && role !== 'CUSTOMER' && <AIChatBot />}
    </div>
  );
};

export default App;
