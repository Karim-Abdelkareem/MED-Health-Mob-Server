import catchAsync from "../utils/catchAsync.js";
import Message from "./messageModel.js";

export const getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({ channel: "public" })
    .sort({ createdAt: 1 })
    .populate("userId", "username name");
  res.json(messages);
});
