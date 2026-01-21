
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Order } from '../types';
import { Clock, CheckCircle, Package, Send, XCircle, ShoppingBag, Printer, Filter } from 'lucide-react';
import SubscriptionGuard from '../components/SubscriptionGuard';

const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  useEffect(() => {
    const restaurant = db.getCurrentRestaurant();
    if (restaurant) {
      setOrders(db.getOrders(restaurant.id));
    }
  }, []);

  const updateStatus = (id: number, status: Order['status']) => {
    const restaurant = db.getCurrentRestaurant();
    db.updateOrderStatus(id, status);
    if (restaurant) {
      setOrders(db.getOrders(restaurant.id));
    }
  };

  const filteredOrders = orders.filter(o => activeFilter === 'all' || o.status === activeFilter);

  const statusMap: any = {
    pending: { label: 'انتظار', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock size={16}/> },
    preparing: { label: 'تجهيز', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Package size={16}/> },
    ready: { label: 'جاهز', color: 'bg-green-50 text-green-600 border-green-100', icon: <Send size={16}/> },
    completed: { label: 'مكتمل', color: 'bg-gray-50 text-gray-600 border-gray-100', icon: <CheckCircle size={16}/> },
    cancelled: { label: 'ملغي', color: 'bg-red-50 text-red-600 border-red-100', icon: <XCircle size={16}/> },
  };

  return (
    <SubscriptionGuard feature="orders">
      <div className="p-8 font-sans">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tighter">نظام إدارة الطلبات (POS)</h1>
            <p className="text-gray-500 font-medium mt-1">تابع سير العمل في مطبخك لحظة بلحظة</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
             <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100"><ShoppingBag size={24}/></div>
             <div className="px-2">
                <p className="text-[10px] font-black text-gray-400 uppercase leading-none tracking-widest mb-1">طلبات نشطة</p>
                <p className="text-xl font-black text-gray-800 leading-none">{orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</p>
             </div>
          </div>
        </div>

        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
           {[
             { id: 'all', name: 'الكل' },
             { id: 'pending', name: 'قيد الانتظار' },
             { id: 'preparing', name: 'جاري التحضير' },
             { id: 'ready', name: 'جاهز للتسليم' }
           ].map(f => (
             <button 
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-8 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
                activeFilter === f.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200'
              }`}
             >
               {f.name}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredOrders.length === 0 ? (
             <div className="col-span-full py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <ShoppingBag className="mx-auto text-gray-200 mb-4" size={64} />
                <p className="text-gray-400 font-black">لا توجد طلبات في هذا القسم حالياً.</p>
             </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 transition-all hover:shadow-2xl hover:translate-y-[-4px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-black text-gray-800 tracking-tighter">{order.orderNumber}</h3>
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-widest border ${statusMap[order.status].color}`}>
                        {statusMap[order.status].icon}
                        {statusMap[order.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                       {order.customerName} • {order.createdAt}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-3xl font-black text-blue-600">{order.total} <span className="text-[10px] text-gray-400 font-black">ر.س</span></div>
                    <button className="text-gray-300 hover:text-blue-600 transition-all mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-tighter">
                      <Printer size={16} /> طباعة الفاتورة
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-10 bg-gray-50/50 rounded-[32px] p-8 border border-gray-100/50 shadow-inner">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm group">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-white border-2 border-gray-50 rounded-2xl flex items-center justify-center text-xs font-black text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                          {item.quantity}
                        </span>
                        <span className="text-gray-800 font-black">{item.dishName}</span>
                      </div>
                      <span className="text-gray-400 font-black">{item.price * item.quantity} ر.س</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  {order.status === 'pending' && (
                    <button onClick={() => updateStatus(order.id, 'preparing')} className="flex-1 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95">قبول وتحضير</button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => updateStatus(order.id, 'ready')} className="flex-1 py-5 bg-green-600 text-white font-black rounded-3xl hover:bg-green-700 transition-all shadow-2xl shadow-green-100 active:scale-95">تم التجهيز</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => updateStatus(order.id, 'completed')} className="flex-1 py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl active:scale-95">إتمام الطلب</button>
                  )}
                  <button onClick={() => updateStatus(order.id, 'cancelled')} className="px-10 py-5 text-red-500 font-black hover:bg-red-50 rounded-3xl transition-all uppercase tracking-tighter">إلغاء</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SubscriptionGuard>
  );
};

export default OrdersView;
