import express from "express";

import blogRouter from "./blog.router.js";
import roleRouter from "./role.router.js";
import userRouter from "./user.router.js";
import districtRouter from "./district.router.js";
import farmerRouter from "./farmer.router.js";
import demonstrationTypeRouter from "./demonstrationType.router.js";
import countryRouter from "./country.router.js";
import upazilaAgricultureOfficeRouter from "./upazilaAgricultureOffice.router.js";
import commentRouter from "./comment.router.js";
import newsRouter from "./news.router.js";
import galleryFolderRouter from "./galleryFolder.router.js";
import videoGalleryRouter from "./videoGallery.router.js";
import imageGalleryRouter from "./imageGallery.router.js";
import pdfRouter from "./pdf.router.js";
import testimonialRouter from "./testimonial.router.js";

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/user-roles", roleRouter);
apiRouter.use("/blogs", blogRouter);
apiRouter.use("/districts", districtRouter);
apiRouter.use("/farmers", farmerRouter);
apiRouter.use("/demonstration-types", demonstrationTypeRouter);
apiRouter.use("/countries", countryRouter);
apiRouter.use("/upazila-agriculture-offices", upazilaAgricultureOfficeRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/news", newsRouter);
apiRouter.use("/gallery-folders", galleryFolderRouter);
apiRouter.use("/video-galleries", videoGalleryRouter);
apiRouter.use("/image-galleries", imageGalleryRouter);
apiRouter.use("/pdfs", pdfRouter);
apiRouter.use("/testimonials", testimonialRouter);
export default apiRouter;
