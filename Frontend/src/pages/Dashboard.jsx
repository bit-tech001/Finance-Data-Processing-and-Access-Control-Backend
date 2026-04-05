import React, { useState, useEffect, useRef } from "react";
// 1. Add 'Link' to your imports from react-router-dom
import { Link } from 'react-router-dom'; 
import { LogOut, User, Settings, LayoutDashboard, Receipt, Users, PlusCircle, TrendingUp, TrendingDown, Wallet, Filter, Trash2, Search, Bell, Calendar, PieChart, Target, ChevronRight, Menu, X } from 'lucide-react';
import AddTransactionModal from '../pages/AddTransactionModal';
import API from '../api/index.js';

const ResponsiveFinanceUI = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: "Guest", role: "Viewer" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get('/finance');
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");

    if (storedName && storedRole) {
      setUser({ name: storedName, role: storedRole });
    }

    fetchTransactions();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await API.delete(`/finance/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      alert("Unauthorized: Only Admins can delete records.");
    }
  };

  const handleNewTransaction = (newRecord) => {
    setTransactions([newRecord, ...transactions]);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth'; 
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const savingsPercent = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const initials = user.name.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Wallet size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">WealthFlow</span>
          </div>
          <button className="lg:hidden p-2 text-slate-500" onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
        </div>

        <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4 px-2">Main Menu</p>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === "dashboard"} onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }} />
          
          {/* UPDATED: Transactions Link */}
          <Link to="/transactions" className="block outline-none">
            <SidebarItem 
              icon={<Receipt size={20} />} 
              label="Transactions" 
              active={activeTab === "records"} 
              onClick={() => { setActiveTab("records"); setIsMobileMenuOpen(false); }} 
            />
          </Link>
            <Link to="/analytics" className="block outline-none">
             <SidebarItem icon={<PieChart size={20} />} label="Analytics" />
          </Link>

       
          <SidebarItem icon={<Target size={20} />} label="Goals" />
        </nav>

        <div className="p-6">
          <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-slate-400 text-xs relative z-10">Current Session</p>
            <p className="text-white font-medium mb-3 relative z-10">{user.role} Access</p>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
          
          <div className="relative hidden md:block w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search transactions..." className="w-full bg-slate-100 border-none rounded-xl py-2 px-10 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-50 transition-all outline-none">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{user.name}</p>
                  <p className={`text-[10px] font-bold tracking-tight uppercase px-1.5 py-0.5 rounded-md inline-block mt-0.5 ${user.role === "Admin" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"}`}>{user.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"><User size={16} /><span>My Profile</span></button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"><Settings size={16} /><span>Settings</span></button>
                  <div className="h-px bg-slate-50 my-2 mx-2"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold"><LogOut size={16} /><span>Sign Out</span></button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Financial Overview</h1>
                <p className="text-slate-500 text-sm flex items-center gap-2 mt-1"><Calendar size={14} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-2"><Filter size={18} /> Filter</button>
                {user.role === 'Admin' && (
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                    <PlusCircle size={18} /> Add New
                  </button>
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <StatCard title="Balance" amount={`$${totalBalance.toLocaleString()}`} change="+12%" icon={<Wallet className="text-blue-600" />} trend={totalBalance >= 0 ? "up" : "down"} />
              <StatCard title="Income" amount={`$${totalIncome.toLocaleString()}`} change="+3%" icon={<TrendingUp className="text-emerald-600" />} trend="up" />
              <StatCard title="Expenses" amount={`$${totalExpenses.toLocaleString()}`} change="-1%" icon={<TrendingDown className="text-rose-600" />} trend="down" />
              <StatCard title="Savings" amount={`${savingsPercent}%`} change="+5%" icon={<Target className="text-amber-600" />} trend="up" />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-lg text-slate-800">Recent Activity</h2>
                
                {/* UPDATED: "All" link to Transactions Page */}
                <Link to="/transactions" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Transaction</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      {user.role === 'Admin' && <th className="px-6 py-4 text-center">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.slice(0, 5).length > 0 ? transactions.slice(0, 5).map((t) => (
                      <TableRow 
                        key={t._id} 
                        name={t.title} 
                        cat={t.category} 
                        amt={`${t.type === 'income' ? '+' : '-'}$${t.amount.toLocaleString()}`} 
                        type={t.type} 
                        isAdmin={user.role === 'Admin'}
                        onDelete={() => handleDelete(t._id)}
                      />
                    )) : (
                      <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400">No transactions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTransactionAdded={handleNewTransaction} 
      />
    </div>
  );
};

// ... SidebarItem, StatCard, and TableRow remain the same ...
const TableRow = ({ name, cat, amt, type, isAdmin, onDelete }) => (
  <tr className="hover:bg-slate-50/80 transition-colors group">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>{name.charAt(0)}</div>
        <span className="font-bold text-slate-700 text-xs sm:text-sm">{name}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-xs font-medium text-slate-500">{cat}</td>
    <td className={`px-6 py-4 text-right font-bold text-xs sm:text-sm ${type === "income" ? "text-emerald-600" : "text-slate-900"}`}>{amt}</td>
    {isAdmin && (
      <td className="px-6 py-4 text-center">
        <button onClick={onDelete} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
          <Trash2 size={16} />
        </button>
      </td>
    )}
  </tr>
);

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
    <span className={active ? "text-blue-600" : "text-slate-400"}>{icon}</span>
    <span className="font-bold text-sm">{label}</span>
    {active && <div className="ml-auto w-1 h-4 bg-blue-600 rounded-full"></div>}
  </button>
);

const StatCard = ({ title, amount, change, icon, trend }) => (
  <div className="bg-white p-5 lg:p-6 rounded-3xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>{change}</span>
    </div>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
    <h3 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">{amount}</h3>
  </div>
);

export default ResponsiveFinanceUI;