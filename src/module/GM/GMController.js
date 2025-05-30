import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import User from "../user/userModel.js";
import Order from "../order/orderModel.js";
import { sendEmail } from "../../services/emailService.js";

export const getGMUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "general_manager" });

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
  await sendEmail({
    to: user.email,
    subject: "Welcome to MedHealth!",
    text: "Thank you for registering. Your request will be reviewed.",
    html: `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
      <div style="text-align: center;">
        <img src="https://res.cloudinary.com/djtjlvuvb/image/upload/v1748525856/medhealth/images/1748525854443-logo-main.png"
             alt="MedHealth Logo"
             style="width: 80px; margin-bottom: 20px; display: inline-block; filter: invert(1);"
             width="80" height="auto" />
        <h1 style="color: #2a7be4; margin-bottom: 10px;">Your Account is Approved!</h1>
      </div>
      <p style="font-size: 16px; color: #333;">
        Hi <strong>${user.username}</strong>,
      </p>
      <p style="font-size: 16px; color: #333;">
        We're happy to let you know that your registration with <strong>MedHealth</strong> has been approved.
      </p>
      <p style="font-size: 16px; color: #333;">
        You can now log in using your credentials and start using your account.
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 14px; color: #888; text-align: center;">
        If you have any questions, contact us at <a href="mailto:medhealth742@gmail.com" style="color: #2a7be4;">support@medhealth.com</a>.
      </p>
    </div>
  </div>
`,
  });
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
  await sendEmail({
    to: user.email,
    subject: "Welcome to MedHealth!",
    text: "Thank you for registering. Your request will be reviewed.",
    html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
          <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
            <div style="text-align: center;">
              <img src="https://res.cloudinary.com/djtjlvuvb/image/upload/v1748525856/medhealth/images/1748525854443-logo-main.png"
                   alt="MedHealth Logo"
                   style="width: 80px; margin-bottom: 20px; display: inline-block; filter: invert(1);"
                   width="80" height="auto" />
              <h1 style="color: #e74c3c; margin-bottom: 10px;">Account Request Declined</h1>
            </div>
            <p style="font-size: 16px; color: #333;">
              Hi <strong>${user.username}</strong>,
            </p>
            <p style="font-size: 16px; color: #333;">
              We regret to inform you that your account request for MedHealth has been declined after review by our team.
            </p>
            <p style="font-size: 16px; color: #333;">
              This decision may be due to incomplete information or not meeting our registration requirements.
            </p>
            <p style="font-size: 16px; color: #333;">
              You are welcome to submit a new application with complete information if you wish to try again.
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 14px; color: #888; text-align: center;">
              If you have any questions, please contact us at <a href="mailto:medhealth742@gmail.com" style="color: #2a7be4;">support@medhealth.com</a>.
            </p>
        </div>
        </div>
      `,
  });
  res.status(200).json("success");
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
