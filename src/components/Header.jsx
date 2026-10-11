import React from 'react';
import { 
  Printer, 
  Flame, 
  LogIn, 
  LogOut,
  ShieldCheck,
  BookOpen,
  Receipt,
  Target,
  Eye,
  Users
} from 'lucide-react';
import { COMMITTEE_ROLES, getUserRoles, getRoleById } from '../data/roles';

export default function Header({ 
  activeRole,
  setActiveRole,
  onPrint,
  currentUser,
  onOpenLogin,
  onLogout
}) {
  const userRoleIds = getUserRoles(currentUser);
  const isAdmin = userRoleIds.includes('admin') || currentUser?.role === 'admin';

  // Available tabs for this user
  const availableRoleIds = isAdmin 
    ? COMMITTEE_ROLES.map(r => r.id) 
    : userRoleIds;

  return (
    <header className="glass-panel no-print p-4 md:p-5 bg-white border-slate-200 shadow-xs space-y-4">
      
      {/* Top Bar: Branding & Profile Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left Side: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Ganesh Chavithi Chanda Book
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Digital Ledger & Multi-Role Accounting App</p>
          </div>
        </div>

        {/* Right Side: Profile, Sign Out, Print Report */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* User Profile Pill & Sign Out Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {isAdmin ? '👑' : '👤'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize leading-none mt-0.5">
                    {currentUser.designation || currentUser.role}
                  </div>
                </div>
              </div>

              <button 
                onClick={onLogout}
                title="Sign Out"
                className="btn btn-secondary text-xs flex items-center gap-1.5 text-rose-600 border-slate-300 hover:bg-rose-50 hover:border-rose-300 px-3 py-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn btn-secondary text-xs flex items-center gap-1.5 text-blue-600 border-slate-300 px-3 py-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}

          {/* Print Report Button */}
          <button
            onClick={onPrint}
            title="Print Chanda & Expense Statement"
            className="btn btn-secondary text-xs flex items-center gap-1.5 text-slate-700 hover:text-blue-600 border-slate-300 px-3 py-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

        </div>

      </div>

      {/* Role Navigation Bar (Tabs for allowed roles) */}
      {currentUser && availableRoleIds.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase font-bold text-slate-400 mr-1 hidden md:inline-block">
            Access Portal:
          </span>
          {availableRoleIds.map(roleId => {
            const roleObj = getRoleById(roleId);
            const isActive = activeRole === roleId;
            return (
              <button
                key={roleId}
                onClick={() => setActiveRole(roleId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{roleObj.badgeLabel}</span>
              </button>
            );
          })}
        </div>
      )}

    </header>
  );
}
