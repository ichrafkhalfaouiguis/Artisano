// productRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getProductsByCategory
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';



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




router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .delete(protect, admin, checkObjectId, deleteProduct);

router.route('/category/:category').get(getProductsByCategory);

router.put('/:id', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 5 }]), protect, admin, updateProduct);



export default router;
