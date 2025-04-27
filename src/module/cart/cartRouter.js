import express from "express";
import * as cartController from "./cartController.js";
import { protect } from "../../middleware/authentication.js";

const router = express.Router();

router
  .route("/")
  .post(protect, cartController.addToCart)
  .get(protect, cartController.getCart);

router.route("/:itemId").delete(protect, cartController.removeFromCart);

export default router;
