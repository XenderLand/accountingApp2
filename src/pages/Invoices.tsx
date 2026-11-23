import { useState } from 'react';
import { Plus, Search, Eye, Send, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Invoice, InvoiceItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface InvoicesProps {
  invoices: Invoice[];
  onUpdate: (invoices: Invoice[]) => void;
}

export default function Invoices({ invoices, onUpdate }: InvoicesProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    items: [{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }] as InvoiceItem[],
    dueDate: '',
    notes: '',
  });

  const filtered = invoices
    .filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (search && !inv.clientName.toLowerCase().includes(search.toLowerCase()) && !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  const getInvoiceTotal = (inv: Invoice) => inv.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);

  const handleAdd = () => {
    if (!formData.clientName || !formData.clientEmail || formData.items.some(i => !i.description)) return;
    const newInvoice: Invoice = {
      id: uuidv4(),
      invoiceNumber: `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      items: formData.items,
      status: 'draft',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: formData.notes,
    };
    onUpdate([newInvoice, ...invoices]);
    setFormData({ clientName: '', clientEmail: '', items: [{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }], dueDate: '', notes: '' });
    setShowForm(false);
  };

  const handleStatusChange = (id: string, status: Invoice['status']) => {
    onUpdate(invoices.map((inv) => inv.id === id ? { ...inv, status } : inv));
  };

  const handleDelete = (id: string) => {
    onUpdate(invoices.filter((inv) => inv.id !== id));
    setSelectedInvoice(null);
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }] });
  };

  const removeItem = (id: string) => {
    setFormData({ ...formData, items: formData.items.filter((i) => i.id !== id) });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map((i) => i.id === id ? { ...i, [field]: value } : i),
    });
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    draft: <Clock size={14} />,
    sent: <Send size={14} />,
    paid: <CheckCircle size={14} />,
    overdue: <AlertTriangle size={14} />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-500 mt-1">Create and manage client invoices</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          New Invoice
        </button>
      </div>

      {/* Invoice Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Create Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Client Name</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Client Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="client@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Line Items</label>
              <button onClick={addItem} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Item</button>
            </div>
            {formData.items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
                <div className="col-span-5">
                  {idx === 0 && <label className="text-xs text-slate-500 block mb-1">Description</label>}
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-2">
                  {idx === 0 && <label className="text-xs text-slate-500 block mb-1">Qty</label>}
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="col-span-2">
                  {idx === 0 && <label className="text-xs text-slate-500 block mb-1">Price</label>}
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="col-span-2">
                  {idx === 0 && <label className="text-xs text-slate-500 block mb-1">Total</label>}
                  <div className="text-sm font-medium text-slate-900 py-2">${(item.quantity * item.unitPrice).toLocaleString()}</div>
                </div>
                <div className="col-span-1">
                  {formData.items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 py-2">✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 block mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-slate-900">
              Total: ${formData.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0).toLocaleString()}
            </p>
            <button
              onClick={handleAdd}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
            >
              Create Invoice
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Search invoices..."
          />
        </div>
        <div className="flex gap-2">
          {['all', 'draft', 'sent', 'paid', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                statusFilter === status ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      <div className="grid gap-4">
        {filtered.map((inv) => (
          <div key={inv.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Send size={18} className="text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{inv.invoiceNumber}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusColors[inv.status]}`}>
                      {statusIcons[inv.status]}
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{inv.clientName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Issued: {inv.issueDate} • Due: {inv.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">${getInvoiceTotal(inv).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{inv.items.length} item{inv.items.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  {inv.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(inv.id, 'sent')}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Send"
                    >
                      <Send size={16} />
                    </button>
                  )}
                  {inv.status === 'sent' && (
                    <button
                      onClick={() => handleStatusChange(inv.id, 'paid')}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Mark Paid"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedInvoice.invoiceNumber}</h2>
                <p className="text-sm text-slate-500">{selectedInvoice.clientName}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[selectedInvoice.status]}`}>
                {selectedInvoice.status}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Issue Date</p>
                  <p className="font-medium">{selectedInvoice.issueDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">Due Date</p>
                  <p className="font-medium">{selectedInvoice.dueDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="font-medium">{selectedInvoice.clientEmail}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Line Items</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-right">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-2 text-right font-medium">${(item.quantity * item.unitPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-900">${getInvoiceTotal(selectedInvoice).toLocaleString()}</p>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Notes</p>
                  <p className="text-sm text-slate-700">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedInvoice.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
