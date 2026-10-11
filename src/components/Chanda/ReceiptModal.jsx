import React from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Phone, 
  Home, 
  Calendar, 
  CreditCard,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function ReceiptModal({ record, onClose, committeeDetails }) {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  // Format WhatsApp Share text
  const shareWhatsApp = () => {
    let digits = record.phone ? record.phone.replace(/\D/g, '') : '';
    if (digits.length === 10) digits = `91${digits}`;
    else if (digits.length === 11 && digits.startsWith('0')) digits = `91${digits.slice(1)}`;

    const text = `🪔 *SRI VINAYAKA CHAVITHI UTSAV SAMITHI* 🪔\n` +
      `*Chanda Receipt Acknowledgment*\n\n` +
      `*Receipt No:* ${record.receiptNo}\n` +
      `*Donor Name:* ${record.donorName}\n` +
      `*House / Flat:* ${record.houseNo}\n` +
      `*Amount Paid:* ₹${Number(record.amount).toLocaleString('en-IN')}\n` +
      `*Payment Mode:* ${record.paymentMode} (${record.refNo || 'N/A'})\n` +
      `*Collected By:* ${record.collectorName}\n` +
      `*Date:* ${new Date(record.date).toLocaleDateString('en-IN')}\n\n` +
      `🙏 _May Lord Ganesha bless you and your family with peace, health & prosperity! Jai Ganesha!_ 🙏`;

    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const encoded = encodeURIComponent(text);
    const whatsappUrl = digits 
      ? `https://api.whatsapp.com/send?phone=${digits}&text=${encoded}` 
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="bg-slate-950 border border-amber-500/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn">
        
        {/* Modal Header */}
        <div className="no-print bg-slate-900 px-5 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Sparkles className="w-5 h-5" />
            <span>Digital Chanda Receipt</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 relative">
          
          {/* Decorative Seal / Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-amber-400">
            <Flame className="w-64 h-64" />
          </div>

          {/* Committee Header Card */}
          <div className="text-center border-b border-amber-500/30 pb-4 mb-4 relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 mb-2">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="festive-title text-xl font-black uppercase tracking-wide">
              {committeeDetails?.utsavName || "Sri Vinayaka Chavithi Utsav Samithi"}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {committeeDetails?.location || "Maruthi Nagar Colony, Road No 4"}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] px-3 py-1 rounded-full font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> OFFICIAL DONATION ACKNOWLEDGMENT {committeeDetails?.year || '2026'}
            </div>
          </div>

          {/* Receipt Info grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs mb-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Receipt Number</span>
              <strong className="text-amber-400 font-mono text-sm">{record.receiptNo}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
              <strong className="text-slate-200">{new Date(record.date).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Donor & Payment Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-start pb-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-amber-400" /> Donor Name:
              </span>
              <div className="text-right font-bold text-white text-base">{record.donorName}</div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" /> Flat / Address:
              </span>
              <span className="font-semibold text-slate-200 text-xs">{record.houseNo}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> Phone Number:
              </span>
              <span className="font-mono text-slate-300 text-xs">{record.phone || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Payment Mode:
              </span>
              <div className="flex items-center gap-2">
                <span className={`badge ${record.paymentMode === 'Cash' ? 'badge-cash' : 'badge-online'}`}>
                  {record.paymentMode}
                </span>
                <span className="text-xs text-slate-400 font-mono">({record.refNo || 'Cash Collected'})</span>
              </div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs">Collected By:</span>
              <span className="font-semibold text-amber-300 text-xs">{record.collectorName}</span>
            </div>
          </div>

          {/* Amount Callout Box */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-center relative overflow-hidden">
            <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider block">
              Contribution Received Amount
            </span>
            <div className="text-3xl font-black text-amber-300 mt-1">
              ₹{Number(record.amount).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> STATUS: {record.status.toUpperCase()} ACKNOWLEDGED
            </div>
          </div>

          {/* Footer Devotional Note */}
          <p className="text-[11px] text-center text-slate-400 mt-4 italic">
            "May Lord Ganesha bless your home with health, wealth & happiness."
          </p>

        </div>

        {/* Modal Actions */}
        <div className="no-print bg-slate-900 p-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button 
            onClick={shareWhatsApp}
            className="btn btn-emerald text-xs flex-1"
          >
            <Share2 className="w-4 h-4" />
            <span>Share WhatsApp Receipt</span>
          </button>
          
          <button 
            onClick={handlePrint}
            className="btn btn-gold text-xs flex-1"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
}
