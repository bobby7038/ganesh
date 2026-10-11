import React from 'react';

export default function PrintableLedger({ chandaList, expenseList, committeeDetails }) {
  const totalChanda = chandaList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenseList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const netBalance = totalChanda - totalExpenses;

  return (
    <div className="printable-area hidden print:block bg-white text-black p-8 font-sans">
      
      {/* Printable Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider">
          {committeeDetails?.utsavName || "Sri Vinayaka Chavithi Utsav Samithi"}
        </h1>
        <p className="text-sm text-gray-700 mt-1">{committeeDetails?.location}</p>
        <h2 className="text-lg font-semibold mt-2 underline">
          OFFICIAL CHANDA BOOK & EXPENSES STATEMENT — {committeeDetails?.year || '2026'}
        </h2>
      </div>

      {/* Summary Financial Box */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 border border-black rounded text-center">
        <div>
          <span className="text-xs uppercase font-bold text-gray-600 block">Total Chanda Collected</span>
          <strong className="text-xl">₹{totalChanda.toLocaleString('en-IN')}</strong>
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-gray-600 block">Total Event Expenses</span>
          <strong className="text-xl">₹{totalExpenses.toLocaleString('en-IN')}</strong>
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-gray-600 block">Net Remaining Fund</span>
          <strong className="text-xl">₹{netBalance.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* Chanda Ledger Table */}
      <div className="mb-8">
        <h3 className="text-base font-bold uppercase mb-2 border-b border-black pb-1">
          1. CHANDA COLLECTIONS LEDGER ({chandaList.length} Donors)
        </h3>
        <table className="w-full text-xs border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-1.5 text-left">Receipt #</th>
              <th className="border border-gray-400 p-1.5 text-left">Donor Name</th>
              <th className="border border-gray-400 p-1.5 text-left">House / Flat</th>
              <th className="border border-gray-400 p-1.5 text-left">Phone</th>
              <th className="border border-gray-400 p-1.5 text-right">Amount (₹)</th>
              <th className="border border-gray-400 p-1.5 text-left">Payment Mode</th>
              <th className="border border-gray-400 p-1.5 text-left">Collector</th>
            </tr>
          </thead>
          <tbody>
            {chandaList.map(item => (
              <tr key={item.id}>
                <td className="border border-gray-400 p-1.5 font-mono">{item.receiptNo}</td>
                <td className="border border-gray-400 p-1.5 font-bold">{item.donorName}</td>
                <td className="border border-gray-400 p-1.5">{item.houseNo}</td>
                <td className="border border-gray-400 p-1.5">{item.phone}</td>
                <td className="border border-gray-400 p-1.5 text-right font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                <td className="border border-gray-400 p-1.5">{item.paymentMode}</td>
                <td className="border border-gray-400 p-1.5">{item.collectorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expenses Ledger Table */}
      <div className="mb-8">
        <h3 className="text-base font-bold uppercase mb-2 border-b border-black pb-1">
          2. EXPENSES & BILLS LEDGER ({expenseList.length} Items)
        </h3>
        <table className="w-full text-xs border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-1.5 text-left">Item Description</th>
              <th className="border border-gray-400 p-1.5 text-left">Category</th>
              <th className="border border-gray-400 p-1.5 text-right">Amount (₹)</th>
              <th className="border border-gray-400 p-1.5 text-left">Incurred By</th>
              <th className="border border-gray-400 p-1.5 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenseList.map(item => (
              <tr key={item.id}>
                <td className="border border-gray-400 p-1.5 font-bold">{item.title}</td>
                <td className="border border-gray-400 p-1.5">{item.category}</td>
                <td className="border border-gray-400 p-1.5 text-right font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                <td className="border border-gray-400 p-1.5">{item.spender}</td>
                <td className="border border-gray-400 p-1.5">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="mt-12 pt-6 border-t border-gray-400 flex justify-between text-xs text-center">
        <div>
          <p className="font-bold">_______________________</p>
          <p className="mt-1">Prepared By (Chanda Collector)</p>
        </div>
        <div>
          <p className="font-bold">_______________________</p>
          <p className="mt-1">Verified By (Treasurer)</p>
        </div>
        <div>
          <p className="font-bold">_______________________</p>
          <p className="mt-1">Approved By (President / Admin)</p>
        </div>
      </div>

    </div>
  );
}
