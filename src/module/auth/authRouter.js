import express from "express";
import { login, register } from "./authController.js";
import validate from "../../middleware/validate.js";
import {
  authValidationSchema,
  loginValidationSchema,
} from "./authValidation.js";
import { upload } from "../../config/cloudinary.js";

const router = express.Router();

router.post(
  "/register",
  validate(authValidationSchema),
  upload.fields([
    { name: "doctorId", maxCount: 1 },
    { name: "commercialRegister", maxCount: 1 },
    { name: "taxRecord", maxCount: 1 },
  ]),
  register
);
router.post("/login", validate(loginValidationSchema), login);

export default router;
