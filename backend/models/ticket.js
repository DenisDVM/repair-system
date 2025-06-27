module.exports = (db) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      device_id INTEGER NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'Open' CHECK(status IN ('Open','In Progress','Closed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(device_id) REFERENCES devices(id)
    )
  `);

  return {
    create: ({ user_id, device_id, description }) => new Promise((res, rej) => {
      const stmt = db.prepare(`INSERT INTO tickets(user_id, device_id, description) VALUES(?,?,?)`);
      stmt.run([user_id, device_id, description], function(err) {
        if (err) return rej(err);
        res({ id: this.lastID, user_id, device_id, description, status: 'Open' });
      });
    }),
    listByUser: (user_id) => new Promise((res, rej) => db.all(`SELECT * FROM tickets WHERE user_id = ?`, [user_id], (e, rows) => e ? rej(e) : res(rows))),
    find: (id) => new Promise((res, rej) => db.get(`SELECT * FROM tickets WHERE id = ?`, [id], (e, row) => e ? rej(e) : res(row))),
    updateStatus: (id, newStatus) => new Promise((res, rej) => {
      const stmt = db.prepare(`UPDATE tickets SET status = ? WHERE id = ?`);
      stmt.run([newStatus, id], (err) => err ? rej(err) : res());
    })
  };
};