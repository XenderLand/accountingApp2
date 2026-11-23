import { Transaction, Invoice, Account } from '../types';

const STORAGE_KEYS = {
  transactions: 'ledgerpro_transactions',
  invoices: 'ledgerpro_invoices',
  accounts: 'ledgerpro_accounts',
};

const defaultAccounts: Account[] = [
  { id: '1', name: 'Cash on Hand', type: 'asset', balance: 15420.50, description: 'Physical cash available' },
  { id: '2', name: 'Business Checking', type: 'asset', balance: 87350.00, description: 'Primary business checking account' },
  { id: '3', name: 'Savings Account', type: 'asset', balance: 125000.00, description: 'Business savings' },
  { id: '4', name: 'Accounts Receivable', type: 'asset', balance: 34200.00, description: 'Money owed by clients' },
  { id: '5', name: 'Accounts Payable', type: 'liability', balance: 12800.00, description: 'Money owed to vendors' },
  { id: '6', name: 'Business Loan', type: 'liability', balance: 50000.00, description: 'Outstanding business loan' },
  { id: '7', name: "Owner's Equity", type: 'equity', balance: 200000.00, description: 'Owner investment' },
  { id: '8', name: 'Service Revenue', type: 'revenue', balance: 185000.00, description: 'Revenue from services' },
  { id: '9', name: 'Product Sales', type: 'revenue', balance: 92000.00, description: 'Revenue from product sales' },
  { id: '10', name: 'Rent Expense', type: 'expense', balance: 24000.00, description: 'Office rent payments' },
  { id: '11', name: 'Utilities', type: 'expense', balance: 4800.00, description: 'Utility bills' },
  { id: '12', name: 'Salaries', type: 'expense', balance: 96000.00, description: 'Employee salaries' },
  { id: '13', name: 'Office Supplies', type: 'expense', balance: 3200.00, description: 'Office supply purchases' },
  { id: '14', name: 'Marketing', type: 'expense', balance: 18500.00, description: 'Marketing and advertising' },
];

const defaultTransactions: Transaction[] = [
  { id: '1', date: '2025-01-15', description: 'Client payment - Acme Corp', category: 'Service Revenue', type: 'income', amount: 12500, accountId: '2', status: 'completed' },
  { id: '2', date: '2025-01-14', description: 'Office rent - January', category: 'Rent', type: 'expense', amount: 3200, accountId: '2', status: 'completed' },
  { id: '3', date: '2025-01-13', description: 'Software subscription', category: 'Software', type: 'expense', amount: 299, accountId: '2', status: 'completed' },
  { id: '4', date: '2025-01-12', description: 'Consulting fee - TechStart', category: 'Service Revenue', type: 'income', amount: 8750, accountId: '2', status: 'completed' },
  { id: '5', date: '2025-01-11', description: 'Employee salaries', category: 'Salaries', type: 'expense', amount: 16000, accountId: '2', status: 'completed' },
  { id: '6', date: '2025-01-10', description: 'Product sale - Widget Pro', category: 'Product Sales', type: 'income', amount: 4500, accountId: '2', status: 'completed' },
  { id: '7', date: '2025-01-09', description: 'Marketing campaign - Q1', category: 'Marketing', type: 'expense', amount: 5000, accountId: '2', status: 'completed' },
  { id: '8', date: '2025-01-08', description: 'Client payment - GlobalTech', category: 'Service Revenue', type: 'income', amount: 22000, accountId: '2', status: 'completed' },
  { id: '9', date: '2025-01-07', description: 'Utilities - Electric', category: 'Utilities', type: 'expense', amount: 450, accountId: '2', status: 'completed' },
  { id: '10', date: '2025-01-06', description: 'Office supplies', category: 'Supplies', type: 'expense', amount: 320, accountId: '1', status: 'completed' },
  { id: '11', date: '2025-01-05', description: 'Freelance design work', category: 'Service Revenue', type: 'income', amount: 3200, accountId: '2', status: 'pending' },
  { id: '12', date: '2025-01-04', description: 'Web hosting annual', category: 'Software', type: 'expense', amount: 1200, accountId: '2', status: 'completed' },
  { id: '13', date: '2025-01-03', description: 'Client retainer - DesignCo', category: 'Service Revenue', type: 'income', amount: 5000, accountId: '2', status: 'completed' },
  { id: '14', date: '2025-01-02', description: 'Insurance premium', category: 'Insurance', type: 'expense', amount: 1800, accountId: '2', status: 'completed' },
  { id: '15', date: '2025-01-01', description: 'Product bulk order', category: 'Product Sales', type: 'income', amount: 15600, accountId: '2', status: 'completed' },
];

const defaultInvoices: Invoice[] = [
  {
    id: '1', invoiceNumber: 'INV-2025-001', clientName: 'Acme Corporation', clientEmail: 'billing@acme.com',
    items: [
      { id: '1', description: 'Web Development Services', quantity: 40, unitPrice: 150 },
      { id: '2', description: 'UI/UX Design', quantity: 20, unitPrice: 125 },
    ],
    status: 'paid', issueDate: '2025-01-01', dueDate: '2025-01-31', notes: 'Thank you for your business!'
  },
  {
    id: '2', invoiceNumber: 'INV-2025-002', clientName: 'TechStart Inc.', clientEmail: 'accounts@techstart.io',
    items: [
      { id: '1', description: 'Consulting - Architecture Review', quantity: 8, unitPrice: 200 },
      { id: '2', description: 'Technical Documentation', quantity: 15, unitPrice: 100 },
    ],
    status: 'sent', issueDate: '2025-01-10', dueDate: '2025-02-10', notes: 'Net 30 payment terms.'
  },
  {
    id: '3', invoiceNumber: 'INV-2025-003', clientName: 'GlobalTech Solutions', clientEmail: 'finance@globaltech.com',
    items: [
      { id: '1', description: 'Full Stack Development', quantity: 80, unitPrice: 175 },
      { id: '2', description: 'Project Management', quantity: 20, unitPrice: 150 },
      { id: '3', description: 'QA Testing', quantity: 30, unitPrice: 100 },
    ],
    status: 'paid', issueDate: '2024-12-15', dueDate: '2025-01-15', notes: ''
  },
  {
    id: '4', invoiceNumber: 'INV-2025-004', clientName: 'DesignCo Studio', clientEmail: 'pay@designco.com',
    items: [
      { id: '1', description: 'Monthly Retainer', quantity: 1, unitPrice: 5000 },
    ],
    status: 'overdue', issueDate: '2024-12-01', dueDate: '2025-01-01', notes: 'Please remit payment ASAP.'
  },
  {
    id: '5', invoiceNumber: 'INV-2025-005', clientName: 'StartupXYZ', clientEmail: 'ceo@startupxyz.com',
    items: [
      { id: '1', description: 'MVP Development', quantity: 120, unitPrice: 130 },
    ],
    status: 'draft', issueDate: '2025-01-20', dueDate: '2025-02-20', notes: 'Phase 1 deliverables.'
  },
];

function loadData<T>(key: string, defaults: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return defaults;
}

function saveData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

export function getTransactions(): Transaction[] {
  return loadData(STORAGE_KEYS.transactions, defaultTransactions);
}

export function saveTransactions(data: Transaction[]): void {
  saveData(STORAGE_KEYS.transactions, data);
}

export function getInvoices(): Invoice[] {
  return loadData(STORAGE_KEYS.invoices, defaultInvoices);
}

export function saveInvoices(data: Invoice[]): void {
  saveData(STORAGE_KEYS.invoices, data);
}

export function getAccounts(): Account[] {
  return loadData(STORAGE_KEYS.accounts, defaultAccounts);
}

export function saveAccounts(data: Account[]): void {
  saveData(STORAGE_KEYS.accounts, data);
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.transactions);
  localStorage.removeItem(STORAGE_KEYS.invoices);
  localStorage.removeItem(STORAGE_KEYS.accounts);
}
