import React from 'react';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { AiOrb } from './AiOrb';

interface WelcomeIntroScreenProps {
  onGetStarted: () => void;
  onHaveAccount?: () => void;
}

export const WelcomeIntroScreen: React.FC<WelcomeIntroScreenProps> = ({
  onGetStarted,
  onHaveAccount,
}) => {
  return (
    <div
      className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-6 select-none relative overflow-hidden text-center"
      dir="rtl"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

      {/* Top Branding */}
      <div className="pt-2 flex items-center justify-center gap-1.5 z-10">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-black tracking-widest uppercase text-slate-300 font-mono">
          bizino.os
        </span>
      </div>

      {/* Hero Visual & Title */}
      <div className="my-auto flex flex-col items-center space-y-6 z-10">
        {/* Glowing Orb / Crest */}
        <div className="relative">
          <AiOrb size="lg" />
          <div className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-md">
            <Sparkles size={14} />
          </div>
        </div>

        <div className="space-y-2 max-w-xs mx-auto">
          <h1 className="text-xl md:text-2xl font-black leading-tight tracking-tight text-white">
            کوچ هوشمند و استراتژیست فروش آنلاین شما
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            مدیریت تمام چنل‌های فروش، تحلیل پیج، تولید محتوا و ساخت خودکار سایت
            فروشگاهی در یک گفتگوی هوشمند.
          </p>
        </div>
      </div>

      {/* Action Buttons & Footer */}
      <div className="space-y-3 z-10 pb-2">
        <button
          type="button"
          onClick={onGetStarted}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <span>شروع گفتگو</span>
          <ArrowLeft size={14} />
        </button>

        <button
          type="button"
          onClick={onHaveAccount || onGetStarted}
          className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
        >
          قبلاً حساب داشته‌ام
        </button>

        <p className="text-[10px] text-slate-500 leading-none pt-1">
          با ادامه، قوانین حریم خصوصی و شرایط بیزینو را می‌پذیرید.
        </p>
      </div>
    </div>
  );
};
