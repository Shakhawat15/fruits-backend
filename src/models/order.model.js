import mongoose, { Schema } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    discount_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    gross_amount: {
      type: Number,
      required: true,
    },
    shipping_cost: {
      type: Number,
      required: true,
      default: 0,
    },
    net_amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
    payment_status: {
      type: String,
      required: true,
      default: "Unpaid",
    },
    payment_type: {
      type: String,
      required: true,
    },
    payment_transaction_id: {
      type: String,
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

const Order = mongoose.model("Order", OrderSchema);

export default Order;
