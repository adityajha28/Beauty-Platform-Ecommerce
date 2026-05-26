const express = require('express');
const cors = require('cors');

const authRoutes = require('./modules/auth/auth.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const servicesRoutes = require('./modules/services/services.routes');
const cmsRoutes = require('./modules/services/cms.routes');
const bookingsRoutes = require('./modules/bookings/bookings.routes');
const productsRoutes = require('./modules/products/products.routes');
const reviewsRoutes = require('./modules/reviews/reviews.routes');
const errorMiddleware = require('./middleware/error.middleware');
const { getWhatsAppStatus } = require('./services/whatsapp.service');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/health', (req, res) => {
  const whatsapp = getWhatsAppStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    auth: {
      whatsappOtp: whatsapp.configured ? 'live' : whatsapp.devMode ? 'dev_console' : 'not_configured',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/reviews', reviewsRoutes);

app.use(errorMiddleware);

module.exports = app;
