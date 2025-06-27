const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { PORT } = require('./config');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Database initialization
require('./db/init');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});