import React, { useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Globe,
  Layers,
} from 'lucide-react';
import { UserProfile, ConnectedChannel, PlatformType } from '../types';
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
import { OAuthScreen } from './OAuthScreen';
import { ConfirmDisconnectBottomSheet } from './ConfirmDisconnectBottomSheet';

interface OnboardingPageProps {
  onComplete: (profile: UserProfile, channels: ConnectedChannel[]) => void;
  onBack?: () => void;
}

const defaultAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
];

interface PlatformButton {
  type: PlatformType;
  name: string;
  category: 'global' | 'iranian';
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const platformButtons: PlatformButton[] = [
  { type: 'instagram', name: 'اینستاگرام', category: 'global', icon: InstagramIcon },
  { type: 'telegram', name: 'تلگرام', category: 'global', icon: TelegramIcon },
  { type: 'whatsapp', name: 'واتساپ', category: 'global', icon: WhatsAppIcon },
  { type: 'eitaa', name: 'ایتا', category: 'iranian', icon: EitaaIcon },
  { type: 'bale', name: 'بله', category: 'iranian', icon: BaleIcon },
  { type: 'rubika', name: 'روبیکا', category: 'iranian', icon: RubikaIcon },
  { type: 'youtube', name: 'یوتیوب', category: 'global', icon: YouTubeIcon },
  { type: 'tiktok', name: 'تیک‌تاک', category: 'global', icon: TikTokIcon },
  { type: 'linkedin', name: 'لینکدین', category: 'global', icon: LinkedInIcon },
  { type: 'facebook', name: 'فیسبوک', category: 'global', icon: FacebookIcon },
];

const iranianPlatforms: PlatformType[] = ['eitaa', 'bale', 'rubika'];
const globalPlatforms: PlatformType[] = [
  'instagram',
  'telegram',
  'whatsapp',
  'youtube',
  'tiktok',
  'linkedin',
  'facebook',
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onComplete,
  onBack,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('آریا تهرانی');
  const [phone, setPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [avatar, setAvatar] = useState(defaultAvatars[0]);

  // List of authorized channels
  const [connectedChannels, setConnectedChannels] = useState<ConnectedChannel[]>([
    {
      id: 'ch-ig-init',
      platform: 'instagram',
      name: 'کارگاه چرم آریا (پیج اصلی)',
      handle: '@charm_aria_tehran',
      followers: '۱۸.۴K',
      isActive: true,
    },
  ]);

  // Active OAuth session: when set, renders OAuthScreen directly as the active view (NOT an overlay!)
  const [activeOAuthPlatform, setActiveOAuthPlatform] = useState<PlatformType | null>(
    null
  );

  // Channel pending deletion for confirmation bottom sheet
  const [channelToDelete, setChannelToDelete] = useState<ConnectedChannel | null>(
    null
  );

  // Tabs for Connected Channels Categorization
  const [mainTab, setMainTab] = useState<'all' | 'global' | 'iranian'>('all');
  const [subTab, setSubTab] = useState<string>('all');

  const handleOAuthSuccess = (newChannel: ConnectedChannel) => {
    setConnectedChannels((prev) => {
      const exists = prev.some((c) => c.handle === newChannel.handle);
      if (exists) return prev;
      return [...prev, newChannel];
    });
    setActiveOAuthPlatform(null);
  };

  const handleConfirmDelete = () => {
    if (channelToDelete) {
      setConnectedChannels((prev) =>
        prev.filter((c) => c.id !== channelToDelete.id)
      );
      setChannelToDelete(null);
    }
  };

  const handleFinish = () => {
    onComplete({ name, phone, avatarUrl: avatar }, connectedChannels);
  };

  // If in OAuth flow, render OAuthScreen as a dedicated, standalone full screen (Zero overlay!)
  if (activeOAuthPlatform) {
    return (
      <OAuthScreen
        platform={activeOAuthPlatform}
        alreadyConnectedHandles={connectedChannels.map((c) => c.handle)}
        onSuccess={handleOAuthSuccess}
        onCancel={() => setActiveOAuthPlatform(null)}
      />
    );
  }

  // Sub-header platform items filtered by mainTab
  const availableSubPlatforms = platformButtons.filter((p) => {
    if (mainTab === 'global') return p.category === 'global';
    if (mainTab === 'iranian') return p.category === 'iranian';
    return true;
  });

  // Filtered connected channels by main tab and sub tab
  const filteredChannels = connectedChannels.filter((c) => {
    if (mainTab === 'global' && !globalPlatforms.includes(c.platform)) return false;
    if (mainTab === 'iranian' && !iranianPlatforms.includes(c.platform)) return false;
    if (subTab !== 'all' && c.platform !== subTab) return false;
    return true;
  });

  return (
    <div
      className="flex-1 w-full h-full flex flex-col justify-between p-4 md:p-5 text-right select-none overflow-y-auto"
      dir="rtl"
    >
      {/* Confirmation Bottom Sheet on Trash Button */}
      <ConfirmDisconnectBottomSheet
        channel={channelToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setChannelToDelete(null)}
      />

      {/* Top Header Row with Back Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <button
              onClick={() => setStep(1)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
              title="بازگشت به مرحله قبل"
            >
              <ArrowRight size={14} />
              <span>بازگشت</span>
            </button>
          ) : onBack ? (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
              title="بازگشت"
            >
              <ArrowRight size={14} />
              <span>بازگشت</span>
            </button>
          ) : null}

        </div>

        <button
          onClick={handleFinish}
          className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
        >
          رد کردن
        </button>
      </div>

      {/* Step 1: User Profile */}
      {step === 1 && (
        <div className="my-auto py-3 space-y-4 text-center flex flex-col items-center">
          <div className="relative group">
            <img
              src={avatar}
              alt="پروفایل"
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
            />
            <label className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center cursor-pointer shadow-xs">
              <Camera size={12} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setAvatar(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-base font-black text-slate-800">پروفایل مدیر</h2>
            <p className="text-[11px] text-slate-400">
              نام و شماره تماس برای راه‌اندازی کارگاه
            </p>
          </div>

          <div className="w-full max-w-xs space-y-2 text-right">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                نام و نام‌خانوادگی
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام خود را وارد کنید..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                شماره موبایل
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-400"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Clean Platform Buttons + Categorized Connected Channels */}
      {step === 2 && (
        <div className="my-auto py-2 space-y-3 text-center flex flex-col items-center">
          <div className="space-y-0.5">
            <h2 className="text-base font-black text-slate-800">
              اتصال کانال‌های فروش
            </h2>
            <p className="text-[11px] text-slate-400">
              روی هر پلتفرم لمس کنید تا اکانت موردنظر را متصل نمایید
            </p>
          </div>

          {/* 10 Clean Platform Buttons */}
          <div className="w-full max-w-xs grid grid-cols-2 gap-1.5 text-right">
            {platformButtons.map((p) => {
              const isConnected = connectedChannels.some(
                (c) => c.platform === p.type
              );
              const IconComp = p.icon;

              return (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => setActiveOAuthPlatform(p.type)}
                  className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between shadow-2xs active:scale-95 text-right ${
                    isConnected
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <IconComp size={17} />
                    </div>
                    <span className="text-xs font-bold leading-none">{p.name}</span>
                  </div>

                  {isConnected && (
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Categorized Connected Channels Section */}
          <div className="w-full max-w-xs pt-2 space-y-2 text-right">
            <span className="text-[10px] font-bold text-slate-400 block px-1">
              کانال‌های متصل‌شده ({connectedChannels.length}):
            </span>

            {/* Main Header Tabs (۳ تب: همه، جهانی، ایرانی) */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMainTab('all');
                  setSubTab('all');
                }}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  mainTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                همه ({connectedChannels.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setMainTab('global');
                  setSubTab('all');
                }}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  mainTab === 'global'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                جهانی
              </button>

              <button
                type="button"
                onClick={() => {
                  setMainTab('iranian');
                  setSubTab('all');
                }}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  mainTab === 'iranian'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ایرانی
              </button>
            </div>

            {/* Sub-header Tab: Scrollable on X axis */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <button
                type="button"
                onClick={() => setSubTab('all')}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  subTab === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                همه پلتفرم‌ها
              </button>

              {availableSubPlatforms.map((p) => {
                const IconComp = p.icon;
                const count = connectedChannels.filter(
                  (c) => c.platform === p.type
                ).length;

                return (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => setSubTab(p.type)}
                    className={`px-2 py-0.5 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                      subTab === p.type
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <IconComp size={12} />
                    <span>{p.name}</span>
                    {count > 0 && (
                      <span className="text-[9px] opacity-75 font-mono">({count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Connected Channel Items List */}
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-0.5">
              {filteredChannels.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-[11px] text-slate-400">
                  کانالی در این دسته‌بندی متصل نیست.
                </div>
              ) : (
                filteredChannels.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">
                        {c.name}
                      </span>
                      <span
                        className="text-[10px] text-slate-400 font-mono block"
                        dir="ltr"
                      >
                        {c.handle}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setChannelToDelete(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="قطع اتصال"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight size={13} />
            <span>بازگشت</span>
          </button>
        ) : (
          <div className="flex items-center gap-1">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? 'w-5 bg-slate-900' : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (step === 1) setStep(2);
            else handleFinish();
          }}
          className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <span>{step === 2 ? 'ورود به بیزینو' : 'مرحله بعد'}</span>
          <ArrowLeft size={13} />
        </button>
      </div>
    </div>
  );
};
