import { Page } from '../types';
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  BookOpen,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { page: 'transactions', label: 'Transactions', icon: <ArrowLeftRight size={20} /> },
  { page: 'invoices', label: 'Invoices', icon: <FileText size={20} /> },
  { page: 'accounts', label: 'Accounts', icon: <BookOpen size={20} /> },
  { page: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
];

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">LP</span>
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg leading-tight">LedgerPro</h1>
            <p className="text-xs text-slate-400">Accounting Suite</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              currentPage === item.page
                ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-400'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center p-3 border-t border-slate-700 text-slate-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
