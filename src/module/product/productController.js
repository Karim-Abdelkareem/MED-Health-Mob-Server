import Product from "./productModel.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import Features from "../../utils/Features.js";
import Category from "../category/categoryModel.js";

export const getAllProducts = catchAsync(async (req, res, next) => {
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
  let hasNextPage = result.length === 20;
  if (hasNextPage) {
    return res.status(200).json({
      status: "success",
      page: features.page,
      nextPage: features.page + 1,
      data: result,
    });
  }
  res.json({
    status: "success",
    page: features.page,
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
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
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
  if (!products) {
    return next(new AppError(404, "Products not found"));
  }
  res.json({
    status: "success",
    data: products,
  });
});
