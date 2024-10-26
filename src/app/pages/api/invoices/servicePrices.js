// src/pages/api/servicePrices.js
import db from "../../../database/database";

export default function handler(req, res) {
  if (req.method === "GET") {
    db.get("SELECT * FROM service_prices", [], (err, row) => {
      if (err) {
        console.error("Error fetching service prices: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to fetch service prices" });
      }
      res.json(row);
    });
  } else if (req.method === "PUT") {
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
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
