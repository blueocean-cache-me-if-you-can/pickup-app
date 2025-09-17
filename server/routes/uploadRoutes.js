const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// POST /upload - upload an image
router.post('/', uploadController.upload);

module.exports = router;
