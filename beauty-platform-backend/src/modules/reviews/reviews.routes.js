const router = require('express').Router();
const contentController = require('../content/content.controller');

router.post('/', contentController.submitReview);

module.exports = router;
