import React from 'react';
import { X, Image, FileText, CheckCircle2, AlertCircle, DollarSign } from 'lucide-react';

export default function ReceiptProofModal({ expense, onClose, onToggleStatus }) {
  if (!expense) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-slate-950 border border-rose-500/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 border-b border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <FileText className="w-5 h-5" />
            <span>Expense Bill & Receipt Proof</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-slate-100">
          
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-base">{expense.title}</h3>
                <span className="text-xs text-slate-400">{expense.category}</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-rose-300">
                  ₹{Number(expense.amount).toLocaleString('en-IN')}
                </div>
                <span className={`badge ${expense.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                  {expense.status}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 flex justify-between">
              <span>Spent By: <strong className="text-amber-300">{expense.spender}</strong></span>
              <span>Date: {new Date(expense.date).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          {/* Image Proof View */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-slate-400 block">Attached Receipt Document</span>
            {expense.receiptImage ? (
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-72 flex items-center justify-center bg-slate-900">
                <img 
                  src={expense.receiptImage} 
                  alt={expense.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-amber-400 opacity-60" />
                <span>No digital image uploaded for this expense entry.</span>
                <span className="text-[11px] text-slate-500">Manual voucher bill maintained by {expense.spender}</span>
              </div>
            )}
          </div>

          {expense.notes && (
            <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 italic border border-slate-800">
              "{expense.notes}"
            </div>
          )}

        </div>

        {/* Action Controls */}
        <div className="bg-slate-900 p-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button 
            onClick={() => onToggleStatus(expense.id)}
            className={`btn text-xs flex-1 ${expense.status === 'Paid' ? 'btn-secondary text-rose-300' : 'btn-emerald'}`}
          >
            {expense.status === 'Paid' ? 'Mark as Unpaid (Reimbursement Pending)' : 'Mark as Paid / Settled'}
          </button>
          
          <button 
            onClick={onClose}
            className="btn btn-secondary text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
