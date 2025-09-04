import express from "express";

import blogRouter from "./blog.router.js";
import roleRouter from "./role.router.js";
import userRouter from "./user.router.js";
import districtRouter from "./district.router.js";
import countryRouter from "./country.router.js";
import commentRouter from "./comment.router.js";
import newsRouter from "./news.router.js";
import productTypeRouter from "./productType.router.js";
import sellerRouter from "./seller.router.js";

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/user-roles", roleRouter);
apiRouter.use("/product-types", productTypeRouter);
apiRouter.use("/sellers", sellerRouter);
apiRouter.use("/blogs", blogRouter);
apiRouter.use("/districts", districtRouter);
apiRouter.use("/countries", countryRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/news", newsRouter);
export default apiRouter;
