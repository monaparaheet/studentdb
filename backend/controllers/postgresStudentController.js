const { query } = require('../config/neonDb');

/**
 * Format PostgreSQL row to match frontend expectation
 */
const formatStudent = (row) => ({
  _id: row.id.toString(),
  id: row.id,
  name: row.name,
  enrollmentNo: row.enrollment_no,
  course: row.course,
  email: row.email,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

/**
 * @desc    Get all students from Neon PostgreSQL
 * @route   GET /students or GET /api/students
 */
const getStudents = async (req, res, next) => {
  try {
    const { search, course, sort } = req.query;

    let sql = 'SELECT * FROM students WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Search filter
    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      sql += ` AND (name ILIKE $${paramIndex} OR enrollment_no ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(searchTerm);
      paramIndex++;
    }

    // Course filter
    if (course && course.trim() !== '' && course !== 'All') {
      sql += ` AND course = $${paramIndex}`;
      params.push(course.trim());
      paramIndex++;
    }

    // Sorting
    let orderBy = 'created_at DESC';
    if (sort === 'name_asc') orderBy = 'name ASC';
    else if (sort === 'name_desc') orderBy = 'name DESC';
    else if (sort === 'enrollment_asc') orderBy = 'enrollment_no ASC';
    else if (sort === 'enrollment_desc') orderBy = 'enrollment_no DESC';
    else if (sort === 'oldest') orderBy = 'created_at ASC';

    sql += ` ORDER BY ${orderBy}`;

    const { rows } = await query(sql, params);
    const countRes = await query('SELECT COUNT(*) FROM students');
    const totalCount = parseInt(countRes.rows[0].count, 10);

    res.status(200).json({
      success: true,
      totalCount,
      count: rows.length,
      data: rows.map(formatStudent)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student by ID
 * @route   GET /students/:id
 */
const getStudentById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format' });
    }

    const { rows } = await query('SELECT * FROM students WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: formatStudent(rows[0])
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new student in Neon PostgreSQL
 * @route   POST /students
 */
const createStudent = async (req, res, next) => {
  try {
    const { name, enrollmentNo, course, email } = req.body;

    if (!name || !enrollmentNo || !course || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, enrollmentNo, course, email'
      });
    }

    const upperEnrollment = enrollmentNo.trim().toUpperCase();

    // Check duplicate enrollment number
    const dupCheck = await query('SELECT id FROM students WHERE enrollment_no = $1', [upperEnrollment]);
    if (dupCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `A student with Enrollment Number '${upperEnrollment}' already exists`
      });
    }

    const insertSql = `
      INSERT INTO students (name, enrollment_no, course, email)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const { rows } = await query(insertSql, [
      name.trim(),
      upperEnrollment,
      course.trim(),
      email.trim().toLowerCase()
    ]);

    res.status(201).json({
      success: true,
      message: 'Student record created successfully in Neon PostgreSQL',
      data: formatStudent(rows[0])
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student in Neon PostgreSQL
 * @route   PUT /students/:id
 */
const updateStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format' });
    }

    const { rows: existing } = await query('SELECT * FROM students WHERE id = $1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`
      });
    }

    const current = existing[0];
    const { name, enrollmentNo, course, email } = req.body;

    const newName = name !== undefined ? name.trim() : current.name;
    const newEnrollment = enrollmentNo !== undefined ? enrollmentNo.trim().toUpperCase() : current.enrollment_no;
    const newCourse = course !== undefined ? course.trim() : current.course;
    const newEmail = email !== undefined ? email.trim().toLowerCase() : current.email;

    // Check duplicate enrollment if changed
    if (newEnrollment !== current.enrollment_no) {
      const dup = await query('SELECT id FROM students WHERE enrollment_no = $1 AND id != $2', [newEnrollment, id]);
      if (dup.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Enrollment Number '${newEnrollment}' is already used by another student`
        });
      }
    }

    const updateSql = `
      UPDATE students
      SET name = $1, enrollment_no = $2, course = $3, email = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const { rows } = await query(updateSql, [newName, newEnrollment, newCourse, newEmail, id]);

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully in Neon PostgreSQL',
      data: formatStudent(rows[0])
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student from Neon PostgreSQL
 * @route   DELETE /students/:id
 */
const deleteStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format' });
    }

    const { rows } = await query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: `Student '${rows[0].name}' (${rows[0].enrollment_no}) has been deleted successfully from Neon PostgreSQL`,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics from Neon PostgreSQL
 * @route   GET /students/stats
 */
const getStudentStats = async (req, res, next) => {
  try {
    const countRes = await query('SELECT COUNT(*) FROM students');
    const totalStudents = parseInt(countRes.rows[0].count, 10);

    const distRes = await query(`
      SELECT course, COUNT(*) as count
      FROM students
      GROUP BY course
      ORDER BY count DESC
    `);

    const recentRes = await query(`
      SELECT id, name, enrollment_no, course, created_at
      FROM students
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        courseDistribution: distRes.rows.map((r) => ({
          course: r.course,
          count: parseInt(r.count, 10)
        })),
        recentStudents: recentRes.rows.map(formatStudent)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
};
