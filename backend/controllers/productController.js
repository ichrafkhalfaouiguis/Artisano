import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';




// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Product not found');
  }
});










// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Set default values for each field
  const defaultProduct = {
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    images: [{ url: '/images/sample.jpg' }],
    videos: [{ url: '/videos/sample.mp4' }],
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  };

  // Merge default values with the provided values from the request body
  const productData = { ...defaultProduct, ...req.body };

  // Create a new Product instance
  const product = new Product(productData);

  // Save the product to the database
  const createdProduct = await product.save();

  // Respond with the created product
  res.status(201).json(createdProduct);
});




// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { name, brand, category, description, price, countInStock } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update other product details
    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price) product.price = price;
    if (countInStock) product.countInStock = countInStock;

    // Process and save uploaded images
    if (req.files && req.files.images) {
      product.images = req.files.images.map((image) => ({ url: image.path }));
    }

    // Process and save uploaded videos
    if (req.files && req.files.videos) {
      product.videos = req.files.videos.map((video) => ({ url: video.path }));
    }

    // Save the updated product
    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});





// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});



// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;

  const products = await Product.find({ category: category });

  if (products && products.length > 0) {
    return res.json(products);
  } else {
    res.status(404);
    throw new Error('Products not found for the given category');
  }
});

export {
  getProductsByCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};