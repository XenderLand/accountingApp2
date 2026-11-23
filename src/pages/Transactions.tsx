import { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TransactionsProps {
  transactions: Transaction[];
  onUpdate: (transactions: Transaction[]) => void;
}

export default function Transactions({ transactions, onUpdate }: TransactionsProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    accountId: '2',
  });

  const filtered = transactions
    .filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const handleAdd = () => {
    if (!formData.description || !formData.amount || !formData.category) return;
    const newTxn: Transaction = {
      id: uuidv4(),
      description: formData.description,
      category: formData.category,
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: formData.date,
      accountId: formData.accountId,
      status: 'completed',
    };
    onUpdate([newTxn, ...transactions]);
    setFormData({ description: '', category: '', type: 'expense', amount: '', date: new Date().toISOString().split('T')[0], accountId: '2' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 mt-1">Manage your income and expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">New Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Transaction description"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g. Rent, Revenue"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
              >
                Save Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Income</p>
          <p className="text-xl font-bold text-emerald-600">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="text-xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Net</p>
          <p className={`text-xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ${(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Search transactions..."
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              typeFilter === 'income' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <TrendingUp size={14} /> Income
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              typeFilter === 'expense' ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <TrendingDown size={14} /> Expense
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-600">{txn.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        txn.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {txn.type === 'income' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{txn.description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{txn.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      txn.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      txn.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold text-right ${
                    txn.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(txn.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Filter size={32} className="mx-auto mb-2 opacity-50" />
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
