export interface UserProfile {
  name: string;
  phone: string;
  avatarUrl: string;
}

export type PlatformType =
  | 'instagram'
  | 'telegram'
  | 'whatsapp'
  | 'youtube'
  | 'linkedin'
  | 'facebook'
  | 'tiktok'
  | 'eitaa'
  | 'bale'
  | 'rubika';

export interface ConnectedChannel {
  id: string;
  platform: PlatformType;
  name: string;
  handle: string;
  followers?: string;
  isActive: boolean;
}

export interface InteractiveOption {
  id: string;
  label: string;
  actionValue: string;
}

export interface MetricCardData {
  id: string;
  category:
    | 'conversion'
    | 'clv'
    | 'inventory'
    | 'roas'
    | 'abandoned'
    | 'health'
    | 'traffic';
  title: string;
  badge: string;
  badgeColor?: string;
  mainValue: string;
  secondaryValue: string;
  trend: string;
  isPositive: boolean;
  benchmark: string;
  aiRecommendation: string;
  quickActionTitle?: string;
  actionPayload?: string;
}

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  timestamp: string;
  type:
    | 'text'
    | 'welcome'
    | 'voice'
    | 'options'
    | 'platform_picker'
    | 'page_analysis'
    | 'site_decision'
    | 'logo_choice'
    | 'palette_choice'
    | 'darkmode_choice'
    | 'business_goals'
    | 'sales_chart'
    | 'lead_action'
    | 'kpi_card';
  text?: string;
  audioDuration?: string;
  options?: InteractiveOption[];
  scrapingData?: {
    instagramHandle: string;
    itemsCount: number;
    palette: { name: string; hex: string }[];
    engagementRate: string;
  };
  leadData?: {
    count: number;
    suggestedMessage: string;
    isSent: boolean;
  };
  metricData?: MetricCardData;
  metadata?: any;
}

export interface ChatSession {
  id: string;
  title: string;
  folderId?: string;
  updatedAt: string;
  messages: Message[];
}

export interface FolderItem {
  id: string;
  name: string;
  iconName?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  category: 'template' | 'file' | 'playbook';
  content: string;
  date: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  badge?: string;
  colorName: string;
  colorHex: string;
  description?: string;
}

export interface MetricScore {
  id: string;
  title: string;
  score: number;
  status: 'nominal' | 'warning' | 'alert';
  action: string;
}
