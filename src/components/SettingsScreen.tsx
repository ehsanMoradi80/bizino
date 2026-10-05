import React, { useState } from 'react';
import {
  ArrowRight,
  Moon,
  Sun,
  Bell,
  Check,
  Plus,
  Trash2,
  Sparkles,
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

interface SettingsScreenProps {
  user: UserProfile;
  channels: ConnectedChannel[];
  activeChannel?: ConnectedChannel;
  onBack: () => void;
  onUpdateUser: (user: UserProfile) => void;
  onSelectChannel?: (channel: ConnectedChannel) => void;
  onStartOAuth?: (platform: PlatformType) => void;
  onDeleteChannel?: (id: string) => void;
}

interface PlatformMetaInfo {
  type: PlatformType;
  name: string;
  category: 'global' | 'iranian';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badgeColor: string;
}

const platformMetaList: PlatformMetaInfo[] = [
  {
    type: 'instagram',
    name: 'اینستاگرام',
    category: 'global',
    icon: InstagramIcon,
    badgeColor: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
  },
  {
    type: 'telegram',
    name: 'تلگرام',
    category: 'global',
    icon: TelegramIcon,
    badgeColor: 'bg-sky-500 text-white',
  },
  {
    type: 'whatsapp',
    name: 'واتساپ',
    category: 'global',
    icon: WhatsAppIcon,
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    type: 'eitaa',
    name: 'ایتا',
    category: 'iranian',
    icon: EitaaIcon,
    badgeColor: 'bg-[#E86C1D] text-white',
  },
  {
    type: 'bale',
    name: 'بله',
    category: 'iranian',
    icon: BaleIcon,
    badgeColor: 'bg-[#00A98F] text-white',
  },
  {
    type: 'rubika',
    name: 'روبیکا',
    category: 'iranian',
    icon: RubikaIcon,
    badgeColor: 'bg-[#8E24AA] text-white',
  },
  {
    type: 'youtube',
    name: 'یوتیوب',
    category: 'global',
    icon: YouTubeIcon,
    badgeColor: 'bg-red-600 text-white',
  },
  {
    type: 'tiktok',
    name: 'تیک‌تاک',
    category: 'global',
    icon: TikTokIcon,
    badgeColor: 'bg-slate-900 text-white',
  },
  {
    type: 'linkedin',
    name: 'لینکدین',
    category: 'global',
    icon: LinkedInIcon,
    badgeColor: 'bg-blue-700 text-white',
  },
  {
    type: 'facebook',
    name: 'فیسبوک',
    category: 'global',
    icon: FacebookIcon,
    badgeColor: 'bg-blue-600 text-white',
  },
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

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  channels,
  activeChannel,
  onBack,
  onUpdateUser,
  onSelectChannel,
  onStartOAuth,
  onDeleteChannel,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // 3-tab Main Header state: همه | جهانی | ایرانی
  const [mainTab, setMainTab] = useState<'all' | 'global' | 'iranian'>('all');
  // Sub-header platform tabs state
  const [subTab, setSubTab] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const availableSubPlatforms = platformMetaList.filter((p) => {
    if (mainTab === 'global') return p.category === 'global';
    if (mainTab === 'iranian') return p.category === 'iranian';
    return true;
  });

  const filteredChannels = channels.filter((c) => {
    if (mainTab === 'global' && !globalPlatforms.includes(c.platform)) return false;
    if (mainTab === 'iranian' && !iranianPlatforms.includes(c.platform)) return false;
    if (subTab !== 'all' && c.platform !== subTab) return false;
    return true;
  });

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
          <h2 className="text-sm font-black text-slate-900">تنظیمات</h2>
        </div>
      </div>

      {/* Settings Body */}
      <div className="p-4 space-y-4 flex-1">
        {/* Profile Card */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-slate-100"
            />
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 block">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5" dir="ltr">
                {user.phone}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            مدیر کارگاه
          </span>
        </div>

        {/* ======================================================== */}
        {/* CONNECTED CHANNELS SECTION WITH 3-TAB HEADER & SUB-HEADER */}
        {/* ======================================================== */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-right">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-slate-900 block leading-tight">
                کانال‌های فروش متصل
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                مدیریت پیج‌ها و پیام‌رسان‌ها
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {channels.length} کانال
            </span>
          </div>

          {/* 1. Main Header Tabs: همه | جهانی | ایرانی */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold shrink-0">
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
              همه
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

          {/* 2. Sub-Header Tabs: Horizontally Scrollable on X-axis with Platform Brand Colors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setSubTab('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all whitespace-nowrap ${
                subTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              همه
            </button>

            {availableSubPlatforms.map((p) => {
              const IconComp = p.icon;
              const isSelected = subTab === p.type;
              const count = channels.filter((c) => c.platform === p.type).length;

              return (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => setSubTab(p.type)}
                  className={`px-3 py-1 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                    isSelected
                      ? `${p.badgeColor} ring-2 ring-slate-900/25`
                      : `${p.badgeColor} opacity-75 hover:opacity-100`
                  }`}
                >
                  <IconComp size={12} />
                  <span>{p.name}</span>
                  {count > 0 && (
                    <span className="text-[9px] bg-black/20 px-1 rounded-full font-mono">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. Channels List / Add Platform Picker */}
          {!isAddingNew ? (
            <div className="space-y-1.5 pt-0.5">
              {filteredChannels.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  کانالی در این دسته‌بندی یافت نشد.
                </div>
              ) : (
                filteredChannels.map((ch) => {
                  const isActive = activeChannel?.id === ch.id;

                  return (
                    <div
                      key={ch.id}
                      onClick={() => onSelectChannel && onSelectChannel(ch)}
                      className={`w-full p-2.5 rounded-xl border text-right flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="flex-1 truncate">
                        <span className="font-bold block leading-tight truncate">
                          {ch.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono truncate block mt-0.5 ${
                            isActive ? 'text-slate-300' : 'text-slate-400'
                          }`}
                          dir="ltr"
                        >
                          {ch.handle}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 mr-2">
                        {isActive && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                        {channels.length > 1 && onDeleteChannel && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChannel(ch.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'text-slate-400 hover:text-rose-400'
                                : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                            }`}
                            title="قطع اتصال"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full mt-2 py-2 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors bg-white"
              >
                <Plus size={13} />
                <span>اتصال اکانت یا کانال جدید (OAuth)</span>
              </button>
            </div>
          ) : (
            /* Add New Platform Grid */
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  پلتفرم مورد نظر جهت اتصال:
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  انصراف
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {platformMetaList.map((p) => {
                  const IconComp = p.icon;
                  return (
                    <button
                      key={p.type}
                      type="button"
                      onClick={() => {
                        setIsAddingNew(false);
                        if (onStartOAuth) {
                          onStartOAuth(p.type);
                        }
                      }}
                      className={`p-2.5 rounded-xl ${p.badgeColor} flex items-center gap-2 text-xs font-bold shadow-2xs hover:opacity-95 active:scale-95 transition-all text-right`}
                    >
                      <IconComp size={15} />
                      <span className="text-xs">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Appearance & Theme (Dark/Light toggle) */}
        <div className="space-y-1.5 text-right">
          <span className="text-[11px] font-bold text-slate-400 px-1">
            ظاهر و تم نرم‌افزار
          </span>
          <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                {isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  حالت نمایش (تم)
                </span>
                <span className="text-[10px] text-slate-400">
                  {isDarkMode ? 'دارک‌مود (تاریک)' : 'لایت‌مود (روشن)'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isDarkMode ? 'bg-slate-900' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  isDarkMode ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-1.5 text-right">
          <span className="text-[11px] font-bold text-slate-400 px-1">
            اعلان‌ها و رویدادها
          </span>
          <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Bell size={15} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  پیام‌های دایرکت و لیدهای داغ
                </span>
                <span className="text-[10px] text-slate-400">
                  اطلاع‌رسانی فوری سفارش‌ها
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                notifications ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  notifications ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="pt-1 text-center text-[10px] text-slate-400 space-y-0.5">
          <span className="font-mono font-bold block">Bizino OS v2.4</span>
          <span>هوش مصنوعی مدیریت و توسعه فروش آنلاین</span>
        </div>
      </div>
    </div>
  );
};
