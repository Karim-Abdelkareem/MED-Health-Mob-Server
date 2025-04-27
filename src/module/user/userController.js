import User from "./userModel.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { uploadBufferToCloudinary } from "../../utils/uploadToCloudinary.js";

// export const createUser = catchAsync(async (req, res, next) => {
//   let user = await userModel.findOne({ username: req.body.username });
//   if (user) {
//     return next(new AppError(400, "User already exists"));
//   }
//   let result = new userModel(req.body);
//   await result.save();

//   res.status(201).json({
//     status: "success",
//     data: {
//       user: result,
//     },
//   });
// });

export const createUser = catchAsync(async (req, res, next) => {
  const {
    username,
    password,
    pharmacyName,
    location,
    address,
    city,
    role,
    active,
  } = req.body;
  const doctorIdFile = req.files?.doctorId?.[0];
  const commercialFile = req.files?.commercialRegister?.[0];
  const taxRecordFile = req.files?.taxRecord?.[0];

  // Upload if present, else set as null or empty string
  const doctorIdUrl = doctorIdFile
    ? await uploadBufferToCloudinary(doctorIdFile.buffer, "user_documents")
    : undefined;

  const commercialRegisterUrl = commercialFile
    ? await uploadBufferToCloudinary(commercialFile.buffer, "user_documents")
    : undefined;

  const taxRecordUrl = taxRecordFile
    ? await uploadBufferToCloudinary(taxRecordFile.buffer, "user_documents")
    : undefined;
  const user = new User({
    username,
    password,
    pharmacyName,
    location,
    address,
    city,
    doctorId: doctorIdUrl,
    commercialRegister: commercialRegisterUrl,
    taxRecord: taxRecordUrl,
    role,
    active,
  });
  await user.save();
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  let user = await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const activeUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: true },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
