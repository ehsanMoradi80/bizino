import React, { useState, useEffect } from 'react';
import {
  Mic,
  Plus,
  Send,
  X,
  FileSpreadsheet,
  Sparkles,
  BarChart2,
  Package,
  Globe,
  Square,
  Percent,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  TrendingUp,
} from 'lucide-react';

export type QuickMetricKey =
  | 'leads'
  | 'conversion'
  | 'clv'
  | 'inventory'
  | 'roas'
  | 'abandoned'
  | 'health'
  | 'chart'
  | 'site';

interface InputDockProps {
  onSendMessage: (text: string, attachedFile?: string) => void;
  onQuickAction: (actionKey: QuickMetricKey) => void;
  disabled?: boolean;
}

const quickButtons: {
  key: QuickMetricKey;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  colorClass: string;
}[] = [
  {
    key: 'leads',
    label: 'لیدهای داغ',
    icon: BarChart2,
    colorClass: 'text-rose-500',
  },
  {
    key: 'conversion',
    label: 'نرخ تبدیل (CR)',
    icon: Percent,
    colorClass: 'text-indigo-600',
  },
  {
    key: 'clv',
    label: 'خرید مجدد و CLV',
    icon: Users,
    colorClass: 'text-blue-600',
  },
  {
    key: 'inventory',
    label: 'گردش انبار',
    icon: Package,
    colorClass: 'text-amber-500',
  },
  {
    key: 'roas',
    label: 'تبلیغات و ROAS',
    icon: DollarSign,
    colorClass: 'text-emerald-600',
  },
  {
    key: 'abandoned',
    label: 'سبدهای رهاشده',
    icon: ShoppingCart,
    colorClass: 'text-orange-500',
  },
  {
    key: 'health',
    label: 'سلامت کسب‌وکار',
    icon: Activity,
    colorClass: 'text-teal-600',
  },
  {
    key: 'chart',
    label: 'نمودار فروش',
    icon: TrendingUp,
    colorClass: 'text-emerald-600',
  },
  {
    key: 'site',
    label: 'فروشگاه',
    icon: Globe,
    colorClass: 'text-indigo-600',
  },
];

export const InputDock: React.FC<InputDockProps> = ({
  onSendMessage,
  onQuickAction,
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setInputText((prev) => (prev ? `${prev} - بررسی سفارش‌ها` : 'بررسی سفارش‌های جدید دایرکت'));
    } else {
      setIsRecording(true);
    }
  };

  const handleAttachExcel = () => {
    if (attachedFile) {
      setAttachedFile(null);
    } else {
      setAttachedFile('customers.xlsx');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    onSendMessage(inputText.trim(), attachedFile || undefined);
    setInputText('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="p-2.5 shrink-0 z-10 w-full max-w-md mx-auto space-y-1.5 bg-white/90 backdrop-blur-md border-t border-slate-100"
      dir="rtl"
    >
      {/* Horizontally Scrollable Quick Metrics Strip (قابلیت اسکرول محور x) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 px-0.5 no-scrollbar scroll-smooth">
        {quickButtons.map((btn) => {
          const IconComp = btn.icon;
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => onQuickAction(btn.key)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs text-[11px] font-medium flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              <IconComp size={11} className={btn.colorClass} />
              <span>{btn.label}</span>
            </button>
          );
        })}

        {attachedFile && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono border border-emerald-200 shrink-0 whitespace-nowrap">
            <FileSpreadsheet size={11} />
            <span>{attachedFile}</span>
            <button
              onClick={() => setAttachedFile(null)}
              className="mr-0.5 text-slate-400 hover:text-slate-700"
            >
              <X size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Recording Overlay */}
      {isRecording && (
        <div className="p-2.5 rounded-2xl bg-white border border-rose-300 shadow-sm flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-rose-700 font-bold text-[11px]">در حال شنیدن پیام صوتی...</span>
            <span className="text-[10px] font-mono text-slate-400">00:0{recordingSeconds}</span>
          </div>

          <button
            type="button"
            onClick={handleToggleRecord}
            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
          >
            <Square size={9} />
            <span>توقف</span>
          </button>
        </div>
      )}

      {/* Floating Pill Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-full px-2.5 py-1 shadow-2xs focus-within:border-slate-400 focus-within:bg-white transition-all"
      >
        <button
          type="button"
          onClick={handleAttachExcel}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
            attachedFile ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-700'
          }`}
          title="پیوست فایل اکسل یا کاتالوگ"
        >
          <Plus size={16} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="دستور یا سؤالی از بیزینو بپرسید..."
          disabled={disabled}
          className="flex-1 bg-transparent px-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleToggleRecord}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
            isRecording ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-slate-700'
          }`}
          title="ورودی صوتی"
        >
          <Mic size={15} />
        </button>

        {inputText.trim() || attachedFile ? (
          <button
            type="submit"
            disabled={disabled}
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-all"
            title="ارسال"
          >
            <Send size={13} className="rotate-180" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggleRecord}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center transition-transform hover:scale-105 shrink-0"
            title="دستیار صوتی"
          >
            <Sparkles size={14} />
          </button>
        )}
      </form>
    </div>
  );
};
