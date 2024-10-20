const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Use middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Connect to the SQLite database
const db = new sqlite3.Database("./database/carwash.db", (err) => {
  if (err) {
    console.error("Error opening database: " + err.message);
    process.exit(1); // Exit if the database can't be opened
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// API endpoint to get all invoices
app.get("/api/invoices", (req, res) => {
  db.all("SELECT * FROM invoices", [], (err, rows) => {
    if (err) {
      console.error("Error fetching invoices: " + err.message);
      return res.status(500).json({ error: "Failed to fetch invoices" });
    }
    res.json(rows);
  });
});

// API endpoint to add a new invoice
app.post("/api/invoices", (req, res) => {
  const { name, email, phone, carNumber, carType, services, total, date } =
    req.body;
  db.run(
    `INSERT INTO invoices (name, email, phone, carNumber, carType, services, total, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, carNumber, carType, services.join(","), total, date],
    function (err) {
      if (err) {
        console.error("Error inserting invoice: " + err.message);
        return res.status(500).json({ error: "Failed to create invoice" });
      }
      res.status(201).json({ id: this.lastID });
    },
  );
});

// API endpoint to get service prices
app.get("/api/service-prices", (req, res) => {
  db.get("SELECT * FROM service_prices", [], (err, row) => {
    if (err) {
      console.error("Error fetching service prices: " + err.message);
      return res.status(500).json({ error: "Failed to fetch service prices" });
    }
    res.json(row);
  });
});

// API endpoint to update service prices
app.put("/api/service-prices", (req, res) => {
  const { carWash, waxing, detailing } = req.body;
  db.run(
    `UPDATE service_prices SET carWash = ?, waxing = ?, detailing = ?`,
    [carWash, waxing, detailing],
    function (err) {
      if (err) {
        console.error("Error updating service prices: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to update service prices" });
      }
      res.json({ updated: this.changes });
    },
  );
});

// API endpoint to delete an invoice
app.delete("/api/invoices/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM invoices WHERE id = ?`, id, function (err) {
    if (err) {
      console.error("Error deleting invoice: " + err.message);
      return res.status(500).json({ error: "Failed to delete invoice" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ deleted: this.changes });
  });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
