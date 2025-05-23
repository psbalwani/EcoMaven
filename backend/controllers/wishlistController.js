import Wishlist from '../models/wishlistModel.js'
import Product from '../models/productModel.js'
import mongoose from 'mongoose'

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products',
        select: 'name image price rating numReviews predictedPrice'
      })

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: []
      })
      await wishlist.save()
      return res.json([])
    }

    res.json(wishlist.products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body

    // 🔥 Validate productId first
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [productId]
      })
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId)
      }
    }

    await wishlist.save()

    wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products',
        select: 'name image price rating numReviews predictedPrice'
      })

    res.status(200).json(wishlist.products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params

    // 🔥 Validate productId first
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' })
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== productId
    )

    await wishlist.save()

    const updatedWishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products',
        select: 'name image price rating numReviews predictedPrice'
      })

    res.status(200).json(updatedWishlist.products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' })
    }

    wishlist.products = []

    await wishlist.save()

    res.status(200).json({ message: 'Wishlist cleared' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
}
