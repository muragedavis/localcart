'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormatPrice } from '@/lib/settings-context';
import { ToastContainer, useToast } from '@/components/Toast';

type Category = 'product_cost' | 'shipping' | 'packaging' | 'marketing' | 'other';

interface Expense {
  id: number;
  supplier_name: string;
  description: string | null;
  amount: number | string;
  category: Category;
  expense_date: string;
  notes: string | null;
  created_at: string;
}

interface Totals {
  total_all_time: number | string;
  total_this_month: number | string;
  total_last_30_days: number | string;
}

const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: 'product_cost', label: 'Product Cost',  color: 'badge-blue'   },
  { value: 'shipping',     label: 'Shipping',       color: 'badge-green'  },
  { value: 'packaging',    label: 'Packaging',      color: 'badge-yellow' },
  { value: 'marketing',    label: 'Marketing',      color: 'badge-red'    },
  { value: 'other',        label: 'Other',          color: 'badge-gray'   },
];

const EMPTY_FORM = {
  supplier_name: '',
  description: '',
  amount: '',
  category: 'product_cost' as Category,
  expense_date: new Date().toISOString().split('T')[0],
  notes: '',
};

export default function ExpensesPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const formatPrice = useFormatPrice();
  const { toasts, addToast, removeToast } = useToast();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | ''>('');

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    fetchExpenses();
  }, [user, router]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterMonth) params.set('month', filterMonth);
      const r = await apiClient.get(`/admin/expenses?${params.toString()}&limit=100`);
      setExpenses(r.data.data || []);
      setTotals(r.data.totals || null);
    } catch {
      addToast('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.role === 'admin') fetchExpenses(); }, [filterMonth]);

  const filtered = useMemo(() => {
    if (!filterCategory) return expenses;
    return expenses.filter((e) => e.category === filterCategory);
  }, [expenses, filterCategory]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (e: Expense) => {
    setEditingId(e.id);
    setForm({
      supplier_name: e.supplier_name,
      description:   e.description || '',
      amount:        String(e.amount),
      category:      e.category,
      expense_date:  e.expense_date.split('T')[0],
      notes:         e.notes || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.supplier_name.trim() || !form.amount) {
      addToast('Supplier name and amount are required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/admin/expenses/${editingId}`, form);
        addToast('Expense updated', 'success');
      } else {
        await apiClient.post('/admin/expenses', form);
        addToast('Expense added', 'success');
      }
      setShowForm(false);
      fetchExpenses();
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await apiClient.delete(`/admin/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      addToast('Expense deleted', 'success');
      fetchExpenses();
    } catch {
      addToast('Failed to delete expense');
    }
  };

  const catBadge = (cat: Category) =>
    CATEGORIES.find((c) => c.value === cat)?.color ?? 'badge-gray';
  const catLabel = (cat: Category) =>
    CATEGORIES.find((c) => c.value === cat)?.label ?? cat;

  const fmt = (v: number | string) => formatPrice(parseFloat(String(v)) || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm text-gray-400">Loading expenses…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Top bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="container py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Admin Panel</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Expenses</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track supplier costs and calculate profit</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-150">
              ← Dashboard
            </Link>
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all duration-150"
              style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-6">

        {/* Summary cards */}
        {totals && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'All-time Expenses',    value: fmt(totals.total_all_time),    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', gradient: 'from-red-500 to-rose-600' },
              { label: 'This Month',           value: fmt(totals.total_this_month),  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', gradient: 'from-orange-500 to-amber-600' },
              { label: 'Last 30 Days',         value: fmt(totals.total_last_30_days), icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', gradient: 'from-violet-500 to-purple-600' },
            ].map((c) => (
              <div key={c.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-sm`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{c.value}</p>
                <p className="text-xs text-gray-400 font-medium">{c.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="form-input text-sm py-2 w-44"
              placeholder="Filter by month"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilterCategory('')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${!filterCategory ? 'text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              style={!filterCategory ? { background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' } : {}}>
              All
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.value} onClick={() => setFilterCategory(c.value === filterCategory ? '' : c.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${filterCategory === c.value ? 'text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                style={filterCategory === c.value ? { background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' } : {}}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">No expenses recorded</p>
              <p className="text-xs text-gray-400 mb-5">Click "Add Expense" to start tracking supplier costs</p>
              <button onClick={openAdd} className="btn-primary text-sm">Add First Expense</button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {['Date', 'Supplier', 'Description', 'Category', 'Amount', ''].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                      {new Date(e.expense_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-200">{e.supplier_name}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{e.description || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={catBadge(e.category)}>{catLabel(e.category)}</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">{fmt(e.amount)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(e)} className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(e.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 dark:border-gray-600">
                  <td colSpan={4} className="px-5 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {filtered.length} expense{filtered.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-gray-100">
                    {fmt(filtered.reduce((s, e) => s + parseFloat(String(e.amount)), 0))}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {editingId ? 'Edit Expense' : 'Add Expense'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="form-label">Supplier / Vendor *</label>
                  <input className="form-input" placeholder="e.g. Nairobi Distributors" value={form.supplier_name}
                    onChange={(e) => setForm({ ...form, supplier_name: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Amount *</label>
                  <input className="form-input" type="number" step="0.01" min="0" placeholder="0.00" value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Date *</label>
                  <input className="form-input" type="date" value={form.expense_date}
                    onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="form-label">Description</label>
                  <input className="form-input" placeholder="What was purchased?" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Notes</label>
                  <textarea className="form-input resize-none" rows={2} placeholder="Optional notes…" value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : editingId ? 'Update' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
