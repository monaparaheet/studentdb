const express = require('express');
const router = express.Router();

// Select controller based on active database configuration
const isPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

const controller = isPostgres
  ? require('../controllers/postgresStudentController')
  : require('../controllers/studentController');

// Aggregate statistics route (placed before :id route)
router.get('/stats', controller.getStudentStats);

// Primary CRUD routes
router
  .route('/')
  .get(controller.getStudents)
  .post(controller.createStudent);

router
  .route('/:id')
  .get(controller.getStudentById)
  .put(controller.updateStudent)
  .delete(controller.deleteStudent);

module.exports = router;
