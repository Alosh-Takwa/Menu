
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, Clock, QrCode, X, Plus, Minus, Trash2, CalendarCheck, Users, Phone, User, SearchCheck, Utensils, MapPin, CheckCircle2, ChevronLeft, Calendar, Info, ArrowRight } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_RESTAURANT } from '../constants';
import { db } from '../services/db';
import { Dish, OrderItem, Restaurant, Category } from '../types';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant>(MOCK_RESTAURANT);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [submittingReservation, setSubmittingReservation] = useState(false);

  const [reservationData, setReservationData] = useState({
    name: '',
    phone: '',
    guests: 2,
    date: new Date().toISOString().split('T')[0],
    time: '20:00'
  });

  useEffect(() => {
    const loadData = async () => {
      const currentRes = db.getCurrentRestaurant();
      const resId = currentRes ? currentRes.id : 1;
      
      const [fetchedRestaurant, fetchedDishes, fetchedCategories] = await Promise.all([
        currentRes ? Promise.resolve(currentRes) : db.getAllRestaurants().then(all => all[0] || MOCK_RESTAURANT),
        db.getDishes(resId),
        db.getCategories(resId)
      ]);

      setRestaurant(fetchedRestaurant);
      setDishes(fetchedDishes);
      setCategories(fetchedCategories.length > 0 ? fetchedCategories : MOCK_CATEGORIES);
      
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

  const placeOrder = async () => {
    if (cart.length === 0) return;
    await db.createOrder({
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

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReservation(true);
    
    try {
      await db.createReservation({
        restaurantId: restaurant.id,
        customerName: reservationData.name,
        customerPhone: reservationData.phone,
        guests: reservationData.guests,
        date: reservationData.date,
        time: reservationData.time,
        status: 'pending'
      });
      
      setIsReservationOpen(false);
      setReservationSuccess(true);
      setReservationData({ name: '', phone: '', guests: 2, date: new Date().toISOString().split('T')[0], time: '20:00' });
      setTimeout(() => setReservationSuccess(false), 4000);
    } catch (error) {
      console.error("Reservation Error:", error);
    } finally {
      setSubmittingReservation(false);
    }
  };

  const fallbackCover = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200';
  const fallbackDish = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';

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
        <img 
          src={restaurant.coverImage || fallbackCover} 
          onError={(e) => (e.currentTarget.src = fallbackCover)}
          className="w-full h-full object-cover" 
          alt="Cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 inset-x-0 p-6 md:p-12">
          <div className="flex items-center gap-4 md:gap-8 max-w-7xl mx-auto">
            <div className="relative">
              <img 
                src={restaurant.logo || fallbackDish} 
                onError={(e) => (e.currentTarget.src = fallbackDish)}
                className="w-20 h-20 md:w-40 md:h-40 rounded-[1.8rem] md:rounded-[2.5rem] border-4 border-white shadow-2xl bg-white object-cover" 
                alt="Logo" 
              />
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
           {categories.map(cat => (
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
              className="bg-white rounded-[2.5rem] p-3 md:p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex md:flex-col items-center gap-4 cursor-pointer active:scale-[0.98]"
            >
              <div className="w-24 h-24 md:w-full md:aspect-square rounded-[2rem] overflow-hidden flex-shrink-0 relative">
                 <img 
                    src={dish.image || fallbackDish} 
                    onError={(e) => (e.currentTarget.src = fallbackDish)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={dish.name} 
                 />
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

      {/* Reservation Modal */}
      {isReservationOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[200] flex items-end md:items-center justify-center p-0 md:p-6">
           <div className="bg-white w-full md:max-w-md rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 animate-in slide-in-from-bottom-10 duration-300">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black text-slate-900">حجز طاولة جديدة</h2>
                 <button onClick={() => setIsReservationOpen(false)} className="bg-slate-100 p-2 rounded-xl text-slate-400"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleReservationSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">الاسم بالكامل</label>
                    <div className="relative">
                       <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="text" 
                         required
                         className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                         value={reservationData.name}
                         onChange={e => setReservationData({...reservationData, name: e.target.value})}
                         placeholder="أدخل اسمك الكريم"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">رقم الهاتف</label>
                    <div className="relative">
                       <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="tel" 
                         required
                         className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                         value={reservationData.phone}
                         onChange={e => setReservationData({...reservationData, phone: e.target.value})}
                         placeholder="05xxxxxxxx"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">التاريخ</label>
                       <input 
                         type="date" 
                         required
                         className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10"
                         value={reservationData.date}
                         onChange={e => setReservationData({...reservationData, date: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">الوقت</label>
                       <input 
                         type="time" 
                         required
                         className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10"
                         value={reservationData.time}
                         onChange={e => setReservationData({...reservationData, time: e.target.value})}
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">عدد الأشخاص</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                       <button 
                         type="button"
                         onClick={() => setReservationData({...reservationData, guests: Math.max(1, reservationData.guests - 1)})}
                         className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400"
                       ><Minus size={18}/></button>
                       <span className="flex-1 text-center font-black text-slate-900">{reservationData.guests} ضيوف</span>
                       <button 
                         type="button"
                         onClick={() => setReservationData({...reservationData, guests: Math.min(20, reservationData.guests + 1)})}
                         className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"
                         style={{ color: restaurant.themeColor }}
                       ><Plus size={18}/></button>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={submittingReservation}
                   className="w-full text-white py-5 rounded-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
                   style={{ backgroundColor: restaurant.themeColor }}
                 >
                    {submittingReservation ? 'جاري الإرسال...' : 'تأكيد طلب الحجز'}
                 </button>
              </form>
           </div>
        </div>
      )}

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

      {/* Dish Detail Modal */}
      {selectedDish && (
        <div 
          onClick={() => setSelectedDish(null)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[250] flex items-end md:items-center justify-center p-0 md:p-6"
        >
           <div 
             onClick={(e) => e.stopPropagation()}
             className="bg-white w-full md:max-w-xl rounded-t-[3rem] md:rounded-[3rem] overflow-hidden animate-in slide-in-from-bottom duration-300 relative"
           >
              <div className="relative h-72 md:h-80 w-full">
                 <img 
                    src={selectedDish.image || fallbackDish} 
                    onError={(e) => (e.currentTarget.src = fallbackDish)}
                    className="w-full h-full object-cover" 
                    alt={selectedDish.name} 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>

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
                       {categories.find(c => c.id === selectedDish.categoryId)?.name}
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
    </div>
  );
};

export default CustomerMenuView;
