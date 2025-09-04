import mongoose, { Schema } from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    post_code: { type: String, required: true },
    address: { type: String, required: true },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

const Address = mongoose.model("Address", AddressSchema);

export default Address;
