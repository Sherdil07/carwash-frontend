// src/pages/api/invoices/[id].js
import db from "../../../../database/database";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
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
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
