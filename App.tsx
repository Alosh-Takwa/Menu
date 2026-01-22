
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RestaurantDashboardView from './views/RestaurantDashboard';
import CustomerMenuView from './views/CustomerMenu';
import DishesView from './views/DishesView';
import CategoriesView from './views/CategoriesView';
import OrdersView from './views/OrdersView';
import ReservationsView from './views/ReservationsView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import RatingsView from './views/RatingsView';
import AdminView from './views/AdminView';
import LandingView from './views/LandingView';
import AuthView from './views/AuthView';
import MenuCustomizationView from './views/MenuCustomizationView';
import PasswordChangeView from './views/PasswordChangeView';
import AIChatBot from './components/AIChatBot';
import { db } from './services/db';
import { UserRole, Restaurant } from './types';
import { X, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('RESTAURANT');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authPage, setAuthPage] = useState<'landing' | 'login' | 'register'>('landing');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const admin = db.isAdmin();
    if (admin) {
      setIsAdmin(true);
      setRole('ADMIN');
      setIsLoggedIn(true);
      setActiveTab('admin');
    } else {
      const user = db.getCurrentRestaurant();
      if (user) {
        setIsLoggedIn(true);
        setRole('RESTAURANT');
      }
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(false);
    setRole('RESTAURANT');
    setActiveTab('dashboard');
    setAuthPage('landing');
  };

  const handleAdminSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    setRole('ADMIN');
    setActiveTab('admin');
    setAuthPage('landing');
  };

  const handleLogout = () => {
    db.logout();
  };

  const handleSelectRestaurant = async (id: number) => {
    const restaurants = await db.getAllRestaurants();
    const selected = restaurants.find(r => r.id === id);
    if (selected) {
      db.setCurrentUser(selected);
      setRole('CUSTOMER');
    }
  };

  const renderContent = () => {
    if (role === 'CUSTOMER') {
      return (
        <div className="relative">
          <button 
            onClick={() => isLoggedIn ? setRole(isAdmin ? 'ADMIN' : 'RESTAURANT') : setAuthPage('landing')}
            className="fixed top-4 left-4 z-[200] bg-white/80 backdrop-blur px-4 py-2 rounded-xl border shadow-sm font-black text-xs flex items-center gap-2 hover:bg-white transition-all"
          >
            <ArrowRight size={16} /> العودة للمنصة
          </button>
          <CustomerMenuView />
        </div>
      );
    }

    if (!isLoggedIn) {
      if (authPage === 'landing') return <LandingView onLogin={() => setAuthPage('login')} onSelectRestaurant={handleSelectRestaurant} />;
      return <AuthView type={authPage === 'login' ? 'login' : 'register'} onSuccess={handleAuthSuccess} onAdminSuccess={handleAdminSuccess} onSwitch={setAuthPage} onBackToLanding={() => setAuthPage('landing')} />;
    }

    if (isAdmin && activeTab === 'admin') return <AdminView />;

    switch (activeTab) {
      case 'dashboard': return <RestaurantDashboardView />;
      case 'categories': return <CategoriesView />;
      case 'dishes': return <DishesView />;
      case 'orders': return <OrdersView />;
      case 'reservations': return <ReservationsView />;
      case 'ratings': return <RatingsView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView onNavigate={setActiveTab} />;
      case 'menu-customization': return <MenuCustomizationView onBack={() => setActiveTab('settings')} />;
      case 'password-change': return <PasswordChangeView onBack={() => setActiveTab('settings')} />;
      case 'menu-preview': return <CustomerMenuView isPreview={true} />;
      default: return <RestaurantDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden" dir="rtl">
      {isLoggedIn && role !== 'CUSTOMER' && (
        <>
          <div className="md:hidden flex justify-between items-center p-4 bg-white border-b sticky top-0 z-[60]">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
                <span className="font-black text-sm">SOP POS</span>
             </div>
             <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="p-2 text-slate-500"><X /></button>
          </div>
          <div className={`fixed inset-0 z-50 transition-transform ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0`}>
             <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsMobileSidebarOpen(false); }} onLogout={handleLogout} />
          </div>
        </>
      )}
      <main className={`flex-1 ${isLoggedIn && role !== 'CUSTOMER' ? 'md:mr-64' : ''}`}>
        {renderContent()}
      </main>
      {isLoggedIn && role !== 'CUSTOMER' && <AIChatBot />}
    </div>
  );
};

export default App;
