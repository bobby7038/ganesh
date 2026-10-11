import React, { useState } from 'react';
import { 
  Receipt, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  FileText, 
  Trash2, 
  DollarSign, 
  Image as ImageIcon,
  Clock,
  Calendar,
  X
} from 'lucide-react';
import ReceiptProofModal from './ReceiptProofModal';

export default function ExpenseManagement({ 
  expenseList, 
  onAddExpense, 
  onDeleteExpense, 
  onToggleStatus,
  onOpenAddModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Paid' | 'Unpaid'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProofExpense, setSelectedProofExpense] = useState(null);

  // Summary Metrics
  const totalExpenses = expenseList.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const paidExpenses = expenseList.filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const unpaidExpenses = expenseList.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + Number(i.amount || 0), 0);

  // Categories list
  const categories = ['ALL', 'Idol & Pooja', 'Tent & Stage', 'Sound & Light', 'Prasadam & Food', 'Visarjan & Procession', 'Electricity & License', 'Misc'];

  // Filtered List
  const filteredList = expenseList.filter(item => {
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.spender || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'Paid' && item.status !== 'Paid') return false;
    if (statusFilter === 'Unpaid' && item.status !== 'Unpaid') return false;

    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;

    if (startDate) {
      const itemTime = item.date ? new Date(item.date).getTime() : null;
      const startTime = new Date(startDate).setHours(0, 0, 0, 0);
      if (itemTime && itemTime < startTime) return false;
    }

    if (endDate) {
      const itemTime = item.date ? new Date(item.date).getTime() : null;
      const endTime = new Date(endDate).setHours(23, 59, 59, 999);
      if (itemTime && itemTime > endTime) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Event Expenses Incurred</span>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Items logged: <span className="text-slate-200 font-semibold">{expenseList.length} items</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Paid & Settled</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1">
            ₹{paidExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Cleared: <span className="text-emerald-400 font-semibold">{expenseList.filter(i => i.status === 'Paid').length} bills</span>
          </div>
        </div>

        <div className="stat-card border-rose-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Unpaid / Pending Reimbursement</span>
            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400 animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">
            ₹{unpaidExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Pending to pay: <span className="text-rose-300 font-bold">{expenseList.filter(i => i.status === 'Unpaid').length} reimbursements</span>
          </div>
        </div>

      </div>

      {/* Expense Ledger Section */}
      <div className="glass-panel p-5 space-y-4 border-rose-500/30">
        
        {/* Top Actions & Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search expense, spender..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-9 text-xs"
              />
            </div>

            {/* Category Dropdown */}
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select text-xs w-full sm:w-44"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Date Range Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs w-full sm:w-auto">
              <Calendar className="w-3.5 h-3.5 text-blue-600 ml-1 flex-shrink-0" />
              <span className="text-slate-500 font-semibold text-[11px]">Date:</span>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-xs rounded px-2 py-1 outline-none focus:border-blue-500"
                title="From Date"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-xs rounded px-2 py-1 outline-none focus:border-blue-500"
                title="To Date"
              />
              {(startDate || endDate) && (
                <button 
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="p-1 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 rounded-md transition-colors"
                  title="Clear Date Range"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs & Add Expense button */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setStatusFilter('ALL')}
                className={`tab-pill text-xs ${statusFilter === 'ALL' ? 'active' : ''}`}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter('Paid')}
                className={`tab-pill text-xs ${statusFilter === 'Paid' ? 'active' : ''}`}
              >
                Paid ({expenseList.filter(i => i.status === 'Paid').length})
              </button>
              <button 
                onClick={() => setStatusFilter('Unpaid')}
                className={`tab-pill text-xs ${statusFilter === 'Unpaid' ? 'active' : ''}`}
              >
                Unpaid ({expenseList.filter(i => i.status === 'Unpaid').length})
              </button>
            </div>

            <button 
              onClick={onOpenAddModal}
              className="btn btn-primary text-xs whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Expense</span>
            </button>
          </div>

        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Expense Item & Date</th>
                <th>Category</th>
                <th>Amount (₹)</th>
                <th>Incurred By</th>
                <th>Receipt Proof</th>
                <th>Status (Click to Toggle)</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500 text-sm">
                    No matching expense records found.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id}>
                    
                    {/* Item Title & Date */}
                    <td>
                      <div className="font-bold text-white text-sm">{item.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(item.date).toLocaleDateString('en-IN')}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="text-xs font-medium text-slate-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                        {item.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td>
                      <span className="text-base font-extrabold text-rose-300">
                        ₹{Number(item.amount).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Spender */}
                    <td>
                      <div className="font-semibold text-slate-200 text-xs">{item.spender}</div>
                      {item.paymentMode !== 'N/A' && (
                        <div className="text-[10px] text-slate-400">{item.paymentMode}</div>
                      )}
                    </td>

                    {/* Receipt Proof */}
                    <td>
                      {item.receiptImage ? (
                        <button
                          onClick={() => setSelectedProofExpense(item)}
                          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No file</span>
                      )}
                    </td>

                    {/* Status Toggle Button */}
                    <td>
                      <button
                        onClick={() => onToggleStatus(item.id)}
                        title="Click to toggle Paid / Unpaid status"
                        className={`badge cursor-pointer transition-all hover:scale-105 ${
                          item.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'
                        }`}
                      >
                        {item.status === 'Paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        <span>{item.status === 'Paid' ? 'PAID ✓' : 'UNPAID (Pay Now)'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="text-right space-x-1">
                      <button 
                        onClick={() => setSelectedProofExpense(item)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => onDeleteExpense(item.id)}
                        title="Delete Record"
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Proof Modal */}
      {selectedProofExpense && (
        <ReceiptProofModal
          expense={selectedProofExpense}
          onClose={() => setSelectedProofExpense(null)}
          onToggleStatus={(id) => {
            onToggleStatus(id);
            setSelectedProofExpense(prev => prev ? { ...prev, status: prev.status === 'Paid' ? 'Unpaid' : 'Paid' } : null);
          }}
        />
      )}

    </div>
  );
}
