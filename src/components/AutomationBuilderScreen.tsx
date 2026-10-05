import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Zap,
  Menu,
  Sparkles,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Send,
  Filter,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowLeftRight,
  Split,
  GitBranch,
  Sliders,
  Move,
  Hand,
  RotateCcw,
} from 'lucide-react';
import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
  EitaaIcon,
  BaleIcon,
  RubikaIcon,
} from './SocialIcons';

interface AutomationBuilderScreenProps {
  onBack: () => void;
}

export interface GraphNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  title: string;
  subtitle: string;
  platform?: 'instagram' | 'telegram' | 'whatsapp' | 'eitaa' | 'bale' | 'rubika' | 'store';
  content: string;
  badge: string;
  badgeColor: string;
  // Canvas placement coordinates (relative px)
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  isReversed?: boolean; // Flip flow direction as requested!
  color?: string;
}

export interface AutomationSession {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  platform: 'instagram' | 'telegram' | 'whatsapp' | 'eitaa' | 'bale' | 'rubika' | 'store';
  nodes: GraphNode[];
  edges: GraphEdge[];
  executionCount: number;
}

const initialSessions: AutomationSession[] = [
  {
    id: 's-auto-1',
    title: 'پاسخ هوشمند چندشاخه‌ای استعلام قیمت',
    description: 'تریگر دایرکت به چندین شاخه شرطی متصل می‌شود: اگر موجود بود کاتالوگ ارسال شود و اگر موجود نبود شارژ کارگاه ثبت شود.',
    isActive: true,
    platform: 'instagram',
    executionCount: 142,
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'تریگر: پیام جدید در دایرکت',
        subtitle: 'اینستاگرام (@charm_aria_tehran)',
        platform: 'instagram',
        content: 'دریافت کلمات «قیمت»، «چند»، «موجوده» یا سوال در استوری',
        badge: 'Trigger',
        badgeColor: 'bg-amber-500 text-white',
        x: 130,
        y: 30,
      },
      {
        id: 'node-2',
        type: 'condition',
        title: 'شاخه ۱: بررسی موجودی در کارگاه',
        subtitle: 'موجودی کالای استعلام‌شده > ۰',
        content: 'اگر موجودی کیف دوشی بالای صفر بود',
        badge: 'Condition A',
        badgeColor: 'bg-indigo-600 text-white',
        x: 20,
        y: 200,
      },
      {
        id: 'node-3',
        type: 'condition',
        title: 'شاخه ۲: بررسی کسری و اتمام موجودی',
        subtitle: 'موجودی = ۰ عدد',
        content: 'اگر محصول به اتمام رسیده باشد',
        badge: 'Condition B',
        badgeColor: 'bg-purple-600 text-white',
        x: 240,
        y: 200,
      },
      {
        id: 'node-4',
        type: 'action',
        title: 'اکشن ۱: ارسال قیمت و کاتالوگ در دایرکت',
        subtitle: 'پاسخ فوری به خریدار',
        platform: 'instagram',
        content: '«درود! کیف دوشی چرم عسلی ۱,۸۵۰,۰۰۰ تومان با ضمانت ۲ ساله موجوده. مایلید رزرو بشه؟»',
        badge: 'Action A',
        badgeColor: 'bg-emerald-600 text-white',
        x: 20,
        y: 380,
      },
      {
        id: 'node-5',
        type: 'action',
        title: 'اکشن ۲: هشدار شارژ انبار و پیش‌ثبت‌نام',
        subtitle: 'نوتیفیکیشن ایتا + پیام به مشتری',
        platform: 'eitaa',
        content: '«موجودی این مدل به پایان رسیده، اما طی ۳ روز آینده شارژ خواهد شد. شماره تماس جهت رزرو دریافت شد.»',
        badge: 'Action B',
        badgeColor: 'bg-teal-600 text-white',
        x: 240,
        y: 380,
      },
    ],
    edges: [
      {
        id: 'edge-1-2',
        sourceId: 'node-1',
        targetId: 'node-2',
        label: 'موجودی مثبت',
        color: '#6366F1',
      },
      {
        id: 'edge-1-3',
        sourceId: 'node-1',
        targetId: 'node-3',
        label: 'اتمام موجودی',
        color: '#A855F7',
      },
      {
        id: 'edge-2-4',
        sourceId: 'node-2',
        targetId: 'node-4',
        label: 'ارسال پاسخ',
        color: '#10B981',
      },
      {
        id: 'edge-3-5',
        sourceId: 'node-3',
        targetId: 'node-5',
        label: 'هشدار کارگاه',
        color: '#0D9488',
      },
    ],
  },
  {
    id: 's-auto-2',
    title: 'بازیابی هوشمند و چندکاناله سبد خرید',
    description: 'سبد خرید رهاشده به دو شاخه واتساپ و پیامک متصل شده و رزرو کالا را پیگیری می‌کند.',
    isActive: true,
    platform: 'store',
    executionCount: 48,
    nodes: [
      {
        id: 'node-s2-1',
        type: 'trigger',
        title: 'تریگر: سبد رهاشده در فروشگاه',
        subtitle: 'گذشت ۲ ساعت بدون پرداخت',
        platform: 'store',
        content: 'ثبت محصول در سبد و عدم پرداخت نهایی پس از ۱۲۰ دقیقه',
        badge: 'Trigger',
        badgeColor: 'bg-amber-500 text-white',
        x: 130,
        y: 30,
      },
      {
        id: 'node-s2-2',
        type: 'action',
        title: 'اکشن ۱: ارسال کوپن ارسال رایگان واتساپ',
        subtitle: 'پیام خوش‌آمد و ارسال رایگان',
        platform: 'whatsapp',
        content: '«سلام! سبد خرید شما در کارگاه چرم آریا با کد FREE-POST تا پایان امشب ارسال رایگان دارد.»',
        badge: 'Action A',
        badgeColor: 'bg-emerald-600 text-white',
        x: 20,
        y: 230,
      },
      {
        id: 'node-s2-3',
        type: 'action',
        title: 'اکشن ۲: پیامک رزرو ۲۴ ساعته کالا',
        subtitle: 'سامانه پیامک هوشمند',
        platform: 'store',
        content: '«محصولات انتخابی شما به مدت ۲۴ ساعت در انبار رزرو ماند.»',
        badge: 'Action B',
        badgeColor: 'bg-blue-600 text-white',
        x: 240,
        y: 230,
      },
    ],
    edges: [
      {
        id: 'edge-s2-1-2',
        sourceId: 'node-s2-1',
        targetId: 'node-s2-2',
        label: 'ارسال در واتساپ',
        color: '#10B981',
      },
      {
        id: 'edge-s2-1-3',
        sourceId: 'node-s2-1',
        targetId: 'node-s2-3',
        label: 'ارسال پیامک رزرو',
        color: '#3B82F6',
      },
    ],
  },
];

const promptSuggestions = [
  'یک نود تریگر دایرکت را به دو شاخه: موجودی کافی و کسری انبار وصل کن',
  'اگر در دایرکت کلمه قیمت اومد، کاتالوگ کیف دوشی رو بفرست',
  'سبد خرید رهاشده رو هم به پیامک و هم به واتساپ متصل کن',
  'وقتی موجودی کیف به زیر ۳ تا رسید، در ایتا به مدیر هشدار بده',
];

export const AutomationBuilderScreen: React.FC<AutomationBuilderScreenProps> = ({
  onBack,
}) => {
  const [sessions, setSessions] = useState<AutomationSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>('s-auto-1');
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);

  // 1. FREE-PANNING & ZOOMING STATE
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasZoom, setCanvasZoom] = useState<number>(95);
  const [isPanning, setIsPanning] = useState(false);

  // Dragging gesture tracking
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(95);

  // Node Dragging on Canvas
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const nodeDragStartRef = useRef<{ mouseX: number; mouseY: number; nodeX: number; nodeY: number }>({
    mouseX: 0,
    mouseY: 0,
    nodeX: 0,
    nodeY: 0,
  });

  // Chat bar natural language input
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [testLog, setTestLog] = useState<string | null>(null);

  // New connection mode: clicking a node as source then another node as target
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleToggleActive = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Reverse direction of an edge (معکوس کردن جهت لبه)
  const handleReverseEdge = (edgeId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSession.id) return s;
        return {
          ...s,
          edges: s.edges.map((e) => {
            if (e.id !== edgeId) return e;
            return {
              ...e,
              sourceId: e.targetId,
              targetId: e.sourceId,
              isReversed: !e.isReversed,
            };
          }),
        };
      })
    );
  };

  // Delete an edge
  const handleDeleteEdge = (edgeId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? { ...s, edges: s.edges.filter((e) => e.id !== edgeId) }
          : s
      )
    );
    setSelectedEdge(null);
  };

  // Add new branch connection between nodes
  const handleStartConnect = (nodeId: string) => {
    if (!connectingSourceId) {
      setConnectingSourceId(nodeId);
    } else if (connectingSourceId === nodeId) {
      setConnectingSourceId(null);
    } else {
      const newEdge: GraphEdge = {
        id: `edge-${Date.now()}`,
        sourceId: connectingSourceId,
        targetId: nodeId,
        label: 'اتصال شاخه جدید',
        color: '#6366F1',
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? { ...s, edges: [...s.edges, newEdge] }
            : s
        )
      );
      setConnectingSourceId(null);
    }
  };

  // Run simulation
  const handleRunSimulation = () => {
    setTestLog('در حال شبیه‌سازی انتشار رویداد در شاخه‌های متصل...');
    setTimeout(() => {
      setTestLog(
        `تست موفق: تریگر وارد شد -> به ${activeSession.edges.length} شاخه و نود متصل گسترش یافت و خروجی‌ها صادر شدند.`
      );
      setTimeout(() => {
        setTestLog(null);
      }, 4500);
    }, 1000);
  };

  // Reset pan and zoom to default
  const handleResetViewport = () => {
    setPan({ x: 0, y: 0 });
    setCanvasZoom(95);
  };

  // ----------------------------------------------------
  // TOUCH & MOUSE PAN / PINCH GESTURES
  // ----------------------------------------------------
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking canvas background (not node or buttons)
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY };
      initialPanRef.current = { ...pan };
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const dx = (e.clientX - nodeDragStartRef.current.mouseX) / (canvasZoom / 100);
      const dy = (e.clientY - nodeDragStartRef.current.mouseY) / (canvasZoom / 100);
      const newX = Math.round(nodeDragStartRef.current.nodeX + dx);
      const newY = Math.round(nodeDragStartRef.current.nodeY + dy);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                nodes: s.nodes.map((n) =>
                  n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n
                ),
              }
            : s
        )
      );
    } else if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({
        x: initialPanRef.current.x + dx,
        y: initialPanRef.current.y + dy,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Mobile Touch Gestures (Pannable + Pinch to Zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // 1 Finger: Pan Canvas
      const touch = e.touches[0];
      setIsPanning(true);
      panStartRef.current = { x: touch.clientX, y: touch.clientY };
      initialPanRef.current = { ...pan };
      pinchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      // 2 Fingers: Pinch to Zoom
      setIsPanning(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistRef.current = dist;
      pinchStartZoomRef.current = canvasZoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      const dx = touch.clientX - panStartRef.current.x;
      const dy = touch.clientY - panStartRef.current.y;
      setPan({
        x: initialPanRef.current.x + dx,
        y: initialPanRef.current.y + dy,
      });
    } else if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / pinchStartDistRef.current;
      const newZoom = Math.min(Math.max(Math.round(pinchStartZoomRef.current * factor), 50), 160);
      setCanvasZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    pinchStartDistRef.current = null;
    setDraggingNodeId(null);
  };

  // Start dragging an individual node
  const handleNodeMouseDown = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    nodeDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };
  };

  // Node position helper for SVG connectors
  const getNodeCenter = (nodeId: string) => {
    const node = activeSession.nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 180, y: 100, topX: 180, topY: 100, bottomX: 180, bottomY: 100 };
    const width = 175;
    const height = 110;
    return {
      x: node.x + width / 2,
      y: node.y + height / 2,
      topX: node.x + width / 2,
      topY: node.y,
      bottomX: node.x + width / 2,
      bottomY: node.y + height,
    };
  };

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'instagram':
        return <InstagramIcon size={13} />;
      case 'telegram':
        return <TelegramIcon size={13} />;
      case 'whatsapp':
        return <WhatsAppIcon size={13} />;
      case 'eitaa':
        return <EitaaIcon size={13} />;
      case 'bale':
        return <BaleIcon size={13} />;
      case 'rubika':
        return <RubikaIcon size={13} />;
      default:
        return <Zap size={13} />;
    }
  };

  const handlePromptSubmit = (customText?: string) => {
    const text = (customText || promptInput).trim();
    if (!text) return;

    setIsProcessing(true);
    setPromptInput('');

    setTimeout(() => {
      setIsProcessing(false);

      if (text.includes('شاخه') || text.includes('چند')) {
        const trigNode: GraphNode = {
          id: `node-${Date.now()}-1`,
          type: 'trigger',
          title: 'تریگر: پیام جدید در دایرکت',
          subtitle: 'اینستاگرام (@charm_aria_tehran)',
          platform: 'instagram',
          content: 'دریافت استعلام محصول یا کلمات کلیدی',
          badge: 'Trigger',
          badgeColor: 'bg-amber-500 text-white',
          x: 130,
          y: 30,
        };
        const branchA: GraphNode = {
          id: `node-${Date.now()}-2`,
          type: 'action',
          title: 'شاخه الف: ارسال کاتالوگ و قیمت',
          subtitle: 'پاسخ مستقیم در دایرکت',
          platform: 'instagram',
          content: '«درود! کاتالوگ با قیمت روزانه تقدیم شما.»',
          badge: 'Action A',
          badgeColor: 'bg-emerald-600 text-white',
          x: 20,
          y: 230,
        };
        const branchB: GraphNode = {
          id: `node-${Date.now()}-3`,
          type: 'action',
          title: 'شاخه ب: ارسال در تلگرام مدیریت',
          subtitle: 'پایش لیدهای داغ',
          platform: 'telegram',
          content: '«یک خریدار جدید در دایرکت استعلام قیمت داد.»',
          badge: 'Action B',
          badgeColor: 'bg-sky-600 text-white',
          x: 240,
          y: 230,
        };

        const newEdges: GraphEdge[] = [
          {
            id: `edge-${Date.now()}-1`,
            sourceId: trigNode.id,
            targetId: branchA.id,
            label: 'شاخه دایرکت',
            color: '#10B981',
          },
          {
            id: `edge-${Date.now()}-2`,
            sourceId: trigNode.id,
            targetId: branchB.id,
            label: 'شاخه تلگرام',
            color: '#0284C7',
          },
        ];

        const newSession: AutomationSession = {
          id: `s-auto-${Date.now()}`,
          title: 'سناریوی هوشمند چندشاخه‌ای',
          description: `تولیدشده با زبان ساده: «${text}»`,
          isActive: true,
          platform: 'instagram',
          nodes: [trigNode, branchA, branchB],
          edges: newEdges,
          executionCount: 0,
        };

        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
      } else {
        const trigNode: GraphNode = {
          id: `node-${Date.now()}-1`,
          type: 'trigger',
          title: 'تریگر: رویداد فروشگاه یا دایرکت',
          subtitle: 'پلتفرم متصل',
          platform: 'instagram',
          content: 'دریافت پیام یا تغییر وضعیت سفارش',
          badge: 'Trigger',
          badgeColor: 'bg-amber-500 text-white',
          x: 130,
          y: 30,
        };
        const actNode: GraphNode = {
          id: `node-${Date.now()}-2`,
          type: 'action',
          title: 'اکشن: اقدام خودکار بیزینو',
          subtitle: 'ارسال پیام یا صدور فاکتور',
          platform: 'instagram',
          content: '«پیام خودکار بر اساس هوش مصنوعی ارسال شد.»',
          badge: 'Action',
          badgeColor: 'bg-emerald-600 text-white',
          x: 130,
          y: 230,
        };

        const newSession: AutomationSession = {
          id: `s-auto-${Date.now()}`,
          title: 'سناریوی اتوماسیون جدید',
          description: `ایجادشده: «${text}»`,
          isActive: true,
          platform: 'instagram',
          nodes: [trigNode, actNode],
          edges: [
            {
              id: `edge-${Date.now()}-1`,
              sourceId: trigNode.id,
              targetId: actNode.id,
              label: 'اقدام مستقیم',
              color: '#10B981',
            },
          ],
          executionCount: 0,
        };

        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
      }
    }, 800);
  };

  return (
    <div
      className="flex-1 w-full h-full flex flex-col justify-between bg-[#FAF9FD] text-slate-800 select-none overflow-hidden relative"
      dir="rtl"
    >
      {/* Top Header */}
      <div className="px-4 py-2.5 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            title="بازگشت به ابزارها"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-black text-slate-900 leading-none">
                کانواس اتوماسیون (Bizino Flow)
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block truncate max-w-[170px]">
              {activeSession.title}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRunSimulation}
            className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-2xs"
            title="تست و شبیه‌سازی"
          >
            <Play size={13} className="fill-white" />
          </button>

          <button
            type="button"
            onClick={() => setIsSideSheetOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-2xs"
            title="سشن‌ها و سناریوهای ذخیره‌شده"
          >
            <Menu size={13} />
            <span className="text-[10px]">سشن‌ها</span>
            <span className="text-[9px] px-1 rounded-full bg-slate-900 text-white font-mono">
              {sessions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Floating Canvas Controls (Free Pan & Zoom Tools) */}
      <div className="absolute top-14 left-4 z-20 flex items-center gap-1 bg-white/95 border border-slate-200/90 shadow-sm rounded-full p-1">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
            isPanning ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'
          }`}
          title="قابلیت حرکت آزادانه در کانواس (Pannable با لمس یا کشیدن)"
        >
          <Hand size={12} />
        </div>

        <button
          type="button"
          onClick={() => setCanvasZoom((z) => Math.min(z + 10, 150))}
          className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 text-xs"
          title="بزرگنمایی (+)"
        >
          <ZoomIn size={12} />
        </button>

        <span className="text-[9px] font-mono text-slate-600 px-1 font-bold">
          {canvasZoom}%
        </span>

        <button
          type="button"
          onClick={() => setCanvasZoom((z) => Math.max(z - 10, 50))}
          className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 text-xs"
          title="کوچک‌نمایی (-)"
        >
          <ZoomOut size={12} />
        </button>

        <button
          type="button"
          onClick={handleResetViewport}
          className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 text-xs"
          title="تنظیم مجدد موقعیت و بزرگنمایی"
        >
          <RotateCcw size={11} />
        </button>
      </div>

      {/* Status Toggle on Right */}
      <div className="absolute top-14 right-4 z-20 flex items-center gap-1.5 bg-white/95 border border-slate-200/90 shadow-sm rounded-full px-2.5 py-1">
        <span className="text-[10px] font-bold text-slate-600">وضعیت:</span>
        <button
          type="button"
          onClick={() => handleToggleActive(activeSession.id)}
          className={`w-8 h-4.5 rounded-full transition-colors relative p-0.5 shrink-0 ${
            activeSession.isActive ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
              activeSession.isActive ? '-translate-x-3.5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* New Branch Connection Banner */}
      {connectingSourceId && (
        <div className="absolute top-24 inset-x-4 z-20 p-2 bg-indigo-900 text-white rounded-xl shadow-lg flex items-center justify-between text-xs animate-in">
          <div className="flex items-center gap-1.5 font-bold">
            <GitBranch size={13} className="text-emerald-400" />
            <span>نود مقصد را برای ایجاد اتصال شاخه جدید لمس کنید</span>
          </div>
          <button
            type="button"
            onClick={() => setConnectingSourceId(null)}
            className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md"
          >
            انصراف
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* FREE PANNABLE & ZOOMABLE CANVAS SURFACE */}
      {/* ======================================================== */}
      <div
        className={`flex-1 relative bg-[#FAF9FD] overflow-hidden select-none touch-none ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Infinite Dot Grid Pattern that moves seamlessly with Pan */}
        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
            backgroundSize: `${20 * (canvasZoom / 100)}px ${20 * (canvasZoom / 100)}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        {/* Simulation Notification Toast */}
        {testLog && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 p-2.5 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono leading-relaxed border border-emerald-500/30 shadow-md flex items-center gap-2 max-w-sm">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
            <span>{testLog}</span>
          </div>
        )}

        {/* Scaled & Translated Canvas Content Layer */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${canvasZoom / 100})`,
            transformOrigin: 'top left',
            width: '480px',
            height: '560px',
          }}
          className="absolute top-8 right-6 transition-transform duration-75 ease-out"
        >
          {/* ==================================================== */}
          {/* SVG LAYER: GORGEOUS BEZIER EDGES & FLOW ARROWS */}
          {/* ==================================================== */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              <marker
                id="edge-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366F1" />
              </marker>
              <marker
                id="edge-arrow-emerald"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
              </marker>
              <marker
                id="edge-arrow-amber"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B" />
              </marker>
            </defs>

            {activeSession.edges.map((edge) => {
              const src = getNodeCenter(edge.sourceId);
              const tgt = getNodeCenter(edge.targetId);

              const startX = src.bottomX;
              const startY = src.bottomY;
              const endX = tgt.topX;
              const endY = tgt.topY;

              const dy = endY - startY;
              const cp1X = startX;
              const cp1Y = startY + dy * 0.45;
              const cp2X = endX;
              const cp2Y = endY - dy * 0.45;

              const pathD = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;

              const edgeColor = edge.color || '#6366F1';
              const markerId =
                edgeColor === '#10B981'
                  ? 'url(#edge-arrow-emerald)'
                  : edgeColor === '#F59E0B'
                  ? 'url(#edge-arrow-amber)'
                  : 'url(#edge-arrow)';

              return (
                <g key={edge.id} className="pointer-events-auto cursor-pointer">
                  {/* Outer glow stroke */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth="5"
                    strokeOpacity="0.15"
                  />

                  {/* Main animated dashed flow curve */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-edge-flow"
                    markerEnd={markerId}
                  />

                  {/* Edge Interactive Badge / Reverse Button in Center */}
                  <foreignObject
                    x={midX - 55}
                    y={midY - 14}
                    width="110"
                    height="28"
                    className="overflow-visible"
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdge(edge);
                      }}
                      className="bg-white/95 border border-slate-300 hover:border-indigo-500 shadow-xs rounded-full px-2 py-0.5 flex items-center justify-between gap-1 text-[9px] font-bold text-slate-700 transition-all active:scale-95"
                    >
                      <span className="truncate max-w-[65px] font-mono leading-none">
                        {edge.label || 'لبه'}
                      </span>

                      {/* 1-Tap REVERSE BUTTON */}
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleReverseEdge(edge.id);
                        }}
                        className={`p-0.5 rounded-full hover:bg-indigo-50 text-indigo-600 transition-transform ${
                          edge.isReversed ? 'rotate-180 text-amber-600' : ''
                        }`}
                        title="معکوس کردن جهت لبه"
                      >
                        <ArrowLeftRight size={10} />
                      </button>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* ==================================================== */}
          {/* DRAGGABLE GRAPH NODES LAYER */}
          {/* ==================================================== */}
          {activeSession.nodes.map((node) => {
            const isConnecting = connectingSourceId === node.id;
            const isDraggingThis = draggingNodeId === node.id;

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: '175px',
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onClick={() => setSelectedNode(node)}
                className={`p-2.5 rounded-2xl bg-white border shadow-md transition-shadow text-right relative z-20 cursor-move active:scale-98 ${
                  isDraggingThis
                    ? 'shadow-xl ring-2 ring-indigo-500'
                    : isConnecting
                    ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-indigo-500/20'
                    : node.type === 'trigger'
                    ? 'border-amber-300 hover:border-amber-400'
                    : node.type === 'condition'
                    ? 'border-indigo-300 hover:border-indigo-400'
                    : 'border-emerald-300 hover:border-emerald-400'
                }`}
              >
                {/* Node Top Port Dot */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-400 shadow-2xs z-30" />

                {/* Node Bottom Port Dot with Connecting Action */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartConnect(node.id);
                  }}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white shadow-2xs hover:scale-125 transition-transform flex items-center justify-center cursor-crosshair z-30"
                  title="افزودن اتصال شاخه جدید"
                >
                  <Plus size={8} className="text-white" />
                </div>

                {/* Top Badge & Platform */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${node.badgeColor}`}>
                    {node.badge}
                  </span>
                  {node.platform && (
                    <div className="w-4.5 h-4.5 rounded bg-slate-100 flex items-center justify-center text-slate-700">
                      {getPlatformIcon(node.platform)}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-[11px] font-black text-slate-900 leading-tight pt-1">
                  {node.title}
                </h4>

                {/* Content snippet */}
                <p className="text-[9px] text-slate-500 font-mono mt-1 p-1 bg-slate-50 rounded-lg border border-slate-100 line-clamp-2 leading-tight">
                  {node.content}
                </p>

                {/* Quick Add Branch Action */}
                <div className="pt-1 flex items-center justify-between text-[8px] text-slate-400">
                  <span>اتصال:</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartConnect(node.id);
                    }}
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <Split size={9} />
                    <span>شاخه جدید</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* NATURAL LANGUAGE CHAT BAR & PROMPT SUGGESTIONS */}
      {/* ======================================================== */}
      <div className="p-2.5 shrink-0 bg-white/95 border-t border-slate-100 space-y-1.5 z-20">
        {/* Preset Prompt Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {promptSuggestions.map((promptText, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePromptSubmit(promptText)}
              className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePromptSubmit();
          }}
          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-full px-2.5 py-1 shadow-2xs focus-within:border-slate-400 focus-within:bg-white transition-all"
        >
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="به زبان ساده بنویسید (مثلاً: یک تریگر رو به دو شاخه وصل کن...)"
            disabled={isProcessing}
            className="flex-1 bg-transparent px-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!promptInput.trim() || isProcessing}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-all ${
              promptInput.trim()
                ? 'bg-slate-900 text-white'
                : 'bg-slate-200 text-slate-400'
            }`}
            title="ساخت یا ویرایش اتوماسیون روی کانواس"
          >
            {isProcessing ? (
              <Sparkles size={13} className="animate-spin text-emerald-400" />
            ) : (
              <Send size={13} className="rotate-180" />
            )}
          </button>
        </form>
      </div>

      {/* ======================================================== */}
      {/* EDGE INSPECTOR / REVERSE DRAWER */}
      {/* ======================================================== */}
      {selectedEdge && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 flex items-end justify-center"
          onClick={() => setSelectedEdge(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl p-4 shadow-2xl space-y-3 animate-slide-in-up text-right"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ArrowLeftRight size={13} />
                </span>
                <h3 className="text-xs font-black text-slate-900">
                  تنظیمات لبه اتصال کانواس
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEdge(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-bold">برچسب شاخه:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedEdge.label || 'لبه اتصال'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-bold">جهت جریان:</span>
                <span className="font-mono text-indigo-600 font-bold">
                  {selectedEdge.isReversed ? 'معکوس شده (Reversed)' : 'مستقیم (Standard)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleReverseEdge(selectedEdge.id)}
                className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <ArrowLeftRight size={13} />
                <span>معکوس کردن جهت لبه</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteEdge(selectedEdge.id)}
                className="py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-rose-200"
              >
                <Trash2 size={13} />
                <span>حذف این لبه</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* NODE DETAILS INSPECTOR */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 flex items-end justify-center"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl p-4 shadow-2xl space-y-3 animate-slide-in-up text-right"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${selectedNode.badgeColor}`}>
                  {selectedNode.badge}
                </span>
                <h3 className="text-xs font-black text-slate-900">
                  تنظیمات نود کانواس
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800 block">
                {selectedNode.title}
              </span>
              <p className="text-[11px] text-slate-500 font-mono leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {selectedNode.content}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  handleStartConnect(selectedNode.id);
                  setSelectedNode(null);
                }}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <Split size={12} />
                <span>ایجاد اتصال شاخه از این نود</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="py-2 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SESSIONS SIDE SHEET - PURE X-AXIS SLIDE */}
      {/* ======================================================== */}
      {isSideSheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 flex justify-end"
          onClick={() => setIsSideSheetOpen(false)}
        >
          <div
            className="w-[84%] max-w-xs h-full bg-white shadow-2xl p-4 flex flex-col justify-between overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                    <Zap size={14} />
                  </div>
                  <h3 className="text-xs font-black text-slate-900">
                    سشن‌های اتوماسیون
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSideSheetOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-1.5">
                {sessions.map((session) => {
                  const isSelected = session.id === activeSessionId;

                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        setActiveSessionId(session.id);
                        setIsSideSheetOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Zap size={12} className={isSelected ? 'text-emerald-400' : 'text-slate-500'} />
                          <span className="text-xs font-bold leading-tight truncate">
                            {session.title}
                          </span>
                        </div>
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            session.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-mono block mt-1 truncate ${
                          isSelected ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {session.nodes.length} نود · {session.edges.length} لبه متصل
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsSideSheetOpen(false);
                  handlePromptSubmit('یک نود تریگر را به دو شاخه مجزا وصل کن');
                }}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <Plus size={13} />
                <span>+ ایجاد کانواس اتوماسیون جدید</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
