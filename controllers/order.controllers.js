/*
Order Algo
0. check if cart is valaibalbe
1. check products availability
2. calculate total or the cart
3. check cupon is available
3.1 if cupon is not available proceed to next step
3.2 if cupon is availbale
  3.2.1 check cupon is ours or not
  3.2.3 check cupon expiry
  if both are ok then go to next step
4. total after cupon apply
5. reduc the stock
5. check the payment method
   5.1 if offline go to next step
   5.2 if online payment gateway
6. cretae a new order in DB
7. delete the user cart from DB
8. send order confirmation mail to user
*/
const CartModel = require("../models/cart.model.js");
const CuponModel = require("../models/cupon.model.js");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const ProductModel = require("../models/products.model.js");
const OrderModel = require("../models/order.model.js");
const Razorpay = require("razorpay");
const dotenv = require("dotenv")
const crypto = require("crypto");

dotenv.config()

dayjs.extend(isBetween);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// ! Create order
// payload => {method, cupon, address}
const createOrder = async (req, res) => {
  try {
    // 0. Cart availability
    const cart = await CartModel.findOne({ userId: req.userData._id }).populate(
      "products.productId"
    );
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 1. Check product stock
    const isProductsAvailable = cart.products.every(
      (product) => product.productId.stock >= product.qty
    );
    if (!isProductsAvailable) {
      return res.status(400).json({
        success: false,
        message: "Some products are out of stock",
      });
    }

    // 2. Calculate total price
    const total = cart.products.reduce((acc, curr) => {
      return acc + curr.qty * curr.productId.price;
    }, 0);

    // 🧾 Handle NO coupon case
    if (!req.body.cupon) {
      // 🧨 Reduce stock
      for (const product of cart.products) {
        await ProductModel.findByIdAndUpdate(product.productId._id, {
          $inc: { stock: -product.qty },
        });
      }

      // 💰 Handle ONLINE payment
      if (req.body.mode === "ONLINE") {
        const razorpayOrder = await razorpay.orders.create({
          amount: total * 100, // in paisa
          currency: "INR",
          receipt: `order_rcptid_${Date.now()}`,
          notes: {
            userId: req.userData._id.toString(),
            cartId: cart._id.toString(),
          },
        });

        return res.status(200).json({
          success: true,
          message: "Redirect to payment gateway",
          orderDetails: {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_API_KEY, // replace with your test/live key
          },
        });
      }

      // 🧾 Create COD order
      const order = await OrderModel.create({
        userId: req.userData._id,
        products: cart.products,
        cupon: "",
        modeOfPayment: req.body.mode,
        orderStatus: "PENDING",
        address: req.body.address || req.userData.address,
      });

      // 🧹 Clear cart
      await CartModel.findByIdAndDelete(cart._id);

      return res.status(200).json({
        success: true,
        message: "Order placed successfully (no coupon)",
        total,
        finalTotal: total,
        order,
      });
    }

    // 🎟️ Coupon validation block
    const cupon = await CuponModel.findOne({ code: req.body.cupon });
    if (!cupon) {
      return res.status(400).json({
        success: false,
        message: "Cupon is not valid",
      });
    }

    if (total < cupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value for this cupon is ${cupon.minOrderValue}`,
      });
    }

    const startDate = dayjs(cupon.startDate);
    const endDate = dayjs(cupon.endDate);
    const currentDate = dayjs();

    const isCuponDateValid = currentDate.isBetween(startDate, endDate);
    if (!isCuponDateValid) {
      return res.status(400).json({
        success: false,
        message: "Cupon is expired or not active yet",
      });
    }

    // 💸 Calculate discount
    const discountAmount = (total * cupon.discountPercentage) / 100;
    const effectiveDiscount = Math.min(discountAmount, cupon.maxDixcountValue);
    const finalTotal = total - effectiveDiscount;

    // 🧨 Reduce stock
    for (const product of cart.products) {
      await ProductModel.findByIdAndUpdate(product.productId._id, {
        $inc: { stock: -product.qty },
      });
    }

    // 💳 Handle ONLINE payment with coupon
    if (req.body.mode === "ONLINE") {
      const razorpayOrder = await razorpay.orders.create({
        amount: finalTotal * 100,
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
        notes: {
          userId: req.userData._id.toString(),
          cartId: cart._id.toString(),
        },
      });

      return res.status(200).json({
        success: true,
        message: "Redirect to payment gateway",
        orderDetails: {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: "YOUR_TEST_KEY_ID", // replace with your test/live key
        },
      });
    }

    // 🧾 Create COD order with coupon
    const order = await OrderModel.create({
      userId: req.userData._id,
      products: cart.products,
      cupon: req.body.cupon,
      modeOfPayment: req.body.mode,
      orderStatus: "PENDING",
      address: req.body.address || req.userData.address,
    });

    await CartModel.findByIdAndDelete(cart._id);

    return res.status(200).json({
      success: true,
      message: "Order placed successfully with coupon",
      total,
      finalTotal,
      discount: effectiveDiscount,
      order,
    });
  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error from create order API",
    });
  }
};


//! remove order
const removeOrder = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const order = await OrderModel.findOne({ userId: req.userData._id });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "User doesn't have any orders",
      });
    }

    const productIndex = order.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Product not found in order",
      });
    }

    const productQty = order.products[productIndex].qty;

    if (productQty <= qty) {
      // Remove item entirely
      order.products.splice(productIndex, 1);
    } else {
      // Just reduce qty
      order.products[productIndex].qty -= qty;
    }

    await order.save();

    // If all products are removed, delete the order
    if (order.products.length === 0) {
      await OrderModel.findByIdAndDelete(order._id);
    }

    return res.json({
      success: true,
      message: "Product removed from order",
    });
  } catch (error) {
    console.error("removeOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in removeOrder",
    });
  }
};

//  ! Get all orders
const list = async (req, res) => {
  try {
    const orders = await OrderModel.findOne({
      userId: req.userData._id,
    }).populate("products.productId");
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Can not fetch data from order DB",
      error,
    });
  }
};

// ! ✅ Razorpay payment verification
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate signature from backend
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Extract userId and cartId from notes stored in order
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const { userId, cartId } = razorpayOrder.notes;

    const cart = await CartModel.findById(cartId).populate("products.productId");
    if (!cart) {
      return res.status(400).json({ success: false, message: "Cart not found" });
    }

    const total = cart.products.reduce((acc, curr) => acc + curr.qty * curr.productId.price, 0);

    const order = await OrderModel.create({
      userId,
      products: cart.products,
      cupon: "", // or add logic to handle if coupon used
      modeOfPayment: "ONLINE",
      orderStatus: "CONFIRMED",
      address: req.body.address,
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    });

    await CartModel.findByIdAndDelete(cartId);

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed",
      order,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying payment",
    });
  }
};

const orderControllers = {
  createOrder,
  removeOrder,
  list,
  verifyPayment,
};
module.exports = orderControllers;
