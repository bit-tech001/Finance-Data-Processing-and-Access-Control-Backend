import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Wallet, Mail, Lock, User, Shield, 
  ArrowRight, Loader2, Eye, EyeOff 
} from 'lucide-react';

// 1. Create a reusable Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Viewer'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 2. Updated endpoints to match backend structure (/api/auth/...)
    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const response = await API.post(endpoint, formData);

      if (isLogin) {
        const { token, user } = response.data;

        // 3. Store session data
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        
        // 4. Set global header for future requests (Dashboard stats, etc)
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigate('/dashboard');
      } else {
        alert("Account created! Please sign in.");
        setIsLogin(true);
      }
    } catch (err) {
      // Handles cases where backend sends specific error messages
      setError(err.response?.data?.message || "Connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-4">
            <Wallet size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">WealthFlow</h1>
          <p className="text-slate-500 font-medium mt-1 text-center">
            {isLogin ? 'Welcome back to your dashboard' : 'Start managing your assets today'}
          </p>
        </div>

        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" name="name" required
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-11 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" name="email" required
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-11 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-11 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Select Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    name="role"
                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-11 text-sm focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer outline-none"
                    onChange={handleChange}
                    value={formData.role}
                  >
                    <option value="Viewer">Viewer (Read Only)</option>
                    <option value="Analyst">Analyst (View + Insights)</option>
                    <option value="Admin">Admin (Full Control)</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Register here" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;