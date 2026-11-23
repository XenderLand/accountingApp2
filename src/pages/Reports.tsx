import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Download, Calendar } from 'lucide-react';
import { Transaction, Account } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  accounts: Account[];
}

export default function Reports({ transactions, accounts }: ReportsProps) {
  const [reportType, setReportType] = useState<'income-statement' | 'balance-sheet' | 'cash-flow'>('income-statement');

  const incomeStatement = useMemo(() => {
    const revenue = transactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((s, t) => s + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((s, t) => s + t.amount, 0);

    const revenueByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .forEach((t) => {
        revenueByCategory[t.category] = (revenueByCategory[t.category] || 0) + t.amount;
      });

    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    return { revenue, expenses, netIncome: revenue - expenses, revenueByCategory, expensesByCategory };
  }, [transactions]);

  const balanceSheet = useMemo(() => {
    const totalAssets = accounts.filter((a) => a.type === 'asset').reduce((s, a) => s + a.balance, 0);
    const totalLiabilities = accounts.filter((a) => a.type === 'liability').reduce((s, a) => s + a.balance, 0);
    const totalEquity = accounts.filter((a) => a.type === 'equity').reduce((s, a) => s + a.balance, 0);
    return { totalAssets, totalLiabilities, totalEquity, retainedEarnings: totalAssets - totalLiabilities - totalEquity };
  }, [accounts]);

  const cashFlowData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, i) => {
      const monthTxns = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === i && t.status === 'completed';
      });
      const inflow = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const outflow = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month, inflow, outflow, net: inflow - outflow };
    });
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
          <p className="text-slate-500 mt-1">Detailed financial analysis and statements</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
          <Download size={16} />
          Export PDF
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2 bg-white rounded-xl border border-slate-200 p-1.5">
        {[
          { id: 'income-statement' as const, label: 'Income Statement' },
          { id: 'balance-sheet' as const, label: 'Balance Sheet' },
          { id: 'cash-flow' as const, label: 'Cash Flow' },
        ].map((report) => (
          <button
            key={report.id}
            onClick={() => setReportType(report.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              reportType === report.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {report.label}
          </button>
        ))}
      </div>

      {/* Income Statement */}
      {reportType === 'income-statement' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar size={18} className="text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Income Statement</h2>
              <span className="text-sm text-slate-500 ml-auto">Year to Date</span>
            </div>

            <div className="space-y-4">
              {/* Revenue Section */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">Revenue</h3>
                {Object.entries(incomeStatement.revenueByCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between py-1.5">
                    <span className="text-sm text-slate-700">{category}</span>
                    <span className="text-sm font-medium text-slate-900">${amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-2 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-900">Total Revenue</span>
                  <span className="text-sm font-bold text-emerald-600">${incomeStatement.revenue.toLocaleString()}</span>
                </div>
              </div>

              {/* Expenses Section */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3">Expenses</h3>
                {Object.entries(incomeStatement.expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between py-1.5">
                    <span className="text-sm text-slate-700">{category}</span>
                    <span className="text-sm font-medium text-slate-900">${amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-2 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-900">Total Expenses</span>
                  <span className="text-sm font-bold text-red-600">${incomeStatement.expenses.toLocaleString()}</span>
                </div>
              </div>

              {/* Net Income */}
              <div className={`rounded-lg p-4 ${incomeStatement.netIncome >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">Net Income</span>
                  <span className={`text-xl font-bold ${incomeStatement.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ${incomeStatement.netIncome.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Profit Margin: {incomeStatement.revenue > 0 ? ((incomeStatement.netIncome / incomeStatement.revenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {reportType === 'balance-sheet' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={18} className="text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">Balance Sheet</h2>
            <span className="text-sm text-slate-500 ml-auto">As of Today</span>
          </div>

          <div className="space-y-6">
            {/* Assets */}
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">Assets</h3>
              {accounts.filter((a) => a.type === 'asset').map((account) => (
                <div key={account.id} className="flex justify-between py-1.5">
                  <span className="text-sm text-slate-700">{account.name}</span>
                  <span className="text-sm font-medium text-slate-900">${account.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 mt-2 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-900">Total Assets</span>
                <span className="text-sm font-bold text-blue-600">${balanceSheet.totalAssets.toLocaleString()}</span>
              </div>
            </div>

            {/* Liabilities */}
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3">Liabilities</h3>
              {accounts.filter((a) => a.type === 'liability').map((account) => (
                <div key={account.id} className="flex justify-between py-1.5">
                  <span className="text-sm text-slate-700">{account.name}</span>
                  <span className="text-sm font-medium text-slate-900">${account.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 mt-2 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-900">Total Liabilities</span>
                <span className="text-sm font-bold text-red-600">${balanceSheet.totalLiabilities.toLocaleString()}</span>
              </div>
            </div>

            {/* Equity */}
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">Equity</h3>
              {accounts.filter((a) => a.type === 'equity').map((account) => (
                <div key={account.id} className="flex justify-between py-1.5">
                  <span className="text-sm text-slate-700">{account.name}</span>
                  <span className="text-sm font-medium text-slate-900">${account.balance.toLocaleString()}</span>
                </div>
              ))}
              {balanceSheet.retainedEarnings !== 0 && (
                <div className="flex justify-between py-1.5">
                  <span className="text-sm text-slate-700">Retained Earnings</span>
                  <span className="text-sm font-medium text-slate-900">${balanceSheet.retainedEarnings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 mt-2 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-900">Total Equity</span>
                <span className="text-sm font-bold text-purple-600">${(balanceSheet.totalEquity + balanceSheet.retainedEarnings).toLocaleString()}</span>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">Total Liabilities + Equity</span>
                <span className="text-xl font-bold text-slate-900">
                  ${(balanceSheet.totalLiabilities + balanceSheet.totalEquity + balanceSheet.retainedEarnings).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow */}
      {reportType === 'cash-flow' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar size={18} className="text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Cash Flow Statement</h2>
              <span className="text-sm text-slate-500 ml-auto">Monthly Breakdown</span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2} name="Cash In" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} name="Cash Out" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} name="Net Cash Flow" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500 font-medium">Total Cash In</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                ${cashFlowData.reduce((s, d) => s + d.inflow, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500 font-medium">Total Cash Out</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ${cashFlowData.reduce((s, d) => s + d.outflow, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500 font-medium">Net Cash Flow</p>
              <p className={`text-2xl font-bold mt-1 ${
                cashFlowData.reduce((s, d) => s + d.net, 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                ${cashFlowData.reduce((s, d) => s + d.net, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Monthly Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Month</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cash In</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cash Out</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Net Flow</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowData.map((row) => (
                  <tr key={row.month} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.month}</td>
                    <td className="px-4 py-3 text-sm text-right text-emerald-600">${row.inflow.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">${row.outflow.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm text-right font-semibold ${row.net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ${row.net.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
