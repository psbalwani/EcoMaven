import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  updateProductPrice,
  predictProductPrice,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/top').get(getTopProducts)
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.route('/:id/price').put(protect, admin, updateProductPrice)
router.route('/:id/predict').get(protect, admin, predictProductPrice)

export default router