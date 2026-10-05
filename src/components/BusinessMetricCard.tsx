import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Users,
  Package,
  Activity,
  DollarSign,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { MetricCardData } from '../types';

interface BusinessMetricCardProps {
  data: MetricCardData;
  onExecuteStrategy?: (actionPayload: string) => void;
}

export const BusinessMetricCard: React.FC<BusinessMetricCardProps> = ({
  data,
  onExecuteStrategy,
}) => {
  const [isExecuted, setIsExecuted] = useState(false);

  const getCategoryIcon = () => {
    switch (data.category) {
      case 'conversion':
        return <Percent size={15} />;
      case 'clv':
        return <Users size={15} />;
      case 'inventory':
        return <Package size={15} />;
      case 'roas':
        return <DollarSign size={15} />;
      case 'abandoned':
        return <ShoppingCart size={15} />;
      case 'health':
        return <Activity size={15} />;
      case 'traffic':
        return <ArrowUpRight size={15} />;
      default:
        return <Activity size={15} />;
    }
  };

  const handleAction = () => {
    setIsExecuted(true);
    if (onExecuteStrategy && data.actionPayload) {
      onExecuteStrategy(data.actionPayload);
    }
  };

  return (
    <div
      className="w-full bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3 select-none text-right transition-all hover:shadow-xs"
      dir="rtl"
    >
      {/* Header Row: Title & Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            {getCategoryIcon()}
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 leading-none">
              {data.title}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              {data.secondaryValue}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            data.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {data.badge}
        </span>
      </div>

      {/* Main KPI Stat & Trend Comparison */}
      <div className="flex items-end justify-between px-1">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold">
            مقدار فعلی کسب‌وکار
          </span>
          <span className="text-xl font-black text-slate-900 font-mono tracking-tight block">
            {data.mainValue}
          </span>
        </div>

        <div className="text-left">
          <span
            className={`text-xs font-bold font-mono inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg ${
              data.isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {data.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{data.trend}</span>
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">
            {data.benchmark}
          </span>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/90 text-slate-700 space-y-1">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-800">
          <Sparkles size={11} className="text-indigo-600" />
          <span>تحلیل و توصیه استراتژیست بیزینو:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          {data.aiRecommendation}
        </p>
      </div>

      {/* Action Button */}
      {data.quickActionTitle && (
        <button
          type="button"
          disabled={isExecuted}
          onClick={handleAction}
          className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
            isExecuted
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
              : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-98'
          }`}
        >
          {isExecuted ? (
            <>
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>راهکار فعال و در دستور کار قرار گرفت</span>
            </>
          ) : (
            <>
              <span>{data.quickActionTitle}</span>
              <ArrowLeft size={13} />
            </>
          )}
        </button>
      )}
    </div>
  );
};
