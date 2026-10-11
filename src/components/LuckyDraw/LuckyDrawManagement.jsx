import React, { useState, useEffect } from 'react';
import { Target, Award, Trophy, Ticket, Plus, Sparkles, RefreshCw, UserCheck, Phone, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LuckyDrawManagement({ committeeDetails }) {
  // Laddu Auction State
  const [bids, setBids] = useState(() => {
    const saved = localStorage.getItem('ganesh_laddu_bids');
    return saved ? JSON.parse(saved) : [
      { id: 'BID-1', bidderName: 'K. Ramakrishna', phone: '9849011223', amount: 25000, time: '10:30 AM', status: 'Active' },
      { id: 'BID-2', bidderName: 'M. Srinivas Reddy', phone: '9951234567', amount: 35000, time: '11:15 AM', status: 'Active' },
      { id: 'BID-3', bidderName: 'Ganesh Youth Pres.', phone: '9876543210', amount: 51116, time: '12:00 PM', status: 'Highest' }
    ];
  });

  // Lucky Coupons State
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('ganesh_lucky_coupons');
    return saved ? JSON.parse(saved) : [
      { id: 'CPN-101', couponNo: '101', buyerName: 'Anil Kumar', phone: '9848012345', status: 'Sold' },
      { id: 'CPN-102', couponNo: '102', buyerName: 'Suresh Varma', phone: '9912345678', status: 'Sold' },
      { id: 'CPN-103', couponNo: '103', buyerName: 'Venkatesh', phone: '9876123456', status: 'Sold' }
    ];
  });

  const [newBidder, setNewBidder] = useState({ name: '', phone: '', amount: '' });
  const [newCoupon, setNewCoupon] = useState({ buyerName: '', phone: '', couponNo: '' });
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    localStorage.setItem('ganesh_laddu_bids', JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem('ganesh_lucky_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Highest Bid calculation
  const highestBid = bids.reduce((max, b) => Number(b.amount) > Number(max.amount) ? b : max, bids[0] || { amount: 0, bidderName: 'No Bids Yet' });

  // Add new bid
  const handleAddBid = (e) => {
    e.preventDefault();
    if (!newBidder.name || !newBidder.amount) return;

    const bidVal = Number(newBidder.amount);
    if (bidVal <= Number(highestBid.amount)) {
      alert(`Bid amount must be higher than current highest bid of ₹${highestBid.amount.toLocaleString('en-IN')}`);
      return;
    }

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}

    const freshBid = {
      id: `BID-${Date.now()}`,
      bidderName: newBidder.name.trim(),
      phone: newBidder.phone.trim() || 'N/A',
      amount: bidVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Highest'
    };

    setBids([freshBid, ...bids.map(b => ({ ...b, status: 'Outbid' }))]);
    setNewBidder({ name: '', phone: '', amount: '' });
  };

  // Sell coupon
  const handleSellCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.buyerName || !newCoupon.couponNo) return;

    const freshCoupon = {
      id: `CPN-${Date.now()}`,
      couponNo: newCoupon.couponNo.trim(),
      buyerName: newCoupon.buyerName.trim(),
      phone: newCoupon.phone.trim() || 'N/A',
      status: 'Sold'
    };

    setCoupons([freshCoupon, ...coupons]);
    setNewCoupon({ buyerName: '', phone: '', couponNo: '' });
  };

  // Draw Winner
  const handlePickWinner = () => {
    if (coupons.length === 0) {
      alert("No coupons sold yet to draw a winner!");
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * coupons.length);
      const picked = coupons[randomIndex];
      setWinner(picked);
      setIsSpinning(false);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch (err) {}
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl border-purple-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner">
              <Trophy className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
                  Live Event Mode
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Grand Maha Laddu Auction & Lucky Draw Portal
                </h2>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Log live Laddu bidding auctions, issue lucky raffle tickets, and perform automated prize winner draws.
              </p>
            </div>
          </div>
          
          <button 
            onClick={handlePickWinner}
            disabled={isSpinning}
            className="btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2.5 shadow-lg shadow-amber-400/20 flex items-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning Wheel...' : 'Pick Lucky Winner'}</span>
          </button>
        </div>
      </div>

      {/* Winner Spotlight Card (If picked) */}
      {winner && (
        <div className="glass-panel p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Congratulations! Lucky Draw Winner Picked:
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {winner.buyerName} — Coupon #{winner.couponNo}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Phone: <strong>{winner.phone}</strong> • Verified Official Winner
                </p>
              </div>
            </div>
            <button 
              onClick={() => setWinner(null)}
              className="btn btn-secondary text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Grid Layout: Laddu Auction & Lucky Coupons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Maha Laddu Auction */}
        <div className="glass-panel p-6 bg-white border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Maha Laddu Live Auction</h3>
                <p className="text-xs text-slate-500">Track real-time bidding for Prasadam Laddu</p>
              </div>
            </div>
          </div>

          {/* Highest Bid Card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase">Current Highest Bidder</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                ₹{Number(highestBid.amount || 0).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                By: <strong className="text-purple-900 font-bold">{highestBid.bidderName}</strong> ({highestBid.phone})
              </div>
            </div>
            <div className="p-3 bg-purple-600 text-white rounded-xl text-center shadow-md">
              <Award className="w-6 h-6 mx-auto" />
              <span className="text-[10px] font-bold block mt-1">LEADER</span>
            </div>
          </div>

          {/* Place New Bid Form */}
          <form onSubmit={handleAddBid} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Log New Higher Bid</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input 
                type="text" 
                required
                placeholder="Bidder Full Name" 
                value={newBidder.name}
                onChange={(e) => setNewBidder({ ...newBidder, name: e.target.value })}
                className="form-input text-xs"
              />
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={newBidder.phone}
                onChange={(e) => setNewBidder({ ...newBidder, phone: e.target.value })}
                className="form-input text-xs"
              />
              <input 
                type="number" 
                required
                placeholder={`Higher than ₹${highestBid.amount}`} 
                value={newBidder.amount}
                onChange={(e) => setNewBidder({ ...newBidder, amount: e.target.value })}
                className="form-input text-xs font-bold text-blue-700"
              />
            </div>
            <button 
              type="submit" 
              className="w-full btn btn-primary text-xs py-2.5 font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Record Official Bid</span>
            </button>
          </form>

          {/* Bids History Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Auction Bidding History ({bids.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {bids.map(bid => (
                <div key={bid.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      bid.status === 'Highest' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      ₹
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{bid.bidderName}</div>
                      <div className="text-[11px] text-slate-500">{bid.phone} • {bid.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900">₹{Number(bid.amount).toLocaleString('en-IN')}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      bid.status === 'Highest' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {bid.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Section 2: Lucky Raffle Coupons */}
        <div className="glass-panel p-6 bg-white border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Lucky Coupon Sales & Draw</h3>
                <p className="text-xs text-slate-500">Sell raffle tickets & record coupon buyers</p>
              </div>
            </div>
          </div>

          {/* Counter Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800">Total Coupons Sold</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{coupons.length} Tickets</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800">Total Raffle Fund</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                ₹{(coupons.length * 100).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Sell Coupon Form */}
          <form onSubmit={handleSellCoupon} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Issue New Raffle Coupon</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input 
                type="text" 
                required
                placeholder="Coupon # (e.g. 104)" 
                value={newCoupon.couponNo}
                onChange={(e) => setNewCoupon({ ...newCoupon, couponNo: e.target.value })}
                className="form-input text-xs font-mono font-bold"
              />
              <input 
                type="text" 
                required
                placeholder="Buyer Name" 
                value={newCoupon.buyerName}
                onChange={(e) => setNewCoupon({ ...newCoupon, buyerName: e.target.value })}
                className="form-input text-xs"
              />
              <input 
                type="text" 
                placeholder="Phone No" 
                value={newCoupon.phone}
                onChange={(e) => setNewCoupon({ ...newCoupon, phone: e.target.value })}
                className="form-input text-xs"
              />
            </div>
            <button 
              type="submit" 
              className="w-full btn bg-amber-500 hover:bg-amber-600 text-white text-xs py-2.5 font-bold"
            >
              <Ticket className="w-4 h-4" />
              <span>Issue Raffle Ticket (₹100)</span>
            </button>
          </form>

          {/* Sold Coupons List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Sold Coupon Registry ({coupons.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {coupons.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-mono font-bold text-xs">
                      #{c.couponNo}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.buyerName}</div>
                      <div className="text-[11px] text-slate-500">{c.phone}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Paid Ticket
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
