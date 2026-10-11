import React, { useState, useEffect } from 'react';
import { X, UserCheck, Shield, Phone, Key, Sparkles, Building2, Check, Edit3 } from 'lucide-react';
import { COMMITTEE_ROLES, getUserRoles } from '../../data/roles';

export default function EditUserModal({ isOpen, onClose, userToEdit, onUpdateUser }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    roles: ['collector'],
    designation: 'Committee Member',
    passcode: '1234'
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        phone: userToEdit.phone || '',
        roles: getUserRoles(userToEdit),
        designation: userToEdit.designation || 'Committee Member',
        passcode: userToEdit.passcode || '1234'
      });
    }
  }, [userToEdit]);

  if (!isOpen || !userToEdit) return null;

  const handleRoleToggle = (roleId) => {
    const currentRoles = formData.roles || [];
    if (currentRoles.includes(roleId)) {
      if (currentRoles.length > 1) {
        setFormData({ ...formData, roles: currentRoles.filter(r => r !== roleId) });
      }
    } else {
      setFormData({ ...formData, roles: [...currentRoles, roleId] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide member name and phone number.");
      return;
    }

    if (!formData.roles || formData.roles.length === 0) {
      alert("Please select at least one access role for the member.");
      return;
    }

    const updatedUser = {
      ...userToEdit,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      roles: formData.roles,
      role: formData.roles[0], // primary fallback role
      designation: formData.designation.trim() || 'Committee Member',
      passcode: formData.passcode.trim() || '1234',
      updatedAt: new Date().toISOString()
    };

    onUpdateUser(updatedUser);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel max-w-md w-full bg-white border-slate-200 overflow-hidden shadow-2xl animate-fadeIn max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 border-b border-blue-700 flex items-center justify-between flex-shrink-0 text-white">
          <div className="flex items-center gap-2 font-bold">
            <Edit3 className="w-5 h-5 text-blue-100" />
            <span>Edit Committee Member & Roles</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          
          {/* Scrollable Body */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span>Modify member details or update their assigned committee access roles.</span>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Member Full Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Venkat Reddy" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-input"
              />
            </div>

            {/* Phone Number & Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Phone / Login ID *</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 9849123456" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Designation / Title</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Vice President, Volunteer" 
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            {/* Multiple Roles Checkbox Selection */}
            <div className="form-group">
              <label className="form-label flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Assigned Access Roles (Multiple Allowed) *</span>
              </label>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {COMMITTEE_ROLES.map(role => {
                  const isSelected = (formData.roles || []).includes(role.id);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleToggle(role.id)}
                      className={`flex items-start justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{role.badgeLabel}</span>
                          <span className="text-slate-500 font-normal">({role.name})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{role.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Passcode / PIN */}
            <div className="form-group">
              <label className="form-label flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Login Passcode / PIN *</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. 1234 or secret pass" 
                value={formData.passcode}
                onChange={(e) => setFormData({...formData, passcode: e.target.value})}
                className="form-input font-mono text-sm"
              />
            </div>

          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
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
              <UserCheck className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
