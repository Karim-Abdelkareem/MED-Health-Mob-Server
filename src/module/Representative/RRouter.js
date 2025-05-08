import express from "express";
import * as rController from "./RController.js";
import { protect, restrictTo } from "../../middleware/authentication.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin", "representative"));

router.route("/orders/shipped").get(rController.getShippedOrders);

export default router;
