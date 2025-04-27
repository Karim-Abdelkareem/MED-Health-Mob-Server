import Order from "./orderModel.js";
import AppErrror from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import User from "../user/userModel.js";
import Cart from "../cart/cartModel.js";

export const createOrder = catchAsync(async (req, res, next) => {
  let order;
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppErrror("User not found", 404));
  }
  const cartId = req.params.cartId;
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppErrror("Cart not found", 404));
  }
  switch (req.body.paymentMethod) {
    case "cash":
      order = await Order.create({
        user: userId,
        cart: cartId,
        totalPrice: cart.totalPrice,
        status: "pending",
        paymentMethod: req.body.paymentMethod,
        shippingAddress: req.body.shippingAddress, // change to user address in the future
      });
      break;
    case "card":
      //do the banking process here
      // if success
      order = await Order.create({
        user: userId,
        cart: cartId,
        totalPrice: cart.totalPrice,
        status: "pending",
        paymentMethod: req.body.paymentMethod,
        shippingAddress: req.body.shippingAddress, // change to user address in the future
      });
      // else
      // return next(new AppErrror("Payment failed", 400));
      break;
    case "later":
      user.debt += cart.totalPrice;
      order = await Order.create({
        user: userId,
        cart: cartId,
        totalPrice: cart.totalPrice,
        status: "pending",
        paymentMethod: req.body.paymentMethod,
        shippingAddress: req.body.shippingAddress, // change to user address in the future
      });
      break;
    default:
      return next(new AppErrror("Invalid payment method", 400));
  }
  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId)
    .populate("user", "username")
    .populate({
      path: "cart",
      select: "items",
      populate: {
        path: "items.product",
        select: "name price image",
      },
    });
  if (!order) {
    return next(new AppErrror("Order not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "username")
    .populate({
      path: "cart",
      select: "items",
      populate: {
        path: "items.product",
        select: "name price image",
      },
    });
  if (!orders) {
    return next(new AppErrror("No orders found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

export const updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    return next(new AppErrror("Order not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.orderId);
  if (!order) {
    return next(new AppErrror("Order not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getUserOrders = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).populate(
    "user",
    "username"
  );
  if (!orders) {
    return next(new AppErrror("No orders found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new AppErrror("Order not found", 404));
  }
  order.status = req.body.status;
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const getOrdersByStatus = catchAsync(async (req, res, next) => {
  const status = req.params.status;
  const orders = await Order.find({ status })
    .populate("user", "username email")
    .populate({
      path: "cart",
      select: "items",
      populate: {
        path: "items.product",
        select: "name price image",
      },
    });
  if (!orders) {
    return next(new AppErrror("No orders found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});
