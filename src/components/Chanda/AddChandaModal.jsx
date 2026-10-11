import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, Smartphone, Banknote, CheckCircle2, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { openWhatsApp } from '../../utils/whatsapp';

export default function AddChandaModal({ isOpen, onClose, onAddChanda, usersList = [] }) {
  const [shareOnWhatsApp, setShareOnWhatsApp] = useState(true);
  const [formData, setFormData] = useState({
    donorName: '',
    houseNo: '',
    phone: '',
    amount: '',
    paymentMode: 'Cash', // 'Cash' | 'Online'
    refNo: '',
    collectorName: usersList[0]?.name || 'Suresh (Youth Pres)',
    category: 'Household',
    status: 'Paid',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.donorName || !formData.amount) {
      alert("Please fill in Donor Name and Amount");
      return;
    }

    // Trigger celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b00', '#ffd700', '#10b981']
      });
    } catch (err) {
      // fallback
    }

    const newRecord = {
      id: `CH-${Date.now()}`,
      receiptNo: `GC-2026-${Math.floor(100 + Math.random() * 900)}`,
      donorName: formData.donorName,
      houseNo: formData.houseNo || 'N/A',
      phone: formData.phone || '',
      amount: Number(formData.amount),
      paymentMode: formData.paymentMode,
      refNo: formData.paymentMode === 'Online' ? (formData.refNo || 'UPI Ref') : 'N/A',
      collectorName: formData.collectorName || 'Chanda Team',
      category: formData.category,
      date: new Date().toISOString(),
      status: formData.status,
      notes: formData.notes
    };

    onAddChanda(newRecord);

    // Direct WhatsApp sending on mobile / browser
    if (shareOnWhatsApp && formData.phone && formData.phone.trim()) {
      const receiptText = `🪔 *SRI VINAYAKA CHAVITHI UTSAV SAMITHI* 🪔\n` +
        `*Chanda Receipt Acknowledgment*\n\n` +
        `*Receipt No:* ${newRecord.receiptNo}\n` +
        `*Donor Name:* ${newRecord.donorName}\n` +
        `*House / Flat:* ${newRecord.houseNo}\n` +
        `*Amount Paid:* ₹${Number(newRecord.amount).toLocaleString('en-IN')}\n` +
        `*Payment Mode:* ${newRecord.paymentMode} (${newRecord.refNo || 'N/A'})\n` +
        `*Collected By:* ${newRecord.collectorName}\n` +
        `*Date:* ${new Date(newRecord.date).toLocaleDateString('en-IN')}\n\n` +
        `🙏 _May Lord Ganesha bless you and your family with peace, health & prosperity! Jai Ganesha!_ 🙏`;

      openWhatsApp({ phone: formData.phone, text: receiptText });
    }

    // Also attempt automated background WhatsApp receipt via Bot server API if available
    if (formData.phone && formData.phone.trim()) {
      const apiHost = window.location.hostname || 'localhost';
      fetch(`http://${apiHost}:5000/api/send-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          donorName: newRecord.donorName,
          amount: newRecord.amount,
          receiptNo: newRecord.receiptNo,
          paymentMode: newRecord.paymentMode,
          collectorName: newRecord.collectorName,
          houseNo: newRecord.houseNo
        })
      }).catch(err => {
        console.log('Automated WhatsApp Bot API offline or not running:', err);
      });
    }

    onClose();

    // Reset form data
    setFormData({
      donorName: '',
      houseNo: '',
      phone: '',
      amount: '',
      paymentMode: 'Cash',
      refNo: '',
      collectorName: usersList[0]?.name || 'Suresh (Youth Pres)',
      category: 'Household',
      status: 'Paid',
      notes: ''
    });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn border-amber-500/40 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900/90 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <PlusCircle className="w-5 h-5" />
            <span>Record New Chanda Entry</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Donor Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Donor Full Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Ramesh Kumar" 
                value={formData.donorName}
                onChange={(e) => setFormData({...formData, donorName: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number (WhatsApp)</label>
              <input 
                type="text" 
                placeholder="e.g. 9849012345" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-input"
              />
            </div>
          </div>

          {/* House No & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">House / Flat No / Address</label>
              <input 
                type="text" 
                placeholder="e.g. Flat 302, Sai Residency" 
                value={formData.houseNo}
                onChange={(e) => setFormData({...formData, houseNo: e.target.value})}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input 
                type="number" 
                required
                min="1"
                placeholder="e.g. 1116" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="form-input text-amber-300 font-bold text-lg"
              />
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="form-group">
            <label className="form-label">Payment Mode *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMode: 'Cash', refNo: 'N/A'})}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  formData.paymentMode === 'Cash' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash Collection</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMode: 'Online'})}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  formData.paymentMode === 'Online' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Online (UPI/GPay/QR)</span>
              </button>
            </div>
          </div>

          {/* Conditional Ref / Collector fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.paymentMode === 'Online' ? (
              <div className="form-group">
                <label className="form-label">UPI Txn / Ref ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. UPI/39102910" 
                  value={formData.refNo}
                  onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                  className="form-input font-mono text-xs"
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Collected By (Member / Friend)</label>
                {usersList.length > 0 ? (
                  <select
                    value={formData.collectorName}
                    onChange={(e) => setFormData({...formData, collectorName: e.target.value})}
                    className="form-select"
                  >
                    {usersList.map(u => (
                      <option key={u.id} value={`${u.name} (${u.designation})`}>
                        {u.name} ({u.designation})
                      </option>
                    ))}
                    <option value="Self / Direct Pandal">Self / Direct Pandal</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    placeholder="e.g. Suresh (Youth Pres)" 
                    value={formData.collectorName}
                    onChange={(e) => setFormData({...formData, collectorName: e.target.value})}
                    className="form-input"
                  />
                )}
              </div>
            )}


            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-select"
              >
                <option value="Household">Household Resident</option>
                <option value="Shopkeeper">Shopkeeper / Commercial</option>
                <option value="Chief Sponsor">Chief Sponsor / VVIP</option>
                <option value="Youth Group">Youth Group Pool</option>
                <option value="Well Wisher">Well Wisher</option>
              </select>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="form-select"
              >
                <option value="Paid">Paid (Cash/Online Received)</option>
                <option value="Pledged">Pledged / Promised for later</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Remarks / Special Prasadam Note</label>
              <input 
                type="text" 
                placeholder="e.g. Laddu sponsor" 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="form-input"
              />
            </div>
          </div>

          {/* Direct WhatsApp Share Toggle */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Send WhatsApp Receipt</p>
                <p className="text-[11px] text-slate-500">Opens WhatsApp directly on your phone with pre-filled receipt</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={shareOnWhatsApp} 
                onChange={(e) => setShareOnWhatsApp(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-secondary text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Issue Digital Receipt</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
