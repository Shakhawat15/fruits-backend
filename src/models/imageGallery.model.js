import mongoose, { Schema } from "mongoose";

const imageGallerySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      required: true,
      trim: true,
    },
    gallery_folder: {
      type: Schema.Types.ObjectId,
      ref: "GalleryFolder",
    },
    status: {
      type: Number,
      required: true,
      default: 1,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const ImageGallery = mongoose.model("ImageGallery", imageGallerySchema);

export default ImageGallery;
