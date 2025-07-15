const express = require('express');
const { 
  getPayments, 
  getPayment, 
  createPayment, 
  updatePayment, 
  deletePayment 
} = require('../controllers/payments');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPayments)
  .post(createPayment);

router.route('/:id')
  .get(getPayment)
  .put(authorize('admin'), updatePayment)
  .delete(authorize('admin'), deletePayment);

module.exports = router;