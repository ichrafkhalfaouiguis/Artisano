// uploadRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads'; // Common upload directory for both products and about
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route for handling uploads at /upload
router.post('/', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 5 }]), (req, res) => {
  // Handle uploads logic here
  // You can access uploaded files using req.files
  res.status(200).json({ message: 'Uploads successful', files: req.files });
});

export default router;
