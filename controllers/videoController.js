const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// Upload handler
const uploadVideoToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const uploadResult = await uploadVideoToCloudinary(file.buffer);

    const newVideo = await Video.create({
      title,
      description,
      videoUrl: uploadResult.secure_url,
      user: req.user.userId,
    });

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching videos', error: err.message });
  }
};
