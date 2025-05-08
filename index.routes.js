import AppError from "./src/utils/AppError.js";
import globalErrorHandler from "./src/middleware/globalErrorHandler.js";
import userRouter from "./src/module/user/userRouter.js";
import authRouter from "./src/module/auth/authRouter.js";
import categoryRouter from "./src/module/category/categoryRouter.js";
import productRouter from "./src/module/product/productRouter.js";
import cartRouter from "./src/module/cart/cartRouter.js";
import orderRouter from "./src/module/order/orderRouter.js";
import messageRouter from "./src/socket/messageRouter.js";
import gmRouter from "./src/module/GM/GMRoutes.js";
import rRouter from "./src/module/Representative/RRouter.js";
export const init = (app) => {
  app.get("/", (req, res) => {
    res.send("Hello Med-Health!");
  });

  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/categories", categoryRouter);
  app.use("/api/products", productRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/messages/public", messageRouter);
  app.use("/api/gm", gmRouter);
  app.use("/api/representatives", rRouter);

  // Handle unknown routes
  app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Global error handler
  app.use(globalErrorHandler);
};
