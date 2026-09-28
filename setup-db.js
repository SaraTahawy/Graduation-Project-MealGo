const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '191997',
  database: process.env.DB_NAME || 'mealgo_db',
});

async function runSQLFile(fileName) {
  try {
    const filePath = path.join(__dirname, 'database', fileName);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n📄 Running ${fileName}...`);
    await pool.query(sql);
    console.log(`✅ ${fileName} completed successfully!`);
  } catch (error) {
    console.error(`❌ Error in ${fileName}:`, error.message);
    throw error;
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');
    
    // Run SQL files in order
    await runSQLFile('001_schema.sql');
    await runSQLFile('002_seed.sql');
    await runSQLFile('003_views.sql');
    
    console.log('\n✨ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database setup failed!', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
