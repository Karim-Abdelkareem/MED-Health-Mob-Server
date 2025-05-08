import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import User from "../user/userModel.js";
import Order from "../order/orderModel.js";

export const getGMUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "general_manger" });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const getRepresentativeUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "representative" });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const getCustomerUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const activateUser = catchAsync(async (req, res, next) => {
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

export const deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
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

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const changeOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const getPendingOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ status: "pending" })
    .populate("user")
    .populate({
      path: "cart",
      populate: {
        path: "items.product",
        select: "name price",
      },
    });
  res.status(200).json({
    status: "success",
    data: { orders },
  });
});

export const getNotActiveUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ active: false });
  res.status(200).json({
    status: "success",
    data: { users },
  });
});
