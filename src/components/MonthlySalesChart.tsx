import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Target,
  BarChart2,
  Calendar,
  Sparkles,
  ShoppingBag,
  Percent,
} from 'lucide-react';

export interface SalesDataPoint {
  month: string;
  sales: number; // in millions tomans
  target: number;
  orders: number;
  aov: number; // average order value in thousand tomans
}

const defaultMonthlyData: SalesDataPoint[] = [
  { month: 'فروردین', sales: 68, target: 120, orders: 42, aov: 1619 },
  { month: 'اردیبهشت', sales: 94, target: 140, orders: 58, aov: 1620 },
  { month: 'خرداد', sales: 115, target: 160, orders: 74, aov: 1554 },
  { month: 'تیر', sales: 132, target: 175, orders: 85, aov: 1552 },
  { month: 'مرداد', sales: 158, target: 190, orders: 98, aov: 1612 },
  { month: 'شهریور', sales: 184, target: 200, orders: 114, aov: 1614 },
];

interface MonthlySalesChartProps {
  data?: SalesDataPoint[];
  currentGoal?: number;
}

export const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({
  data = defaultMonthlyData,
  currentGoal = 200,
}) => {
  const [activeMetric, setActiveMetric] = useState<'sales' | 'orders' | 'aov'>('sales');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(data.length - 1);

  const selectedData = data[selectedMonthIndex] || data[data.length - 1];
  const previousData = data[Math.max(0, selectedMonthIndex - 1)];

  const growthRate =
    selectedMonthIndex > 0
      ? Math.round(((selectedData.sales - previousData.sales) / previousData.sales) * 100)
      : 15;

  const targetProgress = Math.min(
    Math.round((selectedData.sales / currentGoal) * 100),
    100
  );

  return (
    <div
      className="w-full bg-slate-900 text-white rounded-2xl p-3.5 shadow-md border border-slate-800 space-y-3 select-none text-right transition-all"
      dir="rtl"
    >
      {/* Top Header & Interactive Metric Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <BarChart2 size={14} />
          </div>
          <div>
            <span className="text-xs font-black block leading-none">
              تحلیل میله‌ای فروش و سفارشات
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              تارگت ماهانه: {currentGoal} م.ت
            </span>
          </div>
        </div>

        {/* 3 Metric Tabs: فروش | سفارشات | میانگین سبد */}
        <div className="flex items-center gap-0.5 bg-slate-800/90 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveMetric('sales')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              activeMetric === 'sales'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            فروش
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('orders')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              activeMetric === 'orders'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            سفارش
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('aov')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              activeMetric === 'aov'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            سبد
          </button>
        </div>
      </div>

      {/* Selected Month Summary Badges */}
      <div className="grid grid-cols-3 gap-1.5 text-right">
        <div className="bg-slate-800/60 border border-slate-800/80 rounded-xl p-2 space-y-0.5">
          <span className="text-[9px] text-slate-400 block truncate">
            {selectedData.month}
          </span>
          <span className="text-xs font-black text-emerald-400 font-mono block">
            {activeMetric === 'sales'
              ? `${selectedData.sales} م.ت`
              : activeMetric === 'orders'
              ? `${selectedData.orders} سفارش`
              : `${(selectedData.aov / 1000).toFixed(2)} م.ت`}
          </span>
        </div>

        <div className="bg-slate-800/60 border border-slate-800/80 rounded-xl p-2 space-y-0.5">
          <span className="text-[9px] text-slate-400 block">رشد ماهانه</span>
          <span className="text-xs font-bold text-white font-mono flex items-center gap-0.5">
            <TrendingUp size={11} className="text-emerald-400" />
            <span>+{growthRate}٪</span>
          </span>
        </div>

        <div className="bg-slate-800/60 border border-slate-800/80 rounded-xl p-2 space-y-0.5">
          <span className="text-[9px] text-slate-400 block">تحقق تارگت</span>
          <span className="text-xs font-bold text-indigo-400 font-mono block">
            {targetProgress}٪
          </span>
        </div>
      </div>

      {/* Recharts Bar Chart Area */}
      <div className="h-44 w-full pt-1" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 4, left: -22, bottom: 0 }}
            onClick={(state) => {
              if (state && typeof state.activeTooltipIndex === 'number') {
                setSelectedMonthIndex(state.activeTooltipIndex);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'Vazirmatn' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as SalesDataPoint;
                  return (
                    <div
                      className="bg-slate-950/95 border border-slate-700/80 p-2 rounded-xl shadow-xl text-right text-xs space-y-1"
                      dir="rtl"
                    >
                      <span className="font-bold text-white block pb-0.5 border-b border-slate-800">
                        {item.month}
                      </span>
                      <div className="space-y-0.5 font-mono text-[10px]">
                        <div className="text-emerald-400 flex justify-between gap-3">
                          <span>فروش:</span>
                          <span className="font-bold">{item.sales} میلیون تومان</span>
                        </div>
                        <div className="text-sky-400 flex justify-between gap-3">
                          <span>سفارش‌ها:</span>
                          <span>{item.orders} عدد</span>
                        </div>
                        <div className="text-amber-400 flex justify-between gap-3">
                          <span>میانگین سبد:</span>
                          <span>{(item.aov / 1000).toFixed(2)} م.ت</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={activeMetric === 'sales' ? 'sales' : activeMetric === 'orders' ? 'orders' : 'aov'}
              radius={[6, 6, 0, 0]}
              cursor="pointer"
            >
              {data.map((entry, index) => {
                const isSelected = index === selectedMonthIndex;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      isSelected
                        ? '#10B981' // emerald-500 for active/selected bar
                        : '#3B82F6' // blue-500
                    }
                    opacity={isSelected ? 1 : 0.75}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Target Progress Bar & AI Insight Note */}
      <div className="space-y-1 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">پیشرفت تا تارگت ۲۰۰ میلیونی:</span>
          <span className="font-mono text-emerald-400 font-bold">
            {selectedData.sales} / {currentGoal} م.ت ({targetProgress}٪)
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${targetProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
