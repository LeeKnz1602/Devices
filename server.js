const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke MariaDB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "Devices"
});

db.connect(err => {
  if (err) {
    console.log("Database error:", err);
  } else {
    console.log("Connected to MariaDB");
  }
});

// API data
app.get("/data", (req, res) => {
  db.query("SELECT * FROM data_list", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// API tambah data
app.post("/data", (req, res) => {
  const { nama, device, serial, note } = req.body;
  db.query(
    "INSERT INTO data_list (nama, device, serial, note) VALUES (?, ?, ?, ?)",
    [nama, device, serial, note || ""],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Data added" });
    }
  );
});

// API edit data
app.put("/data/:id", (req, res) => {
  const { id } = req.params;
  const { nama, device, serial, note } = req.body;
  db.query(
    "UPDATE data_list SET nama=?, device=?, serial=?, note=? WHERE id=?",
    [nama, device, serial, note, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Data updated" });
    }
  );
});

// API hapus data
app.delete("/data/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM data_list WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Data deleted" });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
