import Product from "./productModel.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import Features from "../../utils/Features.js";
import Category from "../category/categoryModel.js";

export const getAllProducts = catchAsync(async (req, res, next) => {
  // Default page size (limit)
  const limit = parseInt(req.query.limit, 10) || 20;
  const page = parseInt(req.query.page, 10) || 1;

  // Build base query (without pagination)
  let baseQuery = Product.find().populate("category", "name slug");

  // Apply filter, search, and sort on baseQuery (same as in Features)
  // Here, I'm assuming you have separate methods or you can replicate the logic,
  // but for the sake of example, let's just do a count after filters applied

  // Use Features class to apply filters (without pagination)
  let featuresForCount = new Features(baseQuery, req.query)
    .filter()
    .search()
    .sort();

  // Get total count of filtered documents
  const totalDocs = await featuresForCount.mongooseQuery.countDocuments();

  // Calculate total pages
  const totalPages = Math.ceil(totalDocs / limit);

  // Now apply full features including pagination and fields
  let features = new Features(
    Product.find().populate("category", "name slug"),
    req.query
  )
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  let result = await features.mongooseQuery;

  // Check if there is a next page
  const hasNextPage = page < totalPages;

  res.status(200).json({
    status: "success",
    page,
    totalPages,
    nextPage: hasNextPage ? page + 1 : null,
    data: result,
  });
});

export const getProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }
  res.json({
    status: "success",
    data: product,
  });
});

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, quantity, category } = req.body;

  const cate = await Category.findById(category);
  if (!cate) {
    return next(new AppError(404, "Category not found"));
  }

  if (!req.file) {
    return res.status(400).json({ error: "Product image is required" });
  }

  const product = new Product({
    name,
    category,
    description,
    price,
    quantity,
    image: req.file.path,
  });

  await product.save();
  res.status(201).json({ status: "success", data: product });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (req.body.category) {
    const cate = await Category.findById(req.body.category);
    if (!cate) {
      return next(new AppError(404, "Category not found"));
    }
  }

  if (req.file) {
    req.body.image = req.file.path;
  }

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError(404, "Product not found"));
  }

  res.json({
    status: "success",
    data: product,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});

export const getProductByCategoryId = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const products = await Product.find({ category: id });

  if (!products.length) {
    return next(new AppError(404, "No products found for this category"));
  }

  res.json({
    status: "success",
    data: products,
  });
});
