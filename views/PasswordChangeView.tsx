
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';

const PasswordChangeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        onBack();
    }, 3000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 shadow-sm">
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">تغيير كلمة المرور</h1>
          <p className="text-gray-500 font-bold">حافظ على أمان حساب مطعمك</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
        {success && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-300">
             <div className="bg-green-100 text-green-600 p-6 rounded-full mb-6 animate-bounce"><CheckCircle2 size={48} /></div>
             <h3 className="text-2xl font-black text-gray-800 mb-2">تم تحديث كلمة المرور!</h3>
             <p className="text-gray-500 font-bold">تم تأمين حسابك بنجاح بكلمة المرور الجديدة.</p>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-8">
           <div className="p-6 bg-blue-50 rounded-[32px] flex items-center gap-4 mb-4">
              <div className="bg-white p-3 rounded-2xl text-blue-600 shadow-sm"><Shield size={24}/></div>
              <p className="text-blue-800 font-bold text-sm leading-relaxed">تأكد من اختيار كلمة مرور قوية تحتوي على أحرف وأرقام ورموز لضمان أقصى درجات الحماية.</p>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">كلمة المرور الحالية</label>
                 <div className="relative">
                    <KeyRound className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input type={showPass ? "text" : "password"} className="w-full bg-gray-50 border-none rounded-2xl pr-14 pl-6 py-5 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" required />
                 </div>
              </div>

              <div className="h-[1px] bg-gray-50 w-full my-4"></div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">كلمة المرور الجديدة</label>
                 <div className="relative">
                    <input type={showPass ? "text" : "password"} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="أدخل كلمة المرور الجديدة" required />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                       {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">تأكيد كلمة المرور</label>
                 <input type={showPass ? "text" : "password"} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="أعد إدخال كلمة المرور" required />
              </div>
           </div>

           <div className="pt-6">
              <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">تحديث كلمة المرور</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeView;
