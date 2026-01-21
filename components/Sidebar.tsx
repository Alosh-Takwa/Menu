
import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ListOrdered, 
  Settings, 
  BarChart3, 
  Star, 
  CalendarCheck,
  Globe,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: <LayoutDashboard size={20} /> },
    { id: 'dishes', name: 'إدارة الأطباق', icon: <UtensilsCrossed size={20} /> },
    { id: 'orders', name: 'إدارة الطلبات', icon: <ListOrdered size={20} /> },
    { id: 'reservations', name: 'الحجوزات', icon: <CalendarCheck size={20} /> },
    { id: 'ratings', name: 'التقييمات', icon: <Star size={20} /> },
    { id: 'analytics', name: 'الإحصائيات', icon: <BarChart3 size={20} /> },
    { id: 'menu-preview', name: 'معاينة المنيو', icon: <Globe size={20} /> },
    { id: 'settings', name: 'الإعدادات', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-white h-screen border-l border-gray-200 flex flex-col fixed top-0 right-0 z-40">
      <div className="p-8 border-b border-gray-50 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
          S
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-800 tracking-tighter">SOP POS</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enterprise</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-8 py-4 transition-all duration-300 relative group ${
              activeTab === item.id 
                ? 'text-blue-600 font-black' 
                : 'text-gray-400 hover:text-gray-600 font-bold'
            }`}
          >
            {activeTab === item.id && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-blue-600 rounded-l-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            )}
            <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:translate-x-[-4px]'}`}>
              {item.icon}
            </span>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-gray-50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-[20px] transition-all font-black text-sm shadow-sm"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
