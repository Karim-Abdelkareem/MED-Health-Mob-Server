import User from "../user/userModel.js";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { uploadBufferToCloudinary } from "../../utils/uploadToCloudinary.js";

export const register = catchAsync(async (req, res, next) => {
  const {
    username,
    email,
    password,
    pharmacyName,
    location,
    address,
    city,
    role,
  } = req.body;

  const user = await User.findOne({ username: req.body.username });
  if (user) {
    return next(new AppError("Username already exists", 400));
  }
  const doctorIdUrl = await uploadBufferToCloudinary(
    req.files["doctorId"][0].buffer,
    "user_documents"
  );
  const commercialRegisterUrl = await uploadBufferToCloudinary(
    req.files["commercialRegister"][0].buffer,
    "user_documents"
  );
  const taxRecordUrl = await uploadBufferToCloudinary(
    req.files["taxRecord"][0].buffer,
    "user_documents"
  );
  const newUser = new User({
    username,
    email,
    password,
    pharmacyName,
    location,
    address,
    city,
    doctorId: doctorIdUrl,
    commercialRegister: commercialRegisterUrl,
    taxRecord: taxRecordUrl,
    role,
  });
  await newUser.save();
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return next(new AppError("Invalid username", 401));
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid password", 401));
  }
  if (!user.active) {
    return next(
      new AppError(
        "User is not active wait until the admin approve the account",
        401
      )
    );
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});
