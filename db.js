require("dotenv").config(); // Load environment variables from .env file

const { Pool } = require("pg"); // Create a new pool instance to manage PostgreSQL connections

// Create a new pool instance with the database configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// Create the tasks table if it doesn't exist
const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function initializeDatabase() {
  const maxAttempts = 10;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE
        )
      `);

      console.log("Connected to PostgreSQL");
      console.log("Tasks table is ready");
      return;
    } catch (err) {
      if (attempt === maxAttempts) {
        console.error("Database initialization failed:", err);
        return;
      }

      console.error(
        `Database connection attempt ${attempt}/${maxAttempts} failed; retrying in 2 seconds: ${err.message}`
      );
      await delay(2000);
    }
  }
}

initializeDatabase();

module.exports = pool; // Export the pool instance for use in other parts of the application
