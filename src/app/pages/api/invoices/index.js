// src/pages/api/invoices/index.js
import db from "../../../../database/database";

export default function handler(req, res) {
  if (req.method === "GET") {
    db.all("SELECT * FROM invoices", [], (err, rows) => {
      if (err) {
        console.error("Error fetching invoices: " + err.message);
        return res.status(500).json({ error: "Failed to fetch invoices" });
      }
      res.json(rows);
    });
  } else if (req.method === "POST") {
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
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
