import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    product_by: {
      type: Schema.Types.ObjectId,
      ref: "User", // references User who created/owns it
      required: true,
    },
    type_id: {
      type: Schema.Types.ObjectId,
      ref: "ProductType", // references ProductType
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    rrp: {
      type: Number,
      required: true,
    },
    discounted_price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    media: [
      {
        type: String,
      },
    ],
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

const Product = mongoose.model("Product", ProductSchema);

export default Product;
