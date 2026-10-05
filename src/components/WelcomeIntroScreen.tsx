import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { AiOrb } from './AiOrb';

interface WelcomeIntroScreenProps {
  onGetStarted: () => void;
  onHaveAccount?: () => void;
}

const welcomeWords = [
  'سلام',
  'و',
  'درود!',
  'من',
  'بیزینو',
  'هستم،',
  'کوچ',
  'اختصاصی',
  'و',
  'استراتژیست',
  'رشد',
  'فروش',
  'آنلاین',
  'شما.',
  'آماده‌اید',
  'مسیر',
  'فروش،',
  'دایرکت‌ها',
  'و',
  'فروشگاهتان',
  'را',
  'با',
  'هم',
  'متحول',
  'کنیم؟',
];

export const WelcomeIntroScreen: React.FC<WelcomeIntroScreenProps> = ({
  onGetStarted,
}) => {
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [hasTransitioned, setHasTransitioned] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Soft melodic vocal chime using Web Audio
  const playVocalNote = (index: number) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqs = [330, 392, 440, 523, 587, 659];
      const freq = freqs[index % freqs.length];

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback
    }
  };

  // Play Native Speech Synthesis in Persian
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const text = welcomeWords.join(' ');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fa-IR';
        utterance.rate = 1.05;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback
      }
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Word-by-word reading & automatic transition
  useEffect(() => {
    if (hasTransitioned) return;

    if (currentWordIdx < welcomeWords.length) {
      const timer = setTimeout(() => {
        playVocalNote(currentWordIdx);
        setCurrentWordIdx((prev) => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Reached the question ("آماده‌اید مسیر فروش ... را با هم متحول کنیم؟")
      // Seamlessly and automatically transition to the Chat screen after a brief pause!
      const autoEnterTimer = setTimeout(() => {
        setHasTransitioned(true);
        onGetStarted();
      }, 750);
      return () => clearTimeout(autoEnterTimer);
    }
  }, [currentWordIdx, hasTransitioned, onGetStarted]);

  // Tap anywhere to instantly enter chat
  const handleScreenTap = () => {
    if (hasTransitioned) return;
    setHasTransitioned(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onGetStarted();
  };

  const progressPercentage = Math.min(
    Math.round((currentWordIdx / welcomeWords.length) * 100),
    100
  );

  return (
    <div
      onClick={handleScreenTap}
      className="flex-1 w-full h-full bg-[#FAF9FD] text-slate-800 flex flex-col justify-between p-6 select-none relative overflow-hidden text-center cursor-pointer"
      dir="rtl"
    >
      {/* Background Soft Ambient Halos (Clean Light Theme) */}
      <div className="absolute top-1/4 -right-16 w-80 h-80 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-16 w-80 h-80 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none -z-10" />

      {/* Top Branding Bar */}
      <div className="pt-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black tracking-wider uppercase text-slate-700 font-mono">
            bizino.os
          </span>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
          کوچ هوشمند رشد فروش
        </span>
      </div>

      {/* Center Cinematic Orb & Word-by-Word Narration */}
      <div className="my-auto flex flex-col items-center space-y-6 z-10 max-w-sm mx-auto w-full">
        {/* Pulsing Luminous AI Orb */}
        <div className="relative">
          <AiOrb size="lg" />
          <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-md animate-pulse">
            <Sparkles size={13} />
          </div>
        </div>

        {/* Dynamic Spoken Text Flow */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-slate-200/90 shadow-sm text-right space-y-2 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>صدای زنده بیزینو</span>
            </span>
            <span>Bizino Voice Coach</span>
          </div>

          <p className="text-xs leading-relaxed font-medium text-slate-800 select-none min-h-[72px]">
            {welcomeWords.map((word, idx) => {
              const isCurrent = idx === currentWordIdx - 1;
              const isSpoken = idx < currentWordIdx;
              const isQuestion = idx >= 14;

              return (
                <span
                  key={idx}
                  className={`inline-block mx-0.5 transition-all duration-150 ${
                    isCurrent
                      ? 'text-emerald-700 font-black scale-110 bg-emerald-100/90 px-1 rounded-md shadow-2xs'
                      : isSpoken
                      ? isQuestion
                        ? 'text-slate-900 font-black'
                        : 'text-slate-800 font-medium'
                      : 'text-slate-300 opacity-60'
                  }`}
                >
                  {word}
                </span>
              );
            })}
            {currentWordIdx < welcomeWords.length && (
              <span className="inline-block w-1.5 h-3 bg-emerald-500 rounded-full animate-pulse mr-1 align-middle" />
            )}
          </p>
        </div>
      </div>

      {/* Auto-Transition Progress Footer (No redundant buttons!) */}
      <div className="space-y-2 z-10 pb-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="font-bold flex items-center gap-1">
            <span>در حال ورود خودکار به گفتگو</span>
            <span className="animate-pulse">...</span>
          </span>
          <span className="font-mono text-emerald-600 font-bold">
            {progressPercentage}٪
          </span>
        </div>

        {/* Smooth auto-progress bar */}
        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 rounded-full transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-400 pt-1">
          برای ورود فوری، هر کجای صفحه را لمس کنید
        </p>
      </div>
    </div>
  );
};
