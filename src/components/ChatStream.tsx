import React, { useRef, useEffect, useState } from 'react';
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
import { WebsiteInlineMiniPreviewCard } from './WebsiteInlineMiniPreviewCard';
import { AudioSpeechVisualizer } from './AudioSpeechVisualizer';
import { Lock, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { AiOrb } from './AiOrb';

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
  const [openInlinePreviews, setOpenInlinePreviews] = useState<Record<string, boolean>>({
    'msg-welcome': true, // Auto-expand preview on initial site introduction for convenience
  });

  const toggleInlinePreview = (msgId: string) => {
    setOpenInlinePreviews((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Continuous Voice Coach Presence State
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  const [coachWaves, setCoachWaves] = useState<number[]>([30, 55, 40, 75, 50, 65]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesizes pleasant harmonic audio chimes for voice simulation
  const playCoachChime = (toneIdx = 0) => {
    if (isVoiceMuted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqs = [350, 415, 466, 523, 622, 698];
      const freq = freqs[toneIdx % freqs.length];

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio graceful fallback
    }
  };

  // Initial acoustic continuity chime upon entering chat
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isVoiceMuted) {
        playCoachChime(1);
        setTimeout(() => playCoachChime(3), 150);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Continuous sync: when AI is typing or generating a response, the coach pulses and speaks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAiTyping && !isVoiceMuted) {
      setIsCoachSpeaking(true);
      let step = 0;
      interval = setInterval(() => {
        playCoachChime(step % 6);
        setCoachWaves(Array.from({ length: 6 }, () => Math.floor(25 + Math.random() * 70)));
        step++;
      }, 180);
    } else {
      setIsCoachSpeaking(false);
      setCoachWaves([25, 40, 55, 35, 45, 30]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAiTyping, isVoiceMuted]);

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
      {/* ======================================================== */}
      {/* CONTINUOUS INTERACTIVE VOICE COACH ENTITY (AVATAR & WAVES) */}
      {/* ======================================================== */}
      <div className="pt-1 pb-1 space-y-2 text-right bg-gradient-to-r from-emerald-50/80 via-indigo-50/50 to-white p-3.5 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Interactive Shimmering Orb Avatar */}
            <div className="relative">
              <AiOrb size="sm" isListening={isAiTyping || isCoachSpeaking} />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center border-2 border-white shadow-2xs">
                <Sparkles size={8} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-slate-900 leading-tight">
                  کوچ اختصاصی بیزینو
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                {isAiTyping ? 'در حال صحبت و تحلیل شاخص‌ها...' : 'همراه پیوسته رشد فروش شما'}
              </span>
            </div>
          </div>

          {/* Continuous Voice Visualizer & Volume Toggle */}
          <div className="flex items-center gap-2 bg-white/90 border border-slate-200/90 px-3 py-1 rounded-full shadow-2xs">
            <AudioSpeechVisualizer
              isSpeaking={(isAiTyping || isCoachSpeaking) && !isVoiceMuted}
              size="sm"
              variant="emerald"
              label={isAiTyping ? 'در حال گفتار...' : 'کوچ صوتی'}
            />
            <button
              type="button"
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className="p-0.5 text-slate-500 hover:text-slate-800 transition-colors"
              title={isVoiceMuted ? 'فعال‌سازی صوت کوچ' : 'بی‌صدا کردن صوت'}
            >
              {isVoiceMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>
        </div>

        {/* Dynamic Coach Continuous Thought Speech Bubble */}
        <div className="p-2.5 rounded-2xl bg-white/90 border border-slate-100 text-xs text-slate-800 leading-relaxed font-medium">
          <span className="text-emerald-700 font-bold ml-1">درود {user.name}؛</span>
          <span>من اینجام و هم‌مسیر شما هستم. وضعیت کانال‌ها، دایرکت‌ها و استراتژی فروش را با هم پایش می‌کنیم.</span>
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
                  {/* Main AI Text & Inline Mini-Preview Card */}
                  {msg.text && (
                    <div className="bg-white border border-slate-200/90 text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-xs shadow-2xs text-xs leading-relaxed animate-fade-in-up space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">{msg.text}</div>
                        {/* Audio Speech Visualizer synced with AI Speech Processing */}
                        <AudioSpeechVisualizer
                          isSpeaking={isAiTyping && idx === messages.length - 1}
                          size="sm"
                          variant="emerald"
                        />
                      </div>

                      {(msg.text.includes('سایت') || msg.text.includes('فروشگاه') || msg.text.includes('وبسایت')) && (
                        <div className="pt-1.5 border-t border-slate-100 flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleInlinePreview(msg.id)}
                            className={`inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all shadow-2xs active:scale-95 ${
                              openInlinePreviews[msg.id]
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Lock size={10} className={openInlinePreviews[msg.id] ? 'text-emerald-400' : 'text-emerald-600'} />
                              <span>
                                {openInlinePreviews[msg.id]
                                  ? 'بستن کارت پیش‌نمایش سایت'
                                  : 'پیش‌نمایش کارت وبسایت (charm-aria.ir)'}
                              </span>
                            </div>
                            <ExternalLink size={10} className={openInlinePreviews[msg.id] ? 'text-slate-300' : 'text-slate-400'} />
                          </button>

                          {/* INLINE MINI PREVIEW CARD (NO MODAL!) */}
                          {openInlinePreviews[msg.id] && (
                            <WebsiteInlineMiniPreviewCard
                              initialIsBuilding={true}
                              onOpenFullSite={onNavigateToSite}
                            />
                          )}
                        </div>
                      )}
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
                          onClick={() => {
                            if (opt.id.includes('site') || opt.label.includes('سایت') || opt.label.includes('فروشگاه') || opt.label.includes('ویترین')) {
                              toggleInlinePreview(msg.id);
                            } else {
                              onSelectOption(opt);
                            }
                          }}
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

        {/* Typing Indicator with Audio Speech Visualizer */}
        {isAiTyping && (
          <div className="w-full flex justify-end animate-fade-in-up">
            <div className="bg-white border border-slate-200/90 px-3.5 py-2 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-2 text-slate-800">
              <AudioSpeechVisualizer isSpeaking={true} size="sm" variant="rainbow" />
              <span className="text-[11px] text-slate-700 font-bold">بیزینو در حال پردازش صوت و پیام...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
