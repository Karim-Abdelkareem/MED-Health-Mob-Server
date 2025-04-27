import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import User from "../module/user/userModel.js";
import { promisify } from "util";

export const protect = catchAsync(async (req, res, next) => {
  let { authorization } = req.headers;

  if (!authorization) {
    return next(
      new AppError("You are not authorized to access this route", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    authorization,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("Authentication failed", 401));
  }

  req.user = user;

  next();
});

export const restrictTo = (...role) => {
  return catchAsync(async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to access this route", 403)
      );
    }
    next();
  });
};
