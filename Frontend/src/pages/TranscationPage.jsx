import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ArrowUpRight, ArrowDownLeft, 
  Trash2, Calendar, Download, ChevronLeft, 
  Wallet, TrendingUp, TrendingDown, MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const userRole = localStorage.getItem('userRole');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get('/finance');
      setTransactions(data);
    } catch (err) { console.error("Error", err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete record?")) return;
    try {
      await API.delete(`/finance/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) { alert("Admin access required."); }
  };

  const filteredData = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate totals for the filtered view
  const totalIn = filteredData.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalOut = filteredData.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans pb-20">
      {/* Premium Gradient Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 pt-12 pb-24 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <Link to="/" className="group p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all duration-300">
                <ChevronLeft size={22} />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Analytics Ledger</h1>
                <p className="text-blue-200/60 text-sm font-medium">Precision tracking for your digital assets</p>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
              <Download size={18} /> Export CSV
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickStat label="Filtered Volume" value={`$${(totalIn + totalOut).toLocaleString()}`} icon={<Wallet size={20}/>} color="blue" />
            <QuickStat label="Inflow" value={`+$${totalIn.toLocaleString()}`} icon={<TrendingUp size={20}/>} color="emerald" />
            <QuickStat label="Outflow" value={`-$${totalOut.toLocaleString()}`} icon={<TrendingDown size={20}/>} color="rose" />
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-6xl mx-auto -mt-12 px-4 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          
          {/* Action Bar */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search ledger..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select 
                className="flex-1 md:w-40 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none hover:border-slate-300 transition-all cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Records</option>
                <option value="income">Credits</option>
                <option value="expense">Debits</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">Timeline</th>
                  <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">Transaction Details</th>
                  <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">Category</th>
                  <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 text-right">Amount</th>
                  <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? filteredData.map((t) => (
                  <tr key={t._id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{new Date(t.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{new Date(t.date || Date.now()).getFullYear()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                        </div>
                        <span className="font-extrabold text-slate-800 tracking-tight">{t.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-wider group-hover:bg-white transition-colors">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-8 py-6 text-right font-black text-lg tracking-tighter ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-center">
                      {userRole === 'Admin' ? (
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : <MoreHorizontal className="text-slate-200 mx-auto" />}
                    </td>
                  </tr>
                )) : (
                  <EmptyState />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for better organization
const QuickStat = ({ label, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  };
  return (
    <div className={`p-5 rounded-3xl backdrop-blur-xl border ${colors[color]} flex items-center justify-between`}>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
        <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl bg-white/5`}>{icon}</div>
    </div>
  );
};

const EmptyState = () => (
  <tr>
    <td colSpan="5" className="px-6 py-32 text-center">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
          <Calendar size={32} className="text-slate-300" />
        </div>
        <p className="font-black text-slate-800 text-xl tracking-tight">No records detected</p>
        <p className="text-slate-400 text-sm max-w-[200px] mt-2 font-medium">Try adjusting your filters or search terms.</p>
      </div>
    </td>
  </tr>
);

export default TransactionsPage;