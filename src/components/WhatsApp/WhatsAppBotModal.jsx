import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, QrCode, Smartphone, RefreshCw, Send, AlertCircle, Bot } from 'lucide-react';

export default function WhatsAppBotModal({ isOpen, onClose, botStatus, onRefreshStatus }) {
  const [testPhone, setTestPhone] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testPhone.trim()) return;
    setSendingTest(true);
    setTestResult(null);

    const apiHost = typeof window !== 'undefined' ? window.location.hostname || 'localhost' : 'localhost';

    try {
      const res = await fetch(`http://${apiHost}:5000/api/send-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testPhone,
          donorName: 'Devotee (Test)',
          amount: 501,
          receiptNo: 'TEST-BOT-01',
          paymentMode: 'Online',
          collectorName: 'Ganesh Utsav Bot',
          houseNo: 'Block A'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({ success: true, message: '✅ Test receipt sent automatically to WhatsApp!' });
      } else {
        setTestResult({ success: false, message: data.error || 'Failed to send test message' });
      }
    } catch (err) {
      setTestResult({ success: false, message: 'Could not connect to bot server on port 5000.' });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel max-w-md w-full overflow-hidden shadow-2xl animate-fadeIn border-emerald-500/40 bg-white">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${botStatus?.isReady ? 'bg-emerald-600' : 'bg-amber-500'}`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Automated WhatsApp Bot</h3>
              <p className="text-[11px] text-slate-400">
                {botStatus?.isReady ? 'Active & Delivering Receipts' : 'Scan QR to link with WhatsApp'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {botStatus?.isReady ? (
            /* Connected View */
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">WhatsApp Bot is Connected!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Receipts will now be sent automatically in the background whenever a Chanda is recorded. No manual clicking needed!
                </p>
              </div>

              {/* Test Message Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Send a Test Receipt</span>
                </p>
                <form onSubmit={handleSendTest} className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter phone (e.g. 9849012345)"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="form-input text-xs flex-1"
                  />
                  <button
                    type="submit"
                    disabled={sendingTest}
                    className="btn btn-primary text-xs px-3 py-2"
                  >
                    {sendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Send Test'}
                  </button>
                </form>
                {testResult && (
                  <p className={`text-[11px] font-medium ${testResult.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {testResult.message}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* QR Code Scan View */
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Waiting for WhatsApp Link</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">Scan QR Code with WhatsApp</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connect once, and the bot will send receipts automatically forever.
                </p>
              </div>

              {/* QR Image Box */}
              <div className="p-4 bg-slate-950 rounded-2xl flex flex-col items-center justify-center min-h-[260px] shadow-lg">
                {botStatus?.qrImage ? (
                  <img 
                    src={botStatus.qrImage} 
                    alt="WhatsApp QR Code" 
                    className="w-56 h-56 rounded-xl border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400 py-10">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                    <p className="text-xs">Generating WhatsApp QR code...</p>
                  </div>
                )}
              </div>

              {/* Step-by-step instructions */}
              <div className="text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">How to Link:</p>
                <p>1. Open <strong>WhatsApp</strong> on your mobile phone.</p>
                <p>2. Tap <strong>⋮ (Menu)</strong> on Android or <strong>Settings</strong> on iPhone.</p>
                <p>3. Tap <strong>Linked Devices</strong> → <strong>Link a Device</strong>.</p>
                <p>4. Point your camera at this QR code.</p>
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={onRefreshStatus}
                  className="btn btn-secondary text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh QR Code</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
