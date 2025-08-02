import mongoose, { Schema } from "mongoose";

const pdfSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
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

const Pdf = mongoose.model("Pdf", pdfSchema);

export default Pdf;
