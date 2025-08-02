import mongoose, { Schema } from "mongoose";

const upazilaAgricultureOfficeSchema = new Schema(
  {
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    name: {
      type: String,
      required: true,
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

const UpazilaAgricultureOffice = mongoose.model(
  "UpazilaAgricultureOffice",
  upazilaAgricultureOfficeSchema
);

export default UpazilaAgricultureOffice;
