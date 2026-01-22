
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { Order } from '../types';
import { Clock, CheckCircle, Package, Send, XCircle, ShoppingBag, Printer, Bell, Volume2, AlertCircle } from 'lucide-react';
import SubscriptionGuard from '../components/SubscriptionGuard';

const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadOrders = async () => {
    const restaurant = db.getCurrentRestaurant();
    if (restaurant) {
      const allOrders = await db.getOrders(restaurant.id);
      
      // محاكاة اكتشاف طلب جديد لإظهار التنبيه
      if (orders.length > 0 && allOrders.length > orders.length) {
        setNewOrderAlert(true);
        playNotification();
      }
      
      setOrders(allOrders);
    }
  };

  useEffect(() => {
    loadOrders();
    // محاكاة التحديث التلقائي كل 10 ثوانٍ (في الواقع نستخدم WebSockets)
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [orders.length]);

  const playNotification = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play blocked'));
  };

  const updateStatus = async (id: number, status: Order['status']) => {
    await db.updateOrderStatus(id, status);
    loadOrders();
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
        
        {newOrderAlert && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 duration-500">
             <div className="bg-blue-500 p-2 rounded-full animate-pulse">
                <Bell size={20} />
             </div>
             <span className="font-black">وصل طلب جديد الآن!</span>
             <button onClick={() => setNewOrderAlert(false)} className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black hover:bg-white/20">إغلاق</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tighter flex items-center gap-3">
              مركز إدارة الطلبات
              <Volume2 className="text-blue-500 animate-pulse" size={20} />
            </h1>
            <p className="text-gray-500 font-medium mt-1">تتم المزامنة تلقائياً مع المنيو الإلكتروني</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-[24px] shadow-sm border border-gray-100">
             <div className="flex gap-1 p-1 bg-gray-50 rounded-xl">
               {['all', 'pending', 'preparing', 'ready'].map((f) => (
                 <button 
                   key={f}
                   onClick={() => setActiveFilter(f as any)}
                   className={`px-6 py-2 rounded-lg text-[11px] font-black transition-all ${activeFilter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   {f === 'all' ? 'الكل' : f === 'pending' ? 'الجديدة' : f === 'preparing' ? 'المطبخ' : 'الجاهزة'}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredOrders.length === 0 ? (
             <div className="col-span-full py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="text-gray-200" size={40} />
                </div>
                <p className="text-gray-400 font-black text-lg">لا توجد طلبات في هذا القسم حالياً</p>
             </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-2xl hover:translate-y-[-4px] animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-black text-gray-800">#{order.orderNumber.split('-')[2]}</span>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusMap[order.status].color}`}>
                        {statusMap[order.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-bold">{order.customerName}</p>
                  </div>
                  <button className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-2xl transition-all">
                    <Printer size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-3 mb-8 bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-bold">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-blue-600 shadow-sm">{item.quantity}</span>
                        <span className="text-gray-700">{item.dishName}</span>
                      </div>
                      <span className="text-gray-300 text-xs">{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-8 px-2">
                   <span className="text-xs font-black text-gray-400 uppercase tracking-widest">إجمالي الحساب</span>
                   <span className="text-2xl font-black text-blue-600">{order.total} <span className="text-xs font-bold">ر.س</span></span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {order.status === 'pending' && (
                    <button onClick={() => updateStatus(order.id, 'preparing')} className="col-span-2 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">بدء التحضير</button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => updateStatus(order.id, 'ready')} className="col-span-2 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95">تم التجهيز</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => updateStatus(order.id, 'completed')} className="col-span-2 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95">إتمام وتسليم</button>
                  )}
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button onClick={() => updateStatus(order.id, 'cancelled')} className="col-span-2 py-3 text-red-500 font-black text-xs hover:bg-red-50 rounded-xl transition-all">إلغاء الطلب</button>
                  )}
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
