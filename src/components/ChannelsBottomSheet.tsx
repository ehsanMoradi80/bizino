import React, { useState, useRef } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { ConnectedChannel, PlatformType } from '../types';
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

interface ChannelsBottomSheetProps {
  isOpen: boolean;
  channels: ConnectedChannel[];
  activeChannel: ConnectedChannel;
  onSelectChannel: (channel: ConnectedChannel) => void;
  onStartOAuth: (platform: PlatformType) => void;
  onRequestDeleteChannel: (channel: ConnectedChannel) => void;
  onClose: () => void;
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

export const ChannelsBottomSheet: React.FC<ChannelsBottomSheetProps> = ({
  isOpen,
  channels,
  activeChannel,
  onSelectChannel,
  onStartOAuth,
  onRequestDeleteChannel,
  onClose,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [mainTab, setMainTab] = useState<'all' | 'global' | 'iranian'>('all');
  const [subTab, setSubTab] = useState<string>('all');

  // Drag-to-dismiss states
  const [dragY, setDragY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const startYRef = useRef<number | null>(null);

  if (!isOpen) return null;

  const handleCloseWithSlideDown = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setDragY(0);
    }, 220);
  };

  // Touch handlers for drag-to-dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 75) {
      handleCloseWithSlideDown();
    } else {
      setDragY(0);
    }
    startYRef.current = null;
  };

  // Pointer / Mouse handlers for desktop testing
  const handlePointerDown = (e: React.PointerEvent) => {
    startYRef.current = e.clientY;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || startYRef.current === null) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (dragY > 75) {
      handleCloseWithSlideDown();
    } else {
      setDragY(0);
    }
    startYRef.current = null;
  };

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
      className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/50 backdrop-blur-xs select-none"
      dir="rtl"
      onClick={handleCloseWithSlideDown}
    >
      <div
        className={`w-full max-w-[420px] mx-auto bg-white rounded-t-[32px] p-5 shadow-2xl space-y-3.5 max-h-[85vh] flex flex-col ${
          isClosing
            ? 'animate-slide-out-down'
            : !isDragging && dragY === 0
            ? 'animate-slide-in-up'
            : ''
        }`}
        style={{
          transform: isClosing
            ? 'translateY(100%)'
            : dragY > 0
            ? `translateY(${dragY}px)`
            : undefined,
          transition: isDragging
            ? 'none'
            : 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle Bar (Touch / Pointer drag area) */}
        <div
          className="w-full pt-1 pb-3 -mt-2 cursor-grab active:cursor-grabbing flex items-center justify-center shrink-0 touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          title="به سمت پایین بکشید تا بسته شود"
        >
          <div className="w-14 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors" />
        </div>

        {/* Title Bar (Also draggable for easy mobile dismissal) */}
        <div
          className="flex items-center justify-between shrink-0 touch-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="text-right">
            <h3 className="text-sm font-black text-slate-900">
              مدیریت کانال‌های فروش
            </h3>
            <p className="text-[10px] text-slate-400">
              سوییچ بین پیج‌ها یا اتصال اکانت جدید (به پایین بکشید)
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {channels.length} کانال
          </span>
        </div>

        {/* Main Header Tabs (همه، جهانی، ایرانی) */}
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

        {/* Sub-header Tab: Scrollable on X axis, colored with platform brand colors */}
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
                    ? `${p.badgeColor} ring-2 ring-slate-900/20`
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

        {/* Channels List */}
        {!isAddingNew ? (
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {filteredChannels.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                کانالی در این دسته‌بندی وجود ندارد.
              </div>
            ) : (
              filteredChannels.map((ch) => {
                const isActive = activeChannel.id === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onSelectChannel(ch);
                      handleCloseWithSlideDown();
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-right flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
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
                      {channels.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestDeleteChannel(ch);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive
                              ? 'text-slate-400 hover:text-rose-400'
                              : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'
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
              className="w-full mt-2 py-2.5 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus size={13} />
              <span>اتصال اکانت یا کانال جدید (OAuth)</span>
            </button>
          </div>
        ) : (
          /* Add Platform Selector view inside bottom sheet */
          <div className="flex-1 overflow-y-auto space-y-2 text-right">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">
                پلتفرم مورد نظر را انتخاب کنید:
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                انصراف
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-0.5">
              {platformMetaList.map((p) => {
                const IconComp = p.icon;
                return (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => {
                      handleCloseWithSlideDown();
                      onStartOAuth(p.type);
                    }}
                    className={`p-2.5 rounded-2xl ${p.badgeColor} flex items-center gap-2 text-xs font-bold shadow-2xs hover:opacity-95 active:scale-95 transition-all text-right`}
                  >
                    <IconComp size={16} />
                    <span className="text-xs">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
