module.exports = (db) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS status_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      old_status TEXT NOT NULL,
      new_status TEXT NOT NULL,
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ticket_id) REFERENCES tickets(id)
    )
  `);

  return {
    log: ({ ticket_id, old_status, new_status }) => new Promise((res, rej) => {
      const stmt = db.prepare(`INSERT INTO status_logs(ticket_id, old_status, new_status) VALUES(?,?,?)`);
      stmt.run([ticket_id, old_status, new_status], function(err) {
        if (err) return rej(err);
        res({ id: this.lastID, ticket_id, old_status, new_status });
      });
    }),
    listByTicket: (ticket_id) => new Promise((res, rej) => db.all(`SELECT * FROM status_logs WHERE ticket_id = ?`, [ticket_id], (e, rows) => e ? rej(e) : res(rows)))
  };
};