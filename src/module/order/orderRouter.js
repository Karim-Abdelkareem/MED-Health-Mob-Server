import express from "express";
import * as orderController from "./orderController.js";
import { protect, restrictTo } from "../../middleware/authentication.js";

const router = express.Router();

router.use(protect);

router.post("/:cartId", orderController.createOrder);
router.get("/", restrictTo("admin"), orderController.getAllOrders);
router.get("/:id", restrictTo("admin"), orderController.getOrder);
router.patch("/:id", restrictTo("admin"), orderController.updateOrderStatus);
router.delete("/:id", restrictTo("admin"), orderController.deleteOrder);
router.get("/user", orderController.getUserOrders);
router.get(
  "/status/:status",
  restrictTo("admin"),
  orderController.getOrdersByStatus
);

export default router;
