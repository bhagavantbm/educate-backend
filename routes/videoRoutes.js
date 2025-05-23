const express = require('express');
const router = express.Router();
const { uploadVideo, getVideos } = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getVideos);
router.post('/upload', authMiddleware, upload.single('video'), uploadVideo);

module.exports = router;
