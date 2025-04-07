// aboutRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import { getAbout, createOrUpdateAbout, deleteImage, deleteVideo } from '../controllers/aboutController.js';
import { admin,protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = file.fieldname === 'images' ? 'uploads/images' : 'uploads/videos';
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
router.get('/media',getAbout);
router.get('/', protect, admin, getAbout);

router.post('/', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 5 }]), protect, admin, createOrUpdateAbout);

router.delete('/deleteImage/:imageUrl', protect, admin, deleteImage);


router.delete('/deleteVideo/:videoUrl',  protect, admin,deleteVideo);
export default router;
