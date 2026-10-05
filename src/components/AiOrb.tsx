import React from 'react';
import { Sparkles, Radio } from 'lucide-react';

interface AiOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isListening?: boolean;
  statusText?: string;
  onClick?: () => void;
}

export const AiOrb: React.FC<AiOrbProps> = ({
  size = 'md',
  isListening = false,
  statusText,
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-24 h-24',
    hero: 'w-48 h-48 md:w-56 md:h-56',
  };

  const iconSize = {
    sm: 14,
    md: 18,
    lg: 28,
    hero: 36,
  };

  return (
    <div
      onClick={onClick}
      className="inline-flex flex-col items-center justify-center cursor-pointer select-none group relative"
      title="هوش مصنوعی Bizino AI Partner"
    >
      <div className={`relative ${sizeMap[size]} flex items-center justify-center shrink-0`}>
        {/* Soft Multi-Color Halo Glow */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
            isListening
              ? 'bg-gradient-to-tr from-pink-400/60 via-purple-500/50 to-cyan-400/60 scale-125'
              : 'bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-teal-200/40 animate-pulse-halo group-hover:scale-115'
          }`}
        />

        {/* Outer Iridescent Liquid Glass Ring */}
        <div
          className="absolute -inset-1 rounded-full p-[1.5px] pointer-events-none opacity-80 animate-iridescent-rotate"
          style={{
            background:
              'conic-gradient(from 45deg, #a78bfa, #38bdf8, #f472b6, #fbbf24, #a78bfa)',
          }}
        >
          <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-xs" />
        </div>

        {/* Iridescent Chrome / Liquid Sphere Core */}
        <div
          className={`relative w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-[inset_0_-8px_16px_rgba(0,0,0,0.15),0_10px_25px_rgba(139,92,246,0.25)] transition-transform duration-500 ${
            size === 'hero' ? 'animate-float-gentle' : ''
          }`}
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #ffffff 0%, #e0e7ff 18%, #c4b5fd 40%, #818cf8 65%, #38bdf8 85%, #ec4899 100%)',
          }}
        >
          {/* Internal Liquid Chromatic Flow Swirl */}
          <div
            className="absolute inset-0 opacity-80 mix-blend-overlay animate-iridescent-rotate pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 70% 65%, rgba(244,114,182,0.85) 0%, rgba(56,189,248,0.7) 45%, rgba(167,139,250,0.6) 80%, transparent 100%)',
            }}
          />

          {/* Organic Wave / Liquid distortion SVG inside */}
          <svg
            className="absolute inset-0 w-full h-full opacity-60 mix-blend-color-dodge animate-liquid-wobble pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M20 50 Q 35 20, 50 50 T 80 50 Q 95 80, 50 75 T 20 50 Z"
              fill="url(#liquidGrad)"
            />
            <defs>
              <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glaze reflection arc top-left */}
          <div className="absolute top-2 left-3 w-2/5 h-1/4 rounded-full bg-white/70 blur-[1px] rotate-[-25deg] pointer-events-none" />
          <div className="absolute bottom-2.5 right-3 w-1/4 h-1/6 rounded-full bg-white/40 blur-[2px] pointer-events-none" />

          {/* Center Vector Icon */}
          <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-110">
            {isListening ? (
              <Radio size={iconSize[size]} className="text-white animate-pulse" />
            ) : (
              <Sparkles size={iconSize[size]} className="text-white" />
            )}
          </div>
        </div>
      </div>

      {statusText && (
        <span className="text-xs font-medium text-slate-500 group-hover:text-slate-800 transition-colors mt-2">
          {statusText}
        </span>
      )}
    </div>
  );
};
