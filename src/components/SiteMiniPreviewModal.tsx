import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Lock,
  ShoppingBag,
  Sparkles,
  Store,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface SiteMiniPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullSite: () => void;
}

export const SiteMiniPreviewModal: React.FC<SiteMiniPreviewModalProps> = ({
  isOpen,
  onClose,
  onOpenFullSite,
}) => {
  const [activeSection, setActiveSection] = useState<'shop' | 'featured' | 'story' | 'checkout'>('shop');
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleCloseWithSlideDown = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 220);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none"
      dir="rtl"
      onClick={handleCloseWithSlideDown}
    >
      <div
        className={`w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col text-slate-800 ${
          isClosing ? 'animate-slide-out-down' : 'animate-slide-in-up'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser Top Bar */}
        <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-1 max-w-[210px] bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs text-[11px] text-slate-600 font-mono">
            <Lock size={11} className="text-emerald-500 shrink-0" />
            <span className="truncate">https://charm-aria.ir</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenFullSite}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
              title="مشاهده نسخه کامل وبسایت"
            >
              <ArrowUpRight size={14} />
            </button>
            <button
              type="button"
              onClick={handleCloseWithSlideDown}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
              title="بستن پیش‌نمایش"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Lucide Navigation Bar for Fast Section Switching */}
        <div className="bg-slate-50 px-2 py-1.5 border-b border-slate-200 flex items-center justify-around text-slate-600">
          <button
            type="button"
            onClick={() => setActiveSection('shop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'shop'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <ShoppingBag size={13} />
            <span>محصولات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('featured')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'featured'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <Sparkles size={13} />
            <span>پرفروش</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('story')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'story'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <Store size={13} />
            <span>کارگاه</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('checkout')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'checkout'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <CreditCard size={13} />
            <span>پرداخت</span>
          </button>
        </div>

        {/* Dynamic Mini-Preview Content */}
        <div className="p-3.5 max-h-[340px] overflow-y-auto space-y-3 text-right">
          {activeSection === 'shop' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">
                  کاتالوگ محصولات کارگاه چرم آریا
                </span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  موجودی به‌روز
                </span>
              </div>

              {/* Product 1 */}
              <div className="flex items-center gap-2.5 p-2 rounded-2xl border border-slate-100 bg-slate-50/70">
                <img
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=120&auto=format&fit=crop&q=80"
                  alt="کیف دوشی"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-xs font-black text-slate-900">
                    کیف دوشی دست‌دوز چرم طبیعی
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    ۱,۸۵۰,۰۰۰ تومان
                  </p>
                  <span className="text-[9px] text-emerald-600 font-bold block">
                    ضمانت اصالت ۲۴ ماهه
                  </span>
                </div>
              </div>

              {/* Product 2 */}
              <div className="flex items-center gap-2.5 p-2 rounded-2xl border border-slate-100 bg-slate-50/70">
                <img
                  src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=120&auto=format&fit=crop&q=80"
                  alt="کیف پول"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-xs font-black text-slate-900">
                    کیف پول جیبی چرم اشبالت
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    ۵۹۰,۰۰۰ تومان
                  </p>
                  <span className="text-[9px] text-indigo-600 font-bold block">
                    ارسال رایگان تهران
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'featured' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black">
                  <Tag size={13} />
                  <span>تخفیف ویژه سفارش اول پیج</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  ۱۰٪ تخفیف اختصاصی برای خریداران دایرکت اینستاگرام با کد <span className="font-mono font-bold">ARIA10</span>
                </p>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-2xl border border-slate-100 bg-slate-50/70">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&auto=format&fit=crop&q=80"
                  alt="ست هدیه"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-xs font-black text-slate-900">
                    پک VIP کیف و کمربند مردانه
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    ۲,۴۸۰,۰۰۰ تومان
                  </p>
                  <span className="text-[9px] text-emerald-600 font-bold block">
                    پرفروش‌ترین کادوی ماه
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'story' && (
            <div className="space-y-2 text-right">
              <h4 className="text-xs font-black text-slate-900">
                درباره کارگاه چرم آریا
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                کارگاه چرم آریا از سال ۱۳۹۶ با تکیه بر دست‌دوزهای چرم طبیعی تبریز آغاز به کار کرد. تمام برش‌ها و دوخت‌ها با نخ موم‌زده دست‌ساز و یراق‌آلات وارداتی برنجی ضدزنگ تولید می‌شوند.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                <CheckCircle2 size={12} />
                <span>گارانتی بازگشت وجه تا ۷ روز پس از تحویل</span>
              </div>
            </div>
          )}

          {activeSection === 'checkout' && (
            <div className="space-y-2 text-right">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>درگاه پرداخت زرین‌پال و بانک ملت</span>
                  <CheckCircle2 size={13} className="text-emerald-600" />
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  اتصال به سامانه پرداخت شاپرک با تاییدیه خودکار پیامک و صدور فاکتور در دایرکت مشتری.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between font-mono">
                <span className="text-slate-500 text-[11px]">شماره کارت کارگاه:</span>
                <span className="font-bold text-slate-800">۶۰۳۷-۹۹۷۵-****-۲۸۴۱</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenFullSite}
            className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
          >
            <span>مشاهده وبسایت در نمای تمام‌صفحه</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
