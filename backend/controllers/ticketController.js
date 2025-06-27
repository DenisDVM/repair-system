const db = require('../db/init');
const tickets = require('../models/ticket')(db);
const devices = require('../models/device')(db);
const statusLog = require('../models/statusLog')(db);

exports.createTicket = async (req, res, next) => {
  try {
    const { deviceName, serialNumber, description } = req.body;
    const device = await devices.findOrCreate({ name: deviceName, serial_number: serialNumber });
    const ticket = await tickets.create({ user_id: req.user.id, device_id: device.id, description });
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

exports.getMyTickets = async (req, res, next) => {
  try {
    const myTickets = await tickets.listByUser(req.user.id);
    res.json(myTickets);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;
    const current = await tickets.find(id);
    if (!current) return res.status(404).json({ message: 'Ticket not found' });
    await tickets.updateStatus(id, newStatus);
    await statusLog.log({ ticket_id: id, old_status: current.status, new_status: newStatus });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const all = await new Promise((resolve, reject) => {
      db.all(
        `SELECT tickets.*, users.username, devices.name AS device_name FROM tickets
         JOIN users ON tickets.user_id = users.id
         JOIN devices ON tickets.device_id = devices.id`,
        [],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
    res.json(all);
  } catch (err) {
    next(err);
  }
};
