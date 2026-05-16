const express = require('express');
const cors = require('cors');

const authRoutes = require('./modules/auth/auth.routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();
const adminRoutes = require('./modules/admin/admin.routes');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

app.use('/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use(errorMiddleware);

module.exports = app;