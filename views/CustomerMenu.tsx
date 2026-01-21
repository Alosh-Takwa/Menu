
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, Clock, Info, QrCode, Download, Share2, X, Plus, Minus, Trash2, CalendarCheck, Users, Phone, User, SearchCheck } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_RESTAURANT } from '../constants';
import { db } from '../services/db';
import { Dish, OrderItem, Restaurant, Reservation } from '../types';
import ReservationInquiryView from './ReservationInquiryView';

interface CustomerMenuViewProps {
  isPreview?: boolean;
}

const CustomerMenuView: React.FC<CustomerMenuViewProps> = ({ isPreview = false }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant>(MOCK_RESTAURANT);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Reservation form state
  const [reservationForm, setReservationForm] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: 2
  });

  useEffect(() => {
    const res = db.getCurrentRestaurant();
    if (res) {
        setRestaurant(res);
        setDishes(db.getDishes(res.id));
    } else {
        setDishes(db.getDishes(1));
    }
  }, []);

  if (isInquiryOpen) {
    return <ReservationInquiryView restaurant={restaurant} onBack={() => setIsInquiryOpen(false)} />;
  }

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.dishId === dish.id);
      if (existing) {
        return prev.map(i => i.dishId === dish.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { dishId: dish.id, dishName: dish.name, quantity: 1, price: dish.price }];
    });
  };

  const removeFromCart = (dishId: number) => {
    setCart(prev => prev.filter(i => i.dishId !== dishId));
  };

  const updateQty = (dishId: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.dishId === dishId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.createReservation({
      restaurantId: restaurant.id,
      customerName: reservationForm.name,
      customerPhone: reservationForm.phone,
      date: reservationForm.date,
      time: reservationForm.time,
      guests: reservationForm.guests
    });
    setIsReservationOpen(false);
    setReservationSuccess(true);
    setTimeout(() => setReservationSuccess(false), 5000);
    setReservationForm({
      name: '',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      guests: 2
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    db.createOrder({
      restaurantId: restaurant.id,
      customerName: 'عميل من المنيو الإلكتروني',
      customerPhone: '05xxxxxxxx',
      total: cartTotal,
      status: 'pending',
      items: cart
    });
    setCart([]);
    setIsCartOpen(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  const filteredDishes = dishes.filter(dish => 
    (activeCategory === 0 || dish.categoryId === activeCategory) &&
    dish.name.includes(searchTerm)
  );

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + (restaurant.reservationSettings?.advanceBookingDays || 7));
  const maxDateString = maxDate.toISOString().split('T')[0];
  const minDateString = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 relative" style={{ fontFamily: restaurant.fontFamily || 'Cairo' }}>
      {isPreview && (
        <div className="text-white p-3 text-center text-xs font-bold sticky top-0 z-50 flex justify-between items-center px-6 shadow-md" style={{ backgroundColor: restaurant.themeColor }}>
          <span>معاينة حيـة لمنيـو مطعمك</span>
          <button onClick={() => setShowQR(true)} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg flex items-center gap-1 transition-all"><QrCode size={14} /> الرمز</button>
        </div>
      )}

      {(orderSuccess || reservationSuccess) && (
        <div className="fixed top-20 inset-x-4 bg-green-600 text-white p-4 rounded-2xl z-[120] flex items-center justify-between shadow-2xl animate-in slide-in-from-top duration-500">
           <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-full"><ShoppingCart size={20}/></div>
             <div>
                <p className="font-bold text-sm">{orderSuccess ? 'تم إرسال طلبك بنجاح!' : 'تم إرسال طلب الحجز بنجاح!'}</p>
                <p className="text-[10px] opacity-80">{orderSuccess ? 'سيقوم المطبخ بالبدء في تجهيزه فوراً.' : 'سنقوم بالتواصل معك لتأكيد الحجز.'}</p>
             </div>
           </div>
           <button onClick={() => { setOrderSuccess(false); setReservationSuccess(false); }}><X size={18}/></button>
        </div>
      )}

      {/* Hero */}
      <div className="relative h-48">
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 right-4 flex items-center gap-3 w-full px-4">
          <img src={restaurant.logo} className="w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg object-cover flex-shrink-0" alt="Logo" />
          <div className="flex-1">
            <h1 className="text-white text-xl font-black">{restaurant.name}</h1>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>4.8 (1.2k+ تقييم)</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {restaurant.reservationSettings?.isEnabled && (
              <button 
                onClick={() => setIsReservationOpen(true)}
                className="bg-white text-gray-800 px-4 py-2 rounded-xl text-[10px] font-black shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                 <CalendarCheck size={14} style={{ color: restaurant.themeColor }} />
                 حجز طاولة
              </button>
            )}
            <button 
              onClick={() => setIsInquiryOpen(true)}
              className="bg-slate-900/40 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black border border-white/20 flex items-center gap-2 hover:bg-slate-900/60 transition-all whitespace-nowrap"
            >
               <SearchCheck size={14} />
               استعلام حجز
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-around py-4 border-b border-gray-100 bg-gray-50/30">
        <div className="flex flex-col items-center"><Clock size={16} className="mb-1" style={{ color: restaurant.themeColor }}/><span className="text-[10px] text-gray-500 font-bold uppercase">التحضير</span><span className="text-xs font-black">20-30 د</span></div>
        <div className="flex flex-col items-center"><Info size={16} className="mb-1" style={{ color: restaurant.themeColor }}/><span className="text-[10px] text-gray-500 font-bold uppercase">الحالة</span><span className="text-xs font-black text-green-600">مفتوح</span></div>
        <div className="flex flex-col items-center"><ShoppingCart size={16} className="mb-1" style={{ color: restaurant.themeColor }}/><span className="text-[10px] text-gray-500 font-bold uppercase">الأدنى</span><span className="text-xs font-black">40 {restaurant.currency}</span></div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="ابحث عن طبق..." className="w-full bg-gray-100 border-none rounded-2xl py-3 pr-10 pl-4 text-sm focus:ring-2 outline-none" style={{ ['--tw-ring-color' as any]: restaurant.themeColor }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar whitespace-nowrap">
        <button onClick={() => setActiveCategory(0)} className={`px-5 py-2 rounded-full text-xs font-black transition-all ${activeCategory === 0 ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`} style={activeCategory === 0 ? { backgroundColor: restaurant.themeColor } : {}}>الكل</button>
        {MOCK_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2 rounded-full text-xs font-black transition-all ${activeCategory === cat.id ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`} style={activeCategory === cat.id ? { backgroundColor: restaurant.themeColor } : {}}>{cat.name}</button>
        ))}
      </div>

      <div className="px-4 py-6 space-y-6">
        <h2 className="text-lg font-black text-gray-800 border-r-4 pr-3" style={{ borderRightColor: restaurant.themeColor }}>{activeCategory === 0 ? 'قائمة الطعام' : MOCK_CATEGORIES.find(c => c.id === activeCategory)?.name}</h2>
        {filteredDishes.map(dish => (
          <div key={dish.id} className="flex gap-4 group">
            <div className="relative overflow-hidden rounded-2xl shadow-sm w-24 h-24 flex-shrink-0 bg-gray-100">
                <img src={dish.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={dish.name} />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{dish.name}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">{dish.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black text-sm" style={{ color: restaurant.themeColor }}>{dish.price} {restaurant.currency}</span>
                {!isPreview && (
                   <button onClick={() => addToCart(dish)} className="text-white w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-90 transition-all shadow-md" style={{ backgroundColor: restaurant.themeColor }}>+</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isPreview && cart.length > 0 && (
         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-[90]">
           <button onClick={() => setIsCartOpen(true)} className="w-full text-white py-4 rounded-2xl font-black shadow-2xl flex justify-between px-6 items-center hover:opacity-90 transition-all" style={{ backgroundColor: restaurant.themeColor }}>
             <div className="flex items-center gap-3">
               <span className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center text-xs">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
               <span className="text-sm">سلة المشتريات</span>
             </div>
             <span className="text-sm">{cartTotal} {restaurant.currency}</span>
           </button>
         </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-end justify-center">
           <div className="bg-white rounded-t-[40px] w-full max-w-md p-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-gray-800">تفاصيل السلة</h3>
                 <button onClick={() => setIsCartOpen(false)} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button>
              </div>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-8 pr-1">
                 {cart.map(item => (
                    <div key={item.dishId} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                       <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm">{item.dishName}</h4>
                          <p className="font-bold text-xs" style={{ color: restaurant.themeColor }}>{item.price} {restaurant.currency}</p>
                       </div>
                       <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                          <button onClick={() => updateQty(item.dishId, -1)} className="w-6 h-6 flex items-center justify-center text-gray-400"><Minus size={14}/></button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.dishId, 1)} className="w-6 h-6 flex items-center justify-center" style={{ color: restaurant.themeColor }}><Plus size={14}/></button>
                       </div>
                       <button onClick={() => removeFromCart(item.dishId)} className="mr-3 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                 ))}
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-4">
                 <div className="flex justify-between text-lg">
                    <span className="text-gray-500 font-bold">الإجمالي النهائي</span>
                    <span className="font-black" style={{ color: restaurant.themeColor }}>{cartTotal} {restaurant.currency}</span>
                 </div>
                 <button onClick={placeOrder} className="w-full text-white py-4 rounded-2xl font-black shadow-xl hover:opacity-90 transition-all active:scale-95" style={{ backgroundColor: restaurant.themeColor }}>تأكيد وإرسال الطلب</button>
              </div>
           </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isReservationOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-end justify-center p-0">
          <div className="bg-white rounded-t-[40px] w-full max-w-md p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-800">حجز طاولة جديدة</h3>
              <button onClick={() => setIsReservationOpen(false)} className="bg-gray-100 p-3 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleReservationSubmit} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <User size={12}/> الاسم الكريم
                 </label>
                 <input 
                  type="text" 
                  required
                  placeholder="أدخل اسمك"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 outline-none" 
                  style={{ ['--tw-ring-color' as any]: restaurant.themeColor }}
                  value={reservationForm.name}
                  onChange={e => setReservationForm({...reservationForm, name: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Phone size={12}/> رقم الجوال
                 </label>
                 <input 
                  type="tel" 
                  required
                  placeholder="05xxxxxxxx"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 outline-none" 
                  style={{ ['--tw-ring-color' as any]: restaurant.themeColor }}
                  value={reservationForm.phone}
                  onChange={e => setReservationForm({...reservationForm, phone: e.target.value})}
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">التاريخ</label>
                    <input 
                      type="date" 
                      required
                      min={minDateString}
                      max={maxDateString}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-xs focus:ring-2 outline-none" 
                      style={{ ['--tw-ring-color' as any]: restaurant.themeColor }}
                      value={reservationForm.date}
                      onChange={e => setReservationForm({...reservationForm, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الوقت</label>
                    <input 
                      type="time" 
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-xs focus:ring-2 outline-none" 
                      style={{ ['--tw-ring-color' as any]: restaurant.themeColor }}
                      value={reservationForm.time}
                      onChange={e => setReservationForm({...reservationForm, time: e.target.value})}
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Users size={12}/> عدد الضيوف
                  </label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 outline-none cursor-pointer"
                    style={{ ['--tw-ring-color' as any]: restaurant.themeColor }}
                    value={reservationForm.guests}
                    onChange={e => setReservationForm({...reservationForm, guests: Number(e.target.value)})}
                  >
                    {[...Array(restaurant.reservationSettings?.maxGuests || 10)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} ضيوف</option>
                    ))}
                  </select>
               </div>
               <button type="submit" className="w-full text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:opacity-90 transition-all active:scale-95 mt-4" style={{ backgroundColor: restaurant.themeColor }}>
                 تأكيد حجز الطاولة
               </button>
            </form>
          </div>
        </div>
      )}

      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[130] flex items-center justify-center p-6" onClick={() => setShowQR(false)}>
           <div className="bg-white rounded-[40px] p-10 w-full max-w-xs text-center space-y-6 animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <div className="bg-gray-50 p-6 rounded-3xl border-4 border-dashed border-gray-200">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://sop-pos.com/${restaurant.slug}`} className="w-full h-auto mx-auto" alt="QR Code" />
              </div>
              <div><h3 className="font-black text-xl text-gray-800 mb-1">{restaurant.name}</h3><p className="text-gray-400 text-xs font-bold uppercase tracking-wider">المنيو الإلكتروني</p></div>
              <div className="flex gap-2">
                 <button className="flex-1 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90" style={{ backgroundColor: restaurant.themeColor }}><Download size={18} /> تحميل</button>
                 <button className="bg-gray-100 text-gray-400 p-3 rounded-2xl hover:bg-gray-200"><Share2 size={18} /></button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenuView;
