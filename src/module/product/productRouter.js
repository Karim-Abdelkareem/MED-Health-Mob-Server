import express from "express";
import * as productController from "./productController.js";
import { protect, restrictTo } from "../../middleware/authentication.js";
import upload from "../../middleware/multer.js";

const router = express.Router();

// Route to get all products
router.get("/", productController.getAllProducts);

// Route to create a new product
router.post(
  "/",
  protect,
  restrictTo("admin", "general_manger"),
  upload.single("image"),
  productController.createProduct
);

// Route to get a product by ID
router.get("/:id", productController.getProductById);

// Route to update a product by ID
router.patch(
  "/:id",
  protect,
  restrictTo("admin", "general_manger"),
  productController.updateProduct
);

// Route to delete a product by ID
router.delete(
  "/:id",
  protect,
  restrictTo("admin", "general_manger"),
  productController.deleteProduct
);

// Route to get products  by Category ID
router.get("/category/:id", productController.getProductByCategoryId);

export default router;
