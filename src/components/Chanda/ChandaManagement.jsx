import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Smartphone, 
  Banknote, 
  Share2, 
  FileText, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  TrendingUp,
  Receipt,
  Calendar,
  X
} from 'lucide-react';
import ReceiptModal from './ReceiptModal';

export default function ChandaManagement({ 
  chandaList, 
  onAddChanda, 
  onDeleteChanda, 
  committeeDetails,
  onOpenAddModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'Cash' | 'Online' | 'Pledged'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Summary Metrics
  const totalAmount = chandaList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const cashAmount = chandaList.filter(item => item.paymentMode === 'Cash').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const onlineAmount = chandaList.filter(item => item.paymentMode === 'Online').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const avgContribution = chandaList.length ? Math.round(totalAmount / chandaList.length) : 0;

  // Filter & Search Logic
  const filteredList = chandaList.filter(item => {
    const matchesSearch = 
      (item.donorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.houseNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone || '').includes(searchQuery) ||
      (item.receiptNo || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'Cash' && item.paymentMode !== 'Cash') return false;
    if (filterMode === 'Online' && item.paymentMode !== 'Online') return false;
    if (filterMode === 'Pledged' && item.status !== 'Pledged') return false;

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
      
      {/* Top Counter Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Chanda Collected</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Average: <span className="text-amber-300 font-semibold">₹{avgContribution.toLocaleString('en-IN')} / donor</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Cash Collections</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">
            ₹{cashAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Count: <span className="text-slate-200 font-semibold">{chandaList.filter(i => i.paymentMode === 'Cash').length} records</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Online (UPI / GPay)</span>
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-sky-300 mt-1">
            ₹{onlineAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Count: <span className="text-slate-200 font-semibold">{chandaList.filter(i => i.paymentMode === 'Online').length} records</span>
          </div>
        </div>

        <div className="stat-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Donors</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1">
            {chandaList.length}
          </div>
          <button 
            onClick={onOpenAddModal}
            className="btn btn-primary text-xs w-full mt-2"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Record New Entry</span>
          </button>
        </div>

      </div>

      {/* Main Ledger Table Panel */}
      <div className="glass-panel p-5 space-y-4">
        
        {/* Search & Filter Header Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search donor, flat no, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-9 text-xs"
              />
            </div>

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

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button 
              onClick={() => setFilterMode('ALL')}
              className={`tab-pill text-xs ${filterMode === 'ALL' ? 'active' : ''}`}
            >
              All ({chandaList.length})
            </button>
            <button 
              onClick={() => setFilterMode('Cash')}
              className={`tab-pill text-xs ${filterMode === 'Cash' ? 'active' : ''}`}
            >
              Cash ({chandaList.filter(i => i.paymentMode === 'Cash').length})
            </button>
            <button 
              onClick={() => setFilterMode('Online')}
              className={`tab-pill text-xs ${filterMode === 'Online' ? 'active' : ''}`}
            >
              Online ({chandaList.filter(i => i.paymentMode === 'Online').length})
            </button>
            <button 
              onClick={() => setFilterMode('Pledged')}
              className={`tab-pill text-xs ${filterMode === 'Pledged' ? 'active' : ''}`}
            >
              Pledged ({chandaList.filter(i => i.status === 'Pledged').length})
            </button>
          </div>

        </div>

        {/* Chanda Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Donor & Address</th>
                <th>Category</th>
                <th>Amount (₹)</th>
                <th>Payment Mode</th>
                <th>Collector / Ref</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-500 text-sm">
                    No matching Chanda records found.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id}>
                    
                    {/* Receipt No */}
                    <td>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                        {item.receiptNo}
                      </span>
                    </td>

                    {/* Donor Info */}
                    <td>
                      <div className="font-bold text-slate-900 text-sm">{item.donorName}</div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                        <span>{item.houseNo}</span>
                        {item.phone && <span>• {item.phone}</span>}
                        {item.date && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            • {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                        {item.category || 'Household'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td>
                      <span className="text-base font-extrabold text-blue-700">
                        ₹{Number(item.amount).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Payment Mode */}
                    <td>
                      <span className={`badge ${item.paymentMode === 'Cash' ? 'badge-cash' : 'badge-online'}`}>
                        {item.paymentMode === 'Cash' ? <Banknote className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                        <span>{item.paymentMode}</span>
                      </span>
                    </td>

                    {/* Collector / Ref */}
                    <td className="text-xs text-slate-700">
                      <div className="font-semibold text-slate-800">{item.collectorName}</div>
                      {item.refNo !== 'N/A' && (
                        <div className="text-[10px] text-blue-600 font-mono">{item.refNo}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`badge ${item.status === 'Paid' ? 'badge-paid' : 'badge-pledged'}`}>
                        {item.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="text-right space-x-1">
                      <button 
                        onClick={() => setSelectedReceipt(item)}
                        title="View Digital Receipt"
                        className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          let digits = item.phone ? item.phone.replace(/\D/g, '') : '';
                          if (digits.length === 10) digits = `91${digits}`;
                          else if (digits.length === 11 && digits.startsWith('0')) digits = `91${digits.slice(1)}`;

                          const text = `🪔 *SRI GANESH UTSAV SAMITHI* 🪔\n` +
                            `*Digital Chanda Receipt*\n\n` +
                            `*Receipt No:* ${item.receiptNo}\n` +
                            `*Donor Name:* ${item.donorName}\n` +
                            `*Address/Flat:* ${item.houseNo || 'N/A'}\n` +
                            `*Amount Paid:* ₹${Number(item.amount).toLocaleString('en-IN')}\n` +
                            `*Payment Mode:* ${item.paymentMode}\n` +
                            `*Collector:* ${item.collectorName || 'Committee'}\n\n` +
                            `🙏 _Thank you for your contribution! May Lord Ganesha bless you and your family!_ 🙏`;

                          const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                          const encoded = encodeURIComponent(text);
                          const whatsappUrl = digits 
                            ? `https://api.whatsapp.com/send?phone=${digits}&text=${encoded}` 
                            : `https://api.whatsapp.com/send?text=${encoded}`;

                          window.open(whatsappUrl, '_blank');
                        }}
                        title="Quick WhatsApp Share"
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/30"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => onDeleteChanda(item.id)}
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

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal 
          record={selectedReceipt} 
          onClose={() => setSelectedReceipt(null)}
          committeeDetails={committeeDetails}
        />
      )}

    </div>
  );
}
