import mongoose, { Schema } from "mongoose";

const galleryFolderSchema = new Schema(
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
    status: {
      type: Number,
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

const GalleryFolder = mongoose.model("GalleryFolder", galleryFolderSchema);

export default GalleryFolder;
