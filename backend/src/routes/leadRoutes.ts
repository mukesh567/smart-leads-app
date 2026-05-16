import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leadController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(protect);

router.get('/', getLeads);
router.get('/export', exportLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', authorize(UserRole.ADMIN), deleteLead);

export default router;
