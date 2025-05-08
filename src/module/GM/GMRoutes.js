import express from "express";
import * as gmController from "./GMController.js";
import { protect, restrictTo } from "../../middleware/authentication.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin", "general_manger"));

router
  .route("/users")
  .get(gmController.getGMUsers)
  .patch(gmController.activateUser)
  .delete(gmController.deleteUser);

router
  .route("/representatives")
  .get(gmController.getRepresentativeUsers)
  .patch(gmController.activateUser)
  .delete(gmController.deleteUser);

router
  .route("/customers/:id")
  .get(gmController.getCustomerUsers)
  .patch(gmController.activateUser)
  .delete(gmController.deleteUser);

router.route("/not-active-users").get(gmController.getNotActiveUsers);

router.route("/orders").get(gmController.getPendingOrders);

router.route("/orders/:id").patch(gmController.changeOrderStatus);

export default router;
