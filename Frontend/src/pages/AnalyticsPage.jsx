import React, { useState, useEffect } from 'react';
import { 
  Search, ArrowUpRight, ArrowDownLeft, Trash2, 
  Calendar, Download, ChevronLeft, Wallet, 
  TrendingUp, TrendingDown, LayoutDashboard, 
  PieChart as PieIcon, BarChart3, Bell, User
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Link } from 'react-router-dom';
import API from '../api';

const ProfessionalDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/finance');
        setTransactions(data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  // Logic for Charts
  const totalIn = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* --- TOP NAV BAR --- */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <LayoutDashboard className="text-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">WEALTH<span className="text-blue-500">FLOW</span></span>
            </div>
            <div className="hidden md:flex gap-6 text-sm font-bold text-slate-400">
              <Link to="/" className="text-white border-b-2 border-blue-500 pb-7 mt-7">Overview</Link>
              <Link to="/transactions" className="hover:text-white transition-colors pb-7 mt-7">Ledger</Link>
              <Link to="/analytics" className="hover:text-white transition-colors pb-7 mt-7">Insights</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 hover:bg-white/5 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white/10 flex items-center justify-center font-bold text-white shadow-xl">
              {userRole?.charAt(0) || <User size={18}/>}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-2 p-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
             <div className="relative z-10">
                <p className="text-blue-100/60 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Portfolio Liquidity</p>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-8">${(totalIn - totalOut).toLocaleString()}</h2>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white text-blue-700 rounded-2xl font-black text-xs hover:scale-105 transition-transform active:scale-95">DEPOSIT FUNDS</button>
                  <button className="px-6 py-3 bg-white/10 text-white rounded-2xl font-black text-xs hover:bg-white/20 transition-all">VIEW STATS</button>
                </div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          </div>

          <StatCard label="Inflow" value={`+$${totalIn.toLocaleString()}`} icon={<TrendingUp size={24}/>} trend="+12.5%" color="emerald" />
          <StatCard label="Outflow" value={`-$${totalOut.toLocaleString()}`} icon={<TrendingDown size={24}/>} trend="-2.1%" color="rose" />
        </div>

        {/* --- GRAPHS SECTION --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          <div className="xl:col-span-2 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="text-blue-500" size={20} /> Market Trend Analysis
              </h3>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-blue-600 text-[10px] font-black rounded-lg uppercase">Daily</button>
                <button className="px-4 py-1.5 bg-white/5 text-[10px] font-black rounded-lg uppercase hover:bg-white/10">Monthly</button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactions.slice(0, 7)}>
                  <XAxis dataKey="title" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
             <h3 className="text-lg font-black text-white tracking-tight mb-8 flex items-center gap-2">
               <PieIcon className="text-indigo-400" size={20} /> Asset Allocation
             </h3>
             <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={transactions.slice(0,4)} dataKey="amount" innerRadius={70} outerRadius={90} paddingAngle={8}>
                    {transactions.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
             </div>
             <div className="mt-4 grid grid-cols-2 gap-4">
                {transactions.slice(0,4).map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t.category}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* --- RECENT ACTIVITY TABLE --- */}
        <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="text-lg font-black text-white tracking-tight">Recent Activity Ledger</h3>
            <button className="flex items-center gap-2 text-xs font-black text-blue-500 hover:text-blue-400">
              <Download size={16} /> DOWNLOAD LOGS
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="px-8 py-5">Transaction ID</th>
                  <th className="px-8 py-5">Classification</th>
                  <th className="px-8 py-5 text-right">Volume</th>
                  <th className="px-8 py-5 text-center">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((t, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">{t.title}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">#TXN-{t._id?.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                         t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                       }`}>
                         {t.type}
                       </span>
                    </td>
                    <td className={`px-8 py-6 text-right font-black text-lg tracking-tighter ${
                      t.type === 'income' ? 'text-emerald-500' : 'text-white'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-slate-400">VERIFIED</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon, trend, color }) => {
  const colors = {
    emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    rose: "text-rose-500 bg-rose-500/5 border-rose-500/10"
  };
  return (
    <div className={`p-8 rounded-[2.5rem] border backdrop-blur-md transition-all hover:scale-[1.02] ${colors[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
        <span className="text-[10px] font-black tracking-widest px-2 py-1 bg-white/5 rounded-md">{trend}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</p>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
    </div>
  );
};

export default ProfessionalDashboard;