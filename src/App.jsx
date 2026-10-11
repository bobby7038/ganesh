import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RoleBanner from './components/RoleBanner';
import AdminDashboard from './components/Admin/AdminDashboard';
import ChandaManagement from './components/Chanda/ChandaManagement';
import AddChandaModal from './components/Chanda/AddChandaModal';
import ExpenseManagement from './components/Expenses/ExpenseManagement';
import AddExpenseModal from './components/Expenses/AddExpenseModal';
import AddUserModal from './components/Admin/AddUserModal';
import AdminLoginGate from './components/Admin/AdminLoginGate';
import LoginModal from './components/Auth/LoginModal';
import LoginPage from './components/Auth/LoginPage';
import PrintableLedger from './components/PrintReport/PrintableLedger';
import LuckyDrawManagement from './components/LuckyDraw/LuckyDrawManagement';
import AuditViewer from './components/Reader/AuditViewer';
import VolunteerManagement from './components/Volunteer/VolunteerManagement';
import WhatsAppBotModal from './components/WhatsApp/WhatsAppBotModal';
import { INITIAL_CHANDA, INITIAL_EXPENSES, INITIAL_USERS, COMMITTEE_DETAILS } from './data/initialData';
import { getUserRoles } from './data/roles';

// One-time cache invalidation to force clean state
if (typeof window !== 'undefined' && localStorage.getItem('ganesh_fresh_v3') !== 'true') {
  localStorage.removeItem('ganesh_chanda_list');
  localStorage.removeItem('ganesh_expense_list');
  localStorage.removeItem('ganesh_users_list');
  localStorage.removeItem('ganesh_current_user');
  localStorage.setItem('ganesh_fresh_v3', 'true');
}

export default function App() {
  const [activeRole, setActiveRole] = useState('admin'); // 'admin' | 'collector' | 'spender' | 'luckydraw' | 'reader' | 'volunteer'
  
  // Persistent State
  const [chandaList, setChandaList] = useState(() => {
    const saved = localStorage.getItem('ganesh_chanda_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenseList, setExpenseList] = useState(() => {
    const saved = localStorage.getItem('ganesh_expense_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('ganesh_users_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ganesh_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal Visibility
  const [isAddChandaOpen, setIsAddChandaOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);

  // Automated WhatsApp Bot Status
  const [botStatus, setBotStatus] = useState({ isReady: false, qrImage: null });

  const fetchBotStatus = async () => {
    try {
      const apiHost = typeof window !== 'undefined' ? window.location.hostname || 'localhost' : 'localhost';
      const res = await fetch(`http://${apiHost}:5000/api/status`);
      if (res.ok) {
        const data = await res.json();
        setBotStatus(data);
      }
    } catch (e) {
      // Backend bot offline or port 5000 not reachable
    }
  };

  useEffect(() => {
    fetchBotStatus();
    const interval = setInterval(fetchBotStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('ganesh_chanda_list', JSON.stringify(chandaList));
  }, [chandaList]);

  useEffect(() => {
    localStorage.setItem('ganesh_expense_list', JSON.stringify(expenseList));
  }, [expenseList]);

  useEffect(() => {
    localStorage.setItem('ganesh_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ganesh_current_user', JSON.stringify(currentUser));
      const uRoles = getUserRoles(currentUser);
      if (uRoles.length > 0 && !uRoles.includes(activeRole) && currentUser.role !== 'admin') {
        setActiveRole(uRoles[0]);
      }
    } else {
      localStorage.removeItem('ganesh_current_user');
    }
  }, [currentUser]);

  // Overall Financials
  const totalChanda = chandaList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenseList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const netBalance = totalChanda - totalExpenses;

  // Handlers for Chanda
  const handleAddChanda = (newRecord) => {
    setChandaList([newRecord, ...chandaList]);
  };

  const handleDeleteChanda = (id) => {
    if (window.confirm("Are you sure you want to delete this Chanda record?")) {
      setChandaList(chandaList.filter(item => item.id !== id));
    }
  };

  // Handlers for Expenses
  const handleAddExpense = (newExpense) => {
    setExpenseList([newExpense, ...expenseList]);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense entry?")) {
      setExpenseList(expenseList.filter(item => item.id !== id));
    }
  };

  const handleToggleExpenseStatus = (id) => {
    setExpenseList(expenseList.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Paid' ? 'Unpaid' : 'Paid';
        return {
          ...item,
          status: nextStatus,
          paymentMode: nextStatus === 'Paid' ? (item.paymentMode === 'N/A' ? 'Online UPI' : item.paymentMode) : 'N/A',
          refNo: nextStatus === 'Paid' ? (item.refNo === 'Pending' ? 'Cleared' : item.refNo) : 'Pending'
        };
      }
      return item;
    }));
  };

  // User Handlers
  const handleAddUser = (newUser) => {
    setUsersList([...usersList, newUser]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsersList(usersList.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to remove this committee member user?")) {
      setUsersList(usersList.filter(u => u.id !== id));
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    const roles = getUserRoles(user);
    if (roles.length > 0) {
      setActiveRole(roles[0]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleGuestLogin = () => {
    const guestUser = { id: 'USR-GUEST', name: 'Public Guest', roles: ['reader'], role: 'reader', designation: 'Visitor' };
    setCurrentUser(guestUser);
    setActiveRole('reader');
  };

  const handleSignUpAdmin = (newAdmin, committeeInfo) => {
    setUsersList([newAdmin, ...usersList]);
    setCurrentUser(newAdmin);
    setActiveRole('admin');
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm("Reset all Chanda, Expense, and Committee User records?")) {
      setChandaList([]);
      setExpenseList([]);
      setUsersList([]);
      setCurrentUser(null);
      localStorage.removeItem('ganesh_chanda_list');
      localStorage.removeItem('ganesh_expense_list');
      localStorage.removeItem('ganesh_users_list');
      localStorage.removeItem('ganesh_current_user');
    }
  };

  // Dynamic View Renderer based on activeRole
  const renderRoleView = () => {
    switch (activeRole) {
      case 'admin':
        return (
          <AdminDashboard 
            chandaList={chandaList}
            expenseList={expenseList}
            committeeDetails={COMMITTEE_DETAILS}
            onResetData={handleResetData}
            usersList={usersList}
            currentUser={currentUser}
            onOpenAddUser={() => setIsAddUserOpen(true)}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'collector':
      case 'chanda':
        return (
          <ChandaManagement 
            chandaList={chandaList}
            onAddChanda={handleAddChanda}
            onDeleteChanda={handleDeleteChanda}
            committeeDetails={COMMITTEE_DETAILS}
            onOpenAddModal={() => setIsAddChandaOpen(true)}
          />
        );
      case 'spender':
      case 'expenses':
        return (
          <ExpenseManagement 
            expenseList={expenseList}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onToggleStatus={handleToggleExpenseStatus}
            onOpenAddModal={() => setIsAddExpenseOpen(true)}
          />
        );
      case 'luckydraw':
        return (
          <LuckyDrawManagement 
            committeeDetails={COMMITTEE_DETAILS}
          />
        );
      case 'reader':
        return (
          <AuditViewer 
            chandaList={chandaList}
            expenseList={expenseList}
            committeeDetails={COMMITTEE_DETAILS}
          />
        );
      case 'volunteer':
        return (
          <VolunteerManagement 
            committeeDetails={COMMITTEE_DETAILS}
          />
        );
      default:
        return (
          <AdminDashboard 
            chandaList={chandaList}
            expenseList={expenseList}
            committeeDetails={COMMITTEE_DETAILS}
            onResetData={handleResetData}
            usersList={usersList}
            currentUser={currentUser}
            onOpenAddUser={() => setIsAddUserOpen(true)}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
          />
        );
    }
  };

  // If user is not logged in, render the full-page LoginPage
  if (!currentUser) {
    return (
      <LoginPage 
        usersList={usersList}
        onLoginSuccess={handleLoginSuccess}
        onSignUpAdmin={handleSignUpAdmin}
        onGuestLogin={handleGuestLogin}
      />
    );
  }

  return (
    <div className="min-h-screen py-6 px-3 md:px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <Header 
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          totalChanda={totalChanda}
          totalExpenses={totalExpenses}
          netBalance={netBalance}
          onOpenAddChanda={() => setIsAddChandaOpen(true)}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          onPrint={() => window.print()}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenAddUser={() => setIsAddUserOpen(true)}
          onLogout={handleLogout}
          botStatus={botStatus}
          onOpenBotModal={() => setIsBotModalOpen(true)}
        />

        {/* Role Dependent Views */}
        <main className="no-print">
          {renderRoleView()}
        </main>

        {/* Footer */}
        <footer className="no-print pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>🪔 Ganesh Utsav Digital Accounting App • Jai Ganesh Deva 🙏</p>
        </footer>

      </div>

      {/* Modals */}
      <AddChandaModal 
        isOpen={isAddChandaOpen}
        onClose={() => setIsAddChandaOpen(false)}
        onAddChanda={handleAddChanda}
        usersList={usersList}
        botStatus={botStatus}
        onOpenBotModal={() => setIsBotModalOpen(true)}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpense}
        usersList={usersList}
      />

      <AddUserModal 
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        usersList={usersList}
        onLoginSuccess={handleLoginSuccess}
      />

      <WhatsAppBotModal
        isOpen={isBotModalOpen}
        onClose={() => setIsBotModalOpen(false)}
        botStatus={botStatus}
        onRefreshStatus={fetchBotStatus}
      />

      {/* Hidden Printable Area for window.print() */}
      <PrintableLedger 
        chandaList={chandaList}
        expenseList={expenseList}
        committeeDetails={COMMITTEE_DETAILS}
      />

    </div>
  );
}
