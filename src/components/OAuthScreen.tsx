import React, { useState } from 'react';
import {
  Lock,
  X,
  CheckCircle2,
  ShieldCheck,
  Radio,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { PlatformType, ConnectedChannel } from '../types';
import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
  YouTubeIcon,
  LinkedInIcon,
  FacebookIcon,
  TikTokIcon,
  EitaaIcon,
  BaleIcon,
  RubikaIcon,
} from './SocialIcons';

interface AccountOption {
  id: string;
  handle: string;
  name: string;
  followers: string;
}

interface OAuthScreenProps {
  platform: PlatformType;
  alreadyConnectedHandles?: string[];
  onSuccess: (channel: ConnectedChannel) => void;
  onCancel: () => void;
}

const platformMeta: Record<
  PlatformType,
  {
    name: string;
    url: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accounts: AccountOption[];
    permissions: string[];
  }
> = {
  instagram: {
    name: 'اینستاگرام',
    url: 'api.instagram.com/oauth/authorize',
    icon: InstagramIcon,
    accounts: [
      {
        id: 'ig-1',
        handle: '@charm_aria_tehran',
        name: 'کارگاه چرم آریا (پیج اصلی)',
        followers: '۱۸.۴K',
      },
      {
        id: 'ig-2',
        handle: '@charm_aria_wholesale',
        name: 'فروش عمده چرم آریا',
        followers: '۵.۲K',
      },
      {
        id: 'ig-3',
        handle: '@aria_leather_studio',
        name: 'استودیو طراحی اختصاصی چرم',
        followers: '۲.۹K',
      },
    ],
    permissions: [
      'خواندن دایرکت‌ها و پاسخگویی خودکار',
      'دسترسی به کاتالوگ و مدیاهای پیج',
      'مشاهده آمار تعامل و رشد مخاطب',
    ],
  },
  telegram: {
    name: 'تلگرام',
    url: 'oauth.telegram.org/auth',
    icon: TelegramIcon,
    accounts: [
      {
        id: 'tg-1',
        handle: '@charm_aria_shop',
        name: 'کانال رسمی فروشگاه',
        followers: '۳.۲K',
      },
      {
        id: 'tg-2',
        handle: '@charm_aria_vip',
        name: 'باشگاه مشتریان VIP',
        followers: '۱.۱K',
      },
    ],
    permissions: ['ارسال پست و سفارش در کانال', 'پاسخگویی به پیام‌های ورودی'],
  },
  whatsapp: {
    name: 'واتساپ بیزینس',
    url: 'business.facebook.com/whatsapp/oauth',
    icon: WhatsAppIcon,
    accounts: [
      {
        id: 'wa-1',
        handle: '+989123456789',
        name: 'پشتیبانی فروش چرم آریا',
        followers: 'مستقیم',
      },
      {
        id: 'wa-2',
        handle: '+989129876543',
        name: 'واحد پیگیری ارسال سفارش‌ها',
        followers: 'مستقیم',
      },
    ],
    permissions: ['همگام‌سازی کاتالوگ فروشگاه', 'پاسخگویی سریع به پیام‌ها'],
  },
  eitaa: {
    name: 'ایتا',
    url: 'oauth.eitaa.com/authorize',
    icon: EitaaIcon,
    accounts: [
      {
        id: 'eitaa-1',
        handle: '@charm_aria',
        name: 'کانال رسمی چرم آریا',
        followers: '۱.۴K',
      },
      {
        id: 'eitaa-2',
        handle: '@charm_aria_off',
        name: 'حراجی‌های هفتگی چرم',
        followers: '۹۲۰',
      },
    ],
    permissions: ['انتشار کاتالوگ در کانال', 'دریافت سفارشات'],
  },
  bale: {
    name: 'بله',
    url: 'api.bale.ai/oauth',
    icon: BaleIcon,
    accounts: [
      {
        id: 'bale-1',
        handle: '@charm_aria_bale',
        name: 'فروشگاه چرم دست‌ساز',
        followers: '۸۵۰',
      },
      {
        id: 'bale-2',
        handle: '@charm_aria_pay',
        name: 'درگاه پرداخت مستقیم بله',
        followers: '۴۲۰',
      },
    ],
    permissions: ['اتصال درگاه و ثبت سفارش', 'پیگیری سبد خرید مشتری'],
  },
  rubika: {
    name: 'روبیکا',
    url: 'rubika.ir/oauth/login',
    icon: RubikaIcon,
    accounts: [
      {
        id: 'rub-1',
        handle: '@charm_aria_rubika',
        name: 'کانال رسمی روبیکا',
        followers: '۲.۱K',
      },
      {
        id: 'rub-2',
        handle: '@aria_rubino',
        name: 'صفحه روبینو کارگاه چرم',
        followers: '۳.۴K',
      },
    ],
    permissions: ['مدیریت کانال و روبینو', 'پاسخگویی به خریداران'],
  },
  youtube: {
    name: 'یوتیوب',
    url: 'accounts.google.com/o/oauth2/v2/auth',
    icon: YouTubeIcon,
    accounts: [
      {
        id: 'yt-1',
        handle: '@CharmAriaOfficial',
        name: 'کانال اصلی آموزش و ساخت چرم',
        followers: '۹۴۰',
      },
      {
        id: 'yt-2',
        handle: '@CharmAriaShorts',
        name: 'شورت‌های ویدیویی کارگاه',
        followers: '۱.۸K',
      },
    ],
    permissions: ['مشاهده آمار بازدید ویدیوها', 'ارسال ویدیوی کاتالوگ'],
  },
  tiktok: {
    name: 'تیک‌تاک',
    url: 'open.tiktokapis.com/v2/oauth/authorize',
    icon: TikTokIcon,
    accounts: [
      {
        id: 'tt-1',
        handle: '@charm_aria_tiktok',
        name: 'Aria Leather Craft',
        followers: '۵.۲K',
      },
    ],
    permissions: ['مشاهده آمار تعامل', 'پاسخ به کامنت‌های مشتریان'],
  },
  linkedin: {
    name: 'لینکدین',
    url: 'www.linkedin.com/oauth/v2/authorization',
    icon: LinkedInIcon,
    accounts: [
      {
        id: 'li-1',
        handle: 'company/charm-aria',
        name: 'کارگاه صنعتی چرم آریا',
        followers: '۶۲۰',
      },
    ],
    permissions: ['مدیریت صفحه سازمانی', 'مکاتبات تجاری B2B'],
  },
  facebook: {
    name: 'فیسبوک',
    url: 'www.facebook.com/v19.0/dialog/oauth',
    icon: FacebookIcon,
    accounts: [
      {
        id: 'fb-1',
        handle: 'charm.aria.official',
        name: 'صفحه فروشگاه چرم آریا',
        followers: '۴۳۰',
      },
    ],
    permissions: ['مدیریت صفحه و اینباکس', 'همگام‌سازی Meta Commerce'],
  },
};

export const OAuthScreen: React.FC<OAuthScreenProps> = ({
  platform,
  alreadyConnectedHandles = [],
  onSuccess,
  onCancel,
}) => {
  const data = platformMeta[platform];
  const IconComp = data.icon;

  // Account selection state
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    data.accounts[0]?.id || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedAccount =
    data.accounts.find((a) => a.id === selectedAccountId) || data.accounts[0];

  const handleAuthorize = () => {
    if (!selectedAccount) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        id: `ch-${platform}-${Date.now()}`,
        platform,
        name: selectedAccount.name,
        handle: selectedAccount.handle,
        followers: selectedAccount.followers,
        isActive: true,
      });
    }, 850);
  };

  return (
    <div
      className="flex-1 w-full h-full flex flex-col justify-between bg-[#FAF9FD] select-none"
      dir="rtl"
    >
      {/* In-App Browser Address Bar */}
      <div className="px-3 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 shrink-0">
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
          title="انصراف"
        >
          <X size={16} />
        </button>

        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-600 max-w-[200px] truncate"
          dir="ltr"
        >
          <Lock size={10} className="text-emerald-600 shrink-0" />
          <span className="truncate">{data.url}</span>
        </div>

        <span className="text-[10px] text-slate-400 font-bold">OAuth 2.0</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center text-center space-y-3">
        {/* Brand App Icon */}
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center relative mt-1 shrink-0">
          <IconComp size={26} />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
            <ShieldCheck size={9} />
          </div>
        </div>

        <div className="space-y-0.5 shrink-0">
          <h2 className="text-sm font-black text-slate-900">
            اجازه‌نامه اتصال {data.name}
          </h2>
          <p className="text-[11px] text-slate-400">
            یک حساب کاربری را جهت اتصال و اعطای مجوز انتخاب کنید:
          </p>
        </div>

        {/* Multi-Account Selection Radio Cards */}
        <div className="w-full max-w-xs space-y-1.5 text-right">
          <span className="text-[10px] font-bold text-slate-400 block px-1">
            اکانت‌های شناسایی‌شده ({data.accounts.length}):
          </span>

          {data.accounts.map((acc) => {
            const isSelected = selectedAccountId === acc.id;
            const isAlreadyConnected = alreadyConnectedHandles.includes(acc.handle);

            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {acc.name[0]}
                  </div>

                  <div className="truncate text-right">
                    <span className="text-xs font-bold block leading-none truncate">
                      {acc.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono block mt-0.5 ${
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      }`}
                      dir="ltr"
                    >
                      {acc.handle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 mr-1">
                  {isAlreadyConnected && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      متصل
                    </span>
                  )}
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Permissions List */}
        <div className="w-full max-w-xs bg-white border border-slate-200/80 rounded-2xl p-2.5 text-right space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 block">
            مجوزهای درخواستی:
          </span>
          {data.permissions.map((perm, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
              <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[10px] leading-tight">{perm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Left Arrow in RTL */}
      <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
        >
          انصراف
        </button>

        <button
          onClick={handleAuthorize}
          disabled={isProcessing || !selectedAccount}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Radio size={13} className="animate-spin" />
              <span>در حال احراز هویت...</span>
            </>
          ) : (
            <>
              <span>تایید و اجازه دسترسی</span>
              <ArrowLeft size={13} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
