const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// 🔐 BASIC AUTH (LİSTE KORUMASI)
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.status(401).send("Yetkisiz erişim");
  }

  const base64 = auth.split(" ")[1];
  const [user, pass] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  // 👉 BURAYI İSTEDİĞİN GİBİ DEĞİŞTİREBİLİRSİN
 if (
  user === process.env.ADMIN_USER &&
  pass === process.env.ADMIN_PASS
) {
  next();
  } else {
    return res.status(401).send("Hatalı kullanıcı");
  }
};

// 📦 VERİTABANI
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

// 📝 FORM KAYIT
app.post("/api/kaydet", (req, res) => {
  const d = req.body;

  db.run(
    `INSERT INTO talepler (tur, il, ilce, mahalle, metrekare, adsoyad, telefon)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [d.tur, d.il, d.ilce, d.mahalle, d.metrekare, d.adsoyad, d.telefon]
  );

  res.json({ ok: true });
});

// 📋 LİSTE API (sayfa arkasında, şifresiz)
app.get("/api/liste", (req, res) => {
  db.all("SELECT * FROM talepler ORDER BY tarih DESC", (err, rows) => {
    res.json(rows);
  });
});


// 🔐 LİSTE SAYFASI (ŞİFRELİ)
app.get("/liste.html", basicAuth, (req, res) => {
  res.sendFile(__dirname + "/liste.html");
});

// 🚀 SUNUCU
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server çalışıyor: ${PORT}`);
});



