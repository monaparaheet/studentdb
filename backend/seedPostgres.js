require('dotenv').config();
const { query, initNeonDB } = require('./config/neonDb');

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

const seedNeon = async () => {
  try {
    const ready = await initNeonDB();
    if (!ready) {
      console.error('❌ Failed to initialize Neon PostgreSQL. Check DATABASE_URL in .env');
      process.exit(1);
    }

    console.log('🧹 Clearing existing students in Neon PostgreSQL...');
    await query('DELETE FROM students');

    console.log('🌱 Inserting sample student records...');
    for (const student of sampleStudents) {
      await query(
        `INSERT INTO students (name, enrollment_no, course, email)
         VALUES ($1, $2, $3, $4)`,
        [student.name, student.enrollmentNo, student.course, student.email]
      );
    }

    console.log(`🎉 Successfully seeded ${sampleStudents.length} student records into Neon PostgreSQL!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedNeon();
