import React, { useState } from 'react';
import { Users, UserPlus, Phone, Key, Trash2, Search, CheckCircle2, Edit3, Share2 } from 'lucide-react';
import { COMMITTEE_ROLES, getRoleById, getUserRoles } from '../../data/roles';
import EditUserModal from './EditUserModal';
import { openWhatsApp } from '../../utils/whatsapp';

export default function UserManagement({ usersList, currentUser, onOpenAddUser, onDeleteUser, onUpdateUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleShareWhatsApp = (user) => {
    const portalUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const text = `🪔 *SRI GANESH UTSAV SAMITHI* 🪔\n` +
      `*Committee Member Access Credentials*\n\n` +
      `👤 *Member Name:* ${user.name}\n` +
      `🏷️ *Role / Designation:* ${user.designation}\n` +
      `📱 *Registered Phone:* ${user.phone}\n` +
      `🔑 *App Login Passcode:* ${user.passcode}\n\n` +
      `📲 *Web Portal:* ${portalUrl}\n\n` +
      `🙏 _Thank you for guiding and managing our Utsav collections! Jai Ganesha!_ 🙏`;

    openWhatsApp({ phone: user.phone, text });
  };

  const filteredUsers = usersList.filter(user => {
    const userRoleIds = getUserRoles(user);
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.phone.includes(searchTerm) || 
                          user.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || userRoleIds.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="glass-panel p-6 space-y-6 bg-white border-slate-200">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Committee Members & Users</h3>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                {usersList.length} Total Users
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin control center to add committee members, assign multiple roles, and passwords.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search member by name, phone, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>

        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="form-select text-xs font-medium"
        >
          <option value="all">Filter by Any Access Role</option>
          {COMMITTEE_ROLES.map(role => (
            <option key={role.id} value={role.id}>
              {role.badgeLabel} — {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const userRoles = getUserRoles(user);
          const primaryRoleObj = getRoleById(userRoles[0]);

          return (
            <div 
              key={user.id} 
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-xs text-slate-500">{user.designation}</p>
                    </div>
                  </div>
                </div>

                {/* Multiple Role Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {userRoles.map(roleId => {
                    const rObj = getRoleById(roleId);
                    return (
                      <span 
                        key={roleId}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rObj.badgeClass}`}
                      >
                        {rObj.badgeLabel}
                      </span>
                    );
                  })}
                </div>

                {/* User details */}
                <div className="mt-3 space-y-1.5 text-xs bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone:
                    </span>
                    <span className="font-semibold text-slate-900">{user.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Key className="w-3.5 h-3.5 text-blue-600" /> Passcode:
                    </span>
                    <span className="font-mono text-blue-700 font-bold">{user.passcode}</span>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active Member</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleShareWhatsApp(user)}
                    title="Send Credentials via WhatsApp"
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button 
                    onClick={() => {
                      setEditingUser(user);
                      setIsEditOpen(true);
                    }}
                    title="Edit Member & Reassign Roles"
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Roles</span>
                  </button>

                  {user.phone !== currentUser?.phone && (
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      title="Remove User"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-slate-400 space-y-2">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-medium">No committee users found matching your search.</p>
        </div>
      )}

      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingUser(null);
        }}
        userToEdit={editingUser}
        onUpdateUser={onUpdateUser}
      />

    </div>
  );
}
