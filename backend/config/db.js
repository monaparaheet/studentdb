const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas database
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('\n⚠️  WARNING: MONGODB_URI environment variable is missing.');
    console.warn('👉 Please create a .env file in the backend directory and set MONGODB_URI.');
    console.warn('👉 Example: MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/studentportal\n');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Troubleshooting tips:');
    console.error('   1. Verify your username & password in MONGODB_URI.');
    console.error('   2. Verify that IP Access is set to 0.0.0.0/0 in MongoDB Atlas Network Access.');
    console.error('   3. Check that your cluster is active and not paused.\n');
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB Atlas disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB Atlas reconnected successfully.');
});

module.exports = connectDB;
