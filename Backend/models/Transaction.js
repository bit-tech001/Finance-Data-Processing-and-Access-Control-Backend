

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  title: { type: String,
     required: true 
    },
  amount: { 
    type: Number,
     required: true 
    },
  category: {
     type: String, 
    required: true
 },
 
  type: { 
    type: String,
     enum: ['income', 'expense'],
      required: true },
  date: { type: Date, 
    default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the Admin
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);