import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

const SELLER_ROLE_ID = "68b8fb8bf143996efa66acaa"; // seller
const ADMIN_ROLE_ID = "68b8fb1df143996efa66ac94"; // admin

export const getDashboardStats = asyncHandler(async (req, res) => {
  const roleId = req.user?.role_id;

  // ✅ Admin Dashboard
  if (roleId?.equals(ADMIN_ROLE_ID)) {
    const totalFruits = await Product.countDocuments();
    const totalSellers = await User.countDocuments({
      role_id: SELLER_ROLE_ID,
    });
    const totalOrders = await Order.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$net_amount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalFruits,
          totalSellers,
          totalOrders,
          totalRevenue,
        },
        "Admin dashboard stats fetched successfully"
      )
    );
  }

  // ✅ Seller Dashboard
  if (roleId?.equals(SELLER_ROLE_ID)) {
    // Get seller's products
    const sellerProducts = await Product.find({ product_by: req.user._id })
      .select("_id")
      .lean();
    const sellerProductIds = sellerProducts.map((p) => p._id);

    const fruitsListed = sellerProductIds.length;

    // Get orders that include seller's products
    const orderItems = await OrderItem.find({
      product_id: { $in: sellerProductIds },
    });

    const ordersReceived = orderItems.length;

    // Revenue
    const revenue = orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Pending Deliveries
    const pendingOrders = await OrderItem.find({
      product_id: { $in: sellerProductIds },
    }).populate("order_id");

    const pendingDeliveries = pendingOrders.filter(
      (item) => item.order_id?.status === "Pending"
    ).length;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          fruitsListed,
          ordersReceived,
          revenue,
          pendingDeliveries,
        },
        "Seller dashboard stats fetched successfully"
      )
    );
  }

  return res
    .status(403)
    .json(new ApiResponse(403, null, "Unauthorized to view dashboard stats"));
});
