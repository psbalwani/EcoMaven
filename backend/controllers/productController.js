import Product from '../models/productModel.js'
import { predictPrice } from '../utils/pricePredictor.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}
      
    const category = req.query.category 
      ? { category: req.query.category } 
      : {}
      
    const query = { ...keyword, ...category }

    const count = await Product.countDocuments(query)
    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    res.json({ 
      products, 
      page, 
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      res.json(product)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
      features,
      specifications
    } = req.body

    const product = new Product({
      name,
      price,
      user: req.user._id,
      image,
      brand,
      category,
      countInStock,
      numReviews: 0,
      description,
      features,
      specifications,
      priceHistory: [{ price, date: new Date() }]
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
      features,
      specifications
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      product.name = name
      product.description = description
      product.image = image
      product.brand = brand
      product.category = category
      product.countInStock = countInStock
      product.features = features
      product.specifications = specifications
      
      // If price changed, add to price history
      if (price !== product.price) {
        product.price = price
        product.priceHistory.push({ price, date: new Date() })
      }

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      await Product.deleteOne({ _id: product._id })
      res.json({ message: 'Product removed' })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      )

      if (alreadyReviewed) {
        res.status(400)
        throw new Error('Product already reviewed')
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }

      product.reviews.push(review)

      product.numReviews = product.reviews.length

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length

      await product.save()
      res.status(201).json({ message: 'Review added' })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(5)
    res.json(products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update product price
// @route   PUT /api/products/:id/price
// @access  Private/Admin
const updateProductPrice = async (req, res) => {
  try {
    const { price } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      // Add new price to history
      product.price = price
      product.priceHistory.push({ price, date: new Date() })
      
      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Predict product price using ARIMA
// @route   GET /api/products/:id/predict
// @access  Private/Admin
const predictProductPrice = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      // Check if we have enough price history for prediction
      if (product.priceHistory.length < 5) {
        return res.status(400).json({ 
          message: 'Not enough price history data for prediction',
          currentPrice: product.price
        })
      }
      
      // Use ARIMA to predict future price
      const predictedPrice = predictPrice(product.priceHistory)
      
      // Save the prediction
      product.predictedPrice = predictedPrice
      await product.save()
      
      res.json({ 
        currentPrice: product.price,
        predictedPrice,
        priceHistory: product.priceHistory
      })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  updateProductPrice,
  predictProductPrice,
}