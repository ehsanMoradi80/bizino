/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChatStream } from './components/ChatStream';
import { InputDock, QuickMetricKey } from './components/InputDock';
import { LiveSiteScreen } from './components/LiveSiteScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ToolsScreen } from './components/ToolsScreen';
import { AutomationBuilderScreen } from './components/AutomationBuilderScreen';
import { SessionsAndLibraryPanel } from './components/SessionsAndLibraryPanel';
import { OAuthScreen } from './components/OAuthScreen';
import { WelcomeIntroScreen } from './components/WelcomeIntroScreen';
import { BottomNavBar } from './components/BottomNavBar';
import {
  Message,
  UserProfile,
  ConnectedChannel,
  ChatSession,
  FolderItem,
  LibraryItem,
  PlatformType,
  InteractiveOption,
  MetricCardData,
} from './types';
import { Wifi, Battery, Signal } from 'lucide-react';

const initialChatMessages: Message[] = [
  {
    id: 'm-welcome',
    sender: 'ai',
    timestamp: '۱۰:۲۴',
    type: 'options',
    text: 'سلام و درود! من بیزینو هستم، کوچ اختصاصی و استراتژیست رشد فروش آنلاین و کسب‌وکار شما. برای شروع مسیر اختصاصی، نام شما چیه؟',
    options: [
      { id: 'opt-name-1', label: 'آریا تهرانی', actionValue: 'name:آریا تهرانی' },
      { id: 'opt-name-2', label: 'رضا کمالی', actionValue: 'name:رضا کمالی' },
    ],
  },
];

const initialFolders: FolderItem[] = [
  { id: 'f-leads', name: 'فروش و لیدها' },
  { id: 'f-content', name: 'کوچ محتوا' },
  { id: 'f-site', name: 'طراحی سایت و برند' },
];

const initialSessions: ChatSession[] = [
  {
    id: 's-onboarding',
    title: 'مسیر رشد و راه‌اندازی کسب‌وکار',
    folderId: 'f-leads',
    updatedAt: 'امروز',
    messages: initialChatMessages,
  },
];

const initialLibraryItems: LibraryItem[] = [
  {
    id: 'lib-1',
    title: 'قالب پیگیری دایرکت (کیف دوشی)',
    category: 'template',
    content:
      'سلام و درود! کیف دوشی چرم دست‌دوز عسلی که در استوری دیدید، فقط ۲ عدد موجوده. مایلید با ضمانت ۲ ساله براتون ارسال بشه؟',
    date: 'امروز',
  },
  {
    id: 'lib-2',
    title: 'قالب خوش‌آمدگویی فالوور جدید',
    category: 'template',
    content:
      'درود به شما چرم‌دوست گرامی! کد تخفیف ۱۰ درصدی اولین سفارش شما: CHARM10. ارسال امروز رایگانه.',
    date: 'دیروز',
  },
  {
    id: 'lib-3',
    title: 'داده مشتریان وفادار (customers.xlsx)',
    category: 'file',
    content:
      'فهرست ۱۸۰ مشتری وفادار کارگاه چرم آریا با میانگین خرید ۲.۴ میلیون تومان.',
    date: '۳ روز قبل',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<
    'welcome' | 'chat' | 'site' | 'settings' | 'tools' | 'automation_builder'
  >('welcome');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [inAppOAuthPlatform, setInAppOAuthPlatform] = useState<PlatformType | null>(null);

  // Scroll detection: Floating 3-tab BottomNavBar shows at top, hides when scrolled down
  const [isAtTop, setIsAtTop] = useState(true);
  const [activeBottomTab, setActiveBottomTab] = useState<'chat' | 'tools' | 'settings'>('chat');

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'آریا تهرانی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  // Dynamic user channels
  const [channels, setChannels] = useState<ConnectedChannel[]>([
    {
      id: 'ch-ig-1',
      platform: 'instagram',
      name: 'کارگاه چرم آریا (پیج اصلی)',
      handle: '@charm_aria_tehran',
      followers: '۱۸.۴K',
      isActive: true,
    },
  ]);

  const [activeChannel, setActiveChannel] = useState<ConnectedChannel>(channels[0]);

  // Sessions, Folders & Library state
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>('s-onboarding');
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(initialLibraryItems);

  const [isAiTyping, setIsAiTyping] = useState(false);

  // Active Session messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  // Update messages in active session
  const updateActiveMessages = (updater: (prev: Message[]) => Message[]) => {
    setSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.id === activeSession.id ? { ...s, messages: updater(s.messages) } : s
      )
    );
  };

  // Add new channel handler
  const handleAddNewChannel = (newChannel: ConnectedChannel) => {
    setChannels((prev) => {
      const exists = prev.some((c) => c.handle === newChannel.handle);
      if (exists) return prev;
      return [...prev, newChannel];
    });
    setActiveChannel(newChannel);

    setTimeout(() => {
      const analysisMsg: Message = {
        id: `ai-analysis-${Date.now()}`,
        sender: 'ai',
        timestamp: 'هم‌اکنون',
        type: 'page_analysis',
        text: `اکانت ${newChannel.handle} با موفقیت متصل شد. آنالیز کاتالوگ و پیج تکمیل گردید:`,
        scrapingData: {
          instagramHandle: newChannel.handle,
          itemsCount: 24,
          palette: [
            { name: 'عسلی', hex: '#B45309' },
            { name: 'قهوه‌ای', hex: '#78350F' },
            { name: 'کنیاک', hex: '#D97706' },
          ],
          engagementRate: '۴.۸٪',
        },
      };

      const siteDecisionMsg: Message = {
        id: `ai-site-ask-${Date.now()}`,
        sender: 'ai',
        timestamp: 'هم‌اکنون',
        type: 'options',
        text: 'آیا تمایل دارید برای این کسب‌وکار، یک وبسایت و فروشگاه آنلاین اختصاصی هم راه‌اندازی و طراحی بشه؟',
        options: [
          {
            id: 'opt-site-yes',
            label: 'بله، فروشگاه اختصاصی می‌خوام',
            actionValue: 'site:yes',
          },
          {
            id: 'opt-site-no',
            label: 'فعلاً فقط مدیریت شبکه‌های اجتماعی',
            actionValue: 'site:no',
          },
        ],
      };

      updateActiveMessages((prev) => [...prev, analysisMsg, siteDecisionMsg]);
    }, 400);
  };

  // Delete channel
  const handleDeleteChannel = (id: string) => {
    setChannels((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeChannel.id === id && remaining.length > 0) {
        setActiveChannel(remaining[0]);
      }
      return remaining;
    });
  };

  // Handle interactive options clicked in stream
  const handleSelectOption = (option: InteractiveOption) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: 'هم‌اکنون',
      type: 'text',
      text: option.label,
    };
    updateActiveMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);

      if (option.actionValue.startsWith('name:')) {
        const selectedName = option.actionValue.replace('name:', '');
        setUserProfile((p) => ({ ...p, name: selectedName }));

        const nextMsg: Message = {
          id: `ai-ask-platform-${Date.now()}`,
          sender: 'ai',
          timestamp: 'هم‌اکنون',
          type: 'platform_picker',
          text: `خیلی خوشبختم ${selectedName} جان! کدوم کانال یا پیج فروش اصلی رو مایلید متصل کنیم تا کاتالوگ، محصولات و نرخ تعاملش رو تحلیل کنم؟`,
        };
        updateActiveMessages((prev) => [...prev, nextMsg]);
      } else if (option.actionValue === 'site:yes') {
        const logoAskMsg: Message = {
          id: `ai-ask-logo-${Date.now()}`,
          sender: 'ai',
          timestamp: 'هم‌اکنون',
          type: 'options',
          text: 'فوق‌العاده است! برای لوگوی فروشگاه، آیا تصویر پروفایل پیج متصل‌شده مناسب است یا مایلید لوگوی اختصاصی آپلود کنید؟',
          options: [
            {
              id: 'opt-logo-page',
              label: `استفاده از تصویر پروفایل پیج (${activeChannel.handle})`,
              actionValue: 'logo:page',
            },
            {
              id: 'opt-logo-upload',
              label: 'آپلود لوگوی جدید',
              actionValue: 'logo:upload',
            },
          ],
        };
        updateActiveMessages((prev) => [...prev, logoAskMsg]);
      } else if (option.actionValue.startsWith('logo:')) {
        const paletteAskMsg: Message = {
          id: `ai-ask-palette-${Date.now()}`,
          sender: 'ai',
          timestamp: 'هم‌اکنون',
          type: 'palette_choice',
          text: 'تصویر لوگو تایید شد. بر اساس رنگ‌های شناسایی‌شده در برند شما، این ترکیب رنگ‌ها پیشنهاد می‌شوند:',
        };
        updateActiveMessages((prev) => [...prev, paletteAskMsg]);
      } else if (option.actionValue.startsWith('p-')) {
        const darkAskMsg: Message = {
          id: `ai-ask-dark-${Date.now()}`,
          sender: 'ai',
          timestamp: 'هم‌اکنون',
          type: 'options',
          text: 'پالت رنگی با موفقیت ثبت شد. آیا تمایل دارید نسخه دارک‌مود (حالت تاریک) هم برای سایت فعال شود؟',
          options: [
            {
              id: 'opt-dark-yes',
              label: 'بله، نسخه دارک‌مود هم فعال باشه',
              actionValue: 'dark:yes',
            },
            {
              id: 'opt-dark-no',
              label: 'خیر، فقط حالت روشن (لایت‌مود)',
              actionValue: 'dark:no',
            },
          ],
        };
        updateActiveMessages((prev) => [...prev, darkAskMsg]);
      } else if (option.actionValue.startsWith('dark:')) {
        const coachAskMsg: Message = {
          id: `ai-coach-ask-${Date.now()}`,
          sender: 'ai',
          timestamp: 'هم‌اکنون',
          type: 'options',
          text: 'تنظیمات اولیه فروشگاه انجام شد. حالا ایجنت‌های استراتژیست محتوا و بیزینس‌کوچ برای چیدن مسیر رشد: تارگت ماهانه فروشتون چقدره و چه امکاناتی برای تولید محتوا یا انبار دارید؟',
          options: [
            {
              id: 'opt-target-200',
              label: 'تارگت ماهانه ۲۰۰ م.ت (امکان ضبط ویدیو روزانه در کارگاه)',
              actionValue: 'target:200',
            },
            {
              id: 'opt-target-100',
              label: 'تارگت ماهانه ۱۰۰ م.ت (تولید محتوای آسان بدون چهره)',
              actionValue: 'target:100',
            },
          ],
        };
        updateActiveMessages((prev) => [...prev, coachAskMsg]);
      } else if (option.actionValue.startsWith('target:')) {
        const chartMsg: Message = {
          id: `ai-chart-${Date.now()}`,
          sender: 'ai',
          timestamp: 'هم‌اکنون',
          type: 'sales_chart',
          text: 'بر اساس تحلیل داده‌های پیج و سفارشات، مسیر صعودی برای دستیابی به تارگت ماهانه ۲۰۰ میلیون تومان شبیه‌سازی شد:',
        };

        const leadCardMsg: Message = {
          id: `ai-leads-card-${Date.now()}`,
          sender: 'ai',
          timestamp: 'هم‌اکنون',
          type: 'lead_action',
          text: 'فروشگاه آماده است و ۱۲ خریدار بالقوه در دایرکت منتظر دریافت پیشنهاد هستند:',
          leadData: {
            count: 12,
            suggestedMessage:
              'سلام و درود! کیف دوشی چرم دست‌دوز عسلی فقط ۲ عدد در کارگاه موجوده. مایلید براتون رزرو و ارسال بشه؟',
            isSent: false,
          },
        };
        updateActiveMessages((prev) => [...prev, chartMsg, leadCardMsg]);
      }
    }, 600);
  };

  // User free typing message submit
  const handleSendMessage = (text: string, attachedFile?: string) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: 'هم‌اکنون',
      type: 'text',
      text: attachedFile ? `${text ? text + ' ' : ''}[فایل: ${attachedFile}]` : text,
    };

    updateActiveMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);

      if (
        text.includes('نمودار') ||
        text.includes('فروش') ||
        text.includes('تحلیل') ||
        text.includes('آمار')
      ) {
        const chartMsg: Message = {
          id: `ai-chart-${Date.now()}`,
          sender: 'ai',
          timestamp: 'هم‌اکنون',
          type: 'sales_chart',
          text: 'نمودار تحلیل فروش ماهانه و روند دستیابی به تارگت ۲۰۰ م.ت آماده است:',
        };
        updateActiveMessages((prev) => [...prev, chartMsg]);
        return;
      }

      let reply = 'دستور دریافت شد و در دیتابیس ثبت گردید.';

      if (text.includes('سایت') || text.includes('فروشگاه')) {
        reply = 'فروشگاه اختصاصی شما آماده است. دکمه «فروشگاه» در بالای صفحه را لمس کنید.';
      } else if (text.includes('لید') || text.includes('دایرکت')) {
        reply = '۱۲ خریدار آماده در دایرکت در حال بررسی سبد خرید هستند.';
      } else {
        reply = `دستور «${text}» پردازش و روی چنل ${activeChannel.name} اعمال شد.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: 'هم‌اکنون',
        type: 'text',
        text: reply,
      };

      updateActiveMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  // Lead Action Send
  const handleSendLeadAction = (messageId: string) => {
    updateActiveMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.leadData
          ? { ...m, leadData: { ...m.leadData, isSent: true } }
          : m
      )
    );

    setTimeout(() => {
      const followUpMsg: Message = {
        id: `ai-follow-${Date.now()}`,
        sender: 'ai',
        timestamp: 'هم‌اکنون',
        type: 'text',
        text: 'پیام‌های پیگیری به ۱۲ مشتری در دایرکت ارسال شد. سفارشات جدید در بخش کاتالوگ همگام خواهند شد.',
      };
      updateActiveMessages((prev) => [...prev, followUpMsg]);
    }, 600);
  };

  // Execute AI strategy on Business Metric Cards
  const handleExecuteMetricStrategy = (actionPayload: string) => {
    setIsAiTyping(true);
    setTimeout(() => {
      setIsAiTyping(false);
      const confirmMsg: Message = {
        id: `ai-strat-exec-${Date.now()}`,
        sender: 'ai',
        timestamp: 'هم‌اکنون',
        type: 'text',
        text: `راهکار «${actionPayload}» در بیزینو فعال شد. سفارشات و پیام‌ها در صف ارسال و پایش خودکار قرار گرفتند.`,
      };
      updateActiveMessages((prev) => [...prev, confirmMsg]);
    }, 600);
  };

  // Quick Action triggered from the X-axis scrollable bar
  const handleQuickAction = (actionKey: QuickMetricKey) => {
    if (actionKey === 'site') {
      setCurrentView('site');
      return;
    }

    if (actionKey === 'chart') {
      const chartMsg: Message = {
        id: `ai-chart-${Date.now()}`,
        sender: 'ai',
        timestamp: 'هم‌اکنون',
        type: 'sales_chart',
        text: 'نمودار تحلیل فروش ماهانه و روند تحقق تارگت ۲۰۰ م.ت آماده است:',
      };
      updateActiveMessages((prev) => [...prev, chartMsg]);
      return;
    }

    if (actionKey === 'leads') {
      const leadCardMsg: Message = {
        id: `ai-leads-card-${Date.now()}`,
        sender: 'ai',
        timestamp: 'هم‌اکنون',
        type: 'lead_action',
        text: '۱۲ خریدار بالقوه در دایرکت منتظر دریافت پیشنهاد هستند:',
        leadData: {
          count: 12,
          suggestedMessage:
            'سلام و درود! کیف دوشی چرم دست‌دوز عسلی فقط ۲ عدد در کارگاه موجوده. مایلید براتون رزرو و ارسال بشه؟',
          isSent: false,
        },
      };
      updateActiveMessages((prev) => [...prev, leadCardMsg]);
      return;
    }

    // Business Metric KPI Cards Library
    const metricCardsMap: Record<string, MetricCardData> = {
      conversion: {
        id: 'metric-cr',
        category: 'conversion',
        title: 'نرخ تبدیل دایرکت به خرید (CR)',
        badge: 'عملکرد مطلوب',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        mainValue: '۳.۴٪',
        secondaryValue: '۱۴۲ سفارش نهایی از ۴,۱۸۰ دایرکت ورودی',
        trend: '+۱۸٪ رشد ماهانه',
        isPositive: true,
        benchmark: 'میانگین صنف چرم: ۲.۱٪',
        aiRecommendation:
          'پاسخگویی به خریداران در ۴ دقیقه ابتدایی نرخ تبدیل را ۱.۸ برابر کرده است. ارسال کاتالوگ خودکار در دقایق اول فعال بماند.',
        quickActionTitle: 'فعال‌سازی پیشنهاد خودکار کاتالوگ به دایرکت‌های جدید',
        actionPayload: 'پیشنهاد خودکار کاتالوگ در دایرکت',
      },
      clv: {
        id: 'metric-clv',
        category: 'clv',
        title: 'ارزش طول عمر مشتری (CLV)',
        badge: 'وفاداری بالا',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        mainValue: '۲.۱۵ م.ت',
        secondaryValue: 'میانگین ارزش سبد: ۱.۸۵ م.ت · نرخ خرید مجدد: ۲۸٪',
        trend: '+۱۲٪ ارزش هر مشتری',
        isPositive: true,
        benchmark: 'میانگین صنف: ۱.۴ م.ت',
        aiRecommendation:
          '۲۸٪ خریداران طی ۳ ماه گذشته سفارش دوم خود را ثبت کرده‌اند. ارسال کد تخفیف اختصاصی VIP برای خرید بعدی پیشنهاد می‌شود.',
        quickActionTitle: 'ارسال خودکار بن تخفیف ۱۰٪ به خریداران قبلی',
        actionPayload: 'کمپین تخفیف وفاداری VIP',
      },
      inventory: {
        id: 'metric-inv',
        category: 'inventory',
        title: 'گردش انبار و خواب سرمایه',
        badge: 'نیازمند شارژ موجودی',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        mainValue: '۱۲ روز',
        secondaryValue: 'میانگین گردش کالا در کارگاه چرم',
        trend: 'کم‌ریسک و سریع',
        isPositive: true,
        benchmark: 'کالای پرتقاضا: کیف دوشی عسلی (تنها ۲ عدد)',
        aiRecommendation:
          'کیف دوشی عسلی و کیف پول چرم کتی بیشترین تقاضا را دارند و موجودی تا ۴۸ ساعت آینده صفر خواهد شد. دستور تولید صادر شود.',
        quickActionTitle: 'صدور دستور تولید فوری ۱۰ عدد کیف دوشی عسلی',
        actionPayload: 'صدور دستور شارژ انبار کیف دوشی',
      },
      roas: {
        id: 'metric-roas',
        category: 'roas',
        title: 'بازگشت سرمایه تبلیغات (ROAS)',
        badge: 'راندمان عالی',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        mainValue: '۴.۲X',
        secondaryValue: 'هزینه جذب هر مشتری جدید (CAC): ۳۸ هزار تومان',
        trend: '+۰.۶X نسبت به کمپین قبل',
        isPositive: true,
        benchmark: 'تارگت سودآوری: بالای ۳.۵X',
        aiRecommendation:
          'ویدیوهای بررسی چرم طبیعی در برابر آب و آتش بالاترین نرخ بازگشت سرمایه تبلیغاتی را داشته‌اند. افزایش بودجه برای ریلزهای مشابه توصیه می‌شود.',
        quickActionTitle: 'تولید سناریوی جدید تست ضدآب در کوچ محتوا',
        actionPayload: 'سناریوی ریلز تست ضدآب چرم',
      },
      abandoned: {
        id: 'metric-abandoned',
        category: 'abandoned',
        title: 'سبدهای خرید رهاشده (Cart Recovery)',
        badge: 'فرصت فروش فوری',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        mainValue: '۳۵٪',
        secondaryValue: '۱۸ سبد در انتظار پرداخت نهایی',
        trend: '-۸٪ کاهش ریزش سبدها',
        isPositive: true,
        benchmark: 'ارزش سفارشات معلق: ۳۴ میلیون تومان',
        aiRecommendation:
          '۱۸ خریدار کالا را در سبد خرید یا دایرکت انتخاب کرده اما پرداخت نکرده‌اند. ارسال پیام یادآوری تخفیف ارسال رایگان ۲۴ ساعته توصیه می‌شود.',
        quickActionTitle: 'ارسال پیام رزرو ۲۴ ساعته با ارسال رایگان',
        actionPayload: 'بازیابی ۱۸ سبد خرید رهاشده',
      },
      health: {
        id: 'metric-health',
        category: 'health',
        title: 'شاخص سلامت همه‌جانبه کسب‌وکار',
        badge: 'وضعیت عالی (درجه A)',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        mainValue: '۷۸ / ۱۰۰',
        secondaryValue: 'محاسبه بر مبنای ۶ شاخص کلیدی مالی و تعاملی',
        trend: '+۵ امتیاز این هفته',
        isPositive: true,
        benchmark: 'بالاتر از ۸۲٪ پیج‌های هم‌رده',
        aiRecommendation:
          'نقاط قوت: تعامل دایرکت و حاشیه سود ۴۵٪. نقطه بهبود: تسریع زمان آماده‌سازی سفارش‌های سفارشی در کارگاه چرم.',
        quickActionTitle: 'فعال‌سازی برنامه ارتقای امتیاز به بالای ۸۵',
        actionPayload: 'برنامه بهبود سلامت کسب‌وکار',
      },
    };

    const targetMetric = metricCardsMap[actionKey];
    if (targetMetric) {
      const metricMsg: Message = {
        id: `ai-kpi-${Date.now()}`,
        sender: 'ai',
        timestamp: 'هم‌اکنون',
        type: 'kpi_card',
        text: `تحلیل شاخص «${targetMetric.title}» بر اساس داده‌های زنده پیج استخراج شد:`,
        metricData: targetMetric,
      };
      updateActiveMessages((prev) => [...prev, metricMsg]);
    }
  };

  // Site Edit Command
  const handleSiteEditCommand = (command: string) => {
    const userMsg: Message = {
      id: `u-site-${Date.now()}`,
      sender: 'user',
      timestamp: 'هم‌اکنون',
      type: 'text',
      text: command,
    };
    const aiMsg: Message = {
      id: `ai-site-${Date.now()}`,
      sender: 'ai',
      timestamp: 'هم‌اکنون',
      type: 'text',
      text: `تغییر «${command}» روی فروشگاه آنلاین اعمال شد.`,
    };
    updateActiveMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  // Floating 3-Tab Bottom Navigation selection
  const handleSelectBottomTab = (tab: 'chat' | 'tools' | 'settings') => {
    setActiveBottomTab(tab);
    if (tab === 'chat') {
      setCurrentView('chat');
    } else if (tab === 'tools') {
      setCurrentView('tools');
    } else if (tab === 'settings') {
      setCurrentView('settings');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex items-center justify-center p-0 md:p-3 font-sans select-none overflow-x-hidden">
      {/* Mobile Device Canvas - Unified Clean Light Theme (#FAF9FD) */}
      <div className="w-full max-w-[420px] h-[100dvh] md:h-[860px] bg-[#FAF9FD] text-slate-900 md:rounded-[44px] shadow-2xl md:border-[7px] md:border-slate-800 flex flex-col overflow-hidden relative">
        {/* Status Bar */}
        <div className="h-8 px-6 flex items-center justify-between text-xs text-slate-700 shrink-0 select-none bg-white/40 backdrop-blur-xs z-40">
          <span className="font-bold font-mono text-[12px]">9:41</span>
          <div className="w-20 h-3.5 bg-slate-900 rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal size={11} />
            <Wifi size={11} />
            <Battery size={12} />
          </div>
        </div>

        {/* Ambient Subtle Halos */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-50/40 blur-3xl pointer-events-none -z-10" />

        {/* Standalone OAuth Screen (when authenticating a platform) */}
        {inAppOAuthPlatform ? (
          <OAuthScreen
            platform={inAppOAuthPlatform}
            alreadyConnectedHandles={channels.map((c) => c.handle)}
            onSuccess={(newChannel) => {
              handleAddNewChannel(newChannel);
              setInAppOAuthPlatform(null);
            }}
            onCancel={() => setInAppOAuthPlatform(null)}
          />
        ) : (
          <>
            {/* View 1: Welcome Intro Screen */}
            {currentView === 'welcome' && (
              <WelcomeIntroScreen
                onGetStarted={() => {
                  setCurrentView('chat');
                  setActiveBottomTab('chat');
                }}
                onHaveAccount={() => {
                  setCurrentView('chat');
                  setActiveBottomTab('chat');
                }}
              />
            )}

            {/* View 2: Live Store Preview */}
            {currentView === 'site' && (
              <LiveSiteScreen
                onBack={() => setCurrentView('chat')}
                onSendEditCommand={handleSiteEditCommand}
              />
            )}

            {/* View 3: Settings Screen */}
            {currentView === 'settings' && (
              <div className="flex-1 flex flex-col overflow-hidden relative bg-[#FAF9FD]">
                <SettingsScreen
                  user={userProfile}
                  channels={channels}
                  activeChannel={activeChannel}
                  onBack={() => {
                    setCurrentView('chat');
                    setActiveBottomTab('chat');
                  }}
                  onUpdateUser={setUserProfile}
                  onSelectChannel={setActiveChannel}
                  onStartOAuth={(platform) => setInAppOAuthPlatform(platform)}
                  onDeleteChannel={handleDeleteChannel}
                />
                <BottomNavBar
                  isVisible={true}
                  activeTab="settings"
                  onSelectTab={handleSelectBottomTab}
                />
              </div>
            )}

            {/* View 4: Tools Screen (Hub of all tools) */}
            {currentView === 'tools' && (
              <div className="flex-1 flex flex-col overflow-hidden relative bg-[#FAF9FD]">
                <ToolsScreen
                  onBack={() => {
                    setCurrentView('chat');
                    setActiveBottomTab('chat');
                  }}
                  onOpenAutomationBuilder={() => setCurrentView('automation_builder')}
                />
                <BottomNavBar
                  isVisible={true}
                  activeTab="tools"
                  onSelectTab={handleSelectBottomTab}
                />
              </div>
            )}

            {/* View 4.1: Dedicated Mobile Automation Canvas Screen */}
            {currentView === 'automation_builder' && (
              <AutomationBuilderScreen
                onBack={() => setCurrentView('tools')}
              />
            )}

            {/* View 5: Chat-Driven Journey */}
            {currentView === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden relative bg-[#FAF9FD]">
                {/* Single Unified Header */}
                <Header
                  user={userProfile}
                  channels={channels}
                  activeChannel={activeChannel}
                  onSelectChannel={setActiveChannel}
                  onStartOAuth={(platform) => setInAppOAuthPlatform(platform)}
                  onDeleteChannel={handleDeleteChannel}
                  onNavigateToSite={() => setCurrentView('site')}
                  onOpenPanel={() => setIsPanelOpen(true)}
                />

                {/* Chat Stream (Tracks scroll position to show/hide bottom nav bar) */}
                <ChatStream
                  user={userProfile}
                  messages={messages}
                  onSelectOption={handleSelectOption}
                  onSelectPlatform={(platform) => setInAppOAuthPlatform(platform)}
                  onSendLeadAction={handleSendLeadAction}
                  onExecuteMetricStrategy={handleExecuteMetricStrategy}
                  onNavigateToSite={() => setCurrentView('site')}
                  onScrollTopChange={(isTop) => setIsAtTop(isTop)}
                  isAiTyping={isAiTyping}
                />

                {/* Floating Input Dock with Horizontally Scrollable Metrics */}
                <InputDock
                  onSendMessage={handleSendMessage}
                  onQuickAction={handleQuickAction}
                  disabled={isAiTyping}
                />

                {/* Bottom Navigation Bar */}
                <BottomNavBar
                  isVisible={isAtTop}
                  activeTab={activeBottomTab}
                  onSelectTab={handleSelectBottomTab}
                />

                {/* Sessions, Folders & Library Side Panel */}
                <SessionsAndLibraryPanel
                  isOpen={isPanelOpen}
                  onClose={() => setIsPanelOpen(false)}
                  sessions={sessions}
                  activeSessionId={activeSession.id}
                  folders={folders}
                  libraryItems={libraryItems}
                  onSelectSession={setActiveSessionId}
                  onCreateSession={(fId) => {
                    const newId = `s-${Date.now()}`;
                    setSessions((prev) => [
                      {
                        id: newId,
                        title: `سشن جدید ${prev.length + 1}`,
                        folderId: fId,
                        updatedAt: 'هم‌اکنون',
                        messages: [
                          {
                            id: `m-${Date.now()}`,
                            sender: 'ai',
                            timestamp: 'هم‌اکنون',
                            type: 'text',
                            text: 'سشن جدید ایجاد شد. چه کمکی می‌تونم بکنم؟',
                          },
                        ],
                      },
                      ...prev,
                    ]);
                    setActiveSessionId(newId);
                  }}
                  onDeleteSession={(id) => {
                    if (sessions.length <= 1) return;
                    setSessions((prev) => prev.filter((c) => c.id !== id));
                  }}
                  onCreateFolder={(fname) =>
                    setFolders((prev) => [...prev, { id: `f-${Date.now()}`, name: fname }])
                  }
                  onCreateLibraryItem={(item) =>
                    setLibraryItems((prev) => [
                      { ...item, id: `lib-${Date.now()}`, date: 'هم‌اکنون' },
                      ...prev,
                    ])
                  }
                  onInsertLibraryItem={(content) => handleSendMessage(content)}
                />
              </div>
            )}
          </>
        )}

        {/* Home Indicator */}
        <div className="h-3 flex items-center justify-center shrink-0 bg-transparent pb-0.5">
          <div className="w-24 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
