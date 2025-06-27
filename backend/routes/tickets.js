const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

router.post('/', authenticateToken, ticketController.createTicket);
router.get('/mine', authenticateToken, ticketController.getMyTickets);
router.patch('/:id/status', authenticateToken, requireRole('admin'), ticketController.updateStatus);
router.get('/all', authenticateToken, requireRole('admin'), ticketController.getAllTickets);


module.exports = router;