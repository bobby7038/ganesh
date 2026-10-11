import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  UserPlus, 
  User, 
  Key, 
  LogIn, 
  AlertCircle,
  Phone,
  CheckCircle2,
  ArrowRight,
  Flame
} from 'lucide-react';

export default function LoginPage({ usersList = [], onLoginSuccess, onSignUpAdmin, onGuestLogin }) {
  const [authMode, setAuthMode] = useState(usersList.length === 0 ? 'signup' : 'login');
  
  // Login State
  const [loginId, setLoginId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    name: '',
    phone: '',
    passcode: '',
    designation: 'Committee Admin & Treasurer'
  });
  const [signUpError, setSignUpError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const matchedUser = usersList.find(u => 
      (u.phone === loginId.trim() || 
       u.name.toLowerCase().includes(loginId.trim().toLowerCase()) || 
       (loginId.trim().toLowerCase() === 'admin' && u.role === 'admin') ||
       (loginId.trim().toLowerCase() === u.role)) &&
      u.passcode === passcode.trim()
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      setLoginError('Invalid credentials. If you haven\'t created an account yet, switch to "Admin Sign Up".');
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpData.name.trim() || !signUpData.phone.trim() || !signUpData.passcode.trim()) {
      setSignUpError('Please fill in your Full Name, Phone Number, and Passcode.');
      return;
    }

    const newAdmin = {
      id: `USR-ADMIN-${Date.now()}`,
      name: signUpData.name.trim(),
      phone: signUpData.phone.trim(),
      role: 'admin',
      designation: signUpData.designation.trim() || 'Committee Admin',
      passcode: signUpData.passcode.trim(),
      status: 'Active',
      addedAt: new Date().toISOString()
    };

    const committeeInfo = {
      contactPerson: `${signUpData.name} - ${signUpData.phone}`
    };

    onSignUpAdmin(newAdmin, committeeInfo);
  };

  const handleQuickLogin = (user) => {
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
      
      <div className="max-w-md w-full relative z-10 my-8 space-y-4">
        
        {/* Top Header Logo */}
        <div className="text-center space-y-1 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Ganesh Chavithi Chanda Book
          </h1>
          <p className="text-xs text-slate-500 font-medium">Digital Ledger & Expense Management System</p>
        </div>

        {/* Auth Panel */}
        <div className="glass-panel p-6 sm:p-8 bg-white border-slate-200 shadow-sm">
          
          {/* Auth Mode Toggle Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                authMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>👑 Admin Sign Up</span>
            </button>
          </div>

          {/* MODE 1: LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="pb-2 border-b border-slate-100 mb-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Member & Admin Login</span>
                </h3>
                <p className="text-xs text-slate-500">Enter your phone number and passcode to access your dashboard.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Phone Number / Username *</span>
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
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>Passcode / PIN *</span>
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="e.g. 1234 or your secret PIN" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="form-input font-mono"
                />
              </div>

              <button 
                type="submit" 
                className="w-full btn btn-primary py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to Application</span>
              </button>
            </form>
          )}

          {/* MODE 2: ADMIN SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="pb-2 border-b border-slate-100 mb-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span>Register Admin Account</span>
                </h3>
                <p className="text-xs text-slate-500">Set up your committee ledger as the primary Admin.</p>
              </div>

              {signUpError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin Full Name *</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sri Ramesh Sharma" 
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phone / Login ID *</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 9849000000" 
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({...signUpData, phone: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Passcode / PIN *</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 1234" 
                    value={signUpData.passcode}
                    onChange={(e) => setSignUpData({...signUpData, passcode: e.target.value})}
                    className="form-input font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn btn-primary py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create Admin Account & Launch App</span>
              </button>
            </form>
          )}

        </div>

        {/* Registered Committee Users List (if any exist) */}
        {usersList.length > 0 && (
          <div className="glass-panel p-4 bg-white border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Registered Members ({usersList.length})
              </span>
              <span className="text-[11px] text-slate-500">Select to login</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {usersList.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user)}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">
                      {user.role === 'admin' ? '👑' : '👤'}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-500 capitalize truncate">
                        {user.role} Role
                      </div>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
