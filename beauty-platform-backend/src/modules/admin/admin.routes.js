const router = require('express').Router();
const { adminAuth } = require('../../middleware/adminAuth.middleware');

router.get('/dashboard', adminAuth, (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    user: req.user,
  });
});

module.exports = router;