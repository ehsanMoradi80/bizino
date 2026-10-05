import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Folder,
  FolderPlus,
  MessageSquare,
  BookOpen,
  FileText,
  Trash2,
  Check,
  Send,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { ChatSession, FolderItem, LibraryItem } from '../types';

interface SessionsAndLibraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  folders: FolderItem[];
  libraryItems: LibraryItem[];
  onSelectSession: (id: string) => void;
  onCreateSession: (folderId?: string) => void;
  onDeleteSession: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onCreateLibraryItem: (item: Omit<LibraryItem, 'id' | 'date'>) => void;
  onInsertLibraryItem: (content: string) => void;
}

export const SessionsAndLibraryPanel: React.FC<SessionsAndLibraryPanelProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  folders,
  libraryItems,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onCreateFolder,
  onCreateLibraryItem,
  onInsertLibraryItem,
}) => {
  const [tab, setTab] = useState<'sessions' | 'library'>('sessions');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'template' | 'file' | 'playbook'>('all');
  const [isAddingLibraryItem, setIsAddingLibraryItem] = useState(false);
  const [newLibTitle, setNewLibTitle] = useState('');
  const [newLibCategory, setNewLibCategory] = useState<'template' | 'file' | 'playbook'>('template');
  const [newLibContent, setNewLibContent] = useState('');

  if (!isOpen) return null;

  const handleAddFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  const handleAddLibrarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLibTitle.trim() || !newLibContent.trim()) return;
    onCreateLibraryItem({
      title: newLibTitle.trim(),
      category: newLibCategory,
      content: newLibContent.trim(),
    });
    setNewLibTitle('');
    setNewLibContent('');
    setIsAddingLibraryItem(false);
  };

  const [isClosing, setIsClosing] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const handleCloseWithSlideOut = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 240);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.touches[0].clientX - touchStartXRef.current;
    // In RTL, swiping right (positive diffX) drags side sheet out towards right edge
    if (diffX > 60) {
      handleCloseWithSlideOut();
      touchStartXRef.current = null;
    }
  };

  const filteredSessions = selectedFolderId
    ? sessions.filter((s) => s.folderId === selectedFolderId)
    : sessions;

  const filteredLibrary = libraryFilter === 'all'
    ? libraryItems
    : libraryItems.filter((i) => i.category === libraryFilter);

  return (
    <div
      className="fixed inset-0 z-50 flex bg-slate-900/40 backdrop-blur-xs select-none"
      dir="rtl"
      onClick={handleCloseWithSlideOut}
    >
      <div
        className={`w-full max-w-[340px] h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl text-slate-800 select-none ${
          isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full text-xs">
            <button
              onClick={() => setTab('sessions')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                tab === 'sessions'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              سشن‌ها و پوشه‌ها
            </button>
            <button
              onClick={() => setTab('library')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                tab === 'library'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              کتابخانه
            </button>
          </div>

          <button
            onClick={handleCloseWithSlideOut}
            className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab 1: Sessions & Folders */}
        {tab === 'sessions' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            {/* Action Bar: New Session & New Folder */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onCreateSession(selectedFolderId || undefined);
                  handleCloseWithSlideOut();
                }}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-slate-800 active:scale-95 transition-all"
              >
                <Plus size={14} />
                <span>سشن جدید</span>
              </button>

              <button
                onClick={() => setIsAddingFolder(!isAddingFolder)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="افزودن پوشه"
              >
                <FolderPlus size={16} />
              </button>
            </div>

            {/* Inline Add Folder Input */}
            {isAddingFolder && (
              <form onSubmit={handleAddFolderSubmit} className="flex items-center gap-1.5 animate-in fade-in">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="نام پوشه جدید..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-400"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  افزودن
                </button>
              </form>
            )}

            {/* Folders List (horizontal pills) */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block px-1">پوشه‌ها</span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                    selectedFolderId === null
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  همه سشن‌ها
                </button>
                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                      selectedFolderId === f.id
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <Folder size={11} />
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
              <span className="text-[10px] font-bold text-slate-400 block px-1">
                سشن‌های فعال ({filteredSessions.length})
              </span>

              {filteredSessions.map((session) => {
                const isActive = session.id === activeSessionId;
                const folder = folders.find((f) => f.id === session.folderId);

                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      handleCloseWithSlideOut();
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <MessageSquare size={13} />
                      </div>
                      <div className="truncate text-right">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {session.title}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          {folder && <span>{folder.name} ·</span>}
                          <span>{session.updatedAt}</span>
                        </div>
                      </div>
                    </div>

                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-all rounded"
                        title="حذف سشن"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Library */}
        {tab === 'library' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            {/* Filter Chips & Add Button */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                <button
                  onClick={() => setLibraryFilter('all')}
                  className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                    libraryFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  همه
                </button>
                <button
                  onClick={() => setLibraryFilter('template')}
                  className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                    libraryFilter === 'template'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  قالب دایرکت
                </button>
                <button
                  onClick={() => setLibraryFilter('file')}
                  className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                    libraryFilter === 'file'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  داده‌ها
                </button>
              </div>

              <button
                onClick={() => setIsAddingLibraryItem(!isAddingLibraryItem)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 shrink-0"
                title="افزودن به کتابخانه"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add Library Form */}
            {isAddingLibraryItem && (
              <form onSubmit={handleAddLibrarySubmit} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
                <input
                  type="text"
                  value={newLibTitle}
                  onChange={(e) => setNewLibTitle(e.target.value)}
                  placeholder="عنوان آیتم (مثال: قالب پیگیری ارسال)..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                  autoFocus
                />
                <select
                  value={newLibCategory}
                  onChange={(e: any) => setNewLibCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                >
                  <option value="template">قالب پیام دایرکت</option>
                  <option value="file">داده و فایل اکسل</option>
                  <option value="playbook">پلی‌بوک و پرامپت هوش مصنوعی</option>
                </select>
                <textarea
                  value={newLibContent}
                  onChange={(e) => setNewLibContent(e.target.value)}
                  placeholder="متن محتوا یا پرامپت..."
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newLibTitle.trim() || !newLibContent.trim()}
                  className="w-full py-1 bg-slate-900 text-white rounded-lg text-xs font-bold"
                >
                  ذخیره در کتابخانه
                </button>
              </form>
            )}

            {/* Library Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {filteredLibrary.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 text-right hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{item.title}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 font-mono">
                      {item.category === 'template' ? 'قالب' : item.category === 'file' ? 'داده' : 'استراتژی'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl">
                    {item.content}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-mono">{item.date}</span>
                    <button
                      onClick={() => {
                        onInsertLibraryItem(item.content);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Send size={10} className="rotate-180" />
                      <span>ارسال به چت</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
