import React, { useState, useEffect } from 'react';
import {
  Lock,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Store,
  CreditCard,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
  Tag,
  ArrowUpRight,
  Code2,
} from 'lucide-react';

interface WebsiteInlineMiniPreviewCardProps {
  initialIsBuilding?: boolean;
  onOpenFullSite?: () => void;
}

export const WebsiteInlineMiniPreviewCard: React.FC<WebsiteInlineMiniPreviewCardProps> = ({
  initialIsBuilding = true,
  onOpenFullSite,
}) => {
  const [isBuilding, setIsBuilding] = useState(initialIsBuilding);
  const [buildProgress, setBuildProgress] = useState(initialIsBuilding ? 15 : 100);
  const [buildStepText, setBuildStepText] = useState('در حال فراخوانی ساختار کارگاه چرم آریا...');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'featured' | 'story' | 'checkout'>('shop');
  const [isAddingItem, setIsAddingItem] = useState<string | null>(null);

  // Simulated AI Compilation / Building Animation
  useEffect(() => {
    if (!isBuilding) return;

    const timer1 = setTimeout(() => {
      setBuildProgress(45);
      setBuildStepText('تولید کاتالوگ محصولات دست‌دوز و اتصال درگاه پرداخت...');
    }, 400);

    const timer2 = setTimeout(() => {
      setBuildProgress(85);
      setBuildStepText('اعمال پالت رنگی و بهینه‌سازی ریسپانسیو وبسایت...');
    }, 850);

    const timer3 = setTimeout(() => {
      setBuildProgress(100);
      setBuildStepText('ویترین آنلاین با موفقیت ساخته شد!');
      setTimeout(() => {
        setIsBuilding(false);
      }, 350);
    }, 1250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isBuilding]);

  // Handle re-compile / refresh
  const handleReload = () => {
    setIsBuilding(true);
    setBuildProgress(20);
    setBuildStepText('در حال بازسازی ویترین...');
  };

  const handleQuickAdd = (itemName: string) => {
    setIsAddingItem(itemName);
    setTimeout(() => {
      setIsAddingItem(null);
    }, 1500);
  };

  return (
    <div
      className="w-full my-2 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden text-right select-none animate-fade-in-up"
      dir="rtl"
    >
      {/* Mini-Browser Top Chrome Bar */}
      <div className="bg-slate-100/90 px-3 py-2 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1 max-w-[210px] bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs text-[10px] text-slate-600 font-mono">
          <Lock size={10} className="text-emerald-500 shrink-0" />
          <span className="truncate">https://charm-aria.ir</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <button
            type="button"
            onClick={handleReload}
            className={`p-1 rounded-full hover:bg-slate-200 transition-colors ${
              isBuilding ? 'animate-spin text-emerald-600' : ''
            }`}
            title="بازسازی و رفرش پیش‌نمایش"
          >
            <RefreshCw size={12} />
          </button>

          {onOpenFullSite && (
            <button
              type="button"
              onClick={onOpenFullSite}
              className="p-1 rounded-full hover:bg-slate-200 transition-colors"
              title="مشاهده در نمای تمام‌صفحه"
            >
              <ArrowUpRight size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full hover:bg-slate-200 transition-colors"
            title={isCollapsed ? 'باز کردن کارت' : 'جمع کردن کارت'}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Building / Loading State Animation */}
      {isBuilding ? (
        <div className="p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center animate-pulse">
              <Code2 size={16} />
            </div>
            <Sparkles size={16} className="text-indigo-600 animate-spin" />
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-900">
              در حال کامپایل و ساخت وبسایت چرم آریا
            </h4>
            <p className="text-[10px] text-slate-500 font-mono leading-tight">
              {buildStepText}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs mx-auto bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${buildProgress}%` }}
            />
          </div>

          <span className="text-[9px] font-mono text-slate-400 block font-bold">
            {buildProgress}٪ تکمیل شده
          </span>
        </div>
      ) : isCollapsed ? (
        /* Collapsed Header state */
        <div
          onClick={() => setIsCollapsed(false)}
          className="p-2.5 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">
              ویترین فروشگاه آنلاین فعال است (لمس جهت مشاهده)
            </span>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold">باز کردن کارت</span>
        </div>
      ) : (
        /* Rendered Interactive Inline Preview Card */
        <div className="p-3 space-y-3 bg-white">
          {/* Quick Lucide Navigation Bar */}
          <div className="flex items-center justify-between bg-slate-100/80 p-1 rounded-xl text-[11px] font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('shop')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg transition-all ${
                activeTab === 'shop'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <ShoppingBag size={12} />
              <span>محصولات</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg transition-all ${
                activeTab === 'featured'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Sparkles size={12} />
              <span>پرفروش</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg transition-all ${
                activeTab === 'story'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Store size={12} />
              <span>کارگاه</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checkout')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg transition-all ${
                activeTab === 'checkout'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <CreditCard size={12} />
              <span>پرداخت</span>
            </button>
          </div>

          {/* Interactive Content per Tab */}
          {activeTab === 'shop' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">
                  محصولات کارگاه چرم آریا
                </span>
                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  انبار متصل
                </span>
              </div>

              {/* Product 1 */}
              <div className="p-2 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&auto=format&fit=crop&q=80"
                    alt="کیف دوشی"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-[11px] font-black text-slate-900 leading-tight">
                      کیف دوشی چرم طبیعی عسلی
                    </h5>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      ۱,۸۵۰,۰۰۰ تومان
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickAdd('کیف دوشی')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg shrink-0 transition-all active:scale-95 shadow-2xs"
                >
                  {isAddingItem === 'کیف دوشی' ? 'ثبت شد ✓' : 'رزرو'}
                </button>
              </div>

              {/* Product 2 */}
              <div className="p-2 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&auto=format&fit=crop&q=80"
                    alt="کیف پول"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-[11px] font-black text-slate-900 leading-tight">
                      کیف پول کتی اشبالت
                    </h5>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      ۵۹۰,۰۰۰ تومان
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickAdd('کیف پول')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg shrink-0 transition-all active:scale-95 shadow-2xs"
                >
                  {isAddingItem === 'کیف پول' ? 'ثبت شد ✓' : 'رزرو'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'featured' && (
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-right space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-black">
                  <Tag size={12} />
                  <span>تخفیف ویژه سفارش اول پیج</span>
                </div>
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  کد <span className="font-mono font-bold bg-white/80 px-1 py-0.5 rounded border border-amber-300">ARIA10</span> برای اعضای دایرکت اینستاگرام با ۱۰٪ تخفیف و ارسال رایگان
                </p>
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-1.5 text-right text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block">کارگاه چرم آریا</span>
              <p>
                دوخت دست‌ساز با چرم طبیعی درجه یک تبریز، نخ‌های موم‌زده ایتالیایی و گارانتی ۲۴ ماهه تعویض یراق‌آلات.
              </p>
            </div>
          )}

          {activeTab === 'checkout' && (
            <div className="space-y-1.5 text-right">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>درگاه پرداخت متصل شاپرک</span>
                  <CheckCircle2 size={12} className="text-emerald-600" />
                </div>
                <p className="text-[10px] text-emerald-700">
                  ثبت فاکتور آنلاین و ارسال تاییدیه پیامکی به شماره همراه خریدار.
                </p>
              </div>
            </div>
          )}

          {/* Full-view button at the bottom of the card */}
          {onOpenFullSite && (
            <button
              type="button"
              onClick={onOpenFullSite}
              className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <span>مشاهده کامل وبسایت در میز کار</span>
              <ExternalLink size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
