import React, { useState } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { ConnectedChannel } from '../types';

interface ConfirmDisconnectBottomSheetProps {
  channel: ConnectedChannel | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDisconnectBottomSheet: React.FC<
  ConfirmDisconnectBottomSheetProps
> = ({ channel, onConfirm, onCancel }) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  if (!channel) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    // If dragged downwards more than 50px, dismiss
    if (currentY - touchStartY > 60) {
      onCancel();
      setTouchStartY(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/50 backdrop-blur-xs select-none animate-in fade-in duration-150"
      dir="rtl"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[420px] mx-auto bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Drag Handle (NO X button as requested) */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 cursor-grab" />

        {/* Warning Icon & Texts */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-2xs">
            <Trash2 size={22} />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-base font-black text-slate-900">قطع اتصال کانال؟</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              آیا از قطع دسترسی و حذف کانال{' '}
              <span className="font-bold text-slate-800">«{channel.name}»</span> (
              <span className="font-mono text-slate-700" dir="ltr">
                {channel.handle}
              </span>
              ) اطمینان دارید؟
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Trash2 size={13} />
            <span>قطع اتصال</span>
          </button>
        </div>
      </div>
    </div>
  );
};
