import React from 'react';
import { MessageSquare, Layers, Settings } from 'lucide-react';

interface BottomNavBarProps {
  isVisible: boolean;
  activeTab: 'chat' | 'tools' | 'settings';
  onSelectTab: (tab: 'chat' | 'tools' | 'settings') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  isVisible,
  activeTab,
  onSelectTab,
}) => {
  // Exact requested order: 1. چت, 2. ابزارها, 3. تنظیمات
  const tabs = [
    { id: 'chat', label: 'چت', icon: MessageSquare },
    { id: 'tools', label: 'ابزارها', icon: Layers },
    { id: 'settings', label: 'تنظیمات', icon: Settings },
  ] as const;

  return (
    <div
      className={`w-full px-3 transition-all duration-300 ease-in-out shrink-0 select-none flex justify-center z-20 ${
        isVisible
          ? 'max-h-16 opacity-100 translate-y-0 pb-2 pt-1'
          : 'max-h-0 opacity-0 translate-y-4 overflow-hidden p-0 pointer-events-none'
      }`}
      dir="rtl"
    >
      <nav className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm rounded-2xl px-2 py-1 flex items-center gap-1 max-w-xs mx-auto">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 py-1.5 px-4 rounded-xl transition-all text-xs font-bold ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs scale-102'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <IconComp size={15} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
