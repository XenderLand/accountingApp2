import { useState } from 'react';
import { Plus, BookOpen, TrendingUp, TrendingDown, Landmark, Scale, DollarSign } from 'lucide-react';
import { Account } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AccountsProps {
  accounts: Account[];
  onUpdate: (accounts: Account[]) => void;
}

export default function Accounts({ accounts, onUpdate }: AccountsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'asset' as Account['type'],
    balance: '',
    description: '',
  });

  const accountTypes: { type: Account['type']; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'asset', label: 'Assets', icon: <Landmark size={16} />, color: 'text-blue-600 bg-blue-100' },
    { type: 'liability', label: 'Liabilities', icon: <TrendingDown size={16} />, color: 'text-red-600 bg-red-100' },
    { type: 'equity', label: 'Equity', icon: <Scale size={16} />, color: 'text-purple-600 bg-purple-100' },
    { type: 'revenue', label: 'Revenue', icon: <TrendingUp size={16} />, color: 'text-emerald-600 bg-emerald-100' },
    { type: 'expense', label: 'Expenses', icon: <DollarSign size={16} />, color: 'text-amber-600 bg-amber-100' },
  ];

  const getAccountsByType = (type: Account['type']) => accounts.filter((a) => a.type === type);
  const getTotalByType = (type: Account['type']) => accounts.filter((a) => a.type === type).reduce((s, a) => s + a.balance, 0);

  const handleAdd = () => {
    if (!formData.name || !formData.balance) return;
    const newAccount: Account = {
      id: uuidv4(),
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      description: formData.description,
    };
    onUpdate([...accounts, newAccount]);
    setFormData({ name: '', type: 'asset', balance: '', description: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(accounts.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chart of Accounts</h1>
          <p className="text-slate-500 mt-1">Manage your account structure</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          Add Account
        </button>
      </div>

      {/* Add Account Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">New Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Account Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Account name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {accountTypes.map((at) => (
                  <option key={at.type} value={at.type}>{at.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Balance</label>
              <input
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Optional description"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleAdd}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
            >
              Save Account
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {accountTypes.map((at) => (
          <div key={at.type} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`w-8 h-8 rounded-lg ${at.color} flex items-center justify-center mb-2`}>
              {at.icon}
            </div>
            <p className="text-xs text-slate-500 font-medium">{at.label}</p>
            <p className="text-lg font-bold text-slate-900">${getTotalByType(at.type).toLocaleString()}</p>
            <p className="text-xs text-slate-400">{getAccountsByType(at.type).length} accounts</p>
          </div>
        ))}
      </div>

      {/* Account Groups */}
      <div className="space-y-6">
        {accountTypes.map((at) => {
          const typeAccounts = getAccountsByType(at.type);
          if (typeAccounts.length === 0) return null;
          return (
            <div key={at.type} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-md ${at.color} flex items-center justify-center`}>
                    {at.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900">{at.label}</h3>
                </div>
                <span className="text-sm font-bold text-slate-700">${getTotalByType(at.type).toLocaleString()}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {typeAccounts.map((account) => (
                  <div key={account.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{account.name}</p>
                      {account.description && <p className="text-xs text-slate-500">{account.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-900">${account.balance.toLocaleString()}</span>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
