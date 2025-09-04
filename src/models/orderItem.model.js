import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: { type: String, required: true },
    product_title: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unit_price: { type: Number, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

export default OrderItem;
