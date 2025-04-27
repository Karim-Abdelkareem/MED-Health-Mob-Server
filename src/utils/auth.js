import jwt from "jsonwebtoken";
import User from "../module/user/userModel.js";
import AppError from "./AppError.js";

export const getUserRole = async (token) => {
  try {
    if (!token) {
      throw new AppError(401, "No token provided");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user.role;
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new AppError(401, "Invalid token");
    }
    throw error;
  }
};
