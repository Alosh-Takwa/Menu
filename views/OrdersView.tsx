
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Order } from '../types';
import { Clock, CheckCircle, Package, Send, XCircle, ShoppingBag } from 'lucide-react';
import SubscriptionGuard from '../components/SubscriptionGuard';

const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

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

  const statusMap: any = {
    pending: { label: 'انتظار', color: 'bg-amber-100 text-amber-600', icon: <Clock size={16}/> },
    preparing: { label: 'تجهيز', color: 'bg-blue-100 text-blue-600', icon: <Package size={16}/> },
    ready: { label: 'جاهز', color: 'bg-green-100 text-green-600', icon: <Send size={16}/> },
    completed: { label: 'مكتمل', color: 'bg-gray-100 text-gray-600', icon: <CheckCircle size={16}/> },
    cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-600', icon: <XCircle size={16}/> },
  };

  return (
    <SubscriptionGuard feature="orders">
      <div className="p-8 font-sans">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800">إدارة الطلبات المباشرة</h1>
            <p className="text-gray-500 font-medium">نظام POS متكامل لمتابعة المبيعات لحظياً</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
             <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100"><ShoppingBag size={20}/></div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase leading-none">إجمالي اليوم</p>
                <p className="text-lg font-black text-gray-800 leading-none mt-1">{orders.length}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {orders.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">لا يوجد طلبات نشطة حالياً.</p>
             </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 mb-1">
                      {order.orderNumber}
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-widest ${statusMap[order.status].color}`}>
                        {statusMap[order.status].icon}
                        {statusMap[order.status].label}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 font-bold">{order.customerName} • {order.createdAt}</p>
                  </div>
                  <div className="text-2xl font-black text-blue-600">{order.total} ر.س</div>
                </div>

                <div className="space-y-4 mb-8 bg-gray-50/50 rounded-3xl p-6 border border-gray-100/50">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xs font-black text-blue-600 shadow-sm">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-700 font-bold">{item.dishName}</span>
                      </div>
                      <span className="text-gray-400 font-black">{item.price * item.quantity} ر.س</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  {order.status === 'pending' && (
                    <button onClick={() => updateStatus(order.id, 'preparing')} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">قبول وبدء التحضير</button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => updateStatus(order.id, 'ready')} className="flex-1 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-100">تم التجهيز</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => updateStatus(order.id, 'completed')} className="flex-1 py-4 bg-gray-800 text-white font-black rounded-2xl hover:bg-gray-900 transition-all shadow-xl">تأكيد التسليم</button>
                  )}
                  <button onClick={() => updateStatus(order.id, 'cancelled')} className="px-6 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">إلغاء</button>
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
