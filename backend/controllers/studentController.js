const Student = require('../models/Student');

/**
 * @desc    Get all students (with optional search, course filter, and sorting)
 * @route   GET /students or GET /api/students
 * @access  Public
 */
const getStudents = async (req, res, next) => {
  try {
    const { search, course, sort } = req.query;
    const query = {};

    // Filter by search keyword (case-insensitive search across name and enrollmentNo)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: { $regex: searchRegex } },
        { enrollmentNo: { $regex: searchRegex } },
        { email: { $regex: searchRegex } }
      ];
    }

    // Filter by specific course
    if (course && course.trim() !== '' && course !== 'All') {
      query.course = course.trim();
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'name_asc') sortOption = { name: 1 };
    else if (sort === 'name_desc') sortOption = { name: -1 };
    else if (sort === 'enrollment_asc') sortOption = { enrollmentNo: 1 };
    else if (sort === 'enrollment_desc') sortOption = { enrollmentNo: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const students = await Student.find(query).sort(sortOption);
    const totalCount = await Student.countDocuments();

    res.status(200).json({
      success: true,
      totalCount,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student by ID
 * @route   GET /students/:id or GET /api/students/:id
 * @access  Public
 */
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new student
 * @route   POST /students or POST /api/students
 * @access  Public
 */
const createStudent = async (req, res, next) => {
  try {
    const { name, enrollmentNo, course, email } = req.body;

    // Manual quick validations for helpful feedback
    if (!name || !enrollmentNo || !course || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, enrollmentNo, course, email'
      });
    }

    // Check if enrollment number already exists
    const existingStudent = await Student.findOne({
      enrollmentNo: enrollmentNo.trim().toUpperCase()
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: `A student with Enrollment Number '${enrollmentNo.trim().toUpperCase()}' already exists`
      });
    }

    const student = await Student.create({
      name: name.trim(),
      enrollmentNo: enrollmentNo.trim().toUpperCase(),
      course: course.trim(),
      email: email.trim().toLowerCase()
    });

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student details
 * @route   PUT /students/:id or GET /api/students/:id
 * @access  Public
 */
const updateStudent = async (req, res, next) => {
  try {
    const { name, enrollmentNo, course, email } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`
      });
    }

    // If enrollment number is being changed, ensure it doesn't conflict with another student
    if (enrollmentNo && enrollmentNo.trim().toUpperCase() !== student.enrollmentNo) {
      const duplicateEnrollment = await Student.findOne({
        enrollmentNo: enrollmentNo.trim().toUpperCase(),
        _id: { $ne: req.params.id }
      });

      if (duplicateEnrollment) {
        return res.status(409).json({
          success: false,
          message: `Enrollment Number '${enrollmentNo.trim().toUpperCase()}' is already used by another student`
        });
      }
    }

    // Prepare update payload
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (enrollmentNo !== undefined) updateData.enrollmentNo = enrollmentNo.trim().toUpperCase();
    if (course !== undefined) updateData.course = course.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();

    student = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a student
 * @route   DELETE /students/:id or DELETE /api/students/:id
 * @access  Public
 */
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Student '${student.name}' (${student.enrollmentNo}) has been deleted successfully`,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /students/stats or GET /api/students/stats
 * @access  Public
 */
const getStudentStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();

    // Group count by course
    const courseStats = await Student.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Latest 5 registered students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name enrollmentNo course createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        courseDistribution: courseStats.map((item) => ({
          course: item._id,
          count: item.count
        })),
        recentStudents
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
