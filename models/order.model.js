const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    cupon: {
      type: String,
      default: "",
    },
    modeOfPayment: {
      type: String,
      required: true,
      enum: ["COD", "ONLINE"],
    },
    orderStatus: {
      type: String,
      enum: ["IN-PROGRESS", "PENDING", "IN-TRANSIT", "OUT-FOR-DELIVERY", "DONE"],
      default: "PENDING",
    },
    address: {
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
        default: "",
      },
      landmark: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel
