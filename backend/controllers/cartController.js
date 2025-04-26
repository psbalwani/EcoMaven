import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name image price countInStock predictedPrice'
    })

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: []
      })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    // Validate product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Validate quantity is available
    if (quantity > product.countInStock) {
      return res.status(400).json({ message: 'Requested quantity not available' })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      // Create new cart if user doesn't have one
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      })
    } else {
      // Check if product is already in cart
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      )

      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity = quantity
      } else {
        // Add new item if product doesn't exist
        cart.items.push({ product: productId, quantity })
      }
    }

    await cart.save()
    
    // Return populated cart
    cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name image price countInStock predictedPrice'
    })

    res.status(200).json(cart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    // Validate product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Validate quantity is available
    if (quantity > product.countInStock) {
      return res.status(400).json({ message: 'Requested quantity not available' })
    }

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' })
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity

    await cart.save()
    
    // Return populated cart
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name image price countInStock predictedPrice'
    })

    res.status(200).json(updatedCart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    )

    await cart.save()
    
    // Return populated cart
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name image price countInStock predictedPrice'
    })

    res.status(200).json(updatedCart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    // Clear all items
    cart.items = []

    await cart.save()

    res.status(200).json({ message: 'Cart cleared' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}