const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(express.static("."));

const db = new sqlite3.Database("veriler.db");

db.run(`
CREATE TABLE IF NOT EXISTS talepler (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tur TEXT,
  il TEXT,
  ilce TEXT,
  mahalle TEXT,
  metrekare INTEGER,
  adsoyad TEXT,
  telefon TEXT,
  tarih DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

app.post("/api/kaydet", (req, res) => {
  const d = req.body;

  db.run(
    `INSERT INTO talepler (tur, il, ilce, mahalle, metrekare, adsoyad, telefon)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [d.tur, d.il, d.ilce, d.mahalle, d.metrekare, d.adsoyad, d.telefon]
  );

  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Sistem çalışıyor → http://localhost:3000");
});
app.get("/api/liste", (req, res) => {
  db.all("SELECT * FROM talepler ORDER BY tarih DESC", (err, rows) => {
    res.json(rows);
  });
});
