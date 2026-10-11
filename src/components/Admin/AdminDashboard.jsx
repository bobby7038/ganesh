import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Smartphone, 
  Banknote, 
  Receipt, 
  AlertCircle, 
  Target, 
  Award, 
  PieChart as PieIcon, 
  BarChart3, 
  Download, 
  RefreshCw,
  Users,
  CheckCircle2,
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import UserManagement from './UserManagement';

export default function AdminDashboard({ 
  chandaList = [], 
  expenseList = [], 
  committeeDetails,
  onResetData,
  usersList = [],
  currentUser,
  onOpenAddUser,
  onDeleteUser,
  onUpdateUser
}) {
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'users'

  // Calculations
  const totalChanda = chandaList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  
  const cashChanda = chandaList
    .filter(item => item.paymentMode === 'Cash')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const onlineChanda = chandaList
    .filter(item => item.paymentMode === 'Online')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const paidChanda = chandaList
    .filter(item => item.status === 'Paid')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const pledgedChanda = chandaList
    .filter(item => item.status === 'Pledged')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalExpenses = expenseList.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const paidExpenses = expenseList
    .filter(item => item.status === 'Paid')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const unpaidExpenses = expenseList
    .filter(item => item.status === 'Unpaid')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const netBalance = totalChanda - totalExpenses;

  // Category breakdown for expenses
  const expenseCategories = expenseList.reduce((acc, item) => {
    const cat = item.category || 'Misc';
    acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  // Top Donors
  const topDonors = [...chandaList]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Export helper
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "=== GANESH CHAVITHI FINANCIAL REPORT ===\n\n";
    csvContent += "CHANDA COLLECTIONS\n";
    csvContent += "Receipt No,Donor Name,House No,Phone,Amount,Payment Mode,Ref No,Collector,Category,Status,Date\n";
    
    chandaList.forEach(c => {
      csvContent += `"${c.receiptNo}","${c.donorName}","${c.houseNo}","${c.phone}",${c.amount},"${c.paymentMode}","${c.refNo}","${c.collectorName}","${c.category}","${c.status}","${c.date}"\n`;
    });

    csvContent += "\nEXPENSES LEDGER\n";
    csvContent += "ID,Expense Title,Category,Amount,Incurred By,Status,Payment Mode,Ref No,Date\n";
    expenseList.forEach(e => {
      csvContent += `"${e.id}","${e.title}","${e.category}",${e.amount},"${e.spender}","${e.status}","${e.paymentMode}","${e.refNo}","${e.date}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ganesh_Chavithi_Accounts_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Admin Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-3 bg-white border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-2 transition-all ${
              adminTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Financial Overview & Analytics</span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-2 transition-all ${
              adminTab === 'users'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Committee Users ({usersList.length})</span>
          </button>
        </div>

        <button 
          onClick={onOpenAddUser}
          className="btn btn-primary text-xs w-full sm:w-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Committee Member</span>
        </button>
      </div>

      {adminTab === 'users' ? (
        <UserManagement 
          usersList={usersList}
          currentUser={currentUser}
          onOpenAddUser={onOpenAddUser}
          onDeleteUser={onDeleteUser}
          onUpdateUser={onUpdateUser}
        />
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-slate-500">Total Revenue Collected</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                ₹{totalChanda.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                <span>Donors: <strong className="text-slate-800">{chandaList.length}</strong></span>
                <span>Pledged: <strong className="text-purple-600 font-bold">₹{pledgedChanda.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>

            {/* Online vs Cash */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-slate-500">Payment Modes Split</span>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-700 flex items-center gap-1 font-medium"><Smartphone className="w-3.5 h-3.5" /> Online (UPI):</span>
                  <strong className="text-slate-900">₹{onlineChanda.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-amber-700 flex items-center gap-1 font-medium"><Banknote className="w-3.5 h-3.5" /> Cash:</span>
                  <strong className="text-slate-900">₹{cashChanda.toLocaleString('en-IN')}</strong>
                </div>
              </div>
              {/* Split Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden flex border border-slate-200">
                <div 
                  style={{ width: `${totalChanda ? (onlineChanda/totalChanda)*100 : 0}%` }} 
                  className="bg-blue-600 h-full"
                  title="Online %"
                ></div>
                <div 
                  style={{ width: `${totalChanda ? (cashChanda/totalChanda)*100 : 0}%` }} 
                  className="bg-amber-500 h-full"
                  title="Cash %"
                ></div>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-slate-500">Total Event Expenses</span>
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-rose-600">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                <span>Paid: <strong className="text-emerald-600 font-bold">₹{paidExpenses.toLocaleString('en-IN')}</strong></span>
                <span>Pending: <strong className="text-rose-600 font-bold">₹{unpaidExpenses.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>

            {/* Net Fund Balance */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-slate-500">Net Fund Balance</span>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className={`text-2xl font-extrabold ${netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{netBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Available Balance</span>
              </p>
            </div>

          </div>

          {/* Main Charts & Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Payment Mode Deep Dive */}
            <div className="glass-panel p-5 bg-white border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Revenue Source Analysis</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">All Sources</span>
              </div>

              <div className="space-y-4">
                {/* Online Row */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Online UPI & GPay</div>
                        <div className="text-[11px] text-slate-500">Directly into Committee Bank / QR</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-700">₹{onlineChanda.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-slate-500">
                        {totalChanda ? Math.round((onlineChanda / totalChanda) * 100) : 0}% of total
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full" 
                      style={{ width: `${totalChanda ? (onlineChanda / totalChanda) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Cash Row */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-100 text-amber-700 rounded-md">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Cash Collections</div>
                        <div className="text-[11px] text-slate-500">Collected manually by Chanda team</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-amber-700">₹{cashChanda.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-slate-500">
                        {totalChanda ? Math.round((cashChanda / totalChanda) * 100) : 0}% of total
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{ width: `${totalChanda ? (cashChanda / totalChanda) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                <span>
                  All cash collected must be reconciled daily with the Treasurer.
                </span>
              </div>
            </div>

            {/* Expenses Category Breakdown */}
            <div className="glass-panel p-5 bg-white border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-base">Expense Category Breakdown</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Total: ₹{totalExpenses.toLocaleString('en-IN')}</span>
              </div>

              <div className="space-y-3">
                {Object.keys(expenseCategories).length > 0 ? (
                  Object.entries(expenseCategories).map(([cat, amt]) => {
                    const pct = totalExpenses ? Math.round((amt / totalExpenses) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-700 font-medium">{cat}</span>
                          <span className="text-slate-900 font-bold">₹{amt.toLocaleString('en-IN')} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div 
                            className="bg-rose-500 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No expenses logged yet.</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Unpaid Expenses:</span>
                <span className="text-rose-600 font-bold">₹{unpaidExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Top Donors Leaderboard */}
            <div className="glass-panel p-5 bg-white border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Top Chanda Contributors</h3>
                </div>
                <span className="text-xs text-blue-600 font-bold">Honor Wall</span>
              </div>

              <div className="space-y-2.5">
                {topDonors.length > 0 ? (
                  topDonors.map((donor, idx) => (
                    <div 
                      key={donor.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          idx === 0 ? 'bg-blue-600 text-white font-bold' :
                          idx === 1 ? 'bg-slate-200 text-slate-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">{donor.donorName}</div>
                          <div className="text-[11px] text-slate-500">{donor.houseNo}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-blue-700">₹{donor.amount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-500">{donor.paymentMode}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No collections recorded yet.</p>
                )}
              </div>

            </div>

          </div>

          {/* Admin Audit & Data Controls Bar */}
          <div className="glass-panel p-4 bg-white border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Committee Data Management & Audit</h4>
              <p className="text-xs text-slate-500">Export financial records to CSV format or reset dataset.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={exportToCSV}
                className="btn btn-secondary text-xs flex-1 sm:flex-initial"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Export CSV Accounts</span>
              </button>
              <button 
                onClick={onResetData}
                className="btn btn-secondary text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-300 flex-1 sm:flex-initial"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
