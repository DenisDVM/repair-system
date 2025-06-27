odule.exports = (db) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','user'))
    )
  `);

  return {
    create: (username, hash, role) => {
      const stmt = db.prepare(`INSERT INTO users(username, password_hash, role) VALUES(?,?,?)`);
      return new Promise((res, rej) => {
        stmt.run([username, hash, role], function(err) {
          if (err) return rej(err);
          res({ id: this.lastID, username, role });
        });
      });
    },
    findByUsername: (username) => {
      return new Promise((res, rej) => {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
          if (err) return rej(err);
          res(row);
        });
      });
    }
  };
};