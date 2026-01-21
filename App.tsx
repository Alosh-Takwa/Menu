
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
// Fix: Added LogIn to lucide-react imports
import { LayoutGrid, Store, UserCircle, LogOut, Menu, X, LogIn } from 'lucide-react';

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
        setAuthPage('landing');
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
    setIsLoggedIn(false);
    setIsAdmin(false);
    setAuthPage('landing');
    setRole('RESTAURANT');
  };

  const handleSelectRestaurantFromPublic = (id: number) => {
    db.setCurrentUser(id);
    setRole('CUSTOMER');
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (role === 'CUSTOMER') return <CustomerMenuView />;
    
    if (!isLoggedIn) {
      if (authPage === 'landing') return <LandingView onLogin={() => setAuthPage('login')} onSelectRestaurant={handleSelectRestaurantFromPublic} />;
      return (
        <AuthView 
          type={authPage === 'login' ? 'login' : 'register'} 
          onSuccess={handleAuthSuccess} 
          onAdminSuccess={handleAdminSuccess}
          onSwitch={setAuthPage}
          onBackToLanding={() => setAuthPage('landing')}
        />
      );
    }

    if (isAdmin) return <AdminView />;

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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden font-sans" dir="rtl">
      
      {/* Dev Role Switcher */}
      <div className="fixed bottom-4 left-4 z-[100] flex gap-1 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white">
        <button onClick={() => setRole('CUSTOMER')} className={`p-3 rounded-xl transition-all ${role === 'CUSTOMER' ? 'bg-blue-600 text-white' : 'text-slate-400'}`} title="واجهة العميل"><UserCircle size={20}/></button>
        <button onClick={() => { setIsLoggedIn(false); setAuthPage('login'); setRole('RESTAURANT'); }} className={`p-3 rounded-xl transition-all ${!isLoggedIn && role === 'RESTAURANT' ? 'bg-blue-600 text-white' : 'text-slate-400'}`} title="تسجيل الدخول"><LogIn size={20}/></button>
      </div>

      {isLoggedIn && !isAdmin && role === 'RESTAURANT' && (
        <>
          <div className="md:hidden flex justify-between items-center p-4 bg-white border-b sticky top-0 z-[60]">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
                <span className="font-black text-sm">SOP POS</span>
             </div>
             <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="p-2 text-slate-500">
                {isMobileSidebarOpen ? <X /> : <Menu />}
             </button>
          </div>
          
          <div className={`fixed inset-0 z-50 transition-transform ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0`}>
             <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(t) => { setActiveTab(t); setIsMobileSidebarOpen(false); }} 
                onLogout={handleLogout} 
             />
          </div>
        </>
      )}

      {isAdmin && isLoggedIn && (
        <div className="fixed top-4 left-4 right-4 z-[70] md:hidden">
           <button onClick={handleLogout} className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-2 text-red-500 font-black text-xs">
              <LogOut size={16}/> تسجيل خروج المشرف
           </button>
        </div>
      )}

      <main className={`flex-1 transition-all ${isLoggedIn && role === 'RESTAURANT' && !isAdmin ? 'md:mr-64' : ''}`}>
        <div className="animate-in fade-in duration-700">
          {renderContent()}
        </div>
      </main>

      {isLoggedIn && role !== 'CUSTOMER' && <AIChatBot />}
    </div>
  );
};

export default App;
