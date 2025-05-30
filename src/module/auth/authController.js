import User from "../user/userModel.js";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendEmail } from "../../services/emailService.js";

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
  const doctorIdUrl = req.files?.doctorId?.[0]?.path;
  const commercialRegisterUrl = req.files?.commercialRegister?.[0]?.path;
  const taxRecordUrl = req.files?.taxRecord?.[0]?.path;

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
  await sendEmail({
    to: email,
    subject: "Welcome to MedHealth!",
    text: "Thank you for registering. Your request will be reviewed.",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/djtjlvuvb/image/upload/v1748525856/medhealth/images/1748525854443-logo-main.png"
                 alt="MedHealth Logo"
<img src="https://res.cloudinary.com/djtjlvuvb/image/upload/v1748525856/medhealth/images/1748525854443-logo-main.png"
     alt="MedHealth Logo"
     style="width: 80px; margin-bottom: 20px; display: inline-block; filter: invert(1);"
                 width="80" height="auto" />
            <h1 style="color: #2a7be4; margin-bottom: 10px;">Welcome to MedHealth!</h1>
          </div>
          <p style="font-size: 16px; color: #333;">
            Hi <strong>${username}</strong>,
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you for registering with MedHealth. Your account request has been received and is under review by our team.
          </p>
          <p style="font-size: 16px; color: #333;">
            You will receive another email once your account is approved and activated.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 14px; color: #888; text-align: center;">
            If you have any questions, please contact us at <a href="mailto:medhealth742@gmail.com" style="color: #2a7be4;">support@medhealth.com</a>.
          </p>
        </div>
      </div>
    `,
  });
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
