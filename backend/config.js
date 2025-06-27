module.exports = {
  PORT: process.env.PORT || 3000,
  DATABASE_FILE: process.env.DB_FILE || './db/repair_system.sqlite',
  JWT_SECRET: process.env.JWT_SECRET || 'replace_with_secure_secret',
};