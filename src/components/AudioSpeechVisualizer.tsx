import React from 'react';

interface AudioSpeechVisualizerProps {
  isSpeaking: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emerald' | 'indigo' | 'rainbow';
  label?: string;
}

export const AudioSpeechVisualizer: React.FC<AudioSpeechVisualizerProps> = ({
  isSpeaking,
  size = 'md',
  variant = 'emerald',
  label,
}) => {
  const barCount = size === 'sm' ? 5 : size === 'md' ? 8 : 10;

  const getBarColorClass = (idx: number) => {
    if (!isSpeaking) return 'bg-slate-300';
    if (variant === 'indigo') {
      return idx % 2 === 0 ? 'bg-indigo-600' : 'bg-purple-600';
    }
    if (variant === 'rainbow') {
      const colors = [
        'bg-pink-500',
        'bg-purple-500',
        'bg-indigo-500',
        'bg-cyan-500',
        'bg-emerald-500',
        'bg-amber-500',
      ];
      return colors[idx % colors.length];
    }
    // Emerald / Teal default
    return idx % 3 === 0
      ? 'bg-emerald-500'
      : idx % 3 === 1
      ? 'bg-teal-500'
      : 'bg-emerald-400';
  };

  const barClasses = [
    'animate-audio-bar-1',
    'animate-audio-bar-2',
    'animate-audio-bar-3',
    'animate-audio-bar-4',
    'animate-audio-bar-5',
    'animate-audio-bar-6',
    'animate-audio-bar-7',
    'animate-audio-bar-8',
  ];

  return (
    <div className="inline-flex items-center gap-1.5 select-none" dir="rtl">
      {/* Equalizer Wave Container with Pure CSS Animations */}
      <div
        className={`flex items-center gap-0.5 px-1 py-0.5 rounded-full ${
          isSpeaking
            ? 'bg-emerald-50/80 border border-emerald-200/80 shadow-2xs animate-speech-aura'
            : 'bg-slate-100 border border-slate-200/60'
        } transition-all duration-300`}
        style={{
          height: size === 'sm' ? '18px' : size === 'md' ? '24px' : '30px',
        }}
        title={isSpeaking ? 'در حال پردازش گفتار هوش مصنوعی' : 'حالت آماده‌به‌کار'}
      >
        {Array.from({ length: barCount }).map((_, i) => (
          <span
            key={i}
            className={`w-[2.5px] rounded-full transition-all ${getBarColorClass(
              i
            )} ${isSpeaking ? barClasses[i % barClasses.length] : 'h-1.5 opacity-40'}`}
            style={{
              minHeight: '3px',
            }}
          />
        ))}
      </div>

      {label && (
        <span
          className={`text-[10px] font-bold ${
            isSpeaking ? 'text-emerald-700' : 'text-slate-400'
          } transition-colors`}
        >
          {label}
        </span>
      )}
    </div>
  );
};
