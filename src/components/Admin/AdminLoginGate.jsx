import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginGate({ usersList, onAdminLoginSuccess }) {
  const [loginId, setLoginId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const adminUsers = usersList.filter(u => u.role === 'admin');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const matchedAdmin = usersList.find(u => 
      u.role === 'admin' &&
      (u.phone === loginId.trim() || u.name.toLowerCase().includes(loginId.trim().toLowerCase()) || loginId.trim().toLowerCase() === 'admin') &&
      u.passcode === passcode.trim()
    );

    if (matchedAdmin) {
      onAdminLoginSuccess(matchedAdmin);
    } else {
      setError('Invalid Admin credentials or Passcode. Default Admin PIN is "admin123".');
    }
  };

  const handleQuickAdminLogin = (adminUser) => {
    onAdminLoginSuccess(adminUser);
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="glass-panel p-8 shadow-2xl border-amber-500/40 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 text-slate-950 font-extrabold">
            <Lock className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white festive-title">
            Admin Authentication Required
          </h2>
          <p className="text-xs text-slate-400">
            Please log in with Admin credentials to access the financial dashboard, audit logs, and user management.
          </p>
        </div>

        {/* Quick Admin Demo Login */}
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Quick Admin Login (Demo Mode)</span>
          </div>
          <div className="space-y-1">
            {adminUsers.map(admin => (
              <button
                key={admin.id}
                onClick={() => handleQuickAdminLogin(admin)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-amber-400 hover:bg-slate-800 transition-all text-left text-xs text-white group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">👑</span>
                  <div>
                    <span className="font-bold group-hover:text-amber-300 transition-colors">{admin.name}</span>
                    <span className="text-[10px] text-slate-400 block">{admin.designation}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                  Authenticate <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Phone / ID ("admin")</span>
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. 9849000000 or admin" 
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Passcode / PIN</span>
            </label>
            <input 
              type="password" 
              required
              placeholder="e.g. admin123" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="form-input text-xs font-mono"
            />
          </div>

          <button 
            type="submit"
            className="w-full btn btn-primary py-3 text-sm flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber-500/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Admin Dashboard</span>
          </button>
        </form>

        <div className="mt-4 text-center text-[11px] text-slate-500">
          Default Admin Password: <code className="text-amber-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">admin123</code>
        </div>

      </div>
    </div>
  );
}
