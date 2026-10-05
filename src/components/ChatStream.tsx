import React, { useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Package,
  Layers,
  ShieldCheck,
  Palette,
  Globe,
  Radio,
  BarChart2,
} from 'lucide-react';
import { Message, InteractiveOption, PlatformType, UserProfile } from '../types';
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
import { MonthlySalesChart } from './MonthlySalesChart';
import { BusinessMetricCard } from './BusinessMetricCard';

interface ChatStreamProps {
  user: UserProfile;
  messages: Message[];
  onSelectOption: (option: InteractiveOption) => void;
  onSelectPlatform: (platform: PlatformType) => void;
  onSendLeadAction: (messageId: string) => void;
  onExecuteMetricStrategy?: (actionPayload: string) => void;
  onNavigateToSite: () => void;
  onScrollTopChange?: (isAtTop: boolean) => void;
  isAiTyping: boolean;
}

const quickPlatforms: {
  type: PlatformType;
  name: string;
  badgeColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  {
    type: 'instagram',
    name: 'اینستاگرام',
    badgeColor: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
    icon: InstagramIcon,
  },
  {
    type: 'telegram',
    name: 'تلگرام',
    badgeColor: 'bg-sky-500 text-white',
    icon: TelegramIcon,
  },
  {
    type: 'whatsapp',
    name: 'واتساپ',
    badgeColor: 'bg-emerald-600 text-white',
    icon: WhatsAppIcon,
  },
  {
    type: 'eitaa',
    name: 'ایتا',
    badgeColor: 'bg-[#E86C1D] text-white',
    icon: EitaaIcon,
  },
  {
    type: 'bale',
    name: 'بله',
    badgeColor: 'bg-[#00A98F] text-white',
    icon: BaleIcon,
  },
  {
    type: 'rubika',
    name: 'روبیکا',
    badgeColor: 'bg-[#8E24AA] text-white',
    icon: RubikaIcon,
  },
  {
    type: 'youtube',
    name: 'یوتیوب',
    badgeColor: 'bg-red-600 text-white',
    icon: YouTubeIcon,
  },
  {
    type: 'tiktok',
    name: 'تیک‌تاک',
    badgeColor: 'bg-slate-900 text-white',
    icon: TikTokIcon,
  },
  {
    type: 'linkedin',
    name: 'لینکدین',
    badgeColor: 'bg-blue-700 text-white',
    icon: LinkedInIcon,
  },
  {
    type: 'facebook',
    name: 'فیسبوک',
    badgeColor: 'bg-blue-600 text-white',
    icon: FacebookIcon,
  },
];

export const ChatStream: React.FC<ChatStreamProps> = ({
  user,
  messages,
  onSelectOption,
  onSelectPlatform,
  onSendLeadAction,
  onExecuteMetricStrategy,
  onNavigateToSite,
  onScrollTopChange,
  isAiTyping,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current || !onScrollTopChange) return;
    const isTop = containerRef.current.scrollTop <= 20;
    onScrollTopChange(isTop);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-4 select-none"
      dir="rtl"
    >
      {/* Top Hero Section */}
      <div className="pt-2 pb-2 space-y-2.5 text-right">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 via-teal-500 to-indigo-500 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80"
              alt="بیزینو"
              className="w-full h-full rounded-full object-cover border-2 border-white"
            />
          </div>
          <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white shadow-xs">
            <Sparkles size={10} />
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-emerald-700 font-bold text-xs block">
            درود {user.name}،
          </span>
          <h2 className="text-base md:text-lg font-black text-slate-900 leading-tight">
            خوش آمدید، بیایید فروش را ارتقا دهیم!
          </h2>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
            مسیر استراتژی فروش فعال است. کانال‌ها، دایرکت‌ها و شاخص‌های کلیدی از این میز کار پایش می‌شوند.
          </p>
        </div>
      </div>

      {/* Messages List with Staggered Sequential Animations */}
      <div className="space-y-3.5">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          // Sequential staggered delay: 0ms, 60ms, 120ms... capped at 300ms
          const staggerDelay = `${Math.min(idx * 50, 300)}ms`;

          return (
            <div
              key={msg.id}
              style={{ animationDelay: staggerDelay }}
              className={`w-full flex ${
                isUser ? 'justify-start' : 'justify-end'
              } animate-fade-in-up`}
            >
              {/* User Message Bubble (Right-aligned) */}
              {isUser && (
                <div className="max-w-[82%] text-right animate-fade-in-up">
                  <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl rounded-tr-xs shadow-xs text-xs leading-relaxed font-medium transition-all">
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono block mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              )}

              {/* AI Message Bubble (Left-aligned) */}
              {!isUser && (
                <div className="max-w-[88%] text-right space-y-2.5 animate-fade-in-up">
                  {/* Main AI Text */}
                  {msg.text && (
                    <div className="bg-white border border-slate-200/90 text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-xs shadow-2xs text-xs leading-relaxed animate-fade-in-up">
                      {msg.text}
                    </div>
                  )}

                  {/* 1. Business Metric KPI Card */}
                  {msg.type === 'kpi_card' && msg.metricData && (
                    <div className="w-full pt-0.5 animate-fade-in-up">
                      <BusinessMetricCard
                        data={msg.metricData}
                        onExecuteStrategy={onExecuteMetricStrategy}
                      />
                    </div>
                  )}

                  {/* 2. Monthly Sales Chart (Recharts Bar Chart) */}
                  {msg.type === 'sales_chart' && (
                    <div className="w-full pt-1 animate-fade-in-up">
                      <MonthlySalesChart currentGoal={200} />
                    </div>
                  )}

                  {/* 3. Platform Picker */}
                  {msg.type === 'platform_picker' && (
                    <div className="space-y-1.5 pt-1 animate-fade-in-up">
                      <span className="text-[10px] font-bold text-slate-400 block px-1">
                        انتخاب پلتفرم جهت اتصال خودکار (OAuth):
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {quickPlatforms.map((p, pIdx) => {
                          const IconComp = p.icon;
                          return (
                            <button
                              key={p.type}
                              type="button"
                              onClick={() => onSelectPlatform(p.type)}
                              style={{ animationDelay: `${pIdx * 35}ms` }}
                              className={`p-2.5 rounded-2xl ${p.badgeColor} flex items-center gap-2 text-xs font-bold shadow-2xs hover:opacity-95 active:scale-95 transition-all text-right animate-fade-in-up`}
                            >
                              <IconComp size={15} />
                              <span className="text-xs">{p.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. Interactive Options Chips */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="space-y-1.5 pt-1 animate-fade-in-up">
                      {msg.options.map((opt, optIdx) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onSelectOption(opt)}
                          style={{ animationDelay: `${optIdx * 45}ms` }}
                          className="w-full p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-right text-xs font-bold text-slate-800 flex items-center justify-between shadow-2xs active:scale-98 transition-all group animate-fade-in-up"
                        >
                          <span className="leading-tight">{opt.label}</span>
                          <ArrowLeft
                            size={13}
                            className="text-slate-400 group-hover:text-slate-700 group-hover:-translate-x-0.5 transition-all"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 5. Page Scraping & Analysis Card */}
                  {msg.type === 'page_analysis' && msg.scrapingData && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md space-y-2.5 text-right animate-fade-in-up">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span className="text-xs font-bold">
                            آنالیز کامل پیج انجام شد
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300" dir="ltr">
                          {msg.scrapingData.instagramHandle}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-slate-400 block">
                            محصولات فعال
                          </span>
                          <span className="font-bold text-emerald-400 text-sm">
                            {msg.scrapingData.itemsCount} کالا
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-slate-400 block">
                            نرخ تعامل
                          </span>
                          <span className="font-bold text-emerald-400 text-sm">
                            {msg.scrapingData.engagementRate}
                          </span>
                        </div>
                      </div>

                      {/* Palette Detected */}
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-300">
                        <span>پالت رنگی برند:</span>
                        <div className="flex items-center gap-1">
                          {msg.scrapingData.palette.map((c, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Color Palette Selection Cards (For Site Builder) */}
                  {msg.type === 'palette_choice' && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 block px-1">
                        ترکیب رنگ‌های پیشنهادی هوش مصنوعی بر اساس لوگو:
                      </span>

                      {[
                        {
                          id: 'p-leather',
                          title: 'پالت چرم کلاسیک (پیشنهاد اصلی)',
                          colors: ['#B45309', '#78350F', '#FDE68A'],
                          desc: 'عسلی، قهوه‌ای سوخته و کرم استخوانی',
                        },
                        {
                          id: 'p-minimal',
                          title: 'پالت مدرن مینیمال',
                          colors: ['#1E293B', '#D97706', '#F8FAFC'],
                          desc: 'دودی مات، کنیاک و نقره‌ای',
                        },
                        {
                          id: 'p-luxury',
                          title: 'پالت لوکس نئوکلاسیک',
                          colors: ['#0F172A', '#D4AF37', '#FAF9FD'],
                          desc: 'سرمه‌ای اقیانوسی و متالیک طلایی',
                        },
                      ].map((pal) => (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() =>
                            onSelectOption({
                              id: pal.id,
                              label: pal.title,
                              actionValue: pal.id,
                            })
                          }
                          className="w-full p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-right flex items-center justify-between shadow-2xs active:scale-98 transition-all"
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-800 block leading-tight">
                              {pal.title}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {pal.desc}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 mr-2">
                            {pal.colors.map((hex, idx) => (
                              <div
                                key={idx}
                                className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 7. Hot Lead Card */}
                  {msg.type === 'lead_action' && msg.leadData && (
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-right space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          {msg.leadData.count} خریدار بالقوه در دایرکت
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          لید داغ
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl leading-relaxed border border-slate-100">
                        «{msg.leadData.suggestedMessage}»
                      </p>

                      <button
                        type="button"
                        disabled={msg.leadData.isSent}
                        onClick={() => onSendLeadAction(msg.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          msg.leadData.isSent
                            ? 'bg-slate-100 text-slate-400 cursor-default'
                            : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                        }`}
                      >
                        <CheckCircle2 size={13} />
                        <span>
                          {msg.leadData.isSent
                            ? 'پیام‌ها ارسال گردید'
                            : 'ارسال فوری پیام پیگیری'}
                        </span>
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 font-mono block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isAiTyping && (
          <div className="w-full flex justify-end animate-fade-in-up">
            <div className="bg-white border border-slate-200/90 px-3 py-2 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-1.5 text-slate-800">
              <span className="text-[10px] text-slate-400 font-bold">بیزینو در حال پردازش</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
