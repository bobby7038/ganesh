import React from 'react';
import { ShieldCheck, BookOpen, Receipt, CheckCircle2 } from 'lucide-react';

export default function RoleBanner({ activeRole }) {
  const roleConfig = {
    admin: {
      title: "Admin Role — Total Revenue & Audit Analytics",
      description: "Analyze overall collections, payment channel distribution (Cash vs Online), expenses breakdown, and manage committee users.",
      icon: ShieldCheck,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-600",
      features: [
        "Analyze total revenue across Cash & Online sources",
        "Monitor Net fund availability & expense ratios",
        "View category-wise expense breakdown",
        "Audit top donors & manage committee members"
      ]
    },
    chanda: {
      title: "Chanda Role — Collection Bookkeeper",
      description: "Record donations (Chanda) from households & shopkeepers, note Cash vs Online UPI payments, generate digital receipts instantly.",
      icon: BookOpen,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-600",
      features: [
        "Add new Chanda records (Donor Name, Flat, Phone, Amount)",
        "Specify Cash or Online payment with Ref/Collector details",
        "Generate & send WhatsApp receipts",
        "Live search by house number or phone"
      ]
    },
    expenses: {
      title: "Expenses Role — Event Bills & Reimbursements",
      description: "Log all event expenses (Idol purchase, Mandapam tent, DJ sound, Prasadam, Visarjan), attach receipt proofs, and track Paid vs Unpaid status.",
      icon: Receipt,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      iconColor: "text-amber-600",
      features: [
        "Log expenses with category, amount, and spender details",
        "Upload/attach bill receipt photo proof",
        "Toggle status between 'Paid' & 'Unpaid'",
        "Track total outstanding reimbursements"
      ]
    }
  };

  const current = roleConfig[activeRole] || roleConfig.admin;
  const IconComponent = current.icon;

  return (
    <div className="no-print max-w-7xl mx-auto mb-6">
      <div className="glass-panel p-4 md:p-5 bg-white border-slate-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border ${current.badgeColor} flex-shrink-0 mt-0.5 lg:mt-0`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Active Mode
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {current.title}
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                {current.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 w-full lg:w-auto">
            {current.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
