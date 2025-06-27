module.exports = (db) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      serial_number TEXT UNIQUE
    )
  `);

  return {
    all: () => new Promise((res, rej) => db.all(`SELECT * FROM devices`, [], (e, rows) => e ? rej(e) : res(rows))),
    findOrCreate: ({ name, serial_number }) => new Promise((res, rej) => {
      db.get(`SELECT * FROM devices WHERE serial_number = ?`, [serial_number], (err, row) => {
        if (err) return rej(err);
        if (row) return res(row);
        const stmt = db.prepare(`INSERT INTO devices(name, serial_number) VALUES(?,?)`);
        stmt.run([name, serial_number], function(err) {
          if (err) return rej(err);
          res({ id: this.lastID, name, serial_number });
        });
      });
    })
  };
};