const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');
const db = require('../db/init');
const users = require('../models/user')(db);

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await users.create(username, hash, role || 'user');
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await users.findByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};