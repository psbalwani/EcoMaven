import express from 'express'
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart)

router.route('/:productId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart)

export default router