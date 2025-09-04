import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
  {
    business_name: {
      type: String,
      required: true,
      trim: true,
    },
    business_type: {
      type: String,
      required: true,
      trim: true,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    business_address: {
      type: String,
      required: true,
      trim: true,
    },
    types_of_fruits: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductType",
      },
    ], // from your product-types collection
    certifications: [
      {
        type: String,
        trim: true,
      },
    ], // bsti, bcsir, halal, etc.
    business_description: {
      type: String,
      required: true,
      trim: true,
    },
    documents: {
      type: String,
      trim: true,
    },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
