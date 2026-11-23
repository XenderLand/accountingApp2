import { useState, useEffect } from 'react';
import { Page, Transaction, Invoice, Account } from './types';
import { getTransactions, saveTransactions, getInvoices, saveInvoices, getAccounts, saveAccounts } from './data/store';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';
import { Bell, Search, User } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setTransactions(getTransactions());
    setInvoices(getInvoices());
    setAccounts(getAccounts());
  }, []);

  const handleUpdateTransactions = (data: Transaction[]) => {
    setTransactions(data);
    saveTransactions(data);
  };

  const handleUpdateInvoices = (data: Invoice[]) => {
    setInvoices(data);
    saveInvoices(data);
  };

  const handleUpdateAccounts = (data: Account[]) => {
    setAccounts(data);
    saveAccounts(data);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard transactions={transactions} invoices={invoices} />;
      case 'transactions':
        return <Transactions transactions={transactions} onUpdate={handleUpdateTransactions} />;
      case 'invoices':
        return <Invoices invoices={invoices} onUpdate={handleUpdateInvoices} />;
      case 'accounts':
        return <Accounts accounts={accounts} onUpdate={handleUpdateAccounts} />;
      case 'reports':
        return <Reports transactions={transactions} accounts={accounts} />;
      default:
        return <Dashboard transactions={transactions} invoices={invoices} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-slate-100 border-0 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-emerald-700" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 leading-tight">John Doe</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
