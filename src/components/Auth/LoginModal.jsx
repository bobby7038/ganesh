import React, { useState } from 'react';
import { X, LogIn, ShieldCheck, Key, User, Sparkles, Check, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, usersList, onLoginSuccess }) {
  const [loginId, setLoginId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const matchedUser = usersList.find(u => 
      (u.phone === loginId.trim() || u.name.toLowerCase().includes(loginId.trim().toLowerCase()) || (loginId.trim().toLowerCase() === 'admin' && u.role === 'admin')) &&
      u.passcode === passcode.trim()
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
      onClose();
      setLoginId('');
      setPasscode('');
    } else {
      setErrorMessage('Invalid User ID / Phone or Passcode. Default Admin PIN is "admin123".');
    }
  };

  const handleQuickLogin = (user) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel max-w-md w-full overflow-hidden shadow-2xl animate-fadeIn border-amber-500/40 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900/95 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Committee Portal Login</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* Quick Member Login Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
              ⚡ Quick Select Login (Demo Mode)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {usersList.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      u.role === 'chanda' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}>
                      {u.role === 'admin' ? '👑' : u.role === 'chanda' ? '📖' : '🧾'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {u.designation} • <span className="capitalize">{u.role}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400/80 font-medium group-hover:translate-x-0.5 transition-transform">
                    Login →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs my-2">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span>OR LOGIN WITH CREDENTIALS</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          {/* Form Login */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone Number / Username / "admin"</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. 9849000000 or admin" 
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Passcode / PIN</span>
              </label>
              <input 
                type="password" 
                required
                placeholder="e.g. admin123 or suresh123" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="form-input font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
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
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
