import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface AgentTTSVoicePlayerProps {
  text: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  variant?: 'card' | 'inline' | 'floating';
  onWordHighlight?: (wordIndex: number) => void;
}

export const AgentTTSVoicePlayer: React.FC<AgentTTSVoicePlayerProps> = ({
  text,
  autoPlay = false,
  onComplete,
  variant = 'card',
  onWordHighlight,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(-1);
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>([25, 40, 60, 35, 80, 50, 70, 30, 55, 40]);

  const words = useRef<string[]>([]);
  words.current = text.split(/\s+/).filter(Boolean);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synthesize soft vocal chime pulse using Web Audio API
  const playVocalChime = (index: number) => {
    if (isMuted) return;
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

      // Soft harmonic vocal frequency modulation (human voice fundamental frequencies)
      const freqs = [330, 370, 392, 440, 493, 523, 587, 659];
      const freq = freqs[index % freqs.length];

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio context handled gracefully
    }
  };

  // Play Native TTS
  const startSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fa-IR';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        setIsPlaying(false);
        if (onComplete) onComplete();
      };

      utteranceRef.current = utterance;
      if (!isMuted) {
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Stop Speech
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startSpeech();
      let idx = 0;
      setCurrentWordIdx(0);

      timerRef.current = setInterval(() => {
        if (idx < words.current.length) {
          playVocalChime(idx);
          setCurrentWordIdx(idx);
          if (onWordHighlight) onWordHighlight(idx);

          // Animate visualizer spectrum bars
          setWaveAmplitudes(
            Array.from({ length: 10 }, () => Math.floor(20 + Math.random() * 75))
          );
          idx++;
        } else {
          setIsPlaying(false);
          setCurrentWordIdx(-1);
          if (timerRef.current) clearInterval(timerRef.current);
          if (onComplete) onComplete();
        }
      }, 160);
    } else {
      stopSpeech();
    }

    return () => {
      stopSpeech();
    };
  }, [isPlaying, isMuted, text]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    stopSpeech();
    setCurrentWordIdx(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 rounded-full text-slate-700 transition-all select-none" dir="rtl">
        <button
          type="button"
          onClick={togglePlay}
          className="p-1 rounded-full text-slate-800 hover:text-emerald-600 transition-colors"
          title={isPlaying ? 'توقف پخش' : 'پخش صوتی پیام'}
        >
          {isPlaying ? <Pause size={11} /> : <Play size={11} className="fill-slate-700" />}
        </button>

        {/* Mini Wave Bars */}
        <div className="flex items-center gap-0.5 h-3 px-0.5">
          {waveAmplitudes.slice(0, 5).map((h, i) => (
            <span
              key={i}
              style={{ height: isPlaying && !isMuted ? `${h}%` : '20%' }}
              className={`w-0.5 rounded-full transition-all duration-150 ${
                isPlaying && !isMuted ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="p-0.5 text-slate-500 hover:text-slate-800"
          title={isMuted ? 'صدا وصل' : 'بی‌صدا'}
        >
          {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-2 select-none text-right transition-all"
      dir="rtl"
    >
      {/* Header with Visualizer Equalizer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
            <Sparkles size={13} />
          </div>
          <span className="text-xs font-black text-slate-900 leading-none">
            شبیه‌ساز صوتی هوش مصنوعی (TTS)
          </span>
        </div>

        {/* Audio Spectrum Waves */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl h-6">
          {waveAmplitudes.map((h, i) => (
            <span
              key={i}
              style={{ height: isPlaying && !isMuted ? `${h}%` : '20%' }}
              className={`w-0.5 rounded-full transition-all duration-150 ${
                isPlaying && !isMuted ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Synchronized Karaoke Word Flow */}
      <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 max-h-24 overflow-y-auto text-xs leading-relaxed text-slate-700">
        {words.current.map((word, idx) => {
          const isCurrent = idx === currentWordIdx;
          const isSpoken = currentWordIdx !== -1 && idx < currentWordIdx;

          return (
            <span
              key={idx}
              className={`inline-block mx-0.5 transition-all duration-150 ${
                isCurrent
                  ? 'text-emerald-700 font-black scale-110 bg-emerald-100 px-1 rounded shadow-2xs'
                  : isSpoken
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-2xs active:scale-95 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause size={12} />
                <span>توقف</span>
              </>
            ) : (
              <>
                <Play size={12} className="fill-white" />
                <span>پخش صوت</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            title="پخش مجدد از ابتدا"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          <span>{isMuted ? 'صدا قطع' : 'صدا وصل'}</span>
        </button>
      </div>
    </div>
  );
};
