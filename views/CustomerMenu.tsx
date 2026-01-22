
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, Clock, QrCode, X, Plus, Minus, Trash2, CalendarCheck, Users, Phone, User, SearchCheck, Utensils, MapPin, CheckCircle2, ChevronLeft, Calendar, Info, ArrowRight } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_RESTAURANT } from '../constants';
import { db } from '../services/db';
import { Dish, OrderItem, Restaurant } from '../types';
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
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant>(MOCK_RESTAURANT);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const [reservationData, setReservationData] = useState({
    name: 'أحمد محمد علي',
    phone: '0501234567',
    guests: '4 ضيوف',
    date: new Date().toISOString().split('T')[0],
    time: '20:30'
  });

  // Fixed asynchronous data fetching in useEffect
  useEffect(() => {
    const loadData = async () => {
      const res = db.getCurrentRestaurant();
      if (res) {
        setRestaurant(res);
        const dishesData = await db.getDishes(res.id);
        setDishes(dishesData);
      } else {
        const dishesData = await db.getDishes(1);
        setDishes(dishesData);
      }
      window.scrollTo(0, 0);
    };
    loadData();
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

  const updateQty = (dishId: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.dishId === dishId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeFromCart = (dishId: number) => {
    setCart(prev => prev.filter(i => i.dishId !== dishId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    db.createOrder({
      restaurantId: restaurant.id,
      customerName: 'عميل المنيو',
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
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReservationOpen(false);
    setReservationSuccess(true);
    setTimeout(() => setReservationSuccess(false), 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-safe-area-inset-bottom overflow-x-hidden" style={{ fontFamily: restaurant.fontFamily || 'Cairo' }}>
      
      {isPreview && (
        <div className="fixed top-0 inset-x-0 z-[100] bg-black/90 backdrop-blur-md text-white py-2 px-4 flex justify-between items-center text-[10px] font-black tracking-widest border-b border-white/10">
           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> وضع المعاينة الفورية</span>
           <button onClick={() => setShowQR(true)} className="bg-white/10 px-3 py-1 rounded-lg">QR Code</button>
        </div>
      )}

      {(orderSuccess || reservationSuccess) && (
        <div className="fixed top-24 inset-x-6 z-[150] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4">
           <div className="flex items-center gap-3">
             <CheckCircle2 size={24} className="text-green-500" />
             <p className="text-xs font-black">{orderSuccess ? 'تم إرسال طلبك بنجاح!' : 'تم إرسال طلب الحجز بنجاح!'}</p>
           </div>
           <button onClick={() => {setOrderSuccess(false); setReservationSuccess(false)}}><X size={20}/></button>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="relative h-64 md:h-96 lg:h-[500px] w-full overflow-hidden">
        <img src={restaurant.coverImage} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 inset-x-0 p-6 md:p-12">
          <div className="flex items-center gap-4 md:gap-8 max-w-7xl mx-auto">
            <div className="relative">
              <img src={restaurant.logo} className="w-20 h-20 md:w-40 md:h-40 rounded-[1.8rem] md:rounded-[2.5rem] border-4 border-white shadow-2xl bg-white object-cover" alt="Logo" />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-white text-2xl md:text-6xl font-black mb-1 md:mb-4 leading-tight drop-shadow-md">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-white/90 text-[10px] md:text-sm font-bold">
                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>4.9 تقييم</span>
                </div>
                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <MapPin size={14} />
                  <span className="truncate max-w-[120px]">{restaurant.address.split('-')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mt-8 max-w-7xl mx-auto">
        <div className="flex gap-3 md:max-w-md">
           <button 
             onClick={() => setIsReservationOpen(true)}
             className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-xs md:text-sm font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
           >
             <CalendarCheck size={18} style={{ color: restaurant.themeColor }} />
             حجز طاولة
           </button>
           <button 
             onClick={() => setIsInquiryOpen(true)}
             className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl text-xs md:text-sm font-black shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
           >
             <SearchCheck size={18} />
             استعلام عن حجز
           </button>
        </div>
      </div>

      {/* Categories slider */}
      <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50 mt-10">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto py-4 px-6 no-scrollbar">
           <button 
             onClick={() => setActiveCategory(0)}
             className={`px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeCategory === 0 ? 'text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
             style={activeCategory === 0 ? { backgroundColor: restaurant.themeColor } : {}}
           >الكل</button>
           {MOCK_CATEGORIES.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.id)}
               className={`px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeCategory === cat.id ? 'text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
               style={activeCategory === cat.id ? { backgroundColor: restaurant.themeColor } : {}}
             >{cat.name}</button>
           ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative mb-8 group max-w-2xl mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="ابحث عن صنفك المفضل..." 
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pr-12 pl-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {filteredDishes.map(dish => (
            <div 
              key={dish.id} 
              onClick={() => setSelectedDish(dish)}
              className="bg-white rounded-[2rem] p-3 md:p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex md:flex-col items-center gap-4 cursor-pointer active:scale-[0.98]"
            >
              <div className="w-24 h-24 md:w-full md:aspect-square rounded-[1.5rem] overflow-hidden flex-shrink-0 relative">
                 <img src={dish.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={dish.name} />
                 <div className="absolute top-2 left-2 bg-white/95 backdrop-blur text-[10px] font-black px-2 py-1 rounded-lg shadow-sm" style={{ color: restaurant.themeColor }}>
                   {dish.price} {restaurant.currency}
                 </div>
              </div>
              <div className="flex-1 md:w-full">
                <h3 className="text-sm md:text-lg font-black text-slate-800 mb-1 leading-tight">{dish.name}</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold mb-3 line-clamp-2 md:h-10 leading-relaxed">{dish.description}</p>
                <div className="flex justify-between items-center mt-auto">
                   <div className="flex items-center gap-1 text-[9px] text-slate-300 font-black">
                      <Clock size={12} /> {dish.preparationTime} دقيقة
                   </div>
                   {!isPreview && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(dish); }} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
                        style={{ backgroundColor: restaurant.themeColor }}
                      >
                        <Plus size={20} />
                      </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {!isPreview && cart.length > 0 && (
        <div className="fixed bottom-6 inset-x-6 z-50 flex flex-col gap-3 md:max-w-md md:left-1/2 md:-translate-x-1/2">
           <button 
             onClick={() => setIsCartOpen(true)}
             className="w-full text-white py-4 px-6 rounded-[1.8rem] font-black shadow-2xl flex justify-between items-center animate-in slide-in-from-bottom-8 duration-500"
             style={{ backgroundColor: restaurant.themeColor }}
           >
              <div className="flex items-center gap-3">
                 <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center text-xs">{cart.reduce((a, b) => a + b.quantity, 0)}</div>
                 <span className="text-sm">سلة الطلبات</span>
              </div>
              <span className="text-lg">{cartTotal} {restaurant.currency}</span>
           </button>
        </div>
      )}

      {/* Dish Detail Modal with Click Outside to Close (X Button Removed) */}
      {selectedDish && (
        <div 
          onClick={() => setSelectedDish(null)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[250] flex items-end md:items-center justify-center p-0 md:p-6"
        >
           <div 
             onClick={(e) => e.stopPropagation()}
             className="bg-white w-full md:max-w-xl rounded-t-[3rem] md:rounded-[3rem] overflow-hidden animate-in slide-in-from-bottom duration-300 relative"
           >
              {/* Cover Image */}
              <div className="relative h-72 md:h-80 w-full">
                 <img src={selectedDish.image} className="w-full h-full object-cover" alt={selectedDish.name} />
                 {/* X Button has been removed for a cleaner look and reliance on click outside */}
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="px-8 pb-10 -mt-8 relative z-10">
                 <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedDish.name}</h2>
                    <div className="text-2xl font-black bg-slate-50 px-4 py-2 rounded-2xl" style={{ color: restaurant.themeColor }}>
                       {selectedDish.price} <span className="text-[10px] uppercase">{restaurant.currency}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
                       <Clock size={14} className="text-slate-300" />
                       {selectedDish.preparationTime} دقيقة
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
                       <Info size={14} className="text-slate-300" />
                       {MOCK_CATEGORIES.find(c => c.id === selectedDish.categoryId)?.name}
                    </div>
                 </div>

                 <p className="text-slate-500 font-bold leading-relaxed mb-10 text-sm md:text-base">
                    {selectedDish.description}
                 </p>

                 {!isPreview && (
                   <button 
                     onClick={() => { addToCart(selectedDish); setSelectedDish(null); }}
                     className="w-full text-white py-5 rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                     style={{ backgroundColor: restaurant.themeColor }}
                   >
                     <ShoppingCart size={22} />
                     إضافة للسلة
                   </button>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[200] flex items-end justify-center">
           <div className="bg-white w-full md:max-w-2xl rounded-t-[3rem] p-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6"></div>
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black text-slate-900">سلتك الحالية</h2>
                 <button onClick={() => setIsCartOpen(false)} className="bg-slate-50 p-2 rounded-xl text-slate-400"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar mb-8">
                 {cart.map(item => (
                    <div key={item.dishId} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <div className="flex-1">
                          <h4 className="font-black text-slate-800 text-sm mb-1">{item.dishName}</h4>
                          <p className="text-xs font-black" style={{ color: restaurant.themeColor }}>{item.price} {restaurant.currency}</p>
                       </div>
                       <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl">
                          <button onClick={() => updateQty(item.dishId, -1)} className="p-1 text-slate-300"><Minus size={16}/></button>
                          <span className="font-black text-sm w-4 text-center text-slate-700">{item.quantity}</span>
                          <button onClick={() => updateQty(item.dishId, 1)} className="p-1" style={{ color: restaurant.themeColor }}><Plus size={16}/></button>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="pt-6 border-t border-slate-100 mb-6">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-400 font-black">المجموع</span>
                    <span className="text-2xl font-black text-slate-900">{cartTotal} {restaurant.currency}</span>
                 </div>
                 <button onClick={placeOrder} className="w-full text-white py-5 rounded-2xl font-black text-lg shadow-xl" style={{ backgroundColor: restaurant.themeColor }}>تأكيد الطلب</button>
              </div>
           </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isReservationOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[200] flex items-end justify-center">
           <div className="bg-white w-full md:max-w-xl rounded-t-[3rem] md:rounded-[3rem] p-8 max-h-[95vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 md:hidden"></div>
              
              <div className="flex justify-between items-center mb-8">
                 <div>
                   <h2 className="text-2xl font-black text-slate-900">احجز طاولتك الآن</h2>
                   <p className="text-xs text-slate-400 font-bold">يرجى تأكيد البيانات التالية لإتمام الحجز</p>
                 </div>
                 <button onClick={() => setIsReservationOpen(false)} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                   <X size={24}/>
                 </button>
              </div>
              
              <form onSubmit={handleReservationSubmit} className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-6">
                 {/* Name Field */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">الاسم الكريم</label>
                    <div className="relative group">
                       <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                       <input 
                         type="text" 
                         required
                         value={reservationData.name}
                         onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-6 font-bold text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-700 placeholder:text-slate-300" 
                       />
                    </div>
                 </div>

                 {/* Phone Field */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">رقم الجوال</label>
                    <div className="relative group">
                       <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                       <input 
                         type="tel" 
                         required
                         value={reservationData.phone}
                         onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-6 font-bold text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-700 placeholder:text-slate-300" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {/* Guests Select */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">عدد الضيوف</label>
                       <div className="relative group">
                          <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <select 
                            value={reservationData.guests}
                            onChange={(e) => setReservationData({...reservationData, guests: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-4 font-bold text-sm outline-none focus:ring-2 focus:ring-slate-900 appearance-none transition-all text-slate-700"
                          >
                             <option>2 ضيوف</option>
                             <option>4 ضيوف</option>
                             <option>6 ضيوف</option>
                             <option>8 ضيوف</option>
                             <option>مناسبة خاصة (10+)</option>
                          </select>
                       </div>
                    </div>
                    {/* Date Field */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">التاريخ</label>
                       <div className="relative group">
                          <input 
                            type="date" 
                            required
                            value={reservationData.date}
                            onChange={(e) => setReservationData({...reservationData, date: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-700" 
                          />
                       </div>
                    </div>
                 </div>

                 {/* Time Field */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">توقيت الحضور</label>
                    <div className="relative group">
                       <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="time" 
                         required
                         value={reservationData.time}
                         onChange={(e) => setReservationData({...reservationData, time: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-6 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700" 
                       />
                    </div>
                 </div>

                 {/* Info Section */}
                 <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 items-start">
                    <CheckCircle2 size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-blue-800 leading-relaxed">
                      سيتم مراجعة طلب حجزك وتأكيده خلال أقل من 15 دقيقة. ستصلك رسالة تأكيد على رقم الجوال المدخل.
                    </p>
                 </div>

                 <button 
                   type="submit"
                   className="w-full text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all mt-4"
                   style={{ backgroundColor: restaurant.themeColor }}
                 >
                   إرسال طلب الحجز
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default CustomerMenuView;
