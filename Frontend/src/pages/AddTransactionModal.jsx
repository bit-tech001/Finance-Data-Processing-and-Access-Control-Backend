import React, { useState } from 'react';
import { X, PlusCircle, DollarSign, Tag, Layers } from 'lucide-react';
import API from '../api/index';

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Groceries',
    type: 'expense'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send to MongoDB via our API utility
      const { data } = await API.post('/finance', {
        ...formData,
        amount: Number(formData.amount) // Ensure it's a number
      });
      
      // Update the parent UI
      onTransactionAdded(data);
      
      // Reset and close
      setFormData({ title: '', amount: '', category: 'Groceries', type: 'expense' });
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Add Transaction</h2>
              <p className="text-xs text-slate-500 mt-1">Record a new financial entry</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-1 flex items-center gap-2">
                <Tag size={12} /> Description
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Monthly Salary, Grocery Run"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-1 flex items-center gap-2">
                  <DollarSign size={12} /> Amount
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-10 pr-5 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-1 flex items-center gap-2">
                  <Layers size={12} /> Type
                </label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-1">Category</label>
              <select 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Groceries">Groceries</option>
                <option value="Salary">Salary</option>
                <option value="Tech">Technology</option>
                <option value="Housing">Housing</option>
                <option value="Travel">Travel</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <PlusCircle size={20} />
                  Confirm Transaction
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;