import React, { useState } from 'react';
import { X, PlusCircle, Upload, CheckCircle2, Image as ImageIcon, Receipt } from 'lucide-react';

export default function AddExpenseModal({ isOpen, onClose, onAddExpense, usersList = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Idol & Pooja',
    amount: '',
    spender: usersList[0]?.name || 'Suresh (Youth Pres)',
    status: 'Paid', // 'Paid' | 'Unpaid'
    paymentMode: 'Online UPI',
    refNo: '',
    receiptImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80',
    notes: ''
  });

  if (!isOpen) return null;

  const PRESET_RECEIPTS = [
    { label: 'Ganesh Idol Bill', url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80' },
    { label: 'Tent & Flowers Voucher', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80' },
    { label: 'Prasadam Grocery Bill', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80' },
    { label: 'Visarjan Sound Bill', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, receiptImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      alert("Please fill in Expense Title and Amount");
      return;
    }

    const newExpense = {
      id: `EX-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      amount: Number(formData.amount),
      spender: formData.spender || 'Committee Member',
      status: formData.status,
      paymentMode: formData.status === 'Paid' ? formData.paymentMode : 'N/A',
      refNo: formData.status === 'Paid' ? (formData.refNo || 'Settled') : 'Pending',
      date: new Date().toISOString(),
      receiptImage: formData.receiptImage,
      notes: formData.notes
    };

    onAddExpense(newExpense);
    onClose();

    // Reset form
    setFormData({
      title: '',
      category: 'Idol & Pooja',
      amount: '',
      spender: 'Suresh (Youth Pres)',
      status: 'Paid',
      paymentMode: 'Online UPI',
      refNo: '',
      receiptImage: PRESET_RECEIPTS[0].url,
      notes: ''
    });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn border-rose-500/40 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900/90 px-6 py-4 border-b border-rose-500/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <Receipt className="w-5 h-5" />
            <span>Add Event Expense & Attach Bill</span>
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
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Expense Title / Item *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Clay Ganesh idol 5ft" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-select"
              >
                <option value="Idol & Pooja">Idol & Pooja Samagri</option>
                <option value="Tent & Stage">Tent & Mandapam Decoration</option>
                <option value="Sound & Light">Sound System & DJ</option>
                <option value="Prasadam & Food">Prasadam & Food Grocery</option>
                <option value="Visarjan & Procession">Visarjan & Procession</option>
                <option value="Electricity & License">Electricity & Permission</option>
                <option value="Misc">Miscellaneous / Cleaning</option>
              </select>
            </div>
          </div>

          {/* Amount & Spender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Amount Incurred (₹) *</label>
              <input 
                type="number" 
                required
                min="1"
                placeholder="e.g. 8500" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="form-input text-rose-300 font-bold text-lg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Incurred By / Spender Name</label>
              {usersList.length > 0 ? (
                <select
                  value={formData.spender}
                  onChange={(e) => setFormData({...formData, spender: e.target.value})}
                  className="form-select"
                >
                  {usersList.map(u => (
                    <option key={u.id} value={`${u.name} (${u.designation})`}>
                      {u.name} ({u.designation})
                    </option>
                  ))}
                  <option value="General Committee Fund">General Committee Fund</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh (Treasurer)" 
                  value={formData.spender}
                  onChange={(e) => setFormData({...formData, spender: e.target.value})}
                  className="form-input"
                />
              )}
            </div>
          </div>

          {/* Payment Status Toggle (Paid vs Unpaid) */}
          <div className="form-group">
            <label className="form-label">Payment Status *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, status: 'Paid'})}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                  formData.status === 'Paid' 
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Paid / Settled</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({...formData, status: 'Unpaid'})}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                  formData.status === 'Unpaid' 
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-md' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <X className="w-4 h-4" />
                <span>Unpaid (Reimbursement Pending)</span>
              </button>
            </div>
          </div>

          {/* If Paid, specify payment mode */}
          {formData.status === 'Paid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select 
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                  className="form-select"
                >
                  <option value="Online UPI">Online UPI / GPay</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bill / Txn Reference No</label>
                <input 
                  type="text" 
                  placeholder="e.g. Bill #104 or UPI/39102" 
                  value={formData.refNo}
                  onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                  className="form-input font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Receipt Image / Proof Upload */}
          <div className="form-group">
            <label className="form-label">Attach Receipt Photo Proof</label>
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700"
              />

              <div className="text-[11px] text-slate-400">Or pick a sample bill proof image template:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_RECEIPTS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, receiptImage: preset.url })}
                    className={`p-1.5 rounded-lg border text-left text-[11px] transition-all overflow-hidden ${
                      formData.receiptImage === preset.url ? 'border-amber-400 bg-amber-500/10 text-amber-300' : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="h-10 rounded mb-1 overflow-hidden">
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="truncate block">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes & Remarks</label>
            <input 
              type="text" 
              placeholder="e.g. Vendor contact or balance payment terms" 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="form-input"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
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
              <span>Save Expense Record</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
