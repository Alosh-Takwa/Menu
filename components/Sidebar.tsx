
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
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
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
    <div className="w-64 bg-white h-screen border-l border-gray-200 flex flex-col fixed top-0 right-0">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          S
        </div>
        <h1 className="text-xl font-bold text-gray-800">SOP POS</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
