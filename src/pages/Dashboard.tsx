import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  AlertCircle,
  CheckCircle,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Transaction, Invoice } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  invoices: Invoice[];
}

export default function Dashboard({ transactions, invoices }: DashboardProps) {
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const pendingInvoices = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue');
    const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
    const accountsReceivable = pendingInvoices.reduce((sum, inv) => {
      const total = inv.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
      return sum + total;
    }, 0);

    return { totalIncome, totalExpenses, netProfit, pendingInvoices: pendingInvoices.length, overdueInvoices: overdueInvoices.length, accountsReceivable };
  }, [transactions, invoices]);

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((month, i) => {
      const monthTxns = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === i && t.status === 'completed';
      });
      const income = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month, income, expense, profit: income - expense };
    });
    return data;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Financial overview for your business</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalIncome}
          icon={<TrendingUp size={20} />}
          color="emerald"
          change="+12.5%"
        />
        <MetricCard
          title="Total Expenses"
          value={metrics.totalExpenses}
          icon={<TrendingDown size={20} />}
          color="red"
          change="+3.2%"
        />
        <MetricCard
          title="Net Profit"
          value={metrics.netProfit}
          icon={<DollarSign size={20} />}
          color="blue"
          change="+18.7%"
        />
        <MetricCard
          title="Accounts Receivable"
          value={metrics.accountsReceivable}
          icon={<Receipt size={20} />}
          color="amber"
          change={`${metrics.overdueInvoices} overdue`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {categoryData.slice(0, 5).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-medium text-slate-900">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    txn.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {txn.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{txn.description}</p>
                    <p className="text-xs text-slate-500">{txn.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${txn.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Invoice Overview</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-emerald-600" />
                <span className="text-xs text-emerald-700 font-medium">Paid</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">
                {invoices.filter((i) => i.status === 'paid').length}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Receipt size={16} className="text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {invoices.filter((i) => i.status === 'sent').length}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-xs text-red-700 font-medium">Overdue</span>
              </div>
              <p className="text-2xl font-bold text-red-900">
                {invoices.filter((i) => i.status === 'overdue').length}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-slate-600" />
                <span className="text-xs text-slate-700 font-medium">Draft</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {invoices.filter((i) => i.status === 'draft').length}
              </p>
            </div>
          </div>

          {/* Monthly Profit Chart */}
          <h4 className="text-sm font-medium text-slate-700 mb-2">Monthly Profit</h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']} />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
  change,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'bg-amber-100' },
  };

  const c = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500 font-medium">{title}</span>
        <div className={`w-9 h-9 rounded-lg ${c.icon} flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
      <p className={`text-xs mt-1 ${c.text} font-medium`}>{change}</p>
    </div>
  );
}
