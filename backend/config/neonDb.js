const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let pool = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Neon requires SSL
    }
  });

  pool.on('error', (err) => {
    console.error('❌ Unexpected Neon PostgreSQL error on idle client:', err.message);
  });
}

/**
 * Initialize PostgreSQL table schema in Neon
 */
const initNeonDB = async () => {
  if (!pool) {
    console.warn('⚠️  DATABASE_URL / POSTGRES_URL not provided for Neon PostgreSQL.');
    return false;
  }

  const client = await pool.connect();
  try {
    console.log('📡 Connected to Neon PostgreSQL. Verifying tables...');

    // Create students table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        enrollment_no VARCHAR(50) UNIQUE NOT NULL,
        course VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indices
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_students_enrollment ON students(enrollment_no);
      CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
    `);

    console.log('✅ Neon PostgreSQL students table ready!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing Neon PostgreSQL:', error.message);
    return false;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initNeonDB
};
