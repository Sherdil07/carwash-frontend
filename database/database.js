const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create a new database instance with an absolute path to the database
const db = new sqlite3.Database(
  path.join(__dirname, "./database/carwash.db"), // Adjust path to point to the correct location
  (err) => {
    if (err) {
      console.error("Error opening database: " + err.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  },
);

// Use serialize to ensure the queries run in order
db.serialize(() => {
  // Create invoices table
  db.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        carNumber TEXT,
        carType TEXT,
        services TEXT,
        total REAL,
        date TEXT
      )
    `);

  // Create service_prices table
  db.run(
    `
      CREATE TABLE IF NOT EXISTS service_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carWash REAL,
        waxing REAL,
        detailing REAL
      )
    `,
    (err) => {
      if (err) {
        console.error("Error creating service_prices table: " + err.message);
      } else {
        console.log("Service prices table created or already exists.");

        // Insert default prices if the table is empty
        db.get(`SELECT COUNT(*) AS count FROM service_prices`, (err, row) => {
          if (err) {
            console.error(
              "Error checking service_prices count: " + err.message,
            );
          } else if (row.count === 0) {
            // Insert default service prices
            db.run(
              `INSERT INTO service_prices (carWash, waxing, detailing) VALUES (?, ?, ?)`,
              [20.0, 30.0, 50.0],
              (err) => {
                if (err) {
                  console.error(
                    "Error inserting default service prices: " + err.message,
                  );
                } else {
                  console.log("Default service prices inserted.");
                }
              },
            );
          }
        });
      }
    },
  );
});

// Close the database connection when done
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database: " + err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});

module.exports = db;
