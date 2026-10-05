import React from 'react';
import {
  ArrowRight,
  Zap,
  Sparkles,
  ArrowLeft,
  Video,
  Search,
  Receipt,
  TrendingUp,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface ToolsScreenProps {
  onBack: () => void;
  onOpenAutomationBuilder: () => void;
}

export const ToolsScreen: React.FC<ToolsScreenProps> = ({
  onBack,
  onOpenAutomationBuilder,
}) => {
  return (
    <div
      className="flex-1 w-full h-full flex flex-col justify-between bg-[#FAF9FD] text-slate-800 select-none overflow-y-auto"
      dir="rtl"
    >
      {/* Top Header */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            title="بازگشت به چت"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-none">
              میز کار و ابزارهای بیزینو
            </h2>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              ابزارهای هوش مصنوعی ارتقای فروش
            </span>
          </div>
        </div>
      </div>

      {/* Tools Grid Body */}
      <div className="p-4 space-y-3 flex-1 text-right">
        {/* 1. FEATURED TOOL: AI AUTOMATION BUILDER (Bizino Flow Canvas) */}
        <div
          onClick={onOpenAutomationBuilder}
          className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-lg space-y-3 cursor-pointer hover:shadow-xl transition-all active:scale-98 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400 border border-white/10 shadow-xs">
              <Zap size={20} className="fill-emerald-400/20" />
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-xs">
              فعال و آماده طراحی
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-black text-white leading-tight flex items-center gap-1.5">
              <span>سازنده اتوماسیون (Bizino Flow)</span>
              <Sparkles size={13} className="text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              طراحی سناریوهای خودکار با تریگرها و اکشن‌ها روی یک کانواس روان و بهینه‌شده برای موبایل با پشتیبانی از زبان ساده و محاوره‌ای.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
            <span>ورود به محیط کانواس و طراحی سناریو</span>
            <ArrowLeft size={14} />
          </div>
        </div>

        {/* 2. Content Studio */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between text-right transition-all hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
              <Video size={17} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">
                استودیو سناریونویسی ریلز و استوری
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                تولید سناریوهای وایرال برای پیج‌های فروشگاهی
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono shrink-0">
            به‌زودی
          </span>
        </div>

        {/* 3. Competitor Spy */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between text-right transition-all hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Search size={17} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">
                تحلیلگر هوشمند پیج‌های رقبا
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                استخراج پرفروش‌ترین محصولات و نرخ تعامل رقبا
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono shrink-0">
            به‌زودی
          </span>
        </div>

        {/* 4. Smart Direct Invoice */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between text-right transition-all hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Receipt size={17} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">
                فاکتورساز خودکار دایرکت
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                صدور فاکتور رسمی با بارکد و شناسه پرداخت
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono shrink-0">
            به‌زودی
          </span>
        </div>

        {/* 5. Dynamic Margin & Pricing */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between text-right transition-all hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
              <TrendingUp size={17} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">
                محاسبه‌گر حاشیه سود و قیمت‌گذاری
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                محاسبه قیمت تمام‌شده کالاهای دست‌دوز کارگاه
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono shrink-0">
            به‌زودی
          </span>
        </div>
      </div>
    </div>
  );
};
