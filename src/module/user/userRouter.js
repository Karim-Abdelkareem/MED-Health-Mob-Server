import express from "express";
import * as userController from "./userController.js";
import { protect, restrictTo } from "../../middleware/authentication.js";
import { userValidationSchema } from "./userValidation.js";
import validate from "../../middleware/validate.js";

const router = express.Router();

router
  .route("/")
  .post(
    // protect,
    // restrictTo("admin", "genegeneral_manger"),
    validate(userValidationSchema),
    userController.createUser
  )
  .get(
    protect,
    restrictTo("admin", "general_manger"),
    userController.getAllUsers
  );

router
  .route("/:id")
  .get(protect, restrictTo("admin", "general_manger"), userController.getUser)
  .patch(
    protect,
    restrictTo("admin", "general_manger"),
    validate(userValidationSchema),
    userController.updateUser
  )
  .delete(
    protect,
    restrictTo("admin", "general_manger"),
    userController.deleteUser
  )
  .post(
    protect,
    restrictTo("admin", "general_manger"),
    userController.activeUser
  );

export default router;
