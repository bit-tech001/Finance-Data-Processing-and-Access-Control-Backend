import { Transaction } from '../models/Transaction.js';

// --- CREATE (Admin Only) ---
export const createTransaction = async (req, res) => {
  try {
    // We spread req.body and explicitly set createdBy from the auth middleware
    const transaction = new Transaction({
      ...req.body,
      createdBy: req.user.id 
    });

    const savedTransaction = await transaction.save();
    
    // Return the saved document with a 201 Created status
    res.status(201).json(savedTransaction);
  } catch (error) {
    // 400 status indicates a validation or client-side data error
    res.status(400).json({ 
      message: "Could not create transaction", 
      error: error.message 
    });
  }
};

// --- READ (All authenticated users) ---
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- UPDATE (Admin Only) ---
export const updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // runValidators ensures the update matches your Schema
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// --- DELETE (Admin Only) ---
export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};