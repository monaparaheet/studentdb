require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

const sampleStudents = [
  {
    name: 'Aarav Sharma',
    enrollmentNo: 'CS2026001',
    course: 'Computer Science & Engineering',
    email: 'aarav.sharma@university.edu'
  },
  {
    name: 'Diya Patel',
    enrollmentNo: 'AI2026014',
    course: 'Artificial Intelligence & Machine Learning',
    email: 'diya.patel@university.edu'
  },
  {
    name: 'Rohan Mehta',
    enrollmentNo: 'CC2026022',
    course: 'Cloud Computing & DevOps',
    email: 'rohan.mehta@university.edu'
  },
  {
    name: 'Ananya Gupta',
    enrollmentNo: 'DS2026035',
    course: 'Data Science & Big Data',
    email: 'ananya.gupta@university.edu'
  },
  {
    name: 'Vikramaditya Rao',
    enrollmentNo: 'CY2026048',
    course: 'Cyber Security & Forensics',
    email: 'vikram.rao@university.edu'
  },
  {
    name: 'Sara Khan',
    enrollmentNo: 'CS2026059',
    course: 'Computer Science & Engineering',
    email: 'sara.khan@university.edu'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas for seeding.');

    // Clear existing students
    await Student.deleteMany();
    console.log('🧹 Cleared existing students.');

    // Insert sample students
    const created = await Student.insertMany(sampleStudents);
    console.log(`🎉 Successfully seeded ${created.length} student records!`);

    await mongoose.connection.close();
    console.log('🔒 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
