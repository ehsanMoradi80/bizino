import React, { useState } from 'react';
import { Globe, Menu, Sparkles } from 'lucide-react';
import { UserProfile, ConnectedChannel, PlatformType } from '../types';
import { ChannelsBottomSheet } from './ChannelsBottomSheet';

interface HeaderProps {
  user: UserProfile;
  channels: ConnectedChannel[];
  activeChannel: ConnectedChannel;
  onSelectChannel: (channel: ConnectedChannel) => void;
  onStartOAuth: (platform: PlatformType) => void;
  onDeleteChannel?: (id: string) => void;
  onNavigateToSite: () => void;
  onOpenPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  channels,
  activeChannel,
  onSelectChannel,
  onStartOAuth,
  onDeleteChannel,
  onNavigateToSite,
  onOpenPanel,
}) => {
  const [isChannelsSheetOpen, setIsChannelsSheetOpen] = useState(false);

  return (
    <>
      {/* Mobile-First Channels Bottom Sheet */}
      <ChannelsBottomSheet
        isOpen={isChannelsSheetOpen}
        channels={channels}
        activeChannel={activeChannel}
        onSelectChannel={onSelectChannel}
        onStartOAuth={onStartOAuth}
        onRequestDeleteChannel={(ch) => {
          if (onDeleteChannel) {
            onDeleteChannel(ch.id);
          }
        }}
        onClose={() => setIsChannelsSheetOpen(false)}
      />

      {/* Single Unified Clean Light Header (No duplicate headers, no theme toggle here) */}
      <header
        className="px-4 py-2 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between select-none shrink-0 z-20 text-slate-800"
        dir="rtl"
      >
        {/* Right Action: Menu / Sessions Panel button */}
        <button
          type="button"
          onClick={onOpenPanel}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          title="سشن‌ها و پوشه‌ها"
        >
          <Menu size={16} />
        </button>

        {/* Center: Active Channel / Path Badge (tapping opens Channels Bottom Sheet) */}
        <button
          type="button"
          onClick={() => setIsChannelsSheetOpen(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 shadow-2xs transition-all active:scale-95"
        >
          <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Sparkles size={10} />
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold block leading-none text-slate-900">
              {activeChannel.name}
            </span>
            <span className="text-[9px] text-slate-400 font-mono block mt-0.5" dir="ltr">
              {activeChannel.handle}
            </span>
          </div>
        </button>

        {/* Left Action: Store View Button */}
        <button
          type="button"
          onClick={onNavigateToSite}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold transition-all shadow-xs hover:bg-slate-800 active:scale-95"
          title="مشاهده فروشگاه آنلاین"
        >
          <Globe size={12} />
          <span>فروشگاه</span>
        </button>
      </header>
    </>
  );
};
