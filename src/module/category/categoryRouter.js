import express from "express";
import * as categoryController from "./categoryController.js";
import { protect, restrictTo } from "../../middleware/authentication.js";

const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    protect,
    restrictTo("admin", "general_manager"),
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .put(
    protect,
    restrictTo("admin", "general_manager"),
    categoryController.updateCategory
  )
  .delete(
    protect,
    restrictTo("admin", "general_manager"),
    categoryController.deleteCategory
  );

export default router;
