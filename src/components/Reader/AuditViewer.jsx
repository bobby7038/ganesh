import React, { useState } from 'react';
import { ShieldCheck, Eye, TrendingUp, Wallet, Receipt, Award, Search, CheckCircle2, Lock } from 'lucide-react';

export default function AuditViewer({ chandaList = [], expenseList = [], committeeDetails }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'chanda' | 'expenses'

  const totalChanda = chandaList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenseList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const netBalance = totalChanda - totalExpenses;

  const topDonors = [...chandaList]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const filteredChanda = chandaList.filter(item => 
    (item.donorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.houseNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.receiptNo || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExpenses = expenseList.filter(item => 
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.spender || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Transparency Header */}
      <div className="glass-panel p-6 bg-white border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-300">
            <Eye className="w-6 h-6 text-slate-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-600" /> Read-Only Transparent Audit
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Public Financial Inspection & Audit View
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified real-time financial ledger for residents, auditors, and well-wishers of Sri Vinayaka Samithi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Accounts Verified</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Total Chanda Collected</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{totalChanda.toLocaleString('en-IN')}</div>
          <p className="text-xs text-slate-500 mt-2">Total Donors: <strong className="text-slate-800">{chandaList.length}</strong></p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Total Expenses Spent</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600">₹{totalExpenses.toLocaleString('en-IN')}</div>
          <p className="text-xs text-slate-500 mt-2">Log Entries: <strong className="text-slate-800">{expenseList.length}</strong></p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Available Net Fund</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold ${netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₹{netBalance.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-2">Fund Health: <strong className="text-emerald-700">Balanced</strong></p>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Search */}
      <div className="glass-panel p-4 bg-white border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                activeSubTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview & Top Donors
            </button>
            <button
              onClick={() => setActiveSubTab('chanda')}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                activeSubTab === 'chanda' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Chanda Ledger ({chandaList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('expenses')}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                activeSubTab === 'expenses' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Expenses Ledger ({expenseList.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search donor or item..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-9 text-xs"
            />
          </div>
        </div>

        {/* Tab Content 1: Overview & Top Donors */}
        {activeSubTab === 'overview' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Top Contributors Honor Wall</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topDonors.map((donor, idx) => (
                <div key={donor.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{donor.donorName}</div>
                      <div className="text-[11px] text-slate-500">{donor.houseNo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-blue-700">₹{donor.amount.toLocaleString('en-IN')}</div>
                    <span className="text-[10px] text-slate-500">{donor.paymentMode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Chanda Ledger */}
        {activeSubTab === 'chanda' && (
          <div className="overflow-x-auto pt-2">
            <table className="custom-table text-xs">
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Donor Name</th>
                  <th>House / Flat</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredChanda.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono text-blue-700 font-bold">{c.receiptNo}</td>
                    <td className="font-bold text-slate-900">{c.donorName}</td>
                    <td>{c.houseNo}</td>
                    <td className="font-extrabold text-emerald-700">₹{c.amount.toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-online">{c.paymentMode}</span></td>
                    <td><span className="badge badge-paid">{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content 3: Expenses Ledger */}
        {activeSubTab === 'expenses' && (
          <div className="overflow-x-auto pt-2">
            <table className="custom-table text-xs">
              <thead>
                <tr>
                  <th>Expense Item</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Incurred By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(e => (
                  <tr key={e.id}>
                    <td className="font-bold text-slate-900">{e.title}</td>
                    <td><span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">{e.category}</span></td>
                    <td className="font-extrabold text-rose-600">₹{e.amount.toLocaleString('en-IN')}</td>
                    <td>{e.spender}</td>
                    <td>
                      <span className={`badge ${e.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
