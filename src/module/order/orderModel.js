import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "later"],
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
