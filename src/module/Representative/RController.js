import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import Order from "../order/orderModel.js";

export const getShippedOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ status: "shipped" })
    .populate("user")
    .populate({ path: "cart", populate: { path: "items.product" } });
  res.status(200).json({
    status: "success",
    data: { orders },
  });
});
