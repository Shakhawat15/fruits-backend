import mongoose, { Schema } from "mongoose";

const videoGallerySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    youtube_link: {
      type: String,
      required: true,
      trim: true,
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

const VideoGallery = mongoose.model("VideoGallery", videoGallerySchema);

export default VideoGallery;
