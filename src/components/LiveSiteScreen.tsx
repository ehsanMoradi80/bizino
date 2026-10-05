import React, { useState } from 'react';
import {
  ArrowRight,
  Lock,
  Copy,
  Check,
  Globe,
  Edit3,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Send,
  ArrowUpRight,
} from 'lucide-react';
import { ProductItem } from '../types';

interface LiveSiteScreenProps {
  onBack: () => void;
  onSendEditCommand: (command: string) => void;
}

const initialProducts: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'کیف دوشی دست‌دوز چرم عسلی آریا',
    category: 'کیف زنانه',
    price: 3450000,
    stock: 6,
    badge: 'پرفروش‌ترین ماه',
    colorName: 'چرم عسلی طبیعی',
    colorHex: '#B45309',
    description: 'دوخت دوسوزنه دستی با نخ موم‌زده ایتالیایی و یراق برنجی ضدزنگ',
  },
  {
    id: 'prod-2',
    name: 'کیف پول کتی تمام چرم گاوی کلاسیک',
    category: 'کیف پول',
    price: 1280000,
    stock: 14,
    colorName: 'قهوه‌ای تیره فلوتر',
    colorHex: '#78350F',
    description: 'دارای ۸ جای کارت، جای اسکناس جادار و محفظه زیپ‌دار سکه',
  },
  {
    id: 'prod-3',
    name: 'کمربند مردانه چرم گاوی با سگک برنجی مات',
    category: 'اکسسوری',
    price: 890000,
    stock: 9,
    badge: 'تخفیف ست',
    colorName: 'کنیاک عسلی',
    colorHex: '#D97706',
    description: 'چرم یک‌تکه گاوی دباغی گیاهی (وجیتال) بدون لایه‌سازی شیمیایی',
  },
  {
    id: 'prod-4',
    name: 'ست هدیه جاکارتی مینیمال و جاسوئیچی چرم',
    category: 'اکسسوری',
    price: 420000,
    stock: 22,
    colorName: 'مشکی کلاسیک',
    colorHex: '#1E293B',
    description: 'بسته‌بندی چوبی کارگاهی لوکس مناسب هدایای نفیس سازمانی و شخصی',
  },
];

const heroAiSuggestions = [
  'چرم اصیل دست‌دوز، تبلور وقار و ماندگاری در استایل شما',
  'اصالت لمس‌پذیر چرم طبیعی، با گارانتی مادام‌العمر دوخت دستی',
  'کلکسیون پاییزه چرم آریا؛ ترکیب هنر سنتی و طراحی مینیمال مدرن',
  'فروش ویژه: ۱۰٪ تخفیف اولین سفارش + ارسال رایگان به سراسر کشور',
];

export const LiveSiteScreen: React.FC<LiveSiteScreenProps> = ({
  onBack,
  onSendEditCommand,
}) => {
  const [heroTitle, setHeroTitle] = useState(heroAiSuggestions[0]);
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [aiSuggestionIndex, setAiSuggestionIndex] = useState(0);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [isCopied, setIsCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [directPrompt, setDirectPrompt] = useState('');
  const [orderedItems, setOrderedItems] = useState<{ [key: string]: boolean }>({});

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText('https://myshop.bizino.app');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 3000);
  };

  const handleAiRewriteHero = () => {
    const nextIdx = (aiSuggestionIndex + 1) % heroAiSuggestions.length;
    setAiSuggestionIndex(nextIdx);
    setHeroTitle(heroAiSuggestions[nextIdx]);
  };

  const handleOrder = (id: string) => {
    setOrderedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setOrderedItems((prev) => ({ ...prev, [id]: false }));
    }, 2500);
  };

  const handleSendDirectPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPrompt.trim()) return;

    onSendEditCommand(directPrompt.trim());

    const lower = directPrompt.toLowerCase();
    if (lower.includes('تخفیف') || lower.includes('ارزان') || lower.includes('قیمت')) {
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          price: Math.round(p.price * 0.85),
          badge: 'تخفیف ویژه ۱۵٪',
        }))
      );
    } else if (lower.includes('موجودی') || lower.includes('انبار')) {
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          stock: p.stock + 10,
        }))
      );
    }
    setDirectPrompt('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9FD] text-slate-800 select-none overflow-hidden" dir="rtl">
      {/* Top Mobile App Bar */}
      <div className="px-4 py-3 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
            title="بازگشت به چت"
          >
            <ArrowRight size={16} />
          </button>

          {/* URL Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
            <Lock size={11} className="text-emerald-600" />
            <span className="font-mono text-[11px] text-slate-700">myshop.bizino.app</span>
            <button
              onClick={handleCopyUrl}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors mr-0.5"
              title="کپی لینک"
            >
              {isCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
            </button>
          </div>
        </div>

        <button
          onClick={handlePublish}
          disabled={isPublished}
          className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1 transition-all shadow-xs ${
            isPublished
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
          }`}
        >
          {isPublished ? (
            <>
              <CheckCircle2 size={12} />
              <span>منتشر شد!</span>
            </>
          ) : (
            <>
              <Globe size={12} />
              <span>انتشار</span>
            </>
          )}
        </button>
      </div>

      {/* Scrollable Storefront Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Storefront Nav */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-xs">
              چ
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">کارگاه چرم آریا</span>
              <span className="text-[10px] text-slate-400">دست‌سازه‌های چرم طبیعی اصیل</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-bold font-mono">
            <ShoppingBag size={12} />
            <span>۲</span>
          </div>
        </div>

        {/* Hero Banner with Edit Options */}
        <div className="relative p-5 bg-gradient-to-l from-amber-50 via-white to-indigo-50/40 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
              <ShieldCheck size={12} />
              گارانتی ۲۴ ماهه چرم صد درصد طبیعی
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditingHero(!isEditingHero)}
                className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
                title="ویرایش متن"
              >
                <Edit3 size={12} className="text-indigo-600" />
              </button>
              <button
                onClick={handleAiRewriteHero}
                className="p-1 rounded-md bg-indigo-600 text-white shadow-xs"
                title="بازنویسی هوش مصنوعی"
              >
                <Sparkles size={12} />
              </button>
            </div>
          </div>

          {isEditingHero ? (
            <div className="space-y-2">
              <textarea
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-white border border-indigo-400 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
                rows={2}
              />
              <button
                onClick={() => setIsEditingHero(false)}
                className="px-2.5 py-1 bg-indigo-600 text-white text-[11px] font-bold rounded-lg"
              >
                ذخیره متن
              </button>
            </div>
          ) : (
            <h1 className="text-base font-extrabold text-slate-900 leading-snug">
              {heroTitle}
            </h1>
          )}

          <p className="text-[11px] text-slate-500 leading-relaxed">
            طراحی اختصاصی با چرم دباغی گیاهی، فاقد هرگونه مواد شیمیایی سمی، با جعبه هدیه کارگاهی
          </p>

          <button className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs">
            <span>مشاهده و سفارش کلکسیون</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Products Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">کالاهای استخراج‌شده از اینستاگرام</h3>
            <span className="text-[10px] text-indigo-600 font-mono">۴ از ۲۴ محصول</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {products.map((product) => {
              const isOrdered = orderedItems[product.id];
              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-xl shadow-xs flex items-center justify-center shrink-0"
                      style={{ backgroundColor: product.colorHex }}
                    >
                      <ShoppingBag size={22} className="text-white" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{product.name}</span>
                        {product.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-medium">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">{product.colorName}</span>
                      <span className="text-xs font-bold font-mono text-emerald-700 block tabular-nums">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOrder(product.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isOrdered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                    }`}
                  >
                    {isOrdered ? 'ثبت شد' : 'خرید'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Back Office Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
            <TrendingUp size={14} className="text-indigo-600" />
            <div className="text-[10px]">
              <span className="font-bold text-slate-800 block">Matomo Analytics</span>
              <span className="text-slate-400">۲۸۴ بازدید امروز</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
            <Activity size={14} className="text-emerald-600" />
            <div className="text-[10px]">
              <span className="font-bold text-slate-800 block">پشتیبانی برخط</span>
              <span className="text-emerald-600 font-medium">هوش مصنوعی فعال</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct AI Command Bar at Bottom */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0">
        <form onSubmit={handleSendDirectPrompt} className="flex items-center gap-2">
          <input
            type="text"
            value={directPrompt}
            onChange={(e) => setDirectPrompt(e.target.value)}
            placeholder="دستور ویرایش سایت (مثال: تخفیف ۲۰٪ اعمال کن)..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!directPrompt.trim()}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-full text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
          >
            <Send size={13} className="rotate-180" />
            <span>اعمال</span>
          </button>
        </form>
      </div>
    </div>
  );
};
