const express = require('express');
const { 
  getEnrollments, 
  getEnrollment, 
  createEnrollment, 
  updateEnrollment, 
  deleteEnrollment 
} = require('../controllers/enrollments');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEnrollments)
  .post(createEnrollment);

router.route('/:id')
  .get(getEnrollment)
  .put(updateEnrollment)
  .delete(deleteEnrollment);

module.exports = router;