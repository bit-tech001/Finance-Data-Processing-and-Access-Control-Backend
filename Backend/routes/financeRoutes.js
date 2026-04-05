import express from 'express';
import { 
  createTransaction, 
  getTransactions, 
  updateTransaction, 
  deleteTransaction 
} from '../controllers/financeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/finance
router.get('/', protect, getTransactions);

// POST /api/finance (Admin only)
router.post('/', protect, authorize('Admin'), createTransaction);

// PUT /api/finance/:id (Admin only)
router.put('/:id', protect, authorize('Admin'), updateTransaction);

// DELETE /api/finance/:id (Admin only)
router.delete('/:id', protect, authorize('Admin'), deleteTransaction);

export default router;