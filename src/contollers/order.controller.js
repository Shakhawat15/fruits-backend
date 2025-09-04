import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Address from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";

const createOrder = asyncHandler(async (req, res) => {
  const { cartItems, shippingInfo, payment_type, payment_transaction_id } =
    req.body;

  if (!cartItems || cartItems.length === 0) {
    throw new ApiError(400, "Cart items are required");
  }

  if (!shippingInfo) {
    throw new ApiError(400, "Shipping information is required");
  }

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Create order
  const order = await Order.create({
    user_id: req.user._id || null, // optional guest user ID
    total_amount: totalAmount,
    discount_amount: 0,
    gross_amount: totalAmount,
    shipping_cost: 0,
    net_amount: totalAmount,
    status: "Pending",
    payment_status: payment_type === "cod" ? "Pending" : "Paid",
    payment_type,
    payment_transaction_id: payment_transaction_id || null,
  });

  // Create order items
  const orderItemsPayload = cartItems.map((item) => ({
    order_id: order._id,
    product_id: item.id,
    sku: item.sku || "SKU123",
    product_title: item.title,
    quantity: item.quantity,
    unit_price: item.price,
  }));

  await OrderItem.insertMany(orderItemsPayload);

  // Create shipping address
  const addressPayload = {
    ...shippingInfo,
    order_id: order._id,
  };

  await Address.create(addressPayload);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// Other order controller functions like getOrderById, getOrdersByUser, updateOrderStatus, etc. can be added here
// Get all orders, Get order by ID, Update order status, etc.
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user_id", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order retrieved successfully"));
});

const getOrdersByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user_id: userId }).populate(
    "user_id",
    "name email"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

// const getAllOrders = asyncHandler(async (req, res) => {
//   // Fetch all orders
//   const orders = await Order.find().lean();

//   // Attach order items and address for each order
//   const ordersWithDetails = await Promise.all(
//     orders.map(async (order) => {
//       const items = await OrderItem.find({ order_id: order._id }).lean();
//       const address = await Address.findOne({ order_id: order._id }).lean();

//       return {
//         ...order,
//         items,
//         address,
//       };
//     })
//   );

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, ordersWithDetails, "Orders fetched successfully")
//     );
// });
const getAllOrders = asyncHandler(async (req, res) => {
  // Fetch all orders in descending order by creation date
  let orders = await Order.find().sort({ createdAt: -1 }).lean();

  // If seller, filter orders to only include their products
  if (req.user.role_id.equals("68b8fb8bf143996efa66acaa")) {
    // Fetch seller's product IDs
    const sellerProducts = await Product.find({ product_by: req.user._id })
      .select("_id")
      .lean();
    const sellerProductIds = sellerProducts.map((p) => p._id.toString());

    // Filter orders to only include items with seller's products
    orders = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id }).lean();

        // Keep only items that belong to this seller
        const sellerItems = items.filter((item) =>
          sellerProductIds.includes(item.product_id.toString())
        );

        // If no items match, skip this order
        if (sellerItems.length === 0) return null;

        const address = await Address.findOne({ order_id: order._id }).lean();

        return {
          ...order,
          items: sellerItems,
          address,
        };
      })
    );

    // Remove nulls (orders without seller items)
    orders = orders.filter((o) => o !== null);
  } else {
    // Admin: include all orders
    orders = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id }).lean();
        const address = await Address.findOne({ order_id: order._id }).lean();
        return {
          ...order,
          items,
          address,
        };
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { payment_status } = req.body;

  // Check role (only admin allowed)
  if (!req.user?.role_id?.equals("68b8fb1df143996efa66ac94")) {
    return res
      .status(403)
      .json(
        new ApiResponse(
          403,
          null,
          "You are not authorized to update payment status"
        )
      );
  }

  // Validate input
  if (!["Pending", "Paid", "Failed", "Refunded"].includes(payment_status)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid payment status value"));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, "Order not found"));
  }

  order.payment_status = payment_status;
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Payment status updated successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Check role (only admin allowed)
  if (!req.user?.role_id?.equals("68b8fb1df143996efa66ac94")) {
    return res
      .status(403)
      .json(
        new ApiResponse(
          403,
          null,
          "You are not authorized to update order status"
        )
      );
  }

  // Validate input
  if (!["Pending", "Processing", "Completed", "Cancelled"].includes(status)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid order status value"));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, "Order not found"));
  }

  order.status = status;
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

export {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  getAllOrders,
  updatePaymentStatus,
};
