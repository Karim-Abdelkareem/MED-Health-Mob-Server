import Category from "./categoryModel.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";

export const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.findOne({ name });
  if (category) {
    return next(new AppError("Category already exists", 400));
  }
  let newCategory = new Category({ name });
  await newCategory.save();
  res.status(201).json({
    status: "success",
    data: {
      newCategory,
    },
  });
});

export const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find().populate("category");
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});

export const getCategoryById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
