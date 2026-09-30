const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    enrollmentNo: {
      type: String,
      required: [true, 'Enrollment number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, 'Enrollment number must be at least 3 characters'],
      maxlength: [30, 'Enrollment number cannot exceed 30 characters']
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
      minlength: [2, 'Course name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid email address'
      ]
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index for high performance text search
studentSchema.index({ name: 'text', enrollmentNo: 'text' });

module.exports = mongoose.model('Student', studentSchema);
